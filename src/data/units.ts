import type { Unit } from "@/types/learning";

// The existing data model still calls the selected track a language so the
// tutorial can evolve without a noisy rename across every screen.
export const units: Unit[] = [
  {
    id: "pitch-unit-1",
    languageCode: "pitch",
    order: 1,
    title: "Find Your Notes",
    description: "Sing simple notes, match pitch, and build confidence.",
    imageUrl: "https://picsum.photos/seed/pitch-unit-1/800/500",
  },
  {
    id: "ear-unit-1",
    languageCode: "ear",
    order: 1,
    title: "Train Your Ear",
    description: "Recognize higher, lower, steps, and skips before singing.",
    imageUrl: "https://picsum.photos/seed/ear-unit-1/800/500",
  },
  {
    id: "breath-unit-1",
    languageCode: "breath",
    order: 1,
    title: "Steady Air",
    description: "Use breath support for smoother, longer sung notes.",
    imageUrl: "https://picsum.photos/seed/breath-unit-1/800/500",
  },
  {
    id: "warmups-unit-1",
    languageCode: "warmups",
    order: 1,
    title: "Daily Warmups",
    description: "Warm up gently with hums, sirens, vowels, and scales.",
    imageUrl: "https://picsum.photos/seed/warmups-unit-1/800/500",
  },
  {
    id: "songs-unit-1",
    languageCode: "songs",
    order: 1,
    title: "Sing A Piece",
    description: "Practice short melodic phrases and get vocal coaching.",
    imageUrl: "https://picsum.photos/seed/songs-unit-1/800/500",
  },
  {
    id: "harmony-unit-1",
    languageCode: "harmony",
    order: 1,
    title: "Hold Your Part",
    description: "Stay steady while another note or pattern is present.",
    imageUrl: "https://picsum.photos/seed/harmony-unit-1/800/500",
  },
];

export function getUnitsByLanguage(languageCode: string): Unit[] {
  return units
    .filter((unit) => unit.languageCode === languageCode)
    .sort((a, b) => a.order - b.order);
}
