import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import { Image, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { LanguageCard } from "@/components/LanguageCard";
import { images } from "@/constants/images";
import { languages } from "@/data/languages";
import { useLanguageStore } from "@/store/languageStore";
import { colors } from "@/theme";

export default function LanguageSelection() {
  const setSelectedLanguageCode = useLanguageStore((state) => state.setSelectedLanguageCode);
  const [query, setQuery] = useState("");
  const [selectedCode, setSelectedCode] = useState(languages[0]?.code);

  const filteredLanguages = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return languages;

    return languages.filter(
      (language) =>
        language.name.toLowerCase().includes(normalizedQuery) ||
        language.nativeName.toLowerCase().includes(normalizedQuery),
    );
  }, [query]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <View className="flex-row items-center px-6 pb-2 pt-4">
        <TouchableOpacity onPress={() => router.back()} hitSlop={8}>
          <Ionicons name="chevron-back" size={26} color={colors.neutral.textPrimary} />
        </TouchableOpacity>
        <Text className="heading-3 flex-1 text-center">Choose a language</Text>
        <View className="w-[26px]" />
      </View>

      <ScrollView
        className="flex-1"
        contentContainerClassName="gap-4 px-6 pb-6"
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-row items-center gap-2 rounded-full bg-surface px-4 py-3">
          <Ionicons name="search-outline" size={20} color={colors.neutral.textSecondary} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search languages"
            placeholderTextColor={colors.neutral.textSecondary}
            className="body-medium flex-1"
          />
        </View>

        <Text className="font-poppins-semibold text-body-sm text-text-secondary">Popular</Text>

        <View className="gap-3">
          {filteredLanguages.map((language) => (
            <LanguageCard
              key={language.code}
              language={language}
              selected={selectedCode === language.code}
              onPress={() => setSelectedCode(language.code)}
            />
          ))}
        </View>
      </ScrollView>

      <View className="gap-4 pt-2">
        <View className="px-6">
          <TouchableOpacity
            onPress={() => {
              if (!selectedCode) return;
              setSelectedLanguageCode(selectedCode);
              router.replace("/");
            }}
            disabled={!selectedCode}
            activeOpacity={0.85}
            className={`items-center justify-center rounded-full bg-primary-purple py-4 ${
              !selectedCode ? "opacity-50" : ""
            }`}
          >
            <Text className="font-poppins-semibold text-body-lg text-white">Confirm</Text>
          </TouchableOpacity>
        </View>

        <Image
          source={images.earth}
          className="h-36 w-full"
          style={{ width: "100%", height: 144 }}
          resizeMode="cover"
        />
      </View>
    </SafeAreaView>
  );
}
