import type {
  Activity,
  Lesson,
  Phrase,
  VocabularyItem,
} from "@/types/learning";

// Small helpers so each lesson below only has to list its vocabulary and
// phrases once — the activities are derived from that same data.
function vocabularyActivity(id: string, vocabulary: VocabularyItem): Activity {
  return {
    id,
    type: "vocabulary",
    prompt: `Learn how to say "${vocabulary.translation}".`,
    vocabulary,
  };
}

function phraseActivity(id: string, phrase: Phrase): Activity {
  return {
    id,
    type: "phrase",
    prompt: `Practice saying "${phrase.translation}".`,
    phrase,
  };
}

export const lessons: Lesson[] = [
  // ---------------------------------------------------------------------
  // Spanish
  // ---------------------------------------------------------------------
  {
    id: "es-unit-1-lesson-1",
    unitId: "es-unit-1",
    languageCode: "es",
    order: 1,
    title: "Say Hello",
    goal: "Greet someone and say goodbye in Spanish.",
    vocabulary: [
      { word: "Hola", translation: "Hello", pronunciation: "OH-lah" },
      { word: "Adiós", translation: "Goodbye", pronunciation: "ah-dee-OHS" },
      {
        word: "Por favor",
        translation: "Please",
        pronunciation: "por fah-VOR",
      },
      {
        word: "Gracias",
        translation: "Thank you",
        pronunciation: "GRAH-see-ahs",
      },
    ],
    phrases: [
      { text: "¿Cómo estás?", translation: "How are you?" },
      { text: "Muy bien, gracias.", translation: "Very well, thank you." },
    ],
    activities: [
      vocabularyActivity("es-u1-l1-a1", {
        word: "Hola",
        translation: "Hello",
        pronunciation: "OH-lah",
      }),
      vocabularyActivity("es-u1-l1-a2", {
        word: "Adiós",
        translation: "Goodbye",
        pronunciation: "ah-dee-OHS",
      }),
      phraseActivity("es-u1-l1-a3", {
        text: "¿Cómo estás?",
        translation: "How are you?",
      }),
      phraseActivity("es-u1-l1-a4", {
        text: "Muy bien, gracias.",
        translation: "Very well, thank you.",
      }),
    ],
    aiTeacher: {
      systemPrompt:
        "You are a warm, encouraging Spanish teacher helping a complete beginner. Speak mostly in English, and introduce Spanish words slowly with clear translations. Stay focused only on this lesson's goal: greeting someone and saying goodbye. Only use the vocabulary and phrases provided for this lesson. Ask the student to repeat words back to you and gently correct mistakes.",
      kickoffMessage:
        "¡Hola! I'm so happy to practice Spanish with you today. Let's start with something simple — how to say hello. Ready?",
    },
  },
  {
    id: "es-unit-1-lesson-2",
    unitId: "es-unit-1",
    languageCode: "es",
    order: 2,
    title: "Introduce Yourself",
    goal: "Tell someone your name and ask for theirs in Spanish.",
    vocabulary: [
      { word: "Nombre", translation: "Name", pronunciation: "NOM-breh" },
      { word: "Soy", translation: "I am", pronunciation: "soy" },
      {
        word: "Mucho gusto",
        translation: "Nice to meet you",
        pronunciation: "MOO-cho GOOS-toh",
      },
    ],
    phrases: [
      { text: "Me llamo...", translation: "My name is..." },
      { text: "¿Y tú?", translation: "And you?" },
    ],
    activities: [
      vocabularyActivity("es-u1-l2-a1", {
        word: "Nombre",
        translation: "Name",
        pronunciation: "NOM-breh",
      }),
      vocabularyActivity("es-u1-l2-a2", {
        word: "Mucho gusto",
        translation: "Nice to meet you",
        pronunciation: "MOO-cho GOOS-toh",
      }),
      phraseActivity("es-u1-l2-a3", {
        text: "Me llamo...",
        translation: "My name is...",
      }),
      phraseActivity("es-u1-l2-a4", {
        text: "¿Y tú?",
        translation: "And you?",
      }),
    ],
    aiTeacher: {
      systemPrompt:
        "You are a warm, encouraging Spanish teacher helping a complete beginner. Speak mostly in English, and introduce Spanish words slowly with clear translations. Stay focused only on this lesson's goal: introducing yourself and asking someone's name. Only use the vocabulary and phrases provided for this lesson. Ask the student to repeat words back to you and gently correct mistakes.",
      kickoffMessage:
        "¡Bienvenido de nuevo! Now that you can say hello, let's learn how to introduce yourself in Spanish. Want to give it a try?",
    },
  },

  // ---------------------------------------------------------------------
  // French
  // ---------------------------------------------------------------------
  {
    id: "fr-unit-1-lesson-1",
    unitId: "fr-unit-1",
    languageCode: "fr",
    order: 1,
    title: "Say Hello",
    goal: "Greet someone and say goodbye in French.",
    vocabulary: [
      { word: "Bonjour", translation: "Hello", pronunciation: "bon-ZHOOR" },
      { word: "Au revoir", translation: "Goodbye", pronunciation: "oh ruh-VWAR" },
      {
        word: "S'il vous plaît",
        translation: "Please",
        pronunciation: "seel voo PLEH",
      },
      { word: "Merci", translation: "Thank you", pronunciation: "mehr-SEE" },
    ],
    phrases: [
      { text: "Comment ça va ?", translation: "How's it going?" },
      { text: "Très bien, merci.", translation: "Very well, thank you." },
    ],
    activities: [
      vocabularyActivity("fr-u1-l1-a1", {
        word: "Bonjour",
        translation: "Hello",
        pronunciation: "bon-ZHOOR",
      }),
      vocabularyActivity("fr-u1-l1-a2", {
        word: "Au revoir",
        translation: "Goodbye",
        pronunciation: "oh ruh-VWAR",
      }),
      phraseActivity("fr-u1-l1-a3", {
        text: "Comment ça va ?",
        translation: "How's it going?",
      }),
      phraseActivity("fr-u1-l1-a4", {
        text: "Très bien, merci.",
        translation: "Very well, thank you.",
      }),
    ],
    aiTeacher: {
      systemPrompt:
        "You are a warm, encouraging French teacher helping a complete beginner. Speak mostly in English, and introduce French words slowly with clear translations. Stay focused only on this lesson's goal: greeting someone and saying goodbye. Only use the vocabulary and phrases provided for this lesson. Ask the student to repeat words back to you and gently correct mistakes.",
      kickoffMessage:
        "Bonjour! I'm excited to practice French with you today. Let's start with something simple — how to say hello. Ready?",
    },
  },
  {
    id: "fr-unit-1-lesson-2",
    unitId: "fr-unit-1",
    languageCode: "fr",
    order: 2,
    title: "Introduce Yourself",
    goal: "Tell someone your name and ask for theirs in French.",
    vocabulary: [
      { word: "Nom", translation: "Name", pronunciation: "nohm" },
      { word: "Je suis", translation: "I am", pronunciation: "zhuh swee" },
      {
        word: "Enchanté",
        translation: "Nice to meet you",
        pronunciation: "ahn-shahn-TAY",
      },
    ],
    phrases: [
      { text: "Je m'appelle...", translation: "My name is..." },
      { text: "Et toi ?", translation: "And you?" },
    ],
    activities: [
      vocabularyActivity("fr-u1-l2-a1", {
        word: "Nom",
        translation: "Name",
        pronunciation: "nohm",
      }),
      vocabularyActivity("fr-u1-l2-a2", {
        word: "Enchanté",
        translation: "Nice to meet you",
        pronunciation: "ahn-shahn-TAY",
      }),
      phraseActivity("fr-u1-l2-a3", {
        text: "Je m'appelle...",
        translation: "My name is...",
      }),
      phraseActivity("fr-u1-l2-a4", {
        text: "Et toi ?",
        translation: "And you?",
      }),
    ],
    aiTeacher: {
      systemPrompt:
        "You are a warm, encouraging French teacher helping a complete beginner. Speak mostly in English, and introduce French words slowly with clear translations. Stay focused only on this lesson's goal: introducing yourself and asking someone's name. Only use the vocabulary and phrases provided for this lesson. Ask the student to repeat words back to you and gently correct mistakes.",
      kickoffMessage:
        "Re-bonjour! Now that you can say hello, let's learn how to introduce yourself in French. Want to give it a try?",
    },
  },

  // ---------------------------------------------------------------------
  // Japanese
  // ---------------------------------------------------------------------
  {
    id: "ja-unit-1-lesson-1",
    unitId: "ja-unit-1",
    languageCode: "ja",
    order: 1,
    title: "Say Hello",
    goal: "Greet someone and say goodbye in Japanese.",
    vocabulary: [
      {
        word: "こんにちは",
        translation: "Hello",
        pronunciation: "kon-nee-chee-wah",
      },
      {
        word: "さようなら",
        translation: "Goodbye",
        pronunciation: "sah-yoh-nah-rah",
      },
      {
        word: "お願いします",
        translation: "Please",
        pronunciation: "oh-neh-gai-shee-mahs",
      },
      {
        word: "ありがとう",
        translation: "Thank you",
        pronunciation: "ah-ree-gah-toh",
      },
    ],
    phrases: [
      { text: "お元気ですか？", translation: "How are you?" },
      { text: "元気です、ありがとう。", translation: "I'm well, thank you." },
    ],
    activities: [
      vocabularyActivity("ja-u1-l1-a1", {
        word: "こんにちは",
        translation: "Hello",
        pronunciation: "kon-nee-chee-wah",
      }),
      vocabularyActivity("ja-u1-l1-a2", {
        word: "さようなら",
        translation: "Goodbye",
        pronunciation: "sah-yoh-nah-rah",
      }),
      phraseActivity("ja-u1-l1-a3", {
        text: "お元気ですか？",
        translation: "How are you?",
      }),
      phraseActivity("ja-u1-l1-a4", {
        text: "元気です、ありがとう。",
        translation: "I'm well, thank you.",
      }),
    ],
    aiTeacher: {
      systemPrompt:
        "You are a warm, encouraging Japanese teacher helping a complete beginner. Speak mostly in English, and introduce Japanese words slowly with clear translations. Stay focused only on this lesson's goal: greeting someone and saying goodbye. Only use the vocabulary and phrases provided for this lesson. Ask the student to repeat words back to you and gently correct mistakes.",
      kickoffMessage:
        "こんにちは! I'm excited to practice Japanese with you today. Let's start with something simple — how to say hello. Ready?",
    },
  },
  {
    id: "ja-unit-1-lesson-2",
    unitId: "ja-unit-1",
    languageCode: "ja",
    order: 2,
    title: "Introduce Yourself",
    goal: "Tell someone your name and ask for theirs in Japanese.",
    vocabulary: [
      { word: "名前", translation: "Name", pronunciation: "nah-mah-eh" },
      { word: "私は", translation: "I am", pronunciation: "wah-tah-shee wah" },
      {
        word: "はじめまして",
        translation: "Nice to meet you",
        pronunciation: "hah-jee-meh-mah-shee-teh",
      },
    ],
    phrases: [
      {
        text: "私の名前は...です。",
        translation: "My name is...",
      },
      { text: "あなたは？", translation: "And you?" },
    ],
    activities: [
      vocabularyActivity("ja-u1-l2-a1", {
        word: "名前",
        translation: "Name",
        pronunciation: "nah-mah-eh",
      }),
      vocabularyActivity("ja-u1-l2-a2", {
        word: "はじめまして",
        translation: "Nice to meet you",
        pronunciation: "hah-jee-meh-mah-shee-teh",
      }),
      phraseActivity("ja-u1-l2-a3", {
        text: "私の名前は...です。",
        translation: "My name is...",
      }),
      phraseActivity("ja-u1-l2-a4", {
        text: "あなたは？",
        translation: "And you?",
      }),
    ],
    aiTeacher: {
      systemPrompt:
        "You are a warm, encouraging Japanese teacher helping a complete beginner. Speak mostly in English, and introduce Japanese words slowly with clear translations. Stay focused only on this lesson's goal: introducing yourself and asking someone's name. Only use the vocabulary and phrases provided for this lesson. Ask the student to repeat words back to you and gently correct mistakes.",
      kickoffMessage:
        "また会いましたね! Now that you can say hello, let's learn how to introduce yourself in Japanese. Want to give it a try?",
    },
  },
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
