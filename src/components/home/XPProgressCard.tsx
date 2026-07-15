import { Image, Text, View } from "react-native";

import { images } from "@/constants/images";

type XPProgressCardProps = {
  current: number;
  goal: number;
};

export function XPProgressCard({ current, goal }: XPProgressCardProps) {
  const progress = Math.min(current / goal, 1) * 100;

  return (
    <View className="flex-row items-center justify-between rounded-2xl bg-[#FDF1E6] px-5 py-4">
      <View className="flex-1 gap-2 pr-4">
        <Text className="body-small">Daily goal</Text>
        <Text className="font-poppins-bold text-h2 text-text-primary">
          {current}
          <Text className="font-poppins-medium text-body-md text-text-secondary"> / {goal} XP</Text>
        </Text>
        <View className="h-2 w-full overflow-hidden rounded-full bg-streak/20">
          <View className="h-full rounded-full bg-streak" style={{ width: `${progress}%` }} />
        </View>
      </View>
      <Image source={images.treasure} className="h-16 w-16" resizeMode="contain" />
    </View>
  );
}
