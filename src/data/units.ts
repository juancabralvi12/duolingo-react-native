import type { Unit } from "@/types/learning";

export const units: Unit[] = [
  {
    id: "es-unit-1",
    languageCode: "es",
    order: 1,
    title: "Basics 1",
    description: "Greet people and introduce yourself in Spanish.",
  },
  {
    id: "fr-unit-1",
    languageCode: "fr",
    order: 1,
    title: "Basics 1",
    description: "Greet people and introduce yourself in French.",
  },
  {
    id: "ja-unit-1",
    languageCode: "ja",
    order: 1,
    title: "Basics 1",
    description: "Greet people and introduce yourself in Japanese.",
  },
];

export function getUnitsByLanguage(languageCode: string): Unit[] {
  return units
    .filter((unit) => unit.languageCode === languageCode)
    .sort((a, b) => a.order - b.order);
}
