import { clerkAuthErrorResponse, clerkClient, requireClerkUserId } from "@/lib/clerkAuth";
import { streamServerClient } from "@/lib/streamServer";

const TOKEN_VALIDITY_SECONDS = 60 * 60 * 4; // 4 hours, refreshed by the client's tokenProvider
const ROUTE = "/api/stream/token";

export async function POST(request: Request) {
  let userId: string;
  try {
    userId = await requireClerkUserId(request);
  } catch (err) {
    return clerkAuthErrorResponse(err, ROUTE);
  }

  let userName: string;
  let userImage: string | undefined;
  try {
    const user = await clerkClient.users.getUser(userId);
    userName = user.fullName ?? user.username ?? "Learner";
    userImage = user.imageUrl;
  } catch (err) {
    console.error(`${ROUTE} failed to load Clerk user`, { userId, err });

    return Response.json(
      {
        error: "Clerk user lookup failed while creating the Stream token.",
        code: "clerk_user_lookup_failed",
        source: "clerk_backend",
        stage: "user_lookup",
      },
      { status: 500 },
    );
  }

  try {
    const token = streamServerClient.generateUserToken({
      user_id: userId,
      validity_in_seconds: TOKEN_VALIDITY_SECONDS,
    });

    return Response.json({
      apiKey: process.env.EXPO_PUBLIC_STREAM_API_KEY,
      token,
      userId,
      userName,
      userImage,
    });
  } catch (err) {
    console.error(`${ROUTE} failed to generate Stream token`, { userId, err });

    return Response.json(
      {
        error: "Stream token generation failed. Check the Stream API key and secret.",
        code: "stream_token_generation_failed",
        source: "stream_auth",
        stage: "stream_token_generation",
      },
      { status: 500 },
    );
  }
}
