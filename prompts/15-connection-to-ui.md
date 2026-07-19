Read AGENTS.md first and follow it strictly.

Use the installed Vision Agents skill and Stream skills to connect the Audio Lesson screen to the Vision Agent so the AI vocal coach joins the same Stream call as the user.

Add Expo API routes to start and stop the agent that proxy to the Vision Agent server, and pack the selected lesson, vocal track, goals, vocal drills, practice prompts, and AI coach prompt into the Stream call's custom data so the agent can read it on join. Update the Python agent to actually consume those fields.

Make sure the agent has permission to publish audio in `audio_room` (admin role + goLive). Clean up the agent session both when the user ends the call and when the screen unmounts.

Do not expose any secrets in the mobile app. Keep the existing Stream audio flow intact. Show the agent connection status with idle, connecting, connected, and failed states.

Required delta for Vocalingo:

- Use an agent identity like `ai-vocal-coach`, not `ai-language-teacher`.
- Preserve backward-compatible custom fields only if they help the tutorial avoid noisy renames.
