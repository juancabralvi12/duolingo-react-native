import { Ionicons } from "@expo/vector-icons";
import { useUser } from "@clerk/expo";
import { router } from "expo-router";
import { Image, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ContinueLearningCard } from "@/components/home/ContinueLearningCard";
import { NextUpCard } from "@/components/home/NextUpCard";
import { PlanItemRow } from "@/components/home/PlanItemRow";
import { XPProgressCard } from "@/components/home/XPProgressCard";
import { images } from "@/constants/images";
import { getLanguageByCode } from "@/data/languages";
import { getLessonsByUnit } from "@/data/lessons";
import { getUnitsByLanguage } from "@/data/units";
import { useLanguageStore } from "@/store/languageStore";
import { colors } from "@/theme";

const DAILY_XP_GOAL = 20;
const DAILY_XP_CURRENT = 15;
const STREAK_COUNT = 12;
const AI_TEACHER_AVATAR_URI =
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=faces";

export default function Home() {
  const { user } = useUser();
  const selectedLanguageCode = useLanguageStore((state) => state.selectedLanguageCode);

  const language = selectedLanguageCode ? getLanguageByCode(selectedLanguageCode) : undefined;
  const currentUnit = selectedLanguageCode
    ? getUnitsByLanguage(selectedLanguageCode)[0]
    : undefined;
  const currentLesson = currentUnit ? getLessonsByUnit(currentUnit.id)[0] : undefined;
  const greetingWord = currentLesson?.vocabulary[0]?.word ?? "Hello";

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <ScrollView
        className="flex-1"
        contentContainerClassName="gap-5 px-6 pb-8 pt-4"
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-3">
            {language ? (
              <View className="h-11 w-11 overflow-hidden rounded-full">
                <Image
                  source={{ uri: language.flagEmoji }}
                  className="h-full w-full"
                  resizeMode="cover"
                />
              </View>
            ) : null}
            <Text className="font-poppins-semibold text-h4 text-text-primary">
              {greetingWord}, {user?.firstName ?? "there"}! 👋
            </Text>
          </View>

          <View className="flex-row items-center gap-4">
            <View className="flex-row items-center gap-1">
              <Image source={images.streakFire} className="h-6 w-6" resizeMode="contain" />
              <Text className="font-poppins-bold text-body-md text-text-primary">
                {STREAK_COUNT}
              </Text>
            </View>
            <Ionicons name="notifications-outline" size={24} color={colors.neutral.textPrimary} />
          </View>
        </View>

        <XPProgressCard current={DAILY_XP_CURRENT} goal={DAILY_XP_GOAL} />

        {language && currentUnit ? (
          <ContinueLearningCard
            languageName={language.name}
            levelLabel={`A1 • Unit ${currentUnit.order}`}
            onPress={() => router.push("/learn")}
          />
        ) : null}

        <View className="gap-4">
          <View className="flex-row items-center justify-between">
            <Text className="font-poppins-semibold text-h4 text-text-primary">
              {"Today's plan"}
            </Text>
            <Text className="font-poppins-semibold text-body-sm text-primary-purple">
              View all
            </Text>
          </View>

          {currentLesson ? (
            <View className="gap-4">
              <PlanItemRow
                icon="book"
                iconBackgroundClassName="bg-primary-purple"
                title="Lesson"
                subtitle={currentLesson.title}
                completed={false}
              />
              <PlanItemRow
                icon="headset"
                iconBackgroundClassName="bg-primary-purple"
                title="AI Conversation"
                subtitle={currentLesson.goal}
                completed={false}
              />
              <PlanItemRow
                icon="chatbubble-ellipses"
                iconBackgroundClassName="bg-error"
                title="New words"
                subtitle={`${currentLesson.vocabulary.length} words`}
                completed={false}
              />
            </View>
          ) : (
            <Text className="body-small">
              Lessons for {language?.name ?? "this language"} are coming soon.
            </Text>
          )}
        </View>

        <NextUpCard
          title="AI Video Call"
          subtitle="Practice speaking"
          avatarUri={AI_TEACHER_AVATAR_URI}
          onPress={() => router.push("/ai-teacher")}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
