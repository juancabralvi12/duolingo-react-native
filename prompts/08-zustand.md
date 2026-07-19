Read AGENTS.md first and follow it strictly.

Integrate vocal track selection state. Store the selected vocal track using Zustand with the modern `@react-native-async-storage/async-storage` package. If an authenticated user has no selected vocal track, route them to the vocal track selection screen. Only after selecting a vocal track should they access the home route (/). Preserve the existing UI exactly.

Add a button on the home or profile screen route to clear async storage for testing selected track state functionality.

Required delta for Vocalingo:

- Existing store names may remain `useLanguageStore` and `selectedLanguageCode` for tutorial continuity, but visible UI and analytics should call the value a vocal track.
- Handle stale stored values from old language codes by sending the user back to track selection.
