import { Ionicons } from "@expo/vector-icons";
import { useUser } from "@clerk/expo";
import { router } from "expo-router";
import type { ComponentProps } from "react";
import { useState } from "react";
import {
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
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

const SHOW_HOME_V2 = true;

type IoniconName = ComponentProps<typeof Ionicons>["name"];

type HomeV2LessonNode = {
  lessonId: string;
  title: string;
  avatarUri?: string;
  icon?: IoniconName;
  align: "left" | "center" | "right";
  wide?: boolean;
};

type HomeV2Unit = {
  order: number;
  title: string;
  startsAtY: number;
  lessons: HomeV2LessonNode[];
};

const HOME_V2_AVATARS = [
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop&crop=faces",
  "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=120&h=120&fit=crop&crop=faces",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop&crop=faces",
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=120&h=120&fit=crop&crop=faces",
];

const HOME_V2_UNITS: HomeV2Unit[] = [
  {
    order: 1,
    title: "Finding Your Vocal Range",
    startsAtY: 0,
    lessons: [
      {
        lessonId: "pitch-unit-1-lesson-1",
        title: "Find your low note",
        avatarUri: HOME_V2_AVATARS[0],
        align: "center",
        wide: true,
      },
      {
        lessonId: "pitch-unit-1-lesson-2",
        title: "Find your high note",
        avatarUri: HOME_V2_AVATARS[1],
        align: "left",
        wide: true,
      },
      {
        lessonId: "pitch-unit-1-lesson-3",
        title: "Range check",
        icon: "checkmark-circle",
        align: "center",
        wide: true,
      },
    ],
  },
  {
    order: 2,
    title: "Breath Control",
    startsAtY: 720,
    lessons: [
      {
        lessonId: "breath-unit-1-lesson-1",
        title: "Breathe before you sing",
        avatarUri: HOME_V2_AVATARS[2],
        align: "right",
        wide: true,
      },
      {
        lessonId: "breath-unit-1-lesson-2",
        title: "Sing with even air",
        avatarUri: HOME_V2_AVATARS[3],
        align: "center",
        wide: true,
      },
      {
        lessonId: "breath-unit-1-lesson-2",
        title: "Skill check",
        icon: "checkmark-circle",
        align: "left",
        wide: true,
      },
    ],
  },
  {
    order: 3,
    title: "Pitch Steps",
    startsAtY: 1420,
    lessons: [
      {
        lessonId: "pitch-unit-1-lesson-4",
        title: "Step up and down",
        avatarUri: HOME_V2_AVATARS[0],
        align: "center",
        wide: true,
      },
      {
        lessonId: "warmups-unit-1-lesson-2",
        title: "Sing a short melody",
        avatarUri: HOME_V2_AVATARS[2],
        align: "right",
        wide: true,
      },
    ],
  },
];

export default function Home() {
  if (SHOW_HOME_V2) {
    return <HomeV2 />;
  }

  return <HomeV1 />;
}

function HomeV1() {
  const { user } = useUser();
  const selectedLanguageCode = useLanguageStore((state) => state.selectedLanguageCode);

  const language = selectedLanguageCode ? getLanguageByCode(selectedLanguageCode) : undefined;
  const currentUnit = selectedLanguageCode
    ? getUnitsByLanguage(selectedLanguageCode)[0]
    : undefined;
  const currentLesson = currentUnit ? getLessonsByUnit(currentUnit.id)[0] : undefined;
  const greetingWord = currentLesson?.vocabulary[0]?.word ?? "Warm up";

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
              {greetingWord}, {user?.firstName ?? "there"}!
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
            trackName={language.name}
            levelLabel={`Level 1 • Unit ${currentUnit.order}`}
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
                title="Coach session"
                subtitle={currentLesson.goal}
                completed={false}
              />
              <PlanItemRow
                icon="musical-notes"
                iconBackgroundClassName="bg-error"
                title="Vocal drills"
                subtitle={`${currentLesson.vocabulary.length} exercises`}
                completed={false}
              />
            </View>
          ) : (
            <Text className="body-small">
              Lessons for {language?.name ?? "this vocal track"} are coming soon.
            </Text>
          )}
        </View>

        <NextUpCard
          title="AI Voice Coach"
          subtitle="Practice singing"
          avatarUri={AI_TEACHER_AVATAR_URI}
          onPress={() => router.push("/ai-teacher")}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

