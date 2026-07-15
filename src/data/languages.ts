import type { Language } from "@/types/learning";

export const languages: Language[] = [
  {
    code: "es",
    name: "Spanish",
    nativeName: "Español",
    flagEmoji: "https://flagcdn.com/w320/es.png",
  },
  {
    code: "fr",
    name: "French",
    nativeName: "Français",
    flagEmoji: "https://flagcdn.com/w320/fr.png",
  },
  {
    code: "ja",
    name: "Japanese",
    nativeName: "日本語",
    flagEmoji: "https://flagcdn.com/w320/ja.png",
  },
];

export function getLanguageByCode(code: string): Language | undefined {
  return languages.find((language) => language.code === code);
}
