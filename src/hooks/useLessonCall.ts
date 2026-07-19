import { useAuth } from "@clerk/expo";
import { Call, CallingState, StreamVideoClient } from "@stream-io/video-react-native-sdk";
import { useEffect, useRef, useState } from "react";

import type { Lesson } from "@/types/learning";

export type LessonCallStatus =
  | "connecting"
  | "joining"
  | "joined"
  | "reconnecting"
  | "error"
  | "ended";

export type AgentConnectionStatus = "idle" | "connecting" | "connected" | "failed";

type LessonCallStage =
  | "clerk_session_token"
  | "stream_auth_request"
  | "stream_auth_response"
  | "stream_client_create"
  | "stream_call_request"
  | "stream_call_response"
  | "stream_call_instance"
  | "stream_call_subscription"
  | "stream_call_join"
  | "microphone_enable"
  | "vision_agent_start_request"
  | "vision_agent_start_response"
  | "vision_agent_stop_request";

interface StreamAuthResponse {
  apiKey: string;
  token: string;
  userId: string;
  userName: string;
  userImage?: string;
}

interface LessonCallResponse {
  callId: string;
  callType: string;
}

interface VisionAgentSession {
  callId: string;
  sessionId: string;
}

interface VisionAgentStartResponse extends VisionAgentSession {
  callType: string;
  startedAt?: string;
}

interface UseLessonCallResult {
  status: LessonCallStatus;
  errorMessage?: string;
  errorStage?: LessonCallStage;
  agentStatus: AgentConnectionStatus;
  agentErrorMessage?: string;
  client?: StreamVideoClient;
  call?: Call;
  isMicOn: boolean;
  toggleMic: () => void;
  isCameraOn: boolean;
  toggleCamera: () => void;
  endCall: () => Promise<void>;
}

interface ApiErrorBody {
  error?: string;
  message?: string;
  code?: string;
  source?: string;
  stage?: string;
  details?: string;
  responseSnippet?: string;
}

interface ApiErrorDetails extends ApiErrorBody {
  route: string;
  status: number;
}

type LessonCallLogContext = Record<string, string | number | boolean | undefined>;

class LessonCallError extends Error {
  constructor(
    public stage: LessonCallStage,
    message: string,
    public context: LessonCallLogContext = {},
    public originalError?: unknown,
  ) {
    super(message);
    this.name = "LessonCallError";
  }
}