function HomeV2() {
  const [activeUnitIndex, setActiveUnitIndex] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const activeUnit = HOME_V2_UNITS[activeUnitIndex] ?? HOME_V2_UNITS[0];

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
    const offsetY = contentOffset.y;
    const maxScrollableOffset = Math.max(contentSize.height - layoutMeasurement.height, 0);
    const nextProgress =
      maxScrollableOffset === 0
        ? 1
        : Math.min(Math.max(offsetY / maxScrollableOffset, 0), 1);
    const nextIndex = HOME_V2_UNITS.reduce((currentIndex, unit, index) => {
      return offsetY >= unit.startsAtY ? index : currentIndex;
    }, 0);

    setScrollProgress(nextProgress);

    if (nextIndex !== activeUnitIndex) {
      setActiveUnitIndex(nextIndex);
    }
  };

  return (
    <SafeAreaView style={styles.homeV2Root}>
      <View className="px-5 pb-8 pt-3" style={styles.homeV2Header}>
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-2 rounded-full bg-[#E8EDF7] px-6 py-4">
            <Text className="font-poppins-bold text-h3 text-[#5D6270]">Level</Text>
            <Ionicons name="chevron-down" size={22} color="#A5ABB8" />
          </View>

          <View className="flex-row items-center gap-2 rounded-full bg-[#E8EDF7] px-5 py-4">
            <Ionicons name="flame" size={30} color="#A9ABB0" />
            <Text className="font-poppins-bold text-h3 text-[#5D6270]">0</Text>
          </View>
        </View>

        <View className="mt-6 h-1.5 overflow-hidden rounded-full bg-[#C9DDF5]">
          <View
            className="h-full rounded-full bg-[#A9C9EF]"
            style={{ width: `${scrollProgress * 100}%` }}
          />
        </View>

        <View className="mt-9 flex-row items-center justify-between">
          <View className="gap-4">
            <Text className="font-poppins-bold text-h3 uppercase text-[#585D68]">
              Unit {activeUnit.order}
            </Text>
            <Text className="font-poppins-bold text-[34px] leading-[42px] text-[#111318]">
              {activeUnit.title}
            </Text>
          </View>

          <View
            className="h-20 w-20 items-center justify-center rounded-full bg-[#E8EDF5]"
            style={styles.softCircleShadow}
          >
            <Ionicons name="book" size={40} color="#2F7BFF" />
          </View>
        </View>
      </View>

      <View className="flex-1 bg-[#F7FAFE]">
        <ScrollView
          className="flex-1"
          contentContainerStyle={styles.homeV2ScrollContent}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
        >
          {HOME_V2_UNITS.map((unit, unitIndex) => (
            <View key={unit.order} className="gap-10">
              {unitIndex > 0 ? <HomeV2UnitDivider unit={unit} /> : null}
              <View className="gap-10">
                {unit.lessons.map((lesson, lessonIndex) => (
                  <HomeV2LessonCard
                    key={`${unit.order}-${lesson.title}`}
                    lesson={lesson}
                    faded={unitIndex > 0 || lessonIndex > 0}
                  />
                ))}
              </View>
            </View>
          ))}
        </ScrollView>

      </View>
    </SafeAreaView>
  );
}

function HomeV2UnitDivider({ unit }: { unit: HomeV2Unit }) {
  return (
    <View className="items-center gap-2 pb-10 pt-12">
      <View className="w-full flex-row items-center gap-4">
        <View className="h-0.5 flex-1 border-t-2 border-dotted border-[#D9E1EB]" />
        <Text className="font-poppins-bold text-h2 uppercase text-[#BCC7D4]">Unit {unit.order}</Text>
        <View className="h-0.5 flex-1 border-t-2 border-dotted border-[#D9E1EB]" />
      </View>
      <Text className="text-center font-poppins-bold text-[28px] leading-[36px] text-[#555B64]">
        {unit.title}
      </Text>
    </View>
  );
}

function HomeV2LessonCard({
  lesson,
  faded,
}: {
  lesson: HomeV2LessonNode;
  faded: boolean;
}) {
  const alignClassName =
    lesson.align === "left"
      ? "self-start"
      : lesson.align === "right"
        ? "self-end"
        : "self-center";

  return (
    <TouchableOpacity
      onPress={() =>
        router.push({
          pathname: "/lesson/[id]",
          params: { id: lesson.lessonId, mode: "practice" },
        })
      }
      activeOpacity={0.86}
      className={`${alignClassName} h-[108px] flex-row items-center rounded-[34px] bg-white px-7 ${
        lesson.wide ? "w-[285px]" : "w-[240px]"
      }`}
      style={styles.homeV2CardShadow}
    >
      <View className="mr-6 h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-[#F1F4F8]">
        {lesson.avatarUri ? (
          <Image
            source={{ uri: lesson.avatarUri }}
            className={`h-full w-full ${faded ? "opacity-55" : ""}`}
            resizeMode="cover"
          />
        ) : (
          <View className="h-16 w-16 items-center justify-center rounded-full bg-[#E7ECF4]">
            <Ionicons name={lesson.icon ?? "checkmark-circle"} size={42} color="#C4CDD8" />
          </View>
        )}
      </View>

      <Text
        className={`flex-1 font-poppins-bold text-[22px] leading-[27px] ${
          faded ? "text-[#7B7F86]" : "text-[#6F737A]"
        }`}
        numberOfLines={2}
        adjustsFontSizeToFit
        minimumFontScale={0.86}
      >
        {lesson.title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  homeV2Root: {
    flex: 1,
    backgroundColor: "#F7FAFE",
  },
  homeV2Header: {
    backgroundColor: "#F4F7FF",
  },
  homeV2ScrollContent: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 160,
    gap: 46,
  },
  homeV2CardShadow: {
    shadowColor: "#B8C3D4",
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.22,
    shadowRadius: 24,
    elevation: 8,
  },
  softCircleShadow: {
    shadowColor: "#C8D1DE",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.14,
    shadowRadius: 16,
    elevation: 4,
  },
});
