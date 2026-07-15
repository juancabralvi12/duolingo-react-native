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
    flagEmoji: "https://flagcdn.com/w320/jp.png",
  },
  {
    code: "ko",
    name: "Korean",
    nativeName: "한국어",
    flagEmoji: "https://flagcdn.com/w320/kr.png",
  },
  {
    code: "de",
    name: "German",
    nativeName: "Deutsch",
    flagEmoji: "https://flagcdn.com/w320/de.png",
  },
  {
    code: "zh",
    name: "Chinese",
    nativeName: "中文",
    flagEmoji: "https://flagcdn.com/w320/cn.png",
  },
];

export function getLanguageByCode(code: string): Language | undefined {
  return languages.find((language) => language.code === code);
}
