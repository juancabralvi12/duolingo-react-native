from __future__ import annotations

import os
from pathlib import Path

from dotenv import load_dotenv
from vision_agents.core import Agent, AgentLauncher, Runner, User
from vision_agents.plugins import getstream, openai


SERVICE_DIR = Path(__file__).resolve().parent
REPO_ROOT = SERVICE_DIR.parent

AGENT_NAME = "LinguaCoach"
AGENT_USER_ID = "ai-language-teacher"
DEFAULT_TEACHING_LANGUAGE = "the selected language"


def load_environment() -> None:
    """Load service-local env first, then reuse the parent Expo env."""

    for env_file in (
        SERVICE_DIR / ".env",
        REPO_ROOT / ".env.local",
        REPO_ROOT / ".env",
    ):
        load_dotenv(env_file, override=False)

    expo_stream_key = os.getenv("EXPO_PUBLIC_STREAM_API_KEY")
    if not os.getenv("STREAM_API_KEY") and expo_stream_key:
        os.environ["STREAM_API_KEY"] = expo_stream_key


def require_environment() -> None:
    missing = [
        name
        for name in ("STREAM_API_KEY", "STREAM_API_SECRET", "OPENAI_API_KEY")
        if not os.getenv(name)
    ]
    if missing:
        names = ", ".join(missing)
        raise RuntimeError(f"Missing required environment variables: {names}")


def build_teacher_instructions(language: str = DEFAULT_TEACHING_LANGUAGE) -> str:
    return (
        "You are the AI language teacher for a Duolingo-inspired mobile app. "
        "You are voice only: speak naturally, briefly, and conversationally. "
        "Always speak English as the teaching language. "
        f"The learner is studying {language}; teach that language through English. "
        "Introduce target-language words slowly, translate them right away, and ask the learner to repeat. "
        "Keep each turn short enough for a beginner to answer out loud. "
        "Be warm, energetic, and encouraging. "
        "If lesson-specific context is not available yet, ask what they would like to practice and start with a simple greeting."
    )


async def create_agent(**kwargs: object) -> Agent:
    language = str(
        kwargs.get("language")
        or os.getenv("VISION_AGENT_TEACHING_LANGUAGE")
        or DEFAULT_TEACHING_LANGUAGE
    )

    return Agent(
        edge=getstream.Edge(),
        agent_user=User(name=AGENT_NAME, id=AGENT_USER_ID),
        instructions=build_teacher_instructions(language),
        llm=openai.Realtime(
            model=os.getenv("OPENAI_REALTIME_MODEL", "gpt-realtime-2"),
            voice=os.getenv("OPENAI_REALTIME_VOICE", "marin"),
            send_video=False,
        ),
    )


async def join_call(agent: Agent, call_type: str, call_id: str, **kwargs: object) -> None:
    call = await agent.create_call(call_type, call_id)

    async with agent.join(call):
        await agent.simple_response(
            text=(
                "Greet the learner in English, introduce yourself as their AI language teacher, "
                "and ask them to say one simple word in the language they selected."
            )
        )
        await agent.finish()


load_environment()
require_environment()

runner = Runner(
    AgentLauncher(
        create_agent=create_agent,
        join_call=join_call,
        agent_idle_timeout=float(os.getenv("VISION_AGENT_IDLE_TIMEOUT", "60")),
        max_concurrent_sessions=int(os.getenv("VISION_AGENT_MAX_SESSIONS", "4")),
        max_sessions_per_call=1,
    )
)


def main() -> None:
    runner.cli()


if __name__ == "__main__":
    main()
