import { Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

import { images } from "@/constants/images";

export default function Onboarding() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <View className="flex-1 justify-between px-6 pb-6">
        <View className="flex-row items-center justify-center gap-2 pt-4">
          <Image
            source={images.mascotLogo}
            className="h-9 w-9"
            style={{ width: 36, height: 36 }}
            resizeMode="contain"
          />
          <Text className="font-poppins-bold text-h2 text-text-primary">
            vocalingo
          </Text>
        </View>

        <View className="gap-3">
          <Text className="heading-1">
            Your AI vocal{"\n"}
            <Text className="text-primary-purple">coach.</Text>
          </Text>
          <Text className="body-medium text-text-secondary">
            Practice notes, warmups, and songs with real-time coaching.
          </Text>
        </View>

        <View className="items-center justify-center">
          <View className="relative items-center justify-center">
            <View className="absolute -left-4 top-0 rounded-2xl rounded-bl-sm bg-surface px-4 py-2">
              <Text className="body-medium text-text-primary">Sing C</Text>
            </View>
            <View className="absolute -right-2 -top-4 rounded-2xl rounded-br-sm bg-primary-purple/10 px-4 py-2">
              <Text className="body-medium text-primary-purple">Try ah</Text>
            </View>
            <View className="absolute -right-6 top-16 rounded-2xl rounded-br-sm bg-error/10 px-4 py-2">
              <Text className="body-medium text-error">Great pitch</Text>
            </View>
            <Image
              source={images.mascotWelcome}
              className="h-72 w-72"
              style={{ width: 288, height: 288 }}
              resizeMode="contain"
            />
          </View>
        </View>

        <TouchableOpacity
          onPress={() => router.push("/sign-up")}
          activeOpacity={0.85}
          className="relative w-full flex-row items-center justify-center rounded-full bg-primary-purple py-4"
        >
          <Text className="font-poppins-semibold text-body-lg text-white">
            Get Started
          </Text>
          <Text className="absolute right-6 font-poppins-bold text-body-lg text-white">
            {"›"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
