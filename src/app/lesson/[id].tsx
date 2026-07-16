import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { images } from "@/constants/images";
import { getLanguageByCode } from "@/data/languages";
import { getLessonById } from "@/data/lessons";
import { colors } from "@/theme";

const STREAK_COUNT = 12;
const CALL_BACKGROUND_URI = "https://picsum.photos/seed/ai-teacher-room/900/1200";
const SELF_PREVIEW_URI =
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=260&fit=crop&crop=faces";

// Mock speech feedback — there's no real speech recognition yet, this is
// just static UI to match the design until the live AI teacher (prompts
// 13-14) is wired up.
const FEEDBACK = [
  { label: "Speaking", value: "Excellent", colorClassName: "text-success" },
  { label: "Pronunciation", value: "Great", colorClassName: "text-info" },
  { label: "Grammar", value: "Good", colorClassName: "text-primary-purple" },
];

export default function LessonDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const lesson = getLessonById(id);
  const language = lesson ? getLanguageByCode(lesson.languageCode) : undefined;

  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [showSubtitles, setShowSubtitles] = useState(true);

  if (!lesson) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
        <View className="flex-1 items-center justify-center px-6">
          <Text className="body-medium text-center">Lesson not found.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const practicePhrase = lesson.phrases[0];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }} edges={["top"]}>
      <View className="flex-row items-start justify-between px-6 pb-3 pt-2">
        <View className="flex-row items-start gap-3">
          <TouchableOpacity onPress={() => router.back()} hitSlop={8} className="pt-1">
            <Ionicons name="chevron-back" size={26} color={colors.neutral.textPrimary} />
          </TouchableOpacity>
          <View className="gap-0.5">
            <Text className="font-poppins-semibold text-h3 text-text-primary">AI Teacher</Text>
            <View className="flex-row items-center gap-1.5">
              <View className="h-2 w-2 rounded-full bg-success" />
              <Text className="font-poppins-medium text-body-sm text-success">Online</Text>
            </View>
          </View>
        </View>

        <View className="flex-row items-center gap-2">
          <View className="h-10 w-10 items-center justify-center rounded-full bg-surface">
            <Ionicons name="videocam-outline" size={19} color={colors.neutral.textPrimary} />
          </View>
          <View className="h-10 w-10 items-center justify-center rounded-full bg-surface">
            <Text className="font-poppins-bold text-body-sm text-text-primary">
              {STREAK_COUNT}
            </Text>
          </View>
          <View className="h-10 w-10 items-center justify-center rounded-full bg-surface">
            <Ionicons name="notifications-outline" size={19} color={colors.neutral.textPrimary} />
          </View>
        </View>
      </View>

      <View className="gap-0.5 px-6 pb-3">
        <Text className="font-poppins-semibold text-body-md text-text-primary">
          {language?.name ?? "Lesson"} • {lesson.title}
        </Text>
        <Text className="body-small">{lesson.goal}</Text>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerClassName="gap-5 pb-8"
        showsVerticalScrollIndicator={false}
      >
        <View className="relative h-[400px] overflow-hidden rounded-b-[32px] bg-text-primary">
          <Image
            source={{ uri: CALL_BACKGROUND_URI }}
            className="absolute inset-0 h-full w-full"
            resizeMode="cover"
          />

          <Image
            source={images.mascotAuth}
            className="absolute bottom-24 self-center"
            style={{ height: 220, width: 220, left: 0, right: 0 }}
            resizeMode="contain"
          />

          <Image
            source={{ uri: SELF_PREVIEW_URI }}
            className="absolute right-4 top-4 h-28 w-20 rounded-2xl border-2 border-white"
            resizeMode="cover"
          />

          {practicePhrase ? (
            <View className="absolute bottom-4 left-4 right-4 flex-row items-start justify-between gap-3 rounded-2xl bg-white p-4">
              <View className="flex-1 gap-1">
                <Text className="font-poppins-semibold text-body-lg text-text-primary">
                  {practicePhrase.text}
                </Text>
                {showSubtitles ? (
                  <Text className="body-small">{practicePhrase.translation}</Text>
                ) : null}
              </View>
              <Ionicons name="volume-high" size={22} color={colors.primary.purple} />
            </View>
          ) : null}
        </View>

        <View className="flex-row items-center justify-around px-6">
          <View className="items-center gap-2">
            <TouchableOpacity
              onPress={() => setIsCameraOn((value) => !value)}
              activeOpacity={0.85}
              className="h-14 w-14 items-center justify-center rounded-full border border-border bg-white"
            >
              <Ionicons
                name={isCameraOn ? "videocam" : "videocam-off"}
                size={22}
                color={colors.neutral.textPrimary}
              />
            </TouchableOpacity>
            <Text className="caption-text">Camera</Text>
          </View>

          <View className="items-center gap-2">
            <TouchableOpacity
              onPress={() => setIsMicOn((value) => !value)}
              activeOpacity={0.85}
              className="h-14 w-14 items-center justify-center rounded-full border border-border bg-white"
            >
              <Ionicons
                name={isMicOn ? "mic" : "mic-off"}
                size={22}
                color={colors.neutral.textPrimary}
              />
            </TouchableOpacity>
            <Text className="caption-text">Mic</Text>
          </View>

          <View className="items-center gap-2">
            <TouchableOpacity
              onPress={() => setShowSubtitles((value) => !value)}
              activeOpacity={0.85}
              className="h-14 w-14 items-center justify-center rounded-full border border-border bg-white"
            >
              <Ionicons
                name="language"
                size={22}
                color={showSubtitles ? colors.primary.purple : colors.neutral.textSecondary}
              />
            </TouchableOpacity>
            <Text className="caption-text">Subtitles</Text>
          </View>

          <View className="items-center gap-2">
            <TouchableOpacity
              onPress={() => router.back()}
              activeOpacity={0.85}
              className="h-14 w-14 items-center justify-center rounded-full bg-error"
            >
              <Ionicons name="call" size={22} color="#FFFFFF" style={{ transform: [{ rotate: "135deg" }] }} />
            </TouchableOpacity>
            <Text className="caption-text">End Call</Text>
          </View>
        </View>

        <View className="mx-6 flex-row rounded-2xl border border-border py-4">
          {FEEDBACK.map((item, index) => (
            <View
              key={item.label}
              className={`flex-1 items-center gap-1 ${
                index > 0 ? "border-l border-border" : ""
              }`}
            >
              <Text className="font-poppins-semibold text-body-sm text-text-primary">
                {item.label}
              </Text>
              <Text className={`font-poppins-semibold text-body-md ${item.colorClassName}`}>
                {item.value}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
