import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface LanguageState {
  selectedLanguageCode: string | null;
  hasHydrated: boolean;
  setSelectedLanguageCode: (code: string) => void;
  clearSelectedLanguageCode: () => void;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      selectedLanguageCode: null,
      hasHydrated: false,
      setSelectedLanguageCode: (code) => set({ selectedLanguageCode: code }),
      clearSelectedLanguageCode: () => set({ selectedLanguageCode: null }),
    }),
    {
      name: "language-storage",
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => () => {
        useLanguageStore.setState({ hasHydrated: true });
      },
      partialize: (state) => ({ selectedLanguageCode: state.selectedLanguageCode }),
    },
  ),
);
