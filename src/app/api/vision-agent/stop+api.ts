import { clerkAuthErrorResponse, requireClerkUserId } from "@/lib/clerkAuth";

const ROUTE = "/api/vision-agent/stop";
const DEFAULT_AGENT_BASE_URL = "http://127.0.0.1:8000";

interface StopAgentBody {
  callId?: string;
  sessionId?: string;
}

function getAgentBaseUrl(): string {
  return (process.env.VISION_AGENT_BASE_URL ?? DEFAULT_AGENT_BASE_URL).replace(/\/$/, "");
}

async function readProxyError(res: Response): Promise<string | undefined> {
  try {
    const text = await res.text();
    if (!text || text.startsWith("<")) return undefined;
    return text.slice(0, 600);
  } catch {
    return undefined;
  }
}

export async function POST(request: Request) {
  try {
    await requireClerkUserId(request);
  } catch (err) {
    return clerkAuthErrorResponse(err, ROUTE);
  }

  const body = (await request.json().catch(() => null)) as StopAgentBody | null;
  const callId = body?.callId;
  const sessionId = body?.sessionId;

  if (!callId || !sessionId) {
    return Response.json(
      {
        error: "Missing callId or sessionId.",
        code: "vision_agent_missing_session",
        source: "app_api",
        stage: "request_validation",
      },
      { status: 400 },
    );
  }

  const url = `${getAgentBaseUrl()}/calls/${encodeURIComponent(callId)}/sessions/${encodeURIComponent(sessionId)}`;

  try {
    const res = await fetch(url, { method: "DELETE" });
    if (res.ok || res.status === 404) {
      return Response.json({ stopped: true });
    }

    const details = await readProxyError(res);
    console.error(`${ROUTE} Vision Agent stop failed`, {
      callId,
      sessionId,
      status: res.status,
      details,
    });

    return Response.json(
      {
        error: "Vision Agent server could not stop the teacher session.",
        code: "vision_agent_stop_failed",
        source: "vision_agent",
        stage: "agent_stop",
        details,
      },
      { status: 502 },
    );
  } catch (err) {
    console.error(`${ROUTE} could not reach Vision Agent server`, { callId, sessionId, err });

    return Response.json(
      {
        error: "Could not reach the Vision Agent server.",
        code: "vision_agent_unreachable",
        source: "vision_agent",
        stage: "agent_stop_request",
      },
      { status: 502 },
    );
  }
}
