import type {
  AITeacherPrompt,
  Activity,
  Lesson,
  Phrase,
  VocabularyItem,
} from "@/types/learning";

type LessonSeed = {
  id: string;
  unitId: string;
  languageCode: string;
  order: number;
  title: string;
  goal: string;
  vocabulary: VocabularyItem[];
  phrases: Phrase[];
  teacherFocus: string;
  kickoffMessage: string;
};

function vocabularyActivity(id: string, vocabulary: VocabularyItem): Activity {
  return {
    id,
    type: "vocabulary",
    prompt: `Practice ${vocabulary.word}: ${vocabulary.translation}.`,
    vocabulary,
  };
}

function phraseActivity(id: string, phrase: Phrase): Activity {
  return {
    id,
    type: "speaking",
    prompt: `Sing ${phrase.text}.`,
    phrase,
  };
}

function vocalCoachPrompt(focus: string, kickoffMessage: string): AITeacherPrompt {
  return {
    systemPrompt:
      "You're a warm, energetic vocal coach working one-on-one with a beginner singer. You are voice only, so keep your coaching conversational, short, and easy to answer out loud. Ask the learner to sing one note, a tiny pattern, or a short piece, then listen and respond with specific feedback about pitch, breath, vowel shape, tone, timing, or confidence. Correct gently, model the target when useful, and ask them to try again with one clear adjustment. Stay strictly focused on this lesson's goal, vocal exercises, and practice phrases. Do not teach unrelated music theory, diagnose medical issues, or push through pain. If the learner says their throat hurts, tell them to stop, sip water, and rest. Lesson focus: " +
      focus,
    kickoffMessage,
  };
}

function createLesson(seed: LessonSeed): Lesson {
  return {
    ...seed,
    activities: [
      vocabularyActivity(`${seed.id}-a1`, seed.vocabulary[0]),
      vocabularyActivity(`${seed.id}-a2`, seed.vocabulary[1]),
      phraseActivity(`${seed.id}-a3`, seed.phrases[0]),
      phraseActivity(`${seed.id}-a4`, seed.phrases[1]),
    ],
    aiTeacher: vocalCoachPrompt(seed.teacherFocus, seed.kickoffMessage),
    imageUrl: `https://picsum.photos/seed/${seed.id}/200/200`,
  };
}

