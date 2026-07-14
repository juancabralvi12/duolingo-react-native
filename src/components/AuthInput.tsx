import { useState } from "react";
import { Text, TextInput, TextInputProps, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { colors } from "@/theme";

type AuthInputProps = Omit<TextInputProps, "className" | "style"> & {
  label: string;
  secureTextEntry?: boolean;
};

export function AuthInput({ label, secureTextEntry, ...inputProps }: AuthInputProps) {
  const [isHidden, setIsHidden] = useState(secureTextEntry);

  return (
    <View className="rounded-2xl border border-border px-4 py-2">
      <Text className="caption-text">{label}</Text>
      <View className="flex-row items-center">
        <TextInput
          className="body-large flex-1 py-1"
          placeholderTextColor={colors.neutral.textSecondary}
          secureTextEntry={secureTextEntry && isHidden}
          {...inputProps}
        />
        {secureTextEntry && (
          <TouchableOpacity
            onPress={() => setIsHidden((prev) => !prev)}
            hitSlop={8}
          >
            <Ionicons
              name={isHidden ? "eye-outline" : "eye-off-outline"}
              size={20}
              color={colors.neutral.textSecondary}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
