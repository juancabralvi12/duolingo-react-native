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
  | "microphone_enable";

interface StreamAuthResponse {
  apiKey: string;
  token: string;
  userId: string;
  userName: string;
  userImage?: string;
}

interface UseLessonCallResult {
  status: LessonCallStatus;
  errorMessage?: string;
  errorStage?: LessonCallStage;
  isMicOn: boolean;
  toggleMic: () => void;
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

async function createLessonCall(
  getToken: () => Promise<string | null>,
  lessonId: string,
): Promise<{ callId: string; callType: string }> {
  const clerkToken = await getClerkSessionToken(getToken);

  let res: Response;
  try {
    res = await fetch("/api/stream/call", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${clerkToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ lessonId }),
    });
  } catch (err) {
    throw new LessonCallError(
      "stream_call_request",
      "Network request to /api/stream/call failed.",
      { lessonId, route: "/api/stream/call" },
      err,
    );
  }

  if (!res.ok) {
    const details = await readApiError(res, "/api/stream/call", "Could not start the lesson call.");
    throw new LessonCallError(
      "stream_call_request",
      details.error ?? "Stream call API failed.",
      { lessonId, ...apiErrorContext(details) },
    );
  }

  try {
    const body = (await res.json()) as { callId?: string; callType?: string };
    if (!body.callId || !body.callType) {
      throw new Error("Stream call response is missing callId or callType.");
    }
    return { callId: body.callId, callType: body.callType };
  } catch (err) {
    throw new LessonCallError(
      "stream_call_response",
      "Could not parse the /api/stream/call response.",
      { lessonId, route: "/api/stream/call" },
      err,
    );
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
  const [isMicOn, setIsMicOn] = useState(true);
  const callRef = useRef<Call | undefined>(undefined);

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

        const auth = await fetchStreamAuth(getToken);
        if (cancelled) return;
        debugContext.streamUserId = auth.userId;

        try {
          client = StreamVideoClient.getOrCreateInstance({
            apiKey: auth.apiKey,
            user: { id: auth.userId, name: auth.userName, image: auth.userImage },
            tokenProvider: async () => {
              try {
                return (await fetchStreamAuth(getToken)).token;
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
        } catch (err) {
          throw new LessonCallError("stream_client_create", "Could not create the Stream video client.", {}, err);
        }

        const { callId, callType } = await createLessonCall(getToken, lesson.id);
        if (cancelled || !client) return;
        debugContext.callId = callId;
        debugContext.callType = callType;

        let call: Call;
        try {
          call = client.call(callType, callId, { reuseInstance: true });
        } catch (err) {
          throw new LessonCallError(
            "stream_call_instance",
            "Could not create the Stream call instance.",
            { callId, callType },
            err,
          );
        }
        callRef.current = call;

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
        } catch (err) {
          throw new LessonCallError(
            "stream_call_subscription",
            "Could not subscribe to Stream call state.",
            { callId, callType },
            err,
          );
        }

        setStatus("joining");
        try {
          await call.join();
        } catch (err) {
          throw new LessonCallError("stream_call_join", "Could not join the Stream call.", { callId, callType }, err);
        }
        if (cancelled) return;

        try {
          await call.microphone.enable();
        } catch (err) {
          throw new LessonCallError(
            "microphone_enable",
            "Joined the call, but could not enable the microphone.",
            { callId, callType },
            err,
          );
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

      const call = callRef.current;
      if (call && call.state.callingState !== CallingState.LEFT) {
        call.leave().catch((err) => console.error("Failed to leave lesson call", err));
      }
      client?.disconnectUser().catch((err) => console.error("Failed to disconnect Stream user", err));
      callRef.current = undefined;
    };
  }, [lesson.id, isSignedIn, getToken]);

  const toggleMic = () => {
    callRef.current?.microphone.toggle().catch((err) => console.error("Failed to toggle microphone", err));
  };

  const endCall = async () => {
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
      isMicOn,
      toggleMic,
      endCall,
    };
  }

  return { status, errorMessage, errorStage, isMicOn, toggleMic, endCall };
}
