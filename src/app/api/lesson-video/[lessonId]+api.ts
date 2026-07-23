import { getLessonById } from "@/data/lessons";
import { clerkAuthErrorResponse, requireClerkUserId } from "@/lib/clerkAuth";
import type { Lesson } from "@/types/learning";

const ROUTE = "/api/lesson-video/[lessonId]";
const GEMINI_BASE_URL = "https://generativelanguage.googleapis.com/v1beta";
const DEFAULT_VEO_MODEL = "veo-3.1-generate-preview";

type LessonVideoStatus = "generating" | "ready" | "failed";

interface LessonVideoJob {
  lessonId: string;
  status: LessonVideoStatus;
  operationName?: string;
  videoUri?: string;
  accessToken: string;
  errorMessage?: string;
  createdAt: number;
  updatedAt: number;
}

interface VeoStartResponse {
  name?: string;
  error?: { message?: string };
}

interface VeoOperationResponse {
  done?: boolean;
  error?: { message?: string };
  response?: {
    generateVideoResponse?: {
      generatedSamples?: {
        video?: {
          uri?: string;
        };
      }[];
    };
  };
}

declare global {
  // Shared by the video file proxy while the dev server process is alive.
  var __vocalingoLessonVideoJobs: Map<string, LessonVideoJob> | undefined;
}

function getJobs(): Map<string, LessonVideoJob> {
  globalThis.__vocalingoLessonVideoJobs ??= new Map<string, LessonVideoJob>();
  return globalThis.__vocalingoLessonVideoJobs;
}

function getGeminiApiKey(): string | undefined {
  return process.env.GEMINI_API_KEY ?? process.env.GOOGLE_API_KEY;
}

function getVeoModel(): string {
  return process.env.GEMINI_VEO_MODEL ?? DEFAULT_VEO_MODEL;
}

function makeAccessToken(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
}

function makeDemoPrompt(lesson: Lesson): string {
  const firstStep = lesson.phrases[0];
  const secondStep = lesson.phrases[1];
  const steps = [firstStep, secondStep]
    .filter(Boolean)
    .map((step) => `${step.text}: ${step.translation}`)
    .join("; ");

  return [
    "Create an 8-second vertical 9:16 instructional video for a beginner singing app.",
    "A friendly vocal coach stands in a bright simple practice room, framed waist-up, calm and encouraging.",
    `The coach silently demonstrates this exercise: ${lesson.title}. Goal: ${lesson.goal}.`,
    `Exercise steps: ${steps}.`,
    "Show relaxed posture, low easy breath, gentle facial expression, and simple hand gestures that make the singing pattern easy to copy.",
    "No text overlays, no logos, no sheet music, no medical advice, no dramatic stage lighting.",
    "Natural studio ambience and a soft vocal demonstration are okay.",
  ].join(" ");
}

function routeErrorResponse(message: string, status = 500) {
  return Response.json(
    {
      error: message,
      code: "lesson_video_error",
      source: "gemini_veo",
    },
    { status },
  );
}

function getLessonIdFromRequest(request: Request): string | undefined {
  const url = new URL(request.url);
  const parts = url.pathname.split("/").filter(Boolean);
  return parts[parts.length - 1];
}

function makeVideoUrl(request: Request, job: LessonVideoJob): string | undefined {
  if (!job.videoUri) return undefined;

  const url = new URL(request.url);
  url.pathname = "/api/lesson-video/file";
  url.search = "";
  url.searchParams.set("lessonId", job.lessonId);
  url.searchParams.set("token", job.accessToken);

  return url.toString();
}

function jobResponse(request: Request, job: LessonVideoJob) {
  return Response.json({
    lessonId: job.lessonId,
    status: job.status,
    videoUrl: makeVideoUrl(request, job),
    errorMessage: job.errorMessage,
  });
}

async function pollVeoOperation(job: LessonVideoJob, apiKey: string): Promise<LessonVideoJob> {
  if (!job.operationName || job.status !== "generating") return job;

  const res = await fetch(`${GEMINI_BASE_URL}/${job.operationName}`, {
    headers: { "x-goog-api-key": apiKey },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    job.status = "failed";
    job.errorMessage = text || `Veo operation polling failed (${res.status}).`;
    job.updatedAt = Date.now();
    return job;
  }

  const body = (await res.json().catch(() => null)) as VeoOperationResponse | null;

  if (!body?.done) {
    job.updatedAt = Date.now();
    return job;
  }

  const videoUri = body.response?.generateVideoResponse?.generatedSamples?.[0]?.video?.uri;
  if (!videoUri) {
    job.status = "failed";
    job.errorMessage = body.error?.message ?? "Veo finished without returning a video URI.";
    job.updatedAt = Date.now();
    return job;
  }

  job.status = "ready";
  job.videoUri = videoUri;
  job.updatedAt = Date.now();
  return job;
}

export async function GET(request: Request) {
  try {
    await requireClerkUserId(request);
  } catch (err) {
    return clerkAuthErrorResponse(err, ROUTE);
  }

  const lessonId = getLessonIdFromRequest(request);
  const lesson = lessonId ? getLessonById(lessonId) : undefined;
  if (!lesson || !lessonId) return routeErrorResponse("Lesson not found.", 404);

  const job = getJobs().get(lessonId);
  if (!job) {
    return Response.json({ lessonId, status: "idle" });
  }

  const apiKey = getGeminiApiKey();
  if (!apiKey) return jobResponse(request, job);

  if (job.status === "generating") {
    await pollVeoOperation(job, apiKey);
  }

  return jobResponse(request, job);
}

export async function POST(request: Request) {
  try {
    await requireClerkUserId(request);
  } catch (err) {
    return clerkAuthErrorResponse(err, ROUTE);
  }

  const lessonId = getLessonIdFromRequest(request);
  const lesson = lessonId ? getLessonById(lessonId) : undefined;
  if (!lesson || !lessonId) return routeErrorResponse("Lesson not found.", 404);

  const existingJob = getJobs().get(lessonId);
  if (existingJob && existingJob.status !== "failed") {
    return jobResponse(request, existingJob);
  }

  const apiKey = getGeminiApiKey();
  if (!apiKey) {
    return routeErrorResponse("Set GEMINI_API_KEY or GOOGLE_API_KEY to generate lesson videos.", 501);
  }

  const res = await fetch(`${GEMINI_BASE_URL}/models/${getVeoModel()}:predictLongRunning`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-goog-api-key": apiKey,
    },
    body: JSON.stringify({
      instances: [{ prompt: makeDemoPrompt(lesson) }],
      parameters: {
        aspectRatio: "9:16",
      },
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    return routeErrorResponse(text || `Veo generation failed (${res.status}).`, 502);
  }

  const body = (await res.json().catch(() => null)) as VeoStartResponse | null;
  if (!body?.name) {
    return routeErrorResponse(body?.error?.message ?? "Veo did not return an operation name.", 502);
  }

  const job: LessonVideoJob = {
    lessonId,
    status: "generating",
    operationName: body.name,
    accessToken: makeAccessToken(),
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
  getJobs().set(lessonId, job);

  return jobResponse(request, job);
}
