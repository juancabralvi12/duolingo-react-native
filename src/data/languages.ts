import type { Language } from "@/types/learning";

export const languages: Language[] = [
  {
    code: "es",
    name: "Spanish",
    nativeName: "Español",
    flagEmoji: "🇪🇸",
  },
  {
    code: "fr",
    name: "French",
    nativeName: "Français",
    flagEmoji: "🇫🇷",
  },
  {
    code: "ja",
    name: "Japanese",
    nativeName: "日本語",
    flagEmoji: "🇯🇵",
  },
];

export function getLanguageByCode(code: string): Language | undefined {
  return languages.find((language) => language.code === code);
}
