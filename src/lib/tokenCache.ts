import type { TokenCache } from "@clerk/expo";

/**
 * `@clerk/expo/token-cache` requires expo-secure-store's native module at import
 * time. If the running Expo Go client predates this SDK, that throws and takes
 * the whole app down. Fall back to Clerk's own in-memory cache (passing
 * `undefined` to ClerkProvider) instead of crashing — sessions just won't
 * survive an app restart until the native module is available.
 */
const createSafeTokenCache = (): TokenCache | undefined => {
  try {
    // Must be a runtime require (not a static import) so the try/catch below
    // can catch a throw from expo-secure-store's native module lookup.
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    return (require("@clerk/expo/token-cache") as { tokenCache: TokenCache | undefined })
      .tokenCache;
  } catch (error) {
    console.warn(
      "Clerk: expo-secure-store native module is unavailable, falling back to in-memory session storage.",
      error,
    );
    return undefined;
  }
};

export const tokenCache = createSafeTokenCache();
