Read AGENTS.md first and follow it strictly.

Add PostHog event tracking to the existing app using the PostHog instance already initialized in `lib/posthog.ts`. Do not reinitialize PostHog and do not change the existing PostHogProvider setup.

User identification:

- After Clerk authentication completes (sign-in or sign-up), call `posthog.identify()` with the Clerk user's id as `distinctId`.
- On the first identify call after sign-up, set user properties: `signup_date` (current ISO date, via `$set_once`) and `preferred_vocal_track` (the vocal track the user selected during onboarding, or null if not yet selected).
- On every subsequent identify, update `preferred_vocal_track` if it has changed.

Three custom events, captured at these moments:

1. `vocal_track_selected` fires when the user confirms their vocal track on the track selection screen.
   Properties: `{ vocal_track_code: string, vocal_track_name: string }`

2. `lesson_started` fires when the lesson screen mounts and the user begins the lesson.
   Properties: `{ lesson_id: string, vocal_track: string, lesson_number: number }`

3. `lesson_abandoned` fires when the user exits a lesson before `lesson_completed` fires.
   Properties: `{ lesson_id: string, time_into_lesson_seconds: number, last_question_index: number }`

Implementation rules:

- Track lesson start time with a ref captured on mount so duration_seconds is accurate.
- Do not modify any UI.
- Do not expose any keys; PostHog is already configured via environment variables.

Required delta for Vocalingo:

- Do not send legacy `language_selected` or `preferred_language` events unless product analytics explicitly needs backward compatibility.
- Analytics naming should match vocal training concepts.
