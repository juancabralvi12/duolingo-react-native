Read AGENTS.md first and follow it strictly.

Implement the vocal track selection screen UI based on the attached design. Use the hardcoded tracks from `data/languages.ts` and the existing NativeWind/global.css design utilities.

Replace "See all languages" with a confirmation button and use the earth image from the assets folder properly.

Add a link on the home screen route (/) to navigate to the vocal track selection screen route.

Required delta for Vocalingo:

- User-facing labels should say "vocal track", "singing track", or "practice focus", not "language".
- Search should search vocal tracks.
- Existing internal names like `LanguageCard` may remain if renaming would create noisy tutorial churn.

@prompt_material/04-language-selection-screen.png
