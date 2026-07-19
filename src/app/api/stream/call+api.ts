import { getLessonById } from "@/data/lessons";
import { getLanguageByCode } from "@/data/languages";
import { clerkAuthErrorResponse, requireClerkUserId } from "@/lib/clerkAuth";
import { streamServerClient } from "@/lib/streamServer";

const CALL_TYPE = "audio_room";
const ROUTE = "/api/stream/call";
const AGENT_USER_ID = "ai-vocal-coach";
const AGENT_USER_NAME = "Vocalingo Coach";

function hashString(value: string): string {
  let hash = 5381;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 33) ^ value.charCodeAt(index);
  }
  return (hash >>> 0).toString(36);
}

function toCallId(lessonId: string, userId: string): string {
  const safeLessonId = lessonId.toLowerCase().replace(/[^a-z0-9_-]/g, "-");
  const userHash = hashString(userId);
  const uniqueSuffix = Date.now().toString(36);

  return `lesson-${safeLessonId}-${userHash}-${uniqueSuffix}`;
}

function toLessonCustomData(lesson: NonNullable<ReturnType<typeof getLessonById>>) {
  const track = getLanguageByCode(lesson.languageCode);

  return {
    lessonId: lesson.id,
    lessonTitle: lesson.title,
    lessonGoal: lesson.goal,
    trackCode: lesson.languageCode,
    trackName: track?.name ?? lesson.languageCode,
    trackDescription: track?.nativeName,
    languageCode: lesson.languageCode,
    languageName: track?.name ?? lesson.languageCode,
    languageNativeName: track?.nativeName,
    vocabulary: lesson.vocabulary,
    phrases: lesson.phrases,
    aiTeacher: lesson.aiTeacher,
  };
}

function getErrorStatus(err: unknown): number | undefined {
  if (!err || typeof err !== "object") return undefined;

  const record = err as Record<string, unknown>;
  const directStatus = record.status ?? record.statusCode;
  if (typeof directStatus === "number") return directStatus;

  const response = record.response;
  if (!response || typeof response !== "object") return undefined;

  const responseRecord = response as Record<string, unknown>;
  const responseStatus = responseRecord.status ?? responseRecord.statusCode;
  return typeof responseStatus === "number" ? responseStatus : undefined;
}

function isStreamAuthError(err: unknown): boolean {
  const status = getErrorStatus(err);
  if (status === 401 || status === 403) return true;

  const message = err instanceof Error ? err.message.toLowerCase() : "";
  return (
    message.includes("auth") ||
    message.includes("api key") ||
    message.includes("permission denied") ||
    message.includes("signature") ||
    message.includes("token")
  );
}

function getErrorMessage(err: unknown): string {
  return err instanceof Error ? err.message : "Unknown error";
}

function getStreamErrorDetails(err: unknown): string | undefined {
  if (!err || typeof err !== "object") return undefined;

  const response = (err as Record<string, unknown>).response;
  if (!response || typeof response !== "object") return undefined;

  const body = (response as Record<string, unknown>).body;
  if (!body) return undefined;

  try {
    return typeof body === "string" ? body : JSON.stringify(body);
  } catch {
    return undefined;
  }
}

function routeErrorResponse({
  callId,
  err,
  lessonId,
  stage,
  userId,
}: {
  callId?: string;
  err: unknown;
  lessonId?: string;
  stage: string;
  userId?: string;
}) {
  const streamAuthError = isStreamAuthError(err);
  const status = getErrorStatus(err);
  const details = getStreamErrorDetails(err) ?? getErrorMessage(err);

  console.error(`${ROUTE} failed`, {
    callId,
    details,
    lessonId,
    stage,
    status,
    userId,
  });

  return Response.json(
    {
      error: streamAuthError
        ? "Stream rejected the call request for authentication or permission reasons."
        : `Stream call route failed during ${stage}.`,
      code: streamAuthError ? "stream_call_auth_failed" : "stream_call_route_failed",
      source: streamAuthError ? "stream_auth" : "stream_video",
      stage,
      callId,
      details,
    },
    { status: status === 401 || status === 403 ? status : 500 },
  );
}

export async function POST(request: Request) {
  let userId: string;
  try {
    userId = await requireClerkUserId(request);
  } catch (err) {
    return clerkAuthErrorResponse(err, ROUTE);
  }

  let lessonId: string | undefined;
  let callId: string | undefined;

  try {
    const body = (await request.json().catch(() => null)) as { lessonId?: string } | null;
    lessonId = body?.lessonId;
    const lesson = lessonId ? getLessonById(lessonId) : undefined;

    if (!lesson) {
      return Response.json(
        {
          error: "Lesson not found",
          code: "lesson_not_found",
          source: "app_data",
          stage: "lesson_lookup",
        },
        { status: 404 },
      );
    }

    callId = toCallId(lesson.id, userId);

    // The call references this user as `created_by_id` and a member — both
    // require the user to already exist in Stream. The RN client's own
    // connectUser() upsert may not have landed yet, so upsert explicitly.
    try {
      await streamServerClient.upsertUsers([
        { id: userId },
        { id: AGENT_USER_ID, name: AGENT_USER_NAME },
      ]);
    } catch (err) {
      return routeErrorResponse({ callId, err, lessonId: lesson.id, stage: "stream_user_upsert", userId });
    }

    const call = streamServerClient.video.call(CALL_TYPE, callId);
    const custom = toLessonCustomData(lesson);

    try {
      await call.getOrCreate({
        data: {
          created_by_id: userId,
          members: [
            { user_id: userId, role: "host" },
            { user_id: AGENT_USER_ID, role: "admin" },
          ],
          custom,
        },
      });
    } catch (err) {
      return routeErrorResponse({ callId, err, lessonId: lesson.id, stage: "stream_call_get_or_create", userId });
    }

    try {
      await call.update({
        custom,
      });
      await call.updateCallMembers({
        update_members: [{ user_id: AGENT_USER_ID, role: "admin" }],
      });
    } catch (err) {
      return routeErrorResponse({ callId, err, lessonId: lesson.id, stage: "stream_call_update_agent", userId });
    }

    if (call.data?.backstage) {
      try {
        await call.goLive();
      } catch (err) {
        return routeErrorResponse({ callId, err, lessonId: lesson.id, stage: "stream_call_go_live", userId });
      }
    }

    return Response.json({ callId, callType: CALL_TYPE });
  } catch (err) {
    return routeErrorResponse({ callId, err, lessonId, stage: "unhandled_call_route_error", userId });
  }
}
