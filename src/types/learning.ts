export interface Language {
  code: string;
  name: string;
  nativeName: string;
  flagEmoji: string;
}

export interface Unit {
  id: string;
  languageCode: string;
  order: number;
  title: string;
  description: string;
  imageUrl: string;
}

export type LessonStatus = "completed" | "in-progress" | "locked";

export interface VocabularyItem {
  word: string;
  translation: string;
  pronunciation?: string;
}

export interface Phrase {
  text: string;
  translation: string;
  context?: string;
}

export type ActivityType = "vocabulary" | "phrase" | "listening" | "speaking";

export interface Activity {
  id: string;
  type: ActivityType;
  prompt: string;
  vocabulary?: VocabularyItem;
  phrase?: Phrase;
}

// Instructions given to the audio-based Vision Agent AI teacher for a lesson.
export interface AITeacherPrompt {
  systemPrompt: string;
  kickoffMessage: string;
}

export interface Lesson {
  id: string;
  unitId: string;
  languageCode: string;
  order: number;
  title: string;
  goal: string;
  vocabulary: VocabularyItem[];
  phrases: Phrase[];
  activities: Activity[];
  aiTeacher: AITeacherPrompt;
  imageUrl: string;
}
