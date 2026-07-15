import { Ionicons } from "@expo/vector-icons";
import { Image, Text, TouchableOpacity, View } from "react-native";

import { colors } from "@/theme";
import type { Language } from "@/types/learning";

type LanguageCardProps = {
  language: Language;
  selected: boolean;
  onPress: () => void;
};

export function LanguageCard({ language, selected, onPress }: LanguageCardProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      className={`flex-row items-center gap-3 rounded-2xl border px-4 py-3 ${
        selected ? "border-primary-purple bg-primary-purple/5" : "border-border bg-background"
      }`}
    >
      <View className="h-12 w-12 overflow-hidden rounded-full border border-border">
        <Image
          source={{ uri: language.flagEmoji }}
          className="h-full w-full"
          resizeMode="cover"
        />
      </View>

      <View className="flex-1 gap-0.5">
        <Text className="font-poppins-semibold text-body-lg text-text-primary">
          {language.name}
        </Text>
        <Text className="body-small">{language.nativeName}</Text>
      </View>

      {selected ? (
        <View className="h-7 w-7 items-center justify-center rounded-full bg-primary-purple">
          <Ionicons name="checkmark" size={16} color="#FFFFFF" />
        </View>
      ) : (
        <Ionicons name="chevron-forward" size={20} color={colors.neutral.textSecondary} />
      )}
    </TouchableOpacity>
  );
}
