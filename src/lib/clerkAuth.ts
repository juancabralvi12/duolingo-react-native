import { createClerkClient, verifyToken } from "@clerk/backend";

const secretKey = process.env.CLERK_SECRET_KEY;

if (!secretKey) {
  throw new Error("Missing CLERK_SECRET_KEY. Add it to your .env file.");
}

export const clerkClient = createClerkClient({ secretKey });

export type ClerkAuthErrorCode = "missing_authorization" | "invalid_session_token";

export class ClerkAuthError extends Error {
  status = 401;

  constructor(
    public code: ClerkAuthErrorCode,
    message: string,
  ) {
    super(message);
    this.name = "ClerkAuthError";
  }
}

export function clerkAuthErrorResponse(err: unknown, route: string): Response {
  if (err instanceof ClerkAuthError) {
    console.warn(`${route} rejected Clerk session`, { code: err.code });

    return Response.json(
      {
        error: err.message,
        code: err.code,
        source: "clerk_auth",
        stage: "session_verification",
      },
      { status: err.status },
    );
  }

  console.error(`${route} failed during Clerk session verification`, err);

  return Response.json(
    {
      error: "Could not verify Clerk session.",
      code: "clerk_auth_unknown",
      source: "clerk_auth",
      stage: "session_verification",
    },
    { status: 401 },
  );
}

/**
 * Derives the Clerk user id from the request's own session token. Never trust
 * a client-supplied user id here — any signed-in user could otherwise mint a
 * Stream token or call for someone else.
 */
export async function requireClerkUserId(request: Request): Promise<string> {
  const authHeader = request.headers.get("authorization");
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : undefined;

  if (!token) {
    throw new ClerkAuthError("missing_authorization", "Missing Clerk session token.");
  }

  try {
    const { sub } = await verifyToken(token, { secretKey });
    return sub;
  } catch {
    throw new ClerkAuthError("invalid_session_token", "Invalid or expired Clerk session token.");
  }
}
