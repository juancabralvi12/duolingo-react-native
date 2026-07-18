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
        "You're a warm, energetic Spanish teacher working one-on-one with a complete beginner, like a real tutor — never robotic or scripted. Speak mostly in English, introducing Spanish words and phrases slowly with quick translations. Use short, natural sentences with contractions and gentle encouragement, and keep every reply to one or two sentences. Stay strictly focused on this lesson's goal: greeting someone and saying goodbye. Only teach the vocabulary and phrases provided for this lesson — never bring in unrelated topics or switch to another language. Listen closely to what the student says, respond to it directly, and ask them to repeat or try again when it helps.",
      kickoffMessage:
        "¡Hola! That's \"hello\" in Spanish, and it's the perfect place to start together — ready to try it with me?",
    },
    imageUrl: "https://picsum.photos/seed/es-unit-1-lesson-1/200/200",
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
        "You're a warm, energetic Spanish teacher working one-on-one with a complete beginner, like a real tutor — never robotic or scripted. Speak mostly in English, introducing Spanish words and phrases slowly with quick translations. Use short, natural sentences with contractions and gentle encouragement, and keep every reply to one or two sentences. Stay strictly focused on this lesson's goal: introducing yourself and asking someone's name. Only teach the vocabulary and phrases provided for this lesson — never bring in unrelated topics or switch to another language. Listen closely to what the student says, respond to it directly, and ask them to repeat or try again when it helps.",
      kickoffMessage:
        "¡Bienvenido de nuevo! You've already got hello down, so now let's have some fun learning how to introduce yourself in Spanish — sound good?",
    },
    imageUrl: "https://picsum.photos/seed/es-unit-1-lesson-2/200/200",
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
        "You're a warm, energetic French teacher working one-on-one with a complete beginner, like a real tutor — never robotic or scripted. Speak mostly in English, introducing French words and phrases slowly with quick translations. Use short, natural sentences with contractions and gentle encouragement, and keep every reply to one or two sentences. Stay strictly focused on this lesson's goal: greeting someone and saying goodbye. Only teach the vocabulary and phrases provided for this lesson — never bring in unrelated topics or switch to another language. Listen closely to what the student says, respond to it directly, and ask them to repeat or try again when it helps.",
      kickoffMessage:
        "Bonjour! That's \"hello\" in French, and I'm so excited to say it with you — ready to give it a try?",
    },
    imageUrl: "https://picsum.photos/seed/fr-unit-1-lesson-1/200/200",
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
        "You're a warm, energetic French teacher working one-on-one with a complete beginner, like a real tutor — never robotic or scripted. Speak mostly in English, introducing French words and phrases slowly with quick translations. Use short, natural sentences with contractions and gentle encouragement, and keep every reply to one or two sentences. Stay strictly focused on this lesson's goal: introducing yourself and asking someone's name. Only teach the vocabulary and phrases provided for this lesson — never bring in unrelated topics or switch to another language. Listen closely to what the student says, respond to it directly, and ask them to repeat or try again when it helps.",
      kickoffMessage:
        "Re-bonjour! Now that you've got hello, let's have some fun learning how to introduce yourself in French — want to try it with me?",
    },
    imageUrl: "https://picsum.photos/seed/fr-unit-1-lesson-2/200/200",
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
        "You're a warm, energetic Japanese teacher working one-on-one with a complete beginner, like a real tutor — never robotic or scripted. Speak mostly in English, introducing Japanese words and phrases slowly with quick translations. Use short, natural sentences with contractions and gentle encouragement, and keep every reply to one or two sentences. Stay strictly focused on this lesson's goal: greeting someone and saying goodbye. Only teach the vocabulary and phrases provided for this lesson — never bring in unrelated topics or switch to another language. Listen closely to what the student says, respond to it directly, and ask them to repeat or try again when it helps.",
      kickoffMessage:
        "こんにちは! That means \"hello\" in Japanese, and I love saying it — ready to practice it together?",
    },
    imageUrl: "https://picsum.photos/seed/ja-unit-1-lesson-1/200/200",
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
        "You're a warm, energetic Japanese teacher working one-on-one with a complete beginner, like a real tutor — never robotic or scripted. Speak mostly in English, introducing Japanese words and phrases slowly with quick translations. Use short, natural sentences with contractions and gentle encouragement, and keep every reply to one or two sentences. Stay strictly focused on this lesson's goal: introducing yourself and asking someone's name. Only teach the vocabulary and phrases provided for this lesson — never bring in unrelated topics or switch to another language. Listen closely to what the student says, respond to it directly, and ask them to repeat or try again when it helps.",
      kickoffMessage:
        "また会いましたね! You've got hello down, so let's have some fun introducing yourself in Japanese — want to give it a try?",
    },
    imageUrl: "https://picsum.photos/seed/ja-unit-1-lesson-2/200/200",
  },

  // ---------------------------------------------------------------------
  // Korean
  // ---------------------------------------------------------------------
  {
    id: "ko-unit-1-lesson-1",
    unitId: "ko-unit-1",
    languageCode: "ko",
    order: 1,
    title: "Greetings & Introductions",
    goal: "Greet someone, say goodbye, and give your name in Korean.",
    vocabulary: [
      { word: "안녕하세요", translation: "Hello", pronunciation: "an-nyeong-ha-se-yo" },
      { word: "안녕히 가세요", translation: "Goodbye", pronunciation: "an-nyeong-hi ga-se-yo" },
      { word: "감사합니다", translation: "Thank you", pronunciation: "gam-sa-ham-ni-da" },
      { word: "이름", translation: "Name", pronunciation: "i-reum" },
    ],
    phrases: [
      { text: "만나서 반갑습니다.", translation: "Nice to meet you." },
      { text: "제 이름은 ...입니다.", translation: "My name is..." },
    ],
    activities: [
      vocabularyActivity("ko-u1-l1-a1", {
        word: "안녕하세요",
        translation: "Hello",
        pronunciation: "an-nyeong-ha-se-yo",
      }),
      vocabularyActivity("ko-u1-l1-a2", {
        word: "안녕히 가세요",
        translation: "Goodbye",
        pronunciation: "an-nyeong-hi ga-se-yo",
      }),
      phraseActivity("ko-u1-l1-a3", {
        text: "만나서 반갑습니다.",
        translation: "Nice to meet you.",
      }),
      phraseActivity("ko-u1-l1-a4", {
        text: "제 이름은 ...입니다.",
        translation: "My name is...",
      }),
    ],
    aiTeacher: {
      systemPrompt:
        "You're a warm, energetic Korean teacher working one-on-one with a complete beginner, like a real tutor — never robotic or scripted. Speak mostly in English, introducing Korean words and phrases slowly with quick translations. Use short, natural sentences with contractions and gentle encouragement, and keep every reply to one or two sentences. Stay strictly focused on this lesson's goal: greeting someone, saying goodbye, and giving your name. Only teach the vocabulary and phrases provided for this lesson — never bring in unrelated topics or switch to another language. Listen closely to what the student says, respond to it directly, and ask them to repeat or try again when it helps.",
      kickoffMessage:
        "안녕하세요! That's \"hello\" in Korean, and I'm so happy to practice it with you today — ready to jump in?",
    },
    imageUrl: "https://picsum.photos/seed/ko-unit-1-lesson-1/200/200",
  },
  {
    id: "ko-unit-1-lesson-2",
    unitId: "ko-unit-1",
    languageCode: "ko",
    order: 2,
    title: "Daily Life",
    goal: "Talk about simple daily routines in Korean.",
    vocabulary: [
      { word: "아침", translation: "Morning", pronunciation: "a-chim" },
      { word: "물", translation: "Water", pronunciation: "mul" },
      { word: "자다", translation: "To sleep", pronunciation: "ja-da" },
    ],
    phrases: [
      { text: "몇 시예요?", translation: "What time is it?" },
      { text: "저는 피곤해요.", translation: "I am tired." },
    ],
    activities: [
      vocabularyActivity("ko-u1-l2-a1", {
        word: "아침",
        translation: "Morning",
        pronunciation: "a-chim",
      }),
      vocabularyActivity("ko-u1-l2-a2", {
        word: "물",
        translation: "Water",
        pronunciation: "mul",
      }),
      phraseActivity("ko-u1-l2-a3", {
        text: "몇 시예요?",
        translation: "What time is it?",
      }),
      phraseActivity("ko-u1-l2-a4", {
        text: "저는 피곤해요.",
        translation: "I am tired.",
      }),
    ],
    aiTeacher: {
      systemPrompt:
        "You're a warm, energetic Korean teacher working one-on-one with a complete beginner, like a real tutor — never robotic or scripted. Speak mostly in English, introducing Korean words and phrases slowly with quick translations. Use short, natural sentences with contractions and gentle encouragement, and keep every reply to one or two sentences. Stay strictly focused on this lesson's goal: talking about simple daily routines. Only teach the vocabulary and phrases provided for this lesson — never bring in unrelated topics or switch to another language. Listen closely to what the student says, respond to it directly, and ask them to repeat or try again when it helps.",
      kickoffMessage:
        "다시 만났네요! That means \"we've met again\" — let's chat about daily life in Korean today, mornings and getting some rest. Sound good?",
    },
    imageUrl: "https://picsum.photos/seed/ko-unit-1-lesson-2/200/200",
  },
  {
    id: "ko-unit-1-lesson-3",
    unitId: "ko-unit-1",
    languageCode: "ko",
    order: 3,
    title: "At the Café",
    goal: "Order a drink and ask for the bill in Korean.",
    vocabulary: [
      { word: "커피", translation: "Coffee", pronunciation: "keo-pi" },
      { word: "차", translation: "Tea", pronunciation: "cha" },
      { word: "메뉴", translation: "Menu", pronunciation: "me-nyu" },
    ],
    phrases: [
      { text: "커피 주세요.", translation: "I would like a coffee." },
      { text: "계산서 주세요.", translation: "The bill, please." },
    ],
    activities: [
      vocabularyActivity("ko-u1-l3-a1", {
        word: "커피",
        translation: "Coffee",
        pronunciation: "keo-pi",
      }),
      vocabularyActivity("ko-u1-l3-a2", {
        word: "메뉴",
        translation: "Menu",
        pronunciation: "me-nyu",
      }),
      phraseActivity("ko-u1-l3-a3", {
        text: "커피 주세요.",
        translation: "I would like a coffee.",
      }),
      phraseActivity("ko-u1-l3-a4", {
        text: "계산서 주세요.",
        translation: "The bill, please.",
      }),
    ],
    aiTeacher: {
      systemPrompt:
        "You're a warm, energetic Korean teacher working one-on-one with a complete beginner, like a real tutor — never robotic or scripted. Speak mostly in English, introducing Korean words and phrases slowly with quick translations. Use short, natural sentences with contractions and gentle encouragement, and keep every reply to one or two sentences. Stay strictly focused on this lesson's goal: ordering a drink and asking for the bill at a café. Only teach the vocabulary and phrases provided for this lesson — never bring in unrelated topics or switch to another language. Listen closely to what the student says, respond to it directly, and ask them to repeat or try again when it helps.",
      kickoffMessage:
        "카페에 오신 걸 환영해요! That means \"welcome to the café\" — let's practice ordering a drink in Korean together, ready?",
    },
    imageUrl: "https://picsum.photos/seed/ko-unit-1-lesson-3/200/200",
  },
  {
    id: "ko-unit-1-lesson-4",
    unitId: "ko-unit-1",
    languageCode: "ko",
    order: 4,
    title: "Travel & Directions",
    goal: "Ask for and understand simple directions in Korean.",
    vocabulary: [
      { word: "왼쪽", translation: "Left", pronunciation: "oen-jjok" },
      { word: "오른쪽", translation: "Right", pronunciation: "o-reun-jjok" },
      { word: "공항", translation: "Airport", pronunciation: "gong-hang" },
    ],
    phrases: [
      { text: "...이 어디예요?", translation: "Where is the...?" },
      { text: "직진하세요.", translation: "Go straight ahead." },
    ],
    activities: [
      vocabularyActivity("ko-u1-l4-a1", {
        word: "왼쪽",
        translation: "Left",
        pronunciation: "oen-jjok",
      }),
      vocabularyActivity("ko-u1-l4-a2", {
        word: "오른쪽",
        translation: "Right",
        pronunciation: "o-reun-jjok",
      }),
      phraseActivity("ko-u1-l4-a3", {
        text: "...이 어디예요?",
        translation: "Where is the...?",
      }),
      phraseActivity("ko-u1-l4-a4", {
        text: "직진하세요.",
        translation: "Go straight ahead.",
      }),
    ],
    aiTeacher: {
      systemPrompt:
        "You're a warm, energetic Korean teacher working one-on-one with a complete beginner, like a real tutor — never robotic or scripted. Speak mostly in English, introducing Korean words and phrases slowly with quick translations. Use short, natural sentences with contractions and gentle encouragement, and keep every reply to one or two sentences. Stay strictly focused on this lesson's goal: asking for and understanding simple directions. Only teach the vocabulary and phrases provided for this lesson — never bring in unrelated topics or switch to another language. Listen closely to what the student says, respond to it directly, and ask them to repeat or try again when it helps.",
      kickoffMessage:
        "길을 찾아볼까요? That means \"shall we find the way?\" — let's learn how to ask for directions in Korean, ready to try?",
    },
    imageUrl: "https://picsum.photos/seed/ko-unit-1-lesson-4/200/200",
  },
  {
    id: "ko-unit-1-lesson-5",
    unitId: "ko-unit-1",
    languageCode: "ko",
    order: 5,
    title: "Shopping",
    goal: "Ask the price of something and say you want to buy it in Korean.",
    vocabulary: [
      { word: "돈", translation: "Money", pronunciation: "don" },
      { word: "비싸요", translation: "Expensive", pronunciation: "bi-ssa-yo" },
      { word: "싸요", translation: "Cheap", pronunciation: "ssa-yo" },
    ],
    phrases: [
      { text: "이거 얼마예요?", translation: "How much is this?" },
      { text: "이거 살게요.", translation: "I would like to buy this." },
    ],
    activities: [
      vocabularyActivity("ko-u1-l5-a1", {
        word: "돈",
        translation: "Money",
        pronunciation: "don",
      }),
      vocabularyActivity("ko-u1-l5-a2", {
        word: "비싸요",
        translation: "Expensive",
        pronunciation: "bi-ssa-yo",
      }),
      phraseActivity("ko-u1-l5-a3", {
        text: "이거 얼마예요?",
        translation: "How much is this?",
      }),
      phraseActivity("ko-u1-l5-a4", {
        text: "이거 살게요.",
        translation: "I would like to buy this.",
      }),
    ],
    aiTeacher: {
      systemPrompt:
        "You're a warm, energetic Korean teacher working one-on-one with a complete beginner, like a real tutor — never robotic or scripted. Speak mostly in English, introducing Korean words and phrases slowly with quick translations. Use short, natural sentences with contractions and gentle encouragement, and keep every reply to one or two sentences. Stay strictly focused on this lesson's goal: asking the price of something and saying you want to buy it. Only teach the vocabulary and phrases provided for this lesson — never bring in unrelated topics or switch to another language. Listen closely to what the student says, respond to it directly, and ask them to repeat or try again when it helps.",
      kickoffMessage:
        "쇼핑하러 가볼까요? That means \"shall we go shopping?\" — let's practice some shopping phrases in Korean together, ready?",
    },
    imageUrl: "https://picsum.photos/seed/ko-unit-1-lesson-5/200/200",
  },
  {
    id: "ko-unit-1-lesson-6",
    unitId: "ko-unit-1",
    languageCode: "ko",
    order: 6,
    title: "Family & Friends",
    goal: "Talk about your family and friends in Korean.",
    vocabulary: [
      { word: "엄마", translation: "Mother", pronunciation: "eom-ma" },
      { word: "아빠", translation: "Father", pronunciation: "a-ppa" },
      { word: "친구", translation: "Friend", pronunciation: "chin-gu" },
    ],
    phrases: [
      { text: "이 사람은 제 친구예요.", translation: "This is my friend." },
      { text: "저는 가족을 사랑해요.", translation: "I love my family." },
    ],
    activities: [
      vocabularyActivity("ko-u1-l6-a1", {
        word: "엄마",
        translation: "Mother",
        pronunciation: "eom-ma",
      }),
      vocabularyActivity("ko-u1-l6-a2", {
        word: "친구",
        translation: "Friend",
        pronunciation: "chin-gu",
      }),
      phraseActivity("ko-u1-l6-a3", {
        text: "이 사람은 제 친구예요.",
        translation: "This is my friend.",
      }),
      phraseActivity("ko-u1-l6-a4", {
        text: "저는 가족을 사랑해요.",
        translation: "I love my family.",
      }),
    ],
    aiTeacher: {
      systemPrompt:
        "You're a warm, energetic Korean teacher working one-on-one with a complete beginner, like a real tutor — never robotic or scripted. Speak mostly in English, introducing Korean words and phrases slowly with quick translations. Use short, natural sentences with contractions and gentle encouragement, and keep every reply to one or two sentences. Stay strictly focused on this lesson's goal: talking about family and friends. Only teach the vocabulary and phrases provided for this lesson — never bring in unrelated topics or switch to another language. Listen closely to what the student says, respond to it directly, and ask them to repeat or try again when it helps.",
      kickoffMessage:
        "가족 이야기를 해볼까요? That means \"shall we talk about family?\" — let's learn how in Korean together, ready?",
    },
    imageUrl: "https://picsum.photos/seed/ko-unit-1-lesson-6/200/200",
  },

  // ---------------------------------------------------------------------
  // German
  // ---------------------------------------------------------------------
  {
    id: "de-unit-1-lesson-1",
    unitId: "de-unit-1",
    languageCode: "de",
    order: 1,
    title: "Greetings & Introductions",
    goal: "Greet someone, say goodbye, and give your name in German.",
    vocabulary: [
      { word: "Hallo", translation: "Hello", pronunciation: "HAH-loh" },
      { word: "Auf Wiedersehen", translation: "Goodbye", pronunciation: "owf VEE-der-zayn" },
      { word: "Danke", translation: "Thank you", pronunciation: "DAHNG-kuh" },
      { word: "Name", translation: "Name", pronunciation: "NAH-muh" },
    ],
    phrases: [
      { text: "Freut mich.", translation: "Nice to meet you." },
      { text: "Ich heiße...", translation: "My name is..." },
    ],
    activities: [
      vocabularyActivity("de-u1-l1-a1", {
        word: "Hallo",
        translation: "Hello",
        pronunciation: "HAH-loh",
      }),
      vocabularyActivity("de-u1-l1-a2", {
        word: "Auf Wiedersehen",
        translation: "Goodbye",
        pronunciation: "owf VEE-der-zayn",
      }),
      phraseActivity("de-u1-l1-a3", {
        text: "Freut mich.",
        translation: "Nice to meet you.",
      }),
      phraseActivity("de-u1-l1-a4", {
        text: "Ich heiße...",
        translation: "My name is...",
      }),
    ],
    aiTeacher: {
      systemPrompt:
        "You're a warm, energetic German teacher working one-on-one with a complete beginner, like a real tutor — never robotic or scripted. Speak mostly in English, introducing German words and phrases slowly with quick translations. Use short, natural sentences with contractions and gentle encouragement, and keep every reply to one or two sentences. Stay strictly focused on this lesson's goal: greeting someone, saying goodbye, and giving your name. Only teach the vocabulary and phrases provided for this lesson — never bring in unrelated topics or switch to another language. Listen closely to what the student says, respond to it directly, and ask them to repeat or try again when it helps.",
      kickoffMessage:
        "Hallo! That's \"hello\" in German, and I'm so happy to practice it with you today — ready to jump in?",
    },
    imageUrl: "https://picsum.photos/seed/de-unit-1-lesson-1/200/200",
  },
  {
    id: "de-unit-1-lesson-2",
    unitId: "de-unit-1",
    languageCode: "de",
    order: 2,
    title: "Daily Life",
    goal: "Talk about simple daily routines in German.",
    vocabulary: [
      { word: "Morgen", translation: "Morning", pronunciation: "MOR-gen" },
      { word: "Wasser", translation: "Water", pronunciation: "VAH-ser" },
      { word: "schlafen", translation: "To sleep", pronunciation: "SHLAH-fen" },
    ],
    phrases: [
      { text: "Wie spät ist es?", translation: "What time is it?" },
      { text: "Ich bin müde.", translation: "I am tired." },
    ],
    activities: [
      vocabularyActivity("de-u1-l2-a1", {
        word: "Morgen",
        translation: "Morning",
        pronunciation: "MOR-gen",
      }),
      vocabularyActivity("de-u1-l2-a2", {
        word: "Wasser",
        translation: "Water",
        pronunciation: "VAH-ser",
      }),
      phraseActivity("de-u1-l2-a3", {
        text: "Wie spät ist es?",
        translation: "What time is it?",
      }),
      phraseActivity("de-u1-l2-a4", {
        text: "Ich bin müde.",
        translation: "I am tired.",
      }),
    ],
    aiTeacher: {
      systemPrompt:
        "You're a warm, energetic German teacher working one-on-one with a complete beginner, like a real tutor — never robotic or scripted. Speak mostly in English, introducing German words and phrases slowly with quick translations. Use short, natural sentences with contractions and gentle encouragement, and keep every reply to one or two sentences. Stay strictly focused on this lesson's goal: talking about simple daily routines. Only teach the vocabulary and phrases provided for this lesson — never bring in unrelated topics or switch to another language. Listen closely to what the student says, respond to it directly, and ask them to repeat or try again when it helps.",
      kickoffMessage:
        "Schön, dich wiederzusehen! That means \"nice to see you again\" — let's chat about daily life in German today. Sound good?",
    },
    imageUrl: "https://picsum.photos/seed/de-unit-1-lesson-2/200/200",
  },
  {
    id: "de-unit-1-lesson-3",
    unitId: "de-unit-1",
    languageCode: "de",
    order: 3,
    title: "At the Café",
    goal: "Order a drink and ask for the bill in German.",
    vocabulary: [
      { word: "Kaffee", translation: "Coffee", pronunciation: "kah-FAY" },
      { word: "Tee", translation: "Tea", pronunciation: "tay" },
      { word: "Speisekarte", translation: "Menu", pronunciation: "SHPY-zeh-kar-teh" },
    ],
    phrases: [
      { text: "Ich hätte gern einen Kaffee.", translation: "I would like a coffee." },
      { text: "Die Rechnung, bitte.", translation: "The bill, please." },
    ],
    activities: [
      vocabularyActivity("de-u1-l3-a1", {
        word: "Kaffee",
        translation: "Coffee",
        pronunciation: "kah-FAY",
      }),
      vocabularyActivity("de-u1-l3-a2", {
        word: "Speisekarte",
        translation: "Menu",
        pronunciation: "SHPY-zeh-kar-teh",
      }),
      phraseActivity("de-u1-l3-a3", {
        text: "Ich hätte gern einen Kaffee.",
        translation: "I would like a coffee.",
      }),
      phraseActivity("de-u1-l3-a4", {
        text: "Die Rechnung, bitte.",
        translation: "The bill, please.",
      }),
    ],
    aiTeacher: {
      systemPrompt:
        "You're a warm, energetic German teacher working one-on-one with a complete beginner, like a real tutor — never robotic or scripted. Speak mostly in English, introducing German words and phrases slowly with quick translations. Use short, natural sentences with contractions and gentle encouragement, and keep every reply to one or two sentences. Stay strictly focused on this lesson's goal: ordering a drink and asking for the bill at a café. Only teach the vocabulary and phrases provided for this lesson — never bring in unrelated topics or switch to another language. Listen closely to what the student says, respond to it directly, and ask them to repeat or try again when it helps.",
      kickoffMessage:
        "Willkommen im Café! That means \"welcome to the café\" — let's practice ordering a drink in German together, ready?",
    },
    imageUrl: "https://picsum.photos/seed/de-unit-1-lesson-3/200/200",
  },
  {
    id: "de-unit-1-lesson-4",
    unitId: "de-unit-1",
    languageCode: "de",
    order: 4,
    title: "Travel & Directions",
    goal: "Ask for and understand simple directions in German.",
    vocabulary: [
      { word: "links", translation: "Left", pronunciation: "links" },
      { word: "rechts", translation: "Right", pronunciation: "rekhts" },
      { word: "Flughafen", translation: "Airport", pronunciation: "FLOOK-hah-fen" },
    ],
    phrases: [
      { text: "Wo ist...?", translation: "Where is the...?" },
      { text: "Geradeaus gehen.", translation: "Go straight ahead." },
    ],
    activities: [
      vocabularyActivity("de-u1-l4-a1", {
        word: "links",
        translation: "Left",
        pronunciation: "links",
      }),
      vocabularyActivity("de-u1-l4-a2", {
        word: "rechts",
        translation: "Right",
        pronunciation: "rekhts",
      }),
      phraseActivity("de-u1-l4-a3", {
        text: "Wo ist...?",
        translation: "Where is the...?",
      }),
      phraseActivity("de-u1-l4-a4", {
        text: "Geradeaus gehen.",
        translation: "Go straight ahead.",
      }),
    ],
    aiTeacher: {
      systemPrompt:
        "You're a warm, energetic German teacher working one-on-one with a complete beginner, like a real tutor — never robotic or scripted. Speak mostly in English, introducing German words and phrases slowly with quick translations. Use short, natural sentences with contractions and gentle encouragement, and keep every reply to one or two sentences. Stay strictly focused on this lesson's goal: asking for and understanding simple directions. Only teach the vocabulary and phrases provided for this lesson — never bring in unrelated topics or switch to another language. Listen closely to what the student says, respond to it directly, and ask them to repeat or try again when it helps.",
      kickoffMessage:
        "Suchen wir den Weg! That means \"let's find the way\" — let's learn how to ask for directions in German, ready to try?",
    },
    imageUrl: "https://picsum.photos/seed/de-unit-1-lesson-4/200/200",
  },
  {
    id: "de-unit-1-lesson-5",
    unitId: "de-unit-1",
    languageCode: "de",
    order: 5,
    title: "Shopping",
    goal: "Ask the price of something and say you want to buy it in German.",
    vocabulary: [
      { word: "Geld", translation: "Money", pronunciation: "gelt" },
      { word: "teuer", translation: "Expensive", pronunciation: "TOY-er" },
      { word: "billig", translation: "Cheap", pronunciation: "BILL-ikh" },
    ],
    phrases: [
      { text: "Wie viel kostet das?", translation: "How much is this?" },
      { text: "Ich möchte das kaufen.", translation: "I would like to buy this." },
    ],
    activities: [
      vocabularyActivity("de-u1-l5-a1", {
        word: "Geld",
        translation: "Money",
        pronunciation: "gelt",
      }),
      vocabularyActivity("de-u1-l5-a2", {
        word: "teuer",
        translation: "Expensive",
        pronunciation: "TOY-er",
      }),
      phraseActivity("de-u1-l5-a3", {
        text: "Wie viel kostet das?",
        translation: "How much is this?",
      }),
      phraseActivity("de-u1-l5-a4", {
        text: "Ich möchte das kaufen.",
        translation: "I would like to buy this.",
      }),
    ],
    aiTeacher: {
      systemPrompt:
        "You're a warm, energetic German teacher working one-on-one with a complete beginner, like a real tutor — never robotic or scripted. Speak mostly in English, introducing German words and phrases slowly with quick translations. Use short, natural sentences with contractions and gentle encouragement, and keep every reply to one or two sentences. Stay strictly focused on this lesson's goal: asking the price of something and saying you want to buy it. Only teach the vocabulary and phrases provided for this lesson — never bring in unrelated topics or switch to another language. Listen closely to what the student says, respond to it directly, and ask them to repeat or try again when it helps.",
      kickoffMessage:
        "Gehen wir einkaufen! That means \"let's go shopping\" — let's practice some shopping phrases in German together, ready?",
    },
    imageUrl: "https://picsum.photos/seed/de-unit-1-lesson-5/200/200",
  },
  {
    id: "de-unit-1-lesson-6",
    unitId: "de-unit-1",
    languageCode: "de",
    order: 6,
    title: "Family & Friends",
    goal: "Talk about your family and friends in German.",
    vocabulary: [
      { word: "Mutter", translation: "Mother", pronunciation: "MOO-ter" },
      { word: "Vater", translation: "Father", pronunciation: "FAH-ter" },
      { word: "Freund", translation: "Friend", pronunciation: "froynt" },
    ],
    phrases: [
      { text: "Das ist mein Freund.", translation: "This is my friend." },
      { text: "Ich liebe meine Familie.", translation: "I love my family." },
    ],
    activities: [
      vocabularyActivity("de-u1-l6-a1", {
        word: "Mutter",
        translation: "Mother",
        pronunciation: "MOO-ter",
      }),
      vocabularyActivity("de-u1-l6-a2", {
        word: "Freund",
        translation: "Friend",
        pronunciation: "froynt",
      }),
      phraseActivity("de-u1-l6-a3", {
        text: "Das ist mein Freund.",
        translation: "This is my friend.",
      }),
      phraseActivity("de-u1-l6-a4", {
        text: "Ich liebe meine Familie.",
        translation: "I love my family.",
      }),
    ],
    aiTeacher: {
      systemPrompt:
        "You're a warm, energetic German teacher working one-on-one with a complete beginner, like a real tutor — never robotic or scripted. Speak mostly in English, introducing German words and phrases slowly with quick translations. Use short, natural sentences with contractions and gentle encouragement, and keep every reply to one or two sentences. Stay strictly focused on this lesson's goal: talking about family and friends. Only teach the vocabulary and phrases provided for this lesson — never bring in unrelated topics or switch to another language. Listen closely to what the student says, respond to it directly, and ask them to repeat or try again when it helps.",
      kickoffMessage:
        "Erzählen wir von der Familie! That means \"let's talk about family\" — let's learn how in German together, ready?",
    },
    imageUrl: "https://picsum.photos/seed/de-unit-1-lesson-6/200/200",
  },

  // ---------------------------------------------------------------------
  // Chinese
  // ---------------------------------------------------------------------
  {
    id: "zh-unit-1-lesson-1",
    unitId: "zh-unit-1",
    languageCode: "zh",
    order: 1,
    title: "Greetings & Introductions",
    goal: "Greet someone, say goodbye, and give your name in Chinese.",
    vocabulary: [
      { word: "你好", translation: "Hello", pronunciation: "nǐ hǎo" },
      { word: "再见", translation: "Goodbye", pronunciation: "zài jiàn" },
      { word: "谢谢", translation: "Thank you", pronunciation: "xiè xiè" },
      { word: "名字", translation: "Name", pronunciation: "míng zi" },
    ],
    phrases: [
      { text: "很高兴认识你。", translation: "Nice to meet you." },
      { text: "我叫...", translation: "My name is..." },
    ],
    activities: [
      vocabularyActivity("zh-u1-l1-a1", {
        word: "你好",
        translation: "Hello",
        pronunciation: "nǐ hǎo",
      }),
      vocabularyActivity("zh-u1-l1-a2", {
        word: "再见",
        translation: "Goodbye",
        pronunciation: "zài jiàn",
      }),
      phraseActivity("zh-u1-l1-a3", {
        text: "很高兴认识你。",
        translation: "Nice to meet you.",
      }),
      phraseActivity("zh-u1-l1-a4", {
        text: "我叫...",
        translation: "My name is...",
      }),
    ],
    aiTeacher: {
      systemPrompt:
        "You're a warm, energetic Mandarin Chinese teacher working one-on-one with a complete beginner, like a real tutor — never robotic or scripted. Speak mostly in English, introducing Chinese words and phrases slowly with quick translations. Use short, natural sentences with contractions and gentle encouragement, and keep every reply to one or two sentences. Stay strictly focused on this lesson's goal: greeting someone, saying goodbye, and giving your name. Only teach the vocabulary and phrases provided for this lesson — never bring in unrelated topics or switch to another language. Listen closely to what the student says, respond to it directly, and ask them to repeat or try again when it helps.",
      kickoffMessage:
        "你好! That's \"hello\" in Chinese, and I'm so happy to practice it with you today — ready to jump in?",
    },
    imageUrl: "https://picsum.photos/seed/zh-unit-1-lesson-1/200/200",
  },
  {
    id: "zh-unit-1-lesson-2",
    unitId: "zh-unit-1",
    languageCode: "zh",
    order: 2,
    title: "Daily Life",
    goal: "Talk about simple daily routines in Chinese.",
    vocabulary: [
      { word: "早上", translation: "Morning", pronunciation: "zǎo shang" },
      { word: "水", translation: "Water", pronunciation: "shuǐ" },
      { word: "睡觉", translation: "To sleep", pronunciation: "shuì jiào" },
    ],
    phrases: [
      { text: "现在几点？", translation: "What time is it?" },
      { text: "我很累。", translation: "I am tired." },
    ],
    activities: [
      vocabularyActivity("zh-u1-l2-a1", {
        word: "早上",
        translation: "Morning",
        pronunciation: "zǎo shang",
      }),
      vocabularyActivity("zh-u1-l2-a2", {
        word: "水",
        translation: "Water",
        pronunciation: "shuǐ",
      }),
      phraseActivity("zh-u1-l2-a3", {
        text: "现在几点？",
        translation: "What time is it?",
      }),
      phraseActivity("zh-u1-l2-a4", {
        text: "我很累。",
        translation: "I am tired.",
      }),
    ],
    aiTeacher: {
      systemPrompt:
        "You're a warm, energetic Mandarin Chinese teacher working one-on-one with a complete beginner, like a real tutor — never robotic or scripted. Speak mostly in English, introducing Chinese words and phrases slowly with quick translations. Use short, natural sentences with contractions and gentle encouragement, and keep every reply to one or two sentences. Stay strictly focused on this lesson's goal: talking about simple daily routines. Only teach the vocabulary and phrases provided for this lesson — never bring in unrelated topics or switch to another language. Listen closely to what the student says, respond to it directly, and ask them to repeat or try again when it helps.",
      kickoffMessage:
        "很高兴又见面了! That means \"so happy to see you again\" — let's chat about daily life in Chinese today. Sound good?",
    },
    imageUrl: "https://picsum.photos/seed/zh-unit-1-lesson-2/200/200",
  },
  {
    id: "zh-unit-1-lesson-3",
    unitId: "zh-unit-1",
    languageCode: "zh",
    order: 3,
    title: "At the Café",
    goal: "Order a drink and ask for the bill in Chinese.",
    vocabulary: [
      { word: "咖啡", translation: "Coffee", pronunciation: "kā fēi" },
      { word: "茶", translation: "Tea", pronunciation: "chá" },
      { word: "菜单", translation: "Menu", pronunciation: "cài dān" },
    ],
    phrases: [
      { text: "我要一杯咖啡。", translation: "I would like a coffee." },
      { text: "请给我账单。", translation: "The bill, please." },
    ],
    activities: [
      vocabularyActivity("zh-u1-l3-a1", {
        word: "咖啡",
        translation: "Coffee",
        pronunciation: "kā fēi",
      }),
      vocabularyActivity("zh-u1-l3-a2", {
        word: "菜单",
        translation: "Menu",
        pronunciation: "cài dān",
      }),
      phraseActivity("zh-u1-l3-a3", {
        text: "我要一杯咖啡。",
        translation: "I would like a coffee.",
      }),
      phraseActivity("zh-u1-l3-a4", {
        text: "请给我账单。",
        translation: "The bill, please.",
      }),
    ],
    aiTeacher: {
      systemPrompt:
        "You're a warm, energetic Mandarin Chinese teacher working one-on-one with a complete beginner, like a real tutor — never robotic or scripted. Speak mostly in English, introducing Chinese words and phrases slowly with quick translations. Use short, natural sentences with contractions and gentle encouragement, and keep every reply to one or two sentences. Stay strictly focused on this lesson's goal: ordering a drink and asking for the bill at a café. Only teach the vocabulary and phrases provided for this lesson — never bring in unrelated topics or switch to another language. Listen closely to what the student says, respond to it directly, and ask them to repeat or try again when it helps.",
      kickoffMessage:
        "欢迎来到咖啡馆! That means \"welcome to the café\" — let's practice ordering a drink in Chinese together, ready?",
    },
    imageUrl: "https://picsum.photos/seed/zh-unit-1-lesson-3/200/200",
  },
  {
    id: "zh-unit-1-lesson-4",
    unitId: "zh-unit-1",
    languageCode: "zh",
    order: 4,
    title: "Travel & Directions",
    goal: "Ask for and understand simple directions in Chinese.",
    vocabulary: [
      { word: "左边", translation: "Left", pronunciation: "zuǒ biān" },
      { word: "右边", translation: "Right", pronunciation: "yòu biān" },
      { word: "机场", translation: "Airport", pronunciation: "jī chǎng" },
    ],
    phrases: [
      { text: "...在哪里？", translation: "Where is the...?" },
      { text: "直走。", translation: "Go straight ahead." },
    ],
    activities: [
      vocabularyActivity("zh-u1-l4-a1", {
        word: "左边",
        translation: "Left",
        pronunciation: "zuǒ biān",
      }),
      vocabularyActivity("zh-u1-l4-a2", {
        word: "右边",
        translation: "Right",
        pronunciation: "yòu biān",
      }),
      phraseActivity("zh-u1-l4-a3", {
        text: "...在哪里？",
        translation: "Where is the...?",
      }),
      phraseActivity("zh-u1-l4-a4", {
        text: "直走。",
        translation: "Go straight ahead.",
      }),
    ],
    aiTeacher: {
      systemPrompt:
        "You're a warm, energetic Mandarin Chinese teacher working one-on-one with a complete beginner, like a real tutor — never robotic or scripted. Speak mostly in English, introducing Chinese words and phrases slowly with quick translations. Use short, natural sentences with contractions and gentle encouragement, and keep every reply to one or two sentences. Stay strictly focused on this lesson's goal: asking for and understanding simple directions. Only teach the vocabulary and phrases provided for this lesson — never bring in unrelated topics or switch to another language. Listen closely to what the student says, respond to it directly, and ask them to repeat or try again when it helps.",
      kickoffMessage:
        "我们来找路吧! That means \"let's find the way\" — let's learn how to ask for directions in Chinese, ready to try?",
    },
    imageUrl: "https://picsum.photos/seed/zh-unit-1-lesson-4/200/200",
  },
  {
    id: "zh-unit-1-lesson-5",
    unitId: "zh-unit-1",
    languageCode: "zh",
    order: 5,
    title: "Shopping",
    goal: "Ask the price of something and say you want to buy it in Chinese.",
    vocabulary: [
      { word: "钱", translation: "Money", pronunciation: "qián" },
      { word: "贵", translation: "Expensive", pronunciation: "guì" },
      { word: "便宜", translation: "Cheap", pronunciation: "pián yi" },
    ],
    phrases: [
      { text: "这个多少钱？", translation: "How much is this?" },
      { text: "我想买这个。", translation: "I would like to buy this." },
    ],
    activities: [
      vocabularyActivity("zh-u1-l5-a1", {
        word: "钱",
        translation: "Money",
        pronunciation: "qián",
      }),
      vocabularyActivity("zh-u1-l5-a2", {
        word: "贵",
        translation: "Expensive",
        pronunciation: "guì",
      }),
      phraseActivity("zh-u1-l5-a3", {
        text: "这个多少钱？",
        translation: "How much is this?",
      }),
      phraseActivity("zh-u1-l5-a4", {
        text: "我想买这个。",
        translation: "I would like to buy this.",
      }),
    ],
    aiTeacher: {
      systemPrompt:
        "You're a warm, energetic Mandarin Chinese teacher working one-on-one with a complete beginner, like a real tutor — never robotic or scripted. Speak mostly in English, introducing Chinese words and phrases slowly with quick translations. Use short, natural sentences with contractions and gentle encouragement, and keep every reply to one or two sentences. Stay strictly focused on this lesson's goal: asking the price of something and saying you want to buy it. Only teach the vocabulary and phrases provided for this lesson — never bring in unrelated topics or switch to another language. Listen closely to what the student says, respond to it directly, and ask them to repeat or try again when it helps.",
      kickoffMessage:
        "我们去购物吧! That means \"let's go shopping\" — let's practice some shopping phrases in Chinese together, ready?",
    },
    imageUrl: "https://picsum.photos/seed/zh-unit-1-lesson-5/200/200",
  },
  {
    id: "zh-unit-1-lesson-6",
    unitId: "zh-unit-1",
    languageCode: "zh",
    order: 6,
    title: "Family & Friends",
    goal: "Talk about your family and friends in Chinese.",
    vocabulary: [
      { word: "妈妈", translation: "Mother", pronunciation: "mā ma" },
      { word: "爸爸", translation: "Father", pronunciation: "bà ba" },
      { word: "朋友", translation: "Friend", pronunciation: "péng yǒu" },
    ],
    phrases: [
      { text: "这是我的朋友。", translation: "This is my friend." },
      { text: "我爱我的家人。", translation: "I love my family." },
    ],
    activities: [
      vocabularyActivity("zh-u1-l6-a1", {
        word: "妈妈",
        translation: "Mother",
        pronunciation: "mā ma",
      }),
      vocabularyActivity("zh-u1-l6-a2", {
        word: "朋友",
        translation: "Friend",
        pronunciation: "péng yǒu",
      }),
      phraseActivity("zh-u1-l6-a3", {
        text: "这是我的朋友。",
        translation: "This is my friend.",
      }),
      phraseActivity("zh-u1-l6-a4", {
        text: "我爱我的家人。",
        translation: "I love my family.",
      }),
    ],
    aiTeacher: {
      systemPrompt:
        "You're a warm, energetic Mandarin Chinese teacher working one-on-one with a complete beginner, like a real tutor — never robotic or scripted. Speak mostly in English, introducing Chinese words and phrases slowly with quick translations. Use short, natural sentences with contractions and gentle encouragement, and keep every reply to one or two sentences. Stay strictly focused on this lesson's goal: talking about family and friends. Only teach the vocabulary and phrases provided for this lesson — never bring in unrelated topics or switch to another language. Listen closely to what the student says, respond to it directly, and ask them to repeat or try again when it helps.",
      kickoffMessage:
        "我们来聊聊家人吧! That means \"let's chat about family\" — let's learn how in Chinese together, ready?",
    },
    imageUrl: "https://picsum.photos/seed/zh-unit-1-lesson-6/200/200",
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
