import { Ionicons } from "@expo/vector-icons";
import { Image, Text, TouchableOpacity, View } from "react-native";

type NextUpCardProps = {
  title: string;
  subtitle: string;
  avatarUri: string;
  onPress: () => void;
};

export function NextUpCard({ title, subtitle, avatarUri, onPress }: NextUpCardProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      className="flex-row items-center justify-between rounded-2xl bg-success/10 px-5 py-4"
    >
      <View className="flex-1 gap-1 pr-4">
        <Text className="body-small">Next up</Text>
        <Text className="font-poppins-semibold text-body-lg text-text-primary">{title}</Text>
        <Text className="body-small">{subtitle}</Text>
      </View>

      <View className="relative">
        <Image source={{ uri: avatarUri }} className="h-14 w-14 rounded-full" resizeMode="cover" />
        <View className="absolute -bottom-1 -right-1 h-6 w-6 items-center justify-center rounded-full bg-success">
          <Ionicons name="mic" size={13} color="#FFFFFF" />
        </View>
      </View>
    </TouchableOpacity>
  );
}
