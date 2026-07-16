import { Ionicons } from "@expo/vector-icons";
import { Image, Text, TouchableOpacity, View } from "react-native";

import { colors } from "@/theme";
import type { Lesson, LessonStatus } from "@/types/learning";

type LessonListItemProps = {
  lesson: Lesson;
  lessonNumber: number;
  status: LessonStatus;
  onPress: () => void;
};

export function LessonListItem({ lesson, lessonNumber, status, onPress }: LessonListItemProps) {
  const isInProgress = status === "in-progress";

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      className={`flex-row items-center justify-between rounded-2xl border px-4 py-4 ${
        isInProgress ? "border-2 border-primary-purple bg-primary-purple/5" : "border-border"
      }`}
    >
      <View className="flex-1 gap-1 pr-3">
        <Text
          className={`font-poppins-semibold text-body-sm ${
            isInProgress ? "text-primary-purple" : "text-text-secondary"
          }`}
        >
          Lesson {lessonNumber}
        </Text>
        <Text className="font-poppins-semibold text-body-lg text-text-primary">
          {lesson.title}
        </Text>
        {status === "in-progress" ? (
          <Text className="font-poppins-medium text-body-sm text-primary-purple">
            In progress
          </Text>
        ) : null}
        {status === "locked" ? (
          <Text className="body-small">0 / {lesson.activities.length} lessons</Text>
        ) : null}
      </View>

      {status === "completed" ? (
        <View className="h-8 w-8 items-center justify-center rounded-full bg-success">
          <Ionicons name="checkmark" size={18} color="#FFFFFF" />
        </View>
      ) : null}

      {status === "in-progress" ? (
        <Image
          source={{ uri: lesson.imageUrl }}
          className="h-11 w-11 rounded-xl"
          resizeMode="cover"
        />
      ) : null}

      {status === "locked" ? (
        <Ionicons name="lock-closed" size={20} color={colors.neutral.textSecondary} />
      ) : null}
    </TouchableOpacity>
  );
}
