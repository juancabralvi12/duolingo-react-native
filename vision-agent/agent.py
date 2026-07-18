from __future__ import annotations

import os
from collections.abc import Mapping
from pathlib import Path
from typing import Any

from dotenv import load_dotenv
from vision_agents.core import Agent, AgentLauncher, Runner, User
from vision_agents.core.instructions import Instructions
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


def read_text(mapping: Mapping[str, Any], key: str, default: str = "") -> str:
    value = mapping.get(key)
    return value if isinstance(value, str) else default


def read_mapping(mapping: Mapping[str, Any], key: str) -> Mapping[str, Any]:
    value = mapping.get(key)
    return value if isinstance(value, Mapping) else {}


def read_mapping_list(mapping: Mapping[str, Any], key: str) -> list[Mapping[str, Any]]:
    value = mapping.get(key)
    if not isinstance(value, list):
        return []
    return [item for item in value if isinstance(item, Mapping)]


def format_vocabulary(custom: Mapping[str, Any]) -> str:
    lines: list[str] = []
    for item in read_mapping_list(custom, "vocabulary"):
        word = read_text(item, "word")
        translation = read_text(item, "translation")
        pronunciation = read_text(item, "pronunciation")
        if not word and not translation:
            continue
        details = f"{word}: {translation}".strip(": ")
        if pronunciation:
            details = f"{details} (pronounced {pronunciation})"
        lines.append(f"- {details}")
    return "\n".join(lines)


def format_phrases(custom: Mapping[str, Any]) -> str:
    lines: list[str] = []
    for item in read_mapping_list(custom, "phrases"):
        text = read_text(item, "text")
        translation = read_text(item, "translation")
        if not text and not translation:
            continue
        lines.append(f"- {text}: {translation}".strip(": "))
    return "\n".join(lines)


def build_teacher_instructions(custom: Mapping[str, Any] | None = None) -> str:
    custom = custom or {}
    ai_teacher = read_mapping(custom, "aiTeacher")

    language = (
        read_text(custom, "languageName")
        or read_text(custom, "languageCode")
        or DEFAULT_TEACHING_LANGUAGE
    )
    native_name = read_text(custom, "languageNativeName")
    lesson_title = read_text(custom, "lessonTitle", "the selected lesson")
    lesson_goal = read_text(custom, "lessonGoal")
    teacher_prompt = read_text(ai_teacher, "systemPrompt")
    vocabulary = format_vocabulary(custom)
    phrases = format_phrases(custom)

    language_label = f"{language} ({native_name})" if native_name else language

    return (
        "You are a warm, energetic, human-sounding AI language teacher for a Duolingo-inspired app — "
        "never robotic, never a script reader. You are voice only, so speak naturally and conversationally. "
        f"The learner is studying {language_label}, and you teach it mostly through English, "
        "introducing target-language words and phrases slowly with their translations right away. "
        "Use short, natural sentences with contractions and gentle encouragement — keep every reply to one "
        "or two sentences so a beginner can easily answer out loud. "
        "Listen closely to what the learner says, respond to it directly, and ask them to repeat or try "
        "again when it helps them learn. "
        f"Right now you are teaching {lesson_title}. "
        f"Stay strictly within this lesson's goal — {lesson_goal or 'practice beginner speaking.'} — and only "
        "use the vocabulary and phrases below. Do not teach unrelated topics and do not switch to another "
        "language. "
        f"Lesson vocabulary:\n{vocabulary or '- No vocabulary was provided.'}\n"
        f"Lesson phrases:\n{phrases or '- No phrases were provided.'}\n"
        f"Lesson-specific teacher notes:\n{teacher_prompt or 'No additional teacher prompt was provided.'}"
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
        instructions=build_teacher_instructions({"languageName": language}),
        llm=openai.Realtime(
            model=os.getenv("OPENAI_REALTIME_MODEL", "gpt-realtime-2"),
            voice=os.getenv("OPENAI_REALTIME_VOICE", "marin"),
            send_video=False,
        ),
    )


async def read_call_custom(call: object) -> dict[str, Any]:
    try:
        await call.get()  # type: ignore[attr-defined]
    except Exception as exc:
        print(f"Warning: could not read Stream call custom data: {exc}")

    custom_data = getattr(call, "custom_data", {})
    return custom_data if isinstance(custom_data, dict) else {}


def build_kickoff_message(custom: Mapping[str, Any]) -> str:
    ai_teacher = read_mapping(custom, "aiTeacher")
    kickoff = read_text(ai_teacher, "kickoffMessage")
    language = read_text(custom, "languageName") or DEFAULT_TEACHING_LANGUAGE
    lesson_title = read_text(custom, "lessonTitle", "this lesson")
    lesson_goal = read_text(custom, "lessonGoal")

    if kickoff:
        return kickoff

    return (
        f"Greet the learner warmly in English, like a real {language} teacher happy to see them, "
        f"then invite them into {lesson_title} in one or two energetic, conversational sentences. "
        f"Focus on this goal: {lesson_goal or 'help the learner practice speaking out loud.'}"
    )


async def join_call(agent: Agent, call_type: str, call_id: str, **kwargs: object) -> None:
    call = await agent.create_call(call_type, call_id)
    custom = await read_call_custom(call)
    agent.instructions = Instructions(input_text=build_teacher_instructions(custom))

    async with agent.join(call):
        await agent.simple_response(text=build_kickoff_message(custom))
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
