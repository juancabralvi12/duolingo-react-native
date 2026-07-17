import { StreamClient } from "@stream-io/node-sdk";

const apiKey = process.env.EXPO_PUBLIC_STREAM_API_KEY;
const apiSecret = process.env.STREAM_API_SECRET;

if (!apiKey || !apiSecret) {
  throw new Error(
    "Missing Stream credentials. Set EXPO_PUBLIC_STREAM_API_KEY and STREAM_API_SECRET in your .env file.",
  );
}

// Server-only: holds the Stream API secret. Never import this from client code.
export const streamServerClient = new StreamClient(apiKey, apiSecret);
