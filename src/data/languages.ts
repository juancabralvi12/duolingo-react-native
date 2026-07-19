import type { Language } from "@/types/learning";

export const languages: Language[] = [
  {
    code: "pitch",
    name: "Pitch Basics",
    nativeName: "Match single notes",
    flagEmoji: "https://picsum.photos/seed/vocal-track-pitch/320/320",
  },
  {
    code: "ear",
    name: "Ear Training",
    nativeName: "Hear notes and intervals",
    flagEmoji: "https://picsum.photos/seed/vocal-track-ear/320/320",
  },
  {
    code: "breath",
    name: "Breath Support",
    nativeName: "Sing with steady air",
    flagEmoji: "https://picsum.photos/seed/vocal-track-breath/320/320",
  },
  {
    code: "warmups",
    name: "Vocal Warmups",
    nativeName: "Prepare your voice",
    flagEmoji: "https://picsum.photos/seed/vocal-track-warmups/320/320",
  },
  {
    code: "songs",
    name: "Song Practice",
    nativeName: "Coach short pieces",
    flagEmoji: "https://picsum.photos/seed/vocal-track-songs/320/320",
  },
  {
    code: "harmony",
    name: "Harmony",
    nativeName: "Blend with another part",
    flagEmoji: "https://picsum.photos/seed/vocal-track-harmony/320/320",
  },
];

export function getLanguageByCode(code: string): Language | undefined {
  return languages.find((language) => language.code === code);
}
