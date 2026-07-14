import { Text, TouchableOpacity } from "react-native";

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
      className="items-center justify-center rounded-full bg-primary-purple py-4"
    >
      <Text className="font-poppins-semibold text-body-lg text-white">{label}</Text>
    </TouchableOpacity>
  );
}