export const lessons: Lesson[] = [
  createLesson({
    id: "pitch-unit-1-lesson-1",
    unitId: "pitch-unit-1",
    languageCode: "pitch",
    order: 1,
    title: "Sing One Note",
    goal: "Match a comfortable middle note and hold it steadily.",
    vocabulary: [
      { word: "Middle C", translation: "Sing C4 on an open ah", pronunciation: "C four" },
      { word: "Steady tone", translation: "Hold one pitch without sliding", pronunciation: "stay-dee tone" },
      { word: "Listen first", translation: "Hear the note before you sing", pronunciation: "listen first" },
    ],
    phrases: [
      { text: "Ah on C4", translation: "Hold the note for three counts", context: "single-note match" },
      { text: "Mm to ah", translation: "Start with a hum, then open to ah", context: "gentle onset" },
    ],
    teacherFocus: "Help the learner hear C4, sing it back, and stabilize the note without pushing.",
    kickoffMessage:
      "Hi, I'm your vocal coach. I'll sing or name one comfortable note, then you sing it back and I'll help you tune it.",
  }),
  createLesson({
    id: "pitch-unit-1-lesson-2",
    unitId: "pitch-unit-1",
    languageCode: "pitch",
    order: 2,
    title: "Step Up And Down",
    goal: "Sing three nearby notes in tune: C4, D4, and E4.",
    vocabulary: [
      { word: "Step up", translation: "Move from C4 to D4", pronunciation: "step up" },
      { word: "Step down", translation: "Move from E4 to D4", pronunciation: "step down" },
      { word: "Center the pitch", translation: "Land directly on the note", pronunciation: "sen-ter" },
    ],
    phrases: [
      { text: "C4 D4 E4", translation: "Sing three notes going up", context: "ascending pattern" },
      { text: "E4 D4 C4", translation: "Sing three notes going down", context: "descending pattern" },
    ],
    teacherFocus: "Coach stepwise pitch movement and correct scooping, falling flat, or overshooting.",
    kickoffMessage:
      "Let's make a tiny staircase with your voice. Sing C, D, E after me, and I'll tell you which note wants a little adjustment.",
  }),
  createLesson({
    id: "pitch-unit-1-lesson-3",
    unitId: "pitch-unit-1",
    languageCode: "pitch",
    order: 3,
    title: "Hold The Note",
    goal: "Sustain a note for four counts with a relaxed, even sound.",
    vocabulary: [
      { word: "Sustain", translation: "Keep the note going", pronunciation: "suh-stayn" },
      { word: "Release", translation: "End the note cleanly", pronunciation: "ree-lees" },
      { word: "Even air", translation: "Use a smooth breath stream", pronunciation: "ee-ven air" },
    ],
    phrases: [
      { text: "Ah for four", translation: "Hold one note for four counts", context: "sustain drill" },
      { text: "Oo for four", translation: "Hold the same pitch on oo", context: "vowel control" },
    ],
    teacherFocus: "Listen for wavering pitch, breath drops, and tense endings during sustained notes.",
    kickoffMessage:
      "Today we'll hold one note like a steady line. Give me an easy ah for four counts, and I'll coach the breath and pitch.",
  }),
  createLesson({
    id: "pitch-unit-1-lesson-4",
    unitId: "pitch-unit-1",
    languageCode: "pitch",
    order: 4,
    title: "Find Your Starting Note",
    goal: "Start a short phrase on the right note without guessing.",
    vocabulary: [
      { word: "Starting pitch", translation: "The first note of the phrase", pronunciation: "star-ting pitch" },
      { word: "Pitch memory", translation: "Keep the note in your ear", pronunciation: "pitch mem-oh-ree" },
      { word: "Reset breath", translation: "Breathe before you begin", pronunciation: "ree-set breath" },
    ],
    phrases: [
      { text: "C4 E4 D4", translation: "Sing the small pattern after hearing C4", context: "pitch memory" },
      { text: "D4 F4 E4", translation: "Start on D4 and return smoothly", context: "starting note" },
    ],
    teacherFocus: "Help the learner pause, hear the first note internally, then sing the phrase accurately.",
    kickoffMessage:
      "Let's practice starting with confidence. I'll give you a first note, you sing a tiny phrase, and we'll tune the entrance.",
  }),

  createLesson({
    id: "ear-unit-1-lesson-1",
    unitId: "ear-unit-1",
    languageCode: "ear",
    order: 1,
    title: "Higher Or Lower",
    goal: "Hear whether the second note moves higher or lower.",
    vocabulary: [
      { word: "Higher", translation: "The second note goes up", pronunciation: "high-er" },
      { word: "Lower", translation: "The second note goes down", pronunciation: "low-er" },
      { word: "Same", translation: "The note repeats", pronunciation: "same" },
    ],
    phrases: [
      { text: "C4 then E4", translation: "Hear and sing higher", context: "upward comparison" },
      { text: "E4 then C4", translation: "Hear and sing lower", context: "downward comparison" },
    ],
    teacherFocus: "Ask the learner to identify direction, then sing the pair back with clear pitch movement.",
    kickoffMessage:
      "I'll play the role of your ear coach today. Listen for whether the next note goes higher or lower, then sing it back.",
  }),
  createLesson({
    id: "ear-unit-1-lesson-2",
    unitId: "ear-unit-1",
    languageCode: "ear",
    order: 2,
    title: "Steps And Skips",
    goal: "Tell the difference between nearby notes and wider jumps.",
    vocabulary: [
      { word: "Step", translation: "A small move to the next note", pronunciation: "step" },
      { word: "Skip", translation: "A wider move over a note", pronunciation: "skip" },
      { word: "Interval", translation: "The distance between notes", pronunciation: "in-ter-val" },
    ],
    phrases: [
      { text: "C4 D4", translation: "Sing a step", context: "small interval" },
      { text: "C4 E4", translation: "Sing a skip", context: "wider interval" },
    ],
    teacherFocus: "Coach the learner to hear interval size and sing steps smaller than skips.",
    kickoffMessage:
      "Let's train your ear for distance. I'll ask for a step or a skip, and we'll make your voice match what you hear.",
  }),

  createLesson({
    id: "breath-unit-1-lesson-1",
    unitId: "breath-unit-1",
    languageCode: "breath",
    order: 1,
    title: "Breathe Low",
    goal: "Take a relaxed singer's breath before phonating.",
    vocabulary: [
      { word: "Low breath", translation: "Let the ribs and belly expand gently", pronunciation: "low breath" },
      { word: "Silent inhale", translation: "Breathe in without gasping", pronunciation: "sigh-lent in-hale" },
      { word: "Tall posture", translation: "Stand or sit long and easy", pronunciation: "tall pos-chur" },
    ],
    phrases: [
      { text: "Inhale, hiss", translation: "Breathe in and hiss for six counts", context: "air control" },
      { text: "Inhale, hum", translation: "Breathe in and hum softly", context: "gentle phonation" },
    ],
    teacherFocus: "Guide relaxed breathing, no shoulder lifting, and no throat tension.",
    kickoffMessage:
      "Before we sing, let's set up your breath. Take a quiet low inhale, then give me a soft hiss for six counts.",
  }),
  createLesson({
    id: "breath-unit-1-lesson-2",
    unitId: "breath-unit-1",
    languageCode: "breath",
    order: 2,
    title: "Even Air",
    goal: "Keep one note steady with consistent breath support.",
    vocabulary: [
      { word: "Airflow", translation: "The steady stream behind the note", pronunciation: "air-flow" },
      { word: "Support", translation: "Gentle body engagement while singing", pronunciation: "suh-port" },
      { word: "Float", translation: "Let the note ride on the breath", pronunciation: "float" },
    ],
    phrases: [
      { text: "Ah for four", translation: "Sing with even air", context: "supported sustain" },
      { text: "Ah, rest, ah", translation: "Repeat the same note twice", context: "consistent onset" },
    ],
    teacherFocus: "Listen for breath collapse, pressed tone, and fading pitch; correct with one breath cue.",
    kickoffMessage:
      "Let's make your air feel steady and easy. Sing one ah for four counts, and I'll help smooth out the breath.",
  }),

  createLesson({
    id: "warmups-unit-1-lesson-1",
    unitId: "warmups-unit-1",
    languageCode: "warmups",
    order: 1,
    title: "Gentle Hums",
    goal: "Warm up with soft humming and relaxed resonance.",
    vocabulary: [
      { word: "Hum", translation: "Sing with closed lips", pronunciation: "hum" },
      { word: "Buzz", translation: "Feel vibration in the front of the face", pronunciation: "buzz" },
      { word: "Easy onset", translation: "Start the sound without a hard attack", pronunciation: "ee-zee on-set" },
    ],
    phrases: [
      { text: "Mm on C4", translation: "Hum one comfortable note", context: "single-note hum" },
      { text: "Mm C4 D4 C4", translation: "Hum a small three-note pattern", context: "gentle pattern" },
    ],
    teacherFocus: "Keep the sound gentle, buzzy, and free of jaw or throat tension.",
    kickoffMessage:
      "We'll start with a gentle hum. Keep your lips closed, feel a little buzz, and hum one easy note after me.",
  }),
  createLesson({
    id: "warmups-unit-1-lesson-2",
    unitId: "warmups-unit-1",
    languageCode: "warmups",
    order: 2,
    title: "Lip Trill Sirens",
    goal: "Slide smoothly through your range with a relaxed lip trill.",
    vocabulary: [
      { word: "Lip trill", translation: "Bubble the lips while phonating", pronunciation: "lip trill" },
      { word: "Sirens", translation: "Slide up and down smoothly", pronunciation: "sigh-rens" },
      { word: "Release tension", translation: "Let the face and jaw stay loose", pronunciation: "ree-lees ten-shun" },
    ],
    phrases: [
      { text: "Brr up", translation: "Trill from low to high", context: "ascending siren" },
      { text: "Brr down", translation: "Trill from high to low", context: "descending siren" },
    ],
    teacherFocus: "Coach airflow and relaxation when the trill stops or the throat tightens.",
    kickoffMessage:
      "Time for a lip trill siren. If the trill breaks, that's useful feedback, and we'll fix it with easier airflow.",
  }),

  createLesson({
    id: "songs-unit-1-lesson-1",
    unitId: "songs-unit-1",
    languageCode: "songs",
    order: 1,
    title: "First Short Melody",
    goal: "Sing a four-note phrase with clear pitch and rhythm.",
    vocabulary: [
      { word: "Phrase", translation: "A short musical sentence", pronunciation: "frayz" },
      { word: "Beat", translation: "The steady pulse", pronunciation: "beet" },
      { word: "Shape", translation: "Sing with a beginning, middle, and ending", pronunciation: "shayp" },
    ],
    phrases: [
      { text: "C4 D4 E4 D4", translation: "Sing a simple melodic phrase", context: "short melody" },
      { text: "C4 C4 D4 E4", translation: "Keep the beat steady", context: "rhythm phrase" },
    ],
    teacherFocus: "Correct note accuracy, timing, and phrase shape in a short melody.",
    kickoffMessage:
      "Let's sing a tiny piece. I'll guide the notes, you sing the phrase, and then I'll give one clear correction.",
  }),
  createLesson({
    id: "songs-unit-1-lesson-2",
    unitId: "songs-unit-1",
    languageCode: "songs",
    order: 2,
    title: "Add Expression",
    goal: "Sing a short phrase with gentle dynamics and feeling.",
    vocabulary: [
      { word: "Soft", translation: "Sing quietly without losing tone", pronunciation: "soft" },
      { word: "Bright", translation: "Sing with clear forward energy", pronunciation: "bright" },
      { word: "Dynamic", translation: "A change in volume or intensity", pronunciation: "dye-nam-ik" },
    ],
    phrases: [
      { text: "C4 D4 E4", translation: "Start soft and grow slightly", context: "crescendo" },
      { text: "E4 D4 C4", translation: "Relax the phrase as it falls", context: "release" },
    ],
    teacherFocus: "Coach expression without sacrificing pitch, breath, or relaxed tone.",
    kickoffMessage:
      "Now we'll make the phrase feel musical. Sing it once plainly, then we'll add a small expressive change.",
  }),

  createLesson({
    id: "harmony-unit-1-lesson-1",
    unitId: "harmony-unit-1",
    languageCode: "harmony",
    order: 1,
    title: "Hold Your Note",
    goal: "Stay on one note while hearing another note described.",
    vocabulary: [
      { word: "Drone", translation: "A steady note underneath you", pronunciation: "drone" },
      { word: "Blend", translation: "Match tone without disappearing", pronunciation: "blend" },
      { word: "Independence", translation: "Hold your part steadily", pronunciation: "in-duh-pen-dens" },
    ],
    phrases: [
      { text: "Hold C4", translation: "Stay steady for four counts", context: "drone practice" },
      { text: "Hold E4", translation: "Keep your pitch while listening", context: "harmony practice" },
    ],
    teacherFocus: "Help the learner stay centered and avoid drifting toward the imagined harmony note.",
    kickoffMessage:
      "Harmony starts with staying steady. Hold one note for me, and I'll coach you if it drifts while you listen.",
  }),
  createLesson({
    id: "harmony-unit-1-lesson-2",
    unitId: "harmony-unit-1",
    languageCode: "harmony",
    order: 2,
    title: "Thirds",
    goal: "Sing a simple harmony note above a melody note.",
    vocabulary: [
      { word: "Third", translation: "A harmony note two scale steps away", pronunciation: "third" },
      { word: "Above", translation: "Sing the higher harmony part", pronunciation: "uh-buv" },
      { word: "Tune the chord", translation: "Adjust until the notes feel settled", pronunciation: "toon the kord" },
    ],
    phrases: [
      { text: "E4 over C4", translation: "Sing the harmony third", context: "major third" },
      { text: "F4 over D4", translation: "Move the harmony up one step", context: "parallel harmony" },
    ],
    teacherFocus: "Coach the learner to find a harmony third and keep it stable.",
    kickoffMessage:
      "Let's try a simple harmony. I'll name the melody note, you sing the note above it, and we'll tune the chord.",
  }),
];

export function getLessonsByUnit(unitId: string): Lesson[] {
  return lessons
    .filter((lesson) => lesson.unitId === unitId)
    .sort((a, b) => a.order - b.order);
}

export function getLessonsByLanguage(languageCode: string): Lesson[] {
  return lessons
    .filter((lesson) => lesson.languageCode === languageCode)
    .sort((a, b) => a.order - b.order);
}

export function getLessonById(id: string): Lesson | undefined {
  return lessons.find((lesson) => lesson.id === id);
}
