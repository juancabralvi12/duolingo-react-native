import { Text, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import { colors } from "@/theme";

type PrimaryButtonProps = {
  label: string;
  onPress?: () => void;
  disabled?: boolean;
};

export function PrimaryButton({ label, onPress, disabled }: PrimaryButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.85}
      className="overflow-hidden rounded-full"
    >
      <LinearGradient
        colors={[colors.primary.purple, colors.primary.deepPurple]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{ alignItems: "center", justifyContent: "center", paddingVertical: 16 }}
      >
        <Text className="font-poppins-semibold text-body-lg text-white">{label}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
}
