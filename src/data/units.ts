import type { Unit } from "@/types/learning";

// Hero banner images are placeholders (Picsum, seeded per unit for a stable image)
// since the assets folder has no unit-specific illustrations yet.
export const units: Unit[] = [
  {
    id: "es-unit-1",
    languageCode: "es",
    order: 1,
    title: "Basics 1",
    description: "Greet people and introduce yourself in Spanish.",
    imageUrl: "https://picsum.photos/seed/es-unit-1/800/500",
  },
  {
    id: "fr-unit-1",
    languageCode: "fr",
    order: 1,
    title: "Basics 1",
    description: "Greet people and introduce yourself in French.",
    imageUrl: "https://picsum.photos/seed/fr-unit-1/800/500",
  },
  {
    id: "ja-unit-1",
    languageCode: "ja",
    order: 1,
    title: "Basics 1",
    description: "Greet people and introduce yourself in Japanese.",
    imageUrl: "https://picsum.photos/seed/ja-unit-1/800/500",
  },
  {
    id: "ko-unit-1",
    languageCode: "ko",
    order: 1,
    title: "Basics 1",
    description: "Greet people and introduce yourself in Korean.",
    imageUrl: "https://picsum.photos/seed/ko-unit-1/800/500",
  },
  {
    id: "de-unit-1",
    languageCode: "de",
    order: 1,
    title: "Basics 1",
    description: "Greet people and introduce yourself in German.",
    imageUrl: "https://picsum.photos/seed/de-unit-1/800/500",
  },
  {
    id: "zh-unit-1",
    languageCode: "zh",
    order: 1,
    title: "Basics 1",
    description: "Greet people and introduce yourself in Chinese.",
    imageUrl: "https://picsum.photos/seed/zh-unit-1/800/500",
  },
];

export function getUnitsByLanguage(languageCode: string): Unit[] {
  return units
    .filter((unit) => unit.languageCode === languageCode)
    .sort((a, b) => a.order - b.order);
}
