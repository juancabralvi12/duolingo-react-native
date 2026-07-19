import { clerkAuthErrorResponse, requireClerkUserId } from "@/lib/clerkAuth";

const ROUTE = "/api/vision-agent/start";
const DEFAULT_AGENT_BASE_URL = "http://127.0.0.1:8000";

interface StartAgentBody {
  callId?: string;
  callType?: string;
}

function getAgentBaseUrl(): string {
  return (process.env.VISION_AGENT_BASE_URL ?? DEFAULT_AGENT_BASE_URL).replace(/\/$/, "");
}

function getStringField(record: Record<string, unknown>, key: string): string | undefined {
  const value = record[key];
  return typeof value === "string" ? value : undefined;
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

  const body = (await request.json().catch(() => null)) as StartAgentBody | null;
  const callId = body?.callId;
  const callType = body?.callType;

  if (!callId || !callType) {
    return Response.json(
      {
        error: "Missing callId or callType.",
        code: "vision_agent_missing_call",
        source: "app_api",
        stage: "request_validation",
      },
      { status: 400 },
    );
  }

  const url = `${getAgentBaseUrl()}/calls/${encodeURIComponent(callId)}/sessions`;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ call_type: callType }),
    });

    if (!res.ok) {
      const details = await readProxyError(res);
      console.error(`${ROUTE} Vision Agent start failed`, {
        callId,
        callType,
        status: res.status,
        details,
      });

      return Response.json(
        {
          error: "Vision Agent server could not start the vocal coach session.",
          code: "vision_agent_start_failed",
          source: "vision_agent",
          stage: "agent_start",
          details,
        },
        { status: 502 },
      );
    }

    const data = (await res.json().catch(() => null)) as Record<string, unknown> | null;
    const sessionId = data ? getStringField(data, "session_id") : undefined;
    const startedAt = data ? getStringField(data, "session_started_at") : undefined;

    if (!sessionId) {
      return Response.json(
        {
          error: "Vision Agent server did not return a session id.",
          code: "vision_agent_bad_response",
          source: "vision_agent",
          stage: "agent_start_response",
        },
        { status: 502 },
      );
    }

    return Response.json({ callId, callType, sessionId, startedAt });
  } catch (err) {
    console.error(`${ROUTE} could not reach Vision Agent server`, { callId, callType, err });

    return Response.json(
      {
        error: "Could not reach the Vision Agent server.",
        code: "vision_agent_unreachable",
        source: "vision_agent",
        stage: "agent_start_request",
      },
      { status: 502 },
    );
  }
}
