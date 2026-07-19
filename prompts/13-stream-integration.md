Read AGENTS.md first and follow it strictly.

Use the installed GetStream agent skills and the Stream docs to implement Stream audio call setup for the selected vocal lesson flow. When a user taps a lesson, keep the existing Audio Lesson screen UI and add the ability to start, join, mute/unmute, and end an audio-only Stream call.

Use Expo API routes for Stream token generation and call creation. Do not expose Stream secrets in the Expo app. Use the selected lesson, selected vocal track, and logged-in Clerk user when creating the call/session.

Preserve the existing UI and lesson data. Add clear loading, joined, error, muted, connecting, ended states and user info on the audio UI.

Required delta for Vocalingo:

- The call is for singing practice, so microphone access is required and camera should be optional.
- Error strings should mention the AI vocal coach rather than an AI language teacher.
- Call custom data should include track, lesson goal, vocal drills, practice prompts, and AI coach prompt.
