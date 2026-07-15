import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type PlaceholderScreenProps = {
  title: string;
  subtitle?: string;
};

export function PlaceholderScreen({ title, subtitle }: PlaceholderScreenProps) {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <View className="flex-1 items-center justify-center gap-2 px-6">
        <Text className="heading-2">{title}</Text>
        {subtitle ? (
          <Text className="body-medium text-center text-text-secondary">{subtitle}</Text>
        ) : null}
      </View>
    </SafeAreaView>
  );
}
