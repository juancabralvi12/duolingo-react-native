import { getLessonById } from "@/data/lessons";

const GEMINI_BASE_URL = "https://generativelanguage.googleapis.com/v1beta";

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

declare global {
  // Shared by the lesson-video API route while the dev server process is alive.
  // This avoids adding storage for the teaching-project version.
  var __vocalingoLessonVideoJobs: Map<string, LessonVideoJob> | undefined;
}

function getGeminiApiKey(): string | undefined {
  return process.env.GEMINI_API_KEY ?? process.env.GOOGLE_API_KEY;
}

function getJobs(): Map<string, LessonVideoJob> {
  globalThis.__vocalingoLessonVideoJobs ??= new Map<string, LessonVideoJob>();
  return globalThis.__vocalingoLessonVideoJobs;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const lessonId = url.searchParams.get("lessonId");
  const token = url.searchParams.get("token");

  if (!lessonId || !token || !getLessonById(lessonId)) {
    return Response.json({ error: "Video not found." }, { status: 404 });
  }

  const job = getJobs().get(lessonId);
  if (!job || job.status !== "ready" || !job.videoUri || job.accessToken !== token) {
    return Response.json({ error: "Video not ready." }, { status: 404 });
  }

  const apiKey = getGeminiApiKey();
  if (!apiKey) {
    return Response.json({ error: "Missing Gemini API key." }, { status: 501 });
  }

  const res = await fetch(job.videoUri.startsWith("http") ? job.videoUri : `${GEMINI_BASE_URL}/${job.videoUri}`, {
    headers: { "x-goog-api-key": apiKey },
  });

  if (!res.ok) {
    return Response.json({ error: `Could not download generated video (${res.status}).` }, { status: 502 });
  }

  return new Response(res.body, {
    headers: {
      "content-type": res.headers.get("content-type") ?? "video/mp4",
      "cache-control": "private, max-age=3600",
    },
  });
}
