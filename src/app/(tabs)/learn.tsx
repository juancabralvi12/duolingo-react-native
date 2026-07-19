import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { LessonListItem } from "@/components/lessons/LessonListItem";
import { getLessonsByUnit } from "@/data/lessons";
import { getUnitsByLanguage } from "@/data/units";
import { useLanguageStore } from "@/store/languageStore";
import { colors } from "@/theme";
import type { LessonStatus } from "@/types/learning";

// Mock progress: the first couple of lessons are complete, the next one is in
// progress, and the rest are locked — there's no real progress tracking yet.
function getCompletedCount(total: number): number {
  return total >= 2 ? Math.min(2, total - 1) : 0;
}

function getLessonStatus(index: number, total: number): LessonStatus {
  const completedCount = getCompletedCount(total);
  if (index < completedCount) return "completed";
  if (index === completedCount) return "in-progress";
  return "locked";
}

export default function Learn() {
  const [activeTab, setActiveTab] = useState<"lessons" | "practice">("lessons");
  const selectedLanguageCode = useLanguageStore((state) => state.selectedLanguageCode);

  const unit = selectedLanguageCode ? getUnitsByLanguage(selectedLanguageCode)[0] : undefined;
  const lessons = unit ? getLessonsByUnit(unit.id) : [];
  const completedCount = getCompletedCount(lessons.length);
  const reachedCount = lessons.length > 0 ? Math.min(completedCount + 1, lessons.length) : 0;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }} edges={["top"]}>
      <View className="flex-row items-start justify-between px-6 pb-3 pt-2">
        <View className="flex-row items-start gap-3">
          <TouchableOpacity onPress={() => router.push("/")} hitSlop={8} className="pt-1">
            <Ionicons name="chevron-back" size={26} color={colors.neutral.textPrimary} />
          </TouchableOpacity>
          <View className="gap-0.5">
            <Text className="font-poppins-semibold text-h3 text-text-primary">
              {unit?.title ?? "Lessons"}
            </Text>
            {unit ? (
              <Text className="body-small">
                Unit {unit.order} • {reachedCount}/{lessons.length} lessons
              </Text>
            ) : null}
          </View>
        </View>

        <TouchableOpacity hitSlop={8} className="pt-1">
          <Ionicons name="bookmark-outline" size={24} color={colors.neutral.textPrimary} />
        </TouchableOpacity>
      </View>

      {unit ? (
        <Image
          source={{ uri: unit.imageUrl }}
          className="h-64 w-full rounded-b-[32px]"
          resizeMode="cover"
        />
      ) : null}

      <View className="z-10 -mt-6 px-6">
        <View className="flex-row rounded-full bg-white p-1 shadow-sm shadow-black/10">
          <TouchableOpacity
            onPress={() => setActiveTab("lessons")}
            activeOpacity={0.85}
            className={`flex-1 items-center rounded-full py-3 ${
              activeTab === "lessons" ? "border-b-2 border-primary-purple" : ""
            }`}
          >
            <Text
              className={`font-poppins-semibold text-body-md ${
                activeTab === "lessons" ? "text-primary-purple" : "text-text-secondary"
              }`}
            >
              Lessons
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveTab("practice")}
            activeOpacity={0.85}
            className={`flex-1 items-center rounded-full py-3 ${
              activeTab === "practice" ? "border-b-2 border-primary-purple" : ""
            }`}
          >
            <Text
              className={`font-poppins-semibold text-body-md ${
                activeTab === "practice" ? "text-primary-purple" : "text-text-secondary"
              }`}
            >
              Practice
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerClassName="gap-3 px-6 pb-8 pt-6"
        showsVerticalScrollIndicator={false}
      >
        {activeTab === "lessons" ? (
          lessons.length > 0 ? (
            lessons.map((lesson, index) => (
              <LessonListItem
                key={lesson.id}
                lesson={lesson}
                lessonNumber={index + 1}
                status={getLessonStatus(index, lessons.length)}
                onPress={() => router.push(`/lesson/${lesson.id}`)}
              />
            ))
          ) : (
            <Text className="body-small text-center">
              Lessons for this vocal track are coming soon.
            </Text>
          )
        ) : (
          <Text className="body-small text-center">Extra vocal drills are coming soon.</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
