Read AGENTS.md first and follow it strictly.

Improve the AI vocal coach's spoken output so it feels warm, human, energetic, and lesson-focused instead of robotic. Update only the Vision Agent kickoff prompt and the per-lesson entries in `data/lessons.ts`.

The AI coach should act like a real-world vocal coach for the currently selected vocal track and lesson only. It should stay strictly within that lesson's goal, drills, practice prompts, and context, and should not teach unrelated topics.

Required delta for Vocalingo:

- The coach should mostly speak English, then ask the learner to sing a note, pattern, warmup, or short phrase.
- After listening, the coach should adapt the next instruction with one specific correction.
- Corrections should focus on pitch, breath, vowel shape, tone, timing, and confidence.
- Keep replies to one or two conversational sentences.
- Never push through throat pain.
