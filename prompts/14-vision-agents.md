Read AGENTS.md first and follow it strictly.

Use the installed Vision Agents skill to create a Python service at `vision-agent/` inside this repo. It is the AI vocal coach, voice only, using OpenAI Realtime as the LLM and Stream Edge for transport.

Reuse STREAM_API_KEY/STREAM_API_SECRET from the parent .env and add OPENAI_API_KEY. By default the coach always speaks English and teaches the selected vocal track through short sung or spoken prompts.

Before writing any lifecycle code, verify the join and lifecycle method shapes against the installed SDK in this repo and confirm it starts cleanly.

Required delta for Vocalingo:

- The coach should ask the learner to sing notes, tiny melodic patterns, warmups, or short pieces.
- The coach should give concise corrections on pitch, breath, tone, vowel shape, rhythm, and confidence.
- Include safe voice guidance: if the learner reports throat pain, tell them to stop, sip water, and rest.
