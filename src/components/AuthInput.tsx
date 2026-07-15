import { useState } from "react";
import { Text, TextInput, TextInputProps, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { colors } from "@/theme";

type AuthInputProps = Omit<TextInputProps, "className" | "style"> & {
  label: string;
  secureTextEntry?: boolean;
  error?: string;
};

export function AuthInput({ label, secureTextEntry, error, ...inputProps }: AuthInputProps) {
  const [isHidden, setIsHidden] = useState(secureTextEntry);

  return (
    <View className="gap-1">
      <View className={`rounded-2xl border px-4 py-2 ${error ? "border-error" : "border-border"}`}>
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
      {error && <Text className="font-poppins text-body-sm text-error">{error}</Text>}
    </View>
  );
}