function mapCallingState(callingState: CallingState): LessonCallStatus | undefined {
  switch (callingState) {
    case CallingState.JOINING:
      return "joining";
    case CallingState.JOINED:
      return "joined";
    case CallingState.RECONNECTING:
      return "reconnecting";
    case CallingState.LEFT:
      return "ended";
    default:
      return undefined;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function readString(record: Record<string, unknown>, key: keyof ApiErrorBody): string | undefined {
  const value = record[key];
  return typeof value === "string" ? value : undefined;
}

function toApiErrorBody(value: unknown): ApiErrorBody {
  if (!isRecord(value)) return {};

  return {
    error: readString(value, "error"),
    message: readString(value, "message"),
    code: readString(value, "code"),
    source: readString(value, "source"),
    stage: readString(value, "stage"),
    details: readString(value, "details"),
  };
}

function parseApiErrorText(text: string): ApiErrorBody {
  if (!text.startsWith("{")) return {};

  try {
    return toApiErrorBody(JSON.parse(text));
  } catch {
    return {};
  }
}

async function readApiError(res: Response, route: string, fallback: string): Promise<ApiErrorDetails> {
  const fallbackWithStatus = `${fallback} (${res.status})`;

  try {
    const contentType = res.headers.get("content-type") ?? "";
    if (contentType.includes("application/json")) {
      const body = toApiErrorBody(await res.json());
      return {
        ...body,
        error: body.error ?? body.message ?? fallbackWithStatus,
        route,
        status: res.status,
      };
    }

    const text = (await res.text()).trim();
    const body = parseApiErrorText(text);
    if (body.error || body.message) {
      return {
        ...body,
        error: body.error ?? body.message ?? fallbackWithStatus,
        route,
        status: res.status,
      };
    }

    return {
      error: text && !text.startsWith("<") ? text : fallbackWithStatus,
      responseSnippet: text ? text.slice(0, 600) : undefined,
      route,
      status: res.status,
    };
  } catch {
    return { error: fallbackWithStatus, route, status: res.status };
  }
}

function apiErrorContext(details: ApiErrorDetails): LessonCallLogContext {
  return {
    route: details.route,
    status: details.status,
    code: details.code,
    source: details.source,
    apiStage: details.stage,
    details: details.details,
    responseSnippet: details.responseSnippet,
  };
}

async function getClerkSessionToken(getToken: () => Promise<string | null>): Promise<string> {
  let clerkToken: string | null;
  try {
    clerkToken = await getToken();
  } catch (err) {
    throw new LessonCallError("clerk_session_token", "Could not read the Clerk session token.", {}, err);
  }

  if (!clerkToken) {
    throw new LessonCallError(
      "clerk_session_token",
      "You need to be signed in to start this lesson's call.",
    );
  }

  return clerkToken;
}

async function fetchStreamAuth(getToken: () => Promise<string | null>): Promise<StreamAuthResponse> {
  const clerkToken = await getClerkSessionToken(getToken);

  let res: Response;
  try {
    res = await fetch("/api/stream/token", {
      method: "POST",
      headers: { Authorization: `Bearer ${clerkToken}` },
    });
  } catch (err) {
    throw new LessonCallError(
      "stream_auth_request",
      "Network request to /api/stream/token failed.",
      { route: "/api/stream/token" },
      err,
    );
  }

  if (!res.ok) {
    const details = await readApiError(res, "/api/stream/token", "Could not verify your account for the call.");
    throw new LessonCallError("stream_auth_request", details.error ?? "Stream auth failed.", apiErrorContext(details));
  }

  try {
    const body = (await res.json()) as StreamAuthResponse;
    if (!body.apiKey || !body.token || !body.userId) {
      throw new Error("Stream auth response is missing apiKey, token, or userId.");
    }
    return body;
  } catch (err) {
    throw new LessonCallError(
      "stream_auth_response",
      "Could not parse the /api/stream/token response.",
      { route: "/api/stream/token" },
      err,
    );
  }
}

async function fetchLessonCall(
  getToken: () => Promise<string | null>,
  lessonId: string,
): Promise<LessonCallResponse> {
  const clerkToken = await getClerkSessionToken(getToken);

  let res: Response;
  try {
    res = await fetch("/api/stream/call", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${clerkToken}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({ lessonId }),
    });
  } catch (err) {
    throw new LessonCallError(
      "stream_call_request",
      "Network request to /api/stream/call failed.",
      { route: "/api/stream/call", lessonId },
      err,
    );
  }

  if (!res.ok) {
    const details = await readApiError(res, "/api/stream/call", "Could not create the lesson call.");
    throw new LessonCallError("stream_call_request", details.error ?? "Stream call creation failed.", {
      ...apiErrorContext(details),
      lessonId,
    });
  }

  try {
    const body = (await res.json()) as LessonCallResponse;
    if (!body.callId || !body.callType) {
      throw new Error("Stream call response is missing callId or callType.");
    }
    return body;
  } catch (err) {
    throw new LessonCallError(
      "stream_call_response",
      "Could not parse the /api/stream/call response.",
      { route: "/api/stream/call", lessonId },
      err,
    );
  }
}

async function startVisionAgent(
  getToken: () => Promise<string | null>,
  callDetails: LessonCallResponse,
): Promise<VisionAgentStartResponse> {
  const clerkToken = await getClerkSessionToken(getToken);

  let res: Response;
  try {
    res = await fetch("/api/vision-agent/start", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${clerkToken}`,
        "content-type": "application/json",
      },
      body: JSON.stringify(callDetails),
    });
  } catch (err) {
    throw new LessonCallError(
      "vision_agent_start_request",
      "Network request to /api/vision-agent/start failed.",
      { route: "/api/vision-agent/start", callId: callDetails.callId, callType: callDetails.callType },
      err,
    );
  }

  if (!res.ok) {
    const details = await readApiError(res, "/api/vision-agent/start", "Could not start the AI vocal coach.");
    throw new LessonCallError("vision_agent_start_request", details.error ?? "Vision Agent start failed.", {
      ...apiErrorContext(details),
      callId: callDetails.callId,
      callType: callDetails.callType,
    });
  }

  try {
    const body = (await res.json()) as VisionAgentStartResponse;
    if (!body.callId || !body.callType || !body.sessionId) {
      throw new Error("Vision Agent start response is missing callId, callType, or sessionId.");
    }
    return body;
  } catch (err) {
    throw new LessonCallError(
      "vision_agent_start_response",
      "Could not parse the /api/vision-agent/start response.",
      { route: "/api/vision-agent/start", callId: callDetails.callId, callType: callDetails.callType },
      err,
    );
  }
}

async function stopVisionAgent(
  getToken: () => Promise<string | null>,
  session: VisionAgentSession,
): Promise<void> {
  const clerkToken = await getClerkSessionToken(getToken);

  let res: Response;
  try {
    res = await fetch("/api/vision-agent/stop", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${clerkToken}`,
        "content-type": "application/json",
      },
      body: JSON.stringify(session),
    });
  } catch (err) {
    throw new LessonCallError(
      "vision_agent_stop_request",
      "Network request to /api/vision-agent/stop failed.",
      { route: "/api/vision-agent/stop", callId: session.callId, sessionId: session.sessionId },
      err,
    );
  }

  if (!res.ok) {
    const details = await readApiError(res, "/api/vision-agent/stop", "Could not stop the AI vocal coach.");
    throw new LessonCallError("vision_agent_stop_request", details.error ?? "Vision Agent stop failed.", {
      ...apiErrorContext(details),
      callId: session.callId,
      sessionId: session.sessionId,
    });
  }
}

