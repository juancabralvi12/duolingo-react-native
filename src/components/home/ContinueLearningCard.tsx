import { Image, Text, TouchableOpacity, View } from "react-native";

import { images } from "@/constants/images";

type ContinueLearningCardProps = {
  languageName: string;
  levelLabel: string;
  onPress: () => void;
};

export function ContinueLearningCard({
  languageName,
  levelLabel,
  onPress,
}: ContinueLearningCardProps) {
  return (
    <View className="relative overflow-hidden rounded-2xl bg-primary-purple p-5">
      <View className="max-w-[62%] gap-2">
        <Text className="font-poppins-medium text-body-md text-white/80">Continue learning</Text>
        <Text className="font-poppins-bold text-h1 text-white">{languageName}</Text>
        <Text className="font-poppins-medium text-body-sm text-white/70">{levelLabel}</Text>
        <TouchableOpacity
          onPress={onPress}
          activeOpacity={0.85}
          className="mt-2 self-start rounded-full bg-white px-5 py-2.5"
        >
          <Text className="font-poppins-semibold text-body-md text-primary-purple">Continue</Text>
        </TouchableOpacity>
      </View>

      <Image
        source={images.palace}
        className="absolute -right-4 bottom-0 h-32 w-36"
        resizeMode="contain"
      />
    </View>
  );
}
