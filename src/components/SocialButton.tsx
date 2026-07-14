import { Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type SocialButtonProps = {
  label: string;
  iconName: React.ComponentProps<typeof Ionicons>["name"];
  iconColor: string;
  onPress?: () => void;
};

export function SocialButton({ label, iconName, iconColor, onPress }: SocialButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className="flex-row items-center gap-3 rounded-2xl border border-border px-4 py-3"
    >
      <Ionicons name={iconName} size={20} color={iconColor} />
      <Text className="body-medium text-text-primary">{label}</Text>
    </TouchableOpacity>
  );
}
