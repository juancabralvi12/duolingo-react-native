import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { getLessonById } from "@/data/lessons";
import { colors } from "@/theme";

// Placeholder lesson screen — the full audio lesson experience is built in a
// later step. This just confirms navigation from the Lessons list works and
// shows the lesson's content from the hardcoded data.
export default function LessonDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const lesson = getLessonById(id);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <View className="flex-row items-center px-6 pb-2 pt-4">
        <TouchableOpacity onPress={() => router.back()} hitSlop={8}>
          <Ionicons name="chevron-back" size={26} color={colors.neutral.textPrimary} />
        </TouchableOpacity>
        <Text className="heading-3 flex-1 text-center">{lesson?.title ?? "Lesson"}</Text>
        <View className="w-[26px]" />
      </View>

      {!lesson ? (
        <View className="flex-1 items-center justify-center px-6">
          <Text className="body-medium text-center">Lesson not found.</Text>
        </View>
      ) : (
        <ScrollView
          className="flex-1"
          contentContainerClassName="gap-5 px-6 pb-8"
          showsVerticalScrollIndicator={false}
        >
          <Image
            source={{ uri: lesson.imageUrl }}
            className="h-48 w-full rounded-2xl"
            resizeMode="cover"
          />

          <Text className="body-medium">{lesson.goal}</Text>

          <View className="gap-3">
            <Text className="font-poppins-semibold text-h4 text-text-primary">Vocabulary</Text>
            {lesson.vocabulary.map((item) => (
              <View
                key={item.word}
                className="flex-row items-center justify-between rounded-2xl border border-border px-4 py-3"
              >
                <View className="gap-0.5">
                  <Text className="font-poppins-semibold text-body-md text-text-primary">
                    {item.word}
                  </Text>
                  {item.pronunciation ? (
                    <Text className="caption-text">{item.pronunciation}</Text>
                  ) : null}
                </View>
                <Text className="body-small">{item.translation}</Text>
              </View>
            ))}
          </View>

          <View className="gap-3">
            <Text className="font-poppins-semibold text-h4 text-text-primary">Phrases</Text>
            {lesson.phrases.map((phrase) => (
              <View
                key={phrase.text}
                className="gap-0.5 rounded-2xl border border-border px-4 py-3"
              >
                <Text className="font-poppins-semibold text-body-md text-text-primary">
                  {phrase.text}
                </Text>
                <Text className="body-small">{phrase.translation}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
