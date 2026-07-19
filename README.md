# Vocalingo

Vocalingo is a Duolingo-inspired Expo app for learning to sing with short vocal lessons, local progress, and an AI voice coach.

The app currently uses hardcoded TypeScript content for vocal tracks such as Pitch Basics, Ear Training, Breath Support, Vocal Warmups, Song Practice, and Harmony. Lesson calls use Stream and a voice-only Vision Agent so the coach can ask the learner to sing notes, patterns, or short pieces and respond with focused feedback.

## Get Started

```bash
npm install
npx expo start
```

## Useful Commands

```bash
npm run lint
npm run typecheck
```

## Vision Agent

```bash
cd vision-agent
python3.12 -m venv .venv
. .venv/bin/activate
pip install -e .
python agent.py serve --host 127.0.0.1 --port 8000
```

The mobile app and the agent must share the same Stream credentials.
