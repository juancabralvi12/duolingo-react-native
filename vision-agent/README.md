# Vision Agent Service

Voice-only AI vocal coach powered by Vision Agents, OpenAI Realtime, and Stream Edge transport.

## Environment

The service loads environment variables in this order:

1. `vision-agent/.env`
2. parent repo `.env.local`
3. parent repo `.env`

It reuses the parent Stream credentials. If `STREAM_API_KEY` is not set but `EXPO_PUBLIC_STREAM_API_KEY` is present, the service maps it to `STREAM_API_KEY` for the Python SDK.

Required values:

```bash
STREAM_API_KEY=...
STREAM_API_SECRET=...
OPENAI_API_KEY=...
```

Optional values:

```bash
OPENAI_REALTIME_MODEL=gpt-realtime-2
OPENAI_REALTIME_VOICE=marin
VISION_AGENT_VOCAL_TRACK=Pitch Basics
VISION_AGENT_IDLE_TIMEOUT=60
VISION_AGENT_MAX_SESSIONS=4
```

## Run

Use Python 3.10 through 3.13.

```bash
cd vision-agent
python3.12 -m venv .venv
. .venv/bin/activate
pip install -e .
python agent.py serve --host 127.0.0.1 --port 8000
```

For local call testing:

```bash
python agent.py run --call-type default --call-id lesson-test --no-demo
```

The mobile app and the agent must join the same Stream call type and call id.