function toLessonCallError(err: unknown, fallbackStage: LessonCallStage, fallbackMessage: string): LessonCallError {
  if (err instanceof LessonCallError) return err;

  return new LessonCallError(
    fallbackStage,
    err instanceof Error ? err.message : fallbackMessage,
    {},
    err,
  );
}

function getOriginalErrorMessage(err: unknown): string | undefined {
  return err instanceof Error ? err.message : undefined;
}

function getOriginalErrorStack(err: unknown): string | undefined {
  return err instanceof Error ? err.stack : undefined;
}

function formatLessonCallError(err: LessonCallError): string {
  const code = err.context.code ? ` code=${err.context.code}` : "";
  const source = err.context.source ? ` source=${err.context.source}` : "";
  return `${err.message} [stage=${err.stage}${code}${source}]`;
}

function logLessonCallError(err: LessonCallError, context: LessonCallLogContext) {
  console.error("Lesson call failed to connect", {
    ...context,
    ...err.context,
    stage: err.stage,
    message: err.message,
    originalMessage: getOriginalErrorMessage(err.originalError),
    originalStack: getOriginalErrorStack(err.originalError),
    stack: err.stack,
  });
}

export function useLessonCall(lesson: Lesson): UseLessonCallResult {
  const { getToken, isSignedIn } = useAuth();
  const [status, setStatus] = useState<LessonCallStatus>("connecting");
  const [errorMessage, setErrorMessage] = useState<string>();
  const [errorStage, setErrorStage] = useState<LessonCallStage>();
  const [agentStatus, setAgentStatus] = useState<AgentConnectionStatus>("idle");
  const [agentErrorMessage, setAgentErrorMessage] = useState<string>();
  const [clientState, setClientState] = useState<StreamVideoClient>();
  const [callState, setCallState] = useState<Call>();
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const callRef = useRef<Call | undefined>(undefined);
  const agentSessionRef = useRef<VisionAgentSession | undefined>(undefined);
  const getTokenRef = useRef(getToken);

  useEffect(() => {
    getTokenRef.current = getToken;
  }, [getToken]);

  useEffect(() => {
    if (!isSignedIn) return;

    let cancelled = false;
    const subscriptions: { unsubscribe: () => void }[] = [];
    let client: StreamVideoClient | undefined;

    async function connect() {
      const debugContext: LessonCallLogContext = { lessonId: lesson.id };

      try {
        setStatus("connecting");
        setErrorMessage(undefined);
        setErrorStage(undefined);
        setAgentStatus("idle");
        setAgentErrorMessage(undefined);

        const getCurrentToken = () => getTokenRef.current();
        const auth = await fetchStreamAuth(getCurrentToken);
        if (cancelled) return;
        debugContext.streamUserId = auth.userId;

        const callDetails = await fetchLessonCall(getCurrentToken, lesson.id);
        if (cancelled) return;
        debugContext.callId = callDetails.callId;
        debugContext.callType = callDetails.callType;

        try {
          client = StreamVideoClient.getOrCreateInstance({
            apiKey: auth.apiKey,
            user: { id: auth.userId, name: auth.userName, image: auth.userImage },
            token: auth.token,
            tokenProvider: async () => {
              try {
                return (await fetchStreamAuth(getCurrentToken)).token;
              } catch (err) {
                const tokenError = toLessonCallError(
                  err,
                  "stream_auth_request",
                  "Stream token refresh failed.",
                );
                logLessonCallError(tokenError, { ...debugContext, tokenProvider: true });
                throw tokenError;
              }
            },
          });
          setClientState(client);
        } catch (err) {
          throw new LessonCallError("stream_client_create", "Could not create the Stream video client.", {}, err);
        }

        if (cancelled || !client) return;

        let call: Call;
        try {
          call = client.call(callDetails.callType, callDetails.callId, { reuseInstance: true });
        } catch (err) {
          throw new LessonCallError(
            "stream_call_instance",
            "Could not create the Stream call instance.",
            { callId: callDetails.callId, callType: callDetails.callType },
            err,
          );
        }
        callRef.current = call;
        setCallState(call);

        try {
          subscriptions.push(
            call.state.callingState$.subscribe((callingState) => {
              const mapped = mapCallingState(callingState);
              if (mapped) setStatus(mapped);
            }),
          );
          subscriptions.push(
            call.microphone.state.status$.subscribe((deviceStatus) => {
              setIsMicOn(deviceStatus === "enabled");
            }),
          );
          subscriptions.push(
            call.camera.state.status$.subscribe((deviceStatus) => {
              setIsCameraOn(deviceStatus === "enabled");
            }),
          );
        } catch (err) {
          throw new LessonCallError(
            "stream_call_subscription",
            "Could not subscribe to Stream call state.",
            { callId: callDetails.callId, callType: callDetails.callType },
            err,
          );
        }

        setStatus("joining");
        try {
          await call.join();
        } catch (err) {
          throw new LessonCallError(
            "stream_call_join",
            "Could not join the Stream call.",
            { callId: callDetails.callId, callType: callDetails.callType },
            err,
          );
        }
        if (cancelled) return;

        try {
          await call.microphone.enable();
        } catch (err) {
          throw new LessonCallError(
            "microphone_enable",
            "Joined the call, but could not enable the microphone.",
            { callId: callDetails.callId, callType: callDetails.callType },
            err,
          );
        }

        setAgentStatus("connecting");
        try {
          const agentSession = await startVisionAgent(getCurrentToken, callDetails);
          if (cancelled) {
            stopVisionAgent(getCurrentToken, agentSession).catch((err) => {
              const stopError = toLessonCallError(
                err,
                "vision_agent_stop_request",
                "AI vocal coach cleanup failed.",
              );
              logLessonCallError(stopError, { ...debugContext, cancelledAfterAgentStart: true });
            });
            return;
          }

          agentSessionRef.current = agentSession;
          setAgentStatus("connected");
        } catch (err) {
          if (cancelled) return;
          const agentError = toLessonCallError(
            err,
            "vision_agent_start_request",
            "The call started, but the AI vocal coach could not join.",
          );
          logLessonCallError(agentError, debugContext);
          setAgentErrorMessage(formatLessonCallError(agentError));
          setAgentStatus("failed");
        }
      } catch (err) {
        if (cancelled) return;
        const lessonError = toLessonCallError(err, "stream_call_join", "Something went wrong starting the call.");
        logLessonCallError(lessonError, debugContext);
        setErrorMessage(formatLessonCallError(lessonError));
        setErrorStage(lessonError.stage);
        setStatus("error");
      }
    }

    connect();

    return () => {
      cancelled = true;
      subscriptions.forEach((subscription) => subscription.unsubscribe());

      const agentSession = agentSessionRef.current;
      if (agentSession) {
        agentSessionRef.current = undefined;
        stopVisionAgent(() => getTokenRef.current(), agentSession).catch((err) => {
          const lessonError = toLessonCallError(err, "vision_agent_stop_request", "AI vocal coach cleanup failed.");
          logLessonCallError(lessonError, { lessonId: lesson.id, callId: agentSession.callId });
        });
      }

      const call = callRef.current;
      if (call && call.state.callingState !== CallingState.LEFT) {
        call.leave().catch((err) => console.error("Failed to leave lesson call", err));
      }
      client?.disconnectUser().catch((err) => console.error("Failed to disconnect Stream user", err));
      callRef.current = undefined;
      setCallState(undefined);
      setClientState(undefined);
    };
  }, [lesson.id, isSignedIn]);

  const toggleMic = () => {
    callRef.current?.microphone.toggle().catch((err) => console.error("Failed to toggle microphone", err));
  };

  const toggleCamera = () => {
    callRef.current?.camera.toggle().catch((err) => console.error("Failed to toggle camera", err));
  };

  const endCall = async () => {
    const agentSession = agentSessionRef.current;
    if (agentSession) {
      agentSessionRef.current = undefined;
      try {
        await stopVisionAgent(() => getTokenRef.current(), agentSession);
        setAgentStatus("idle");
      } catch (err) {
        const lessonError = toLessonCallError(err, "vision_agent_stop_request", "AI vocal coach cleanup failed.");
        logLessonCallError(lessonError, { lessonId: lesson.id, callId: agentSession.callId });
        setAgentStatus("failed");
        setAgentErrorMessage(formatLessonCallError(lessonError));
      }
    }

    const call = callRef.current;
    if (call && call.state.callingState !== CallingState.LEFT) {
      try {
        await call.leave();
      } catch (err) {
        console.error("Failed to end lesson call", err);
      }
    }
    setStatus("ended");
  };

  if (!isSignedIn) {
    return {
      status: "error",
      errorMessage: "Sign in to start this lesson.",
      errorStage,
      agentStatus: "idle",
      agentErrorMessage,
      client: clientState,
      call: callState,
      isMicOn,
      toggleMic,
      isCameraOn,
      toggleCamera,
      endCall,
    };
  }

  return {
    status,
    errorMessage,
    errorStage,
    agentStatus,
    agentErrorMessage,
    client: clientState,
    call: callState,
    isMicOn,
    toggleMic,
    isCameraOn,
    toggleCamera,
    endCall,
  };
}
