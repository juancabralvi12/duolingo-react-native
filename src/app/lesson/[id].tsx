import { useAuth, useUser } from "@clerk/expo";
import { Ionicons } from "@expo/vector-icons";
import { CallContent, StreamCall, StreamVideo } from "@stream-io/video-react-native-sdk";
import { useEventListener } from "expo";
import { router, useLocalSearchParams } from "expo-router";
import { type VideoSource, VideoView, useVideoPlayer } from "expo-video";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { images } from "@/constants/images";
import { lessonIntroVideos } from "@/constants/videos";
import { getLanguageByCode } from "@/data/languages";
import { getLessonById } from "@/data/lessons";
import {
  type AgentConnectionStatus,
  type LessonCallStatus,
  useLessonCall,
} from "@/hooks/useLessonCall";
import { colors } from "@/theme";
import type { Lesson } from "@/types/learning";

const STREAK_COUNT = 12;
const CALL_BACKGROUND_URI = "https://picsum.photos/seed/ai-vocal-coach-room/900/1200";
const SELF_PREVIEW_URI =
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=260&fit=crop&crop=faces";

// Mock singing feedback. The live vocal coach can respond over audio, while
// these scores stay static until realtime pitch/rhythm analysis is added.
const FEEDBACK = [
  { label: "Pitch", value: "Centered", colorClassName: "text-success" },
  { label: "Tone", value: "Clear", colorClassName: "text-info" },
  { label: "Timing", value: "Steady", colorClassName: "text-primary-purple" },
];

type PracticeAttemptStatus = "idle" | "listening" | "complete";
type LessonVideoStatus = "idle" | "checking" | "generating" | "ready" | "failed";

interface LessonVideoResponse {
  lessonId?: string;
  status?: LessonVideoStatus;
  videoUrl?: string;
  errorMessage?: string;
  error?: string;
}

const CALL_STATUS_META: Record<
  LessonCallStatus,
  { label: string; dotClassName: string; textClassName: string }
> = {
  connecting: { label: "Connecting…", dotClassName: "bg-warning", textClassName: "text-warning" },
  joining: { label: "Joining…", dotClassName: "bg-warning", textClassName: "text-warning" },
  joined: { label: "Online", dotClassName: "bg-success", textClassName: "text-success" },
  reconnecting: {
    label: "Reconnecting…",
    dotClassName: "bg-warning",
    textClassName: "text-warning",
  },
  error: { label: "Call failed", dotClassName: "bg-error", textClassName: "text-error" },
  ended: {
    label: "Call ended",
    dotClassName: "bg-text-secondary",
    textClassName: "text-text-secondary",
  },
};

const AGENT_STATUS_META: Record<
  AgentConnectionStatus,
  { label: string; dotClassName: string; textClassName: string }
> = {
  idle: {
    label: "Coach idle",
    dotClassName: "bg-text-secondary",
    textClassName: "text-text-secondary",
  },
  connecting: {
    label: "Coach connecting",
    dotClassName: "bg-warning",
    textClassName: "text-warning",
  },
  connected: {
    label: "Coach connected",
    dotClassName: "bg-success",
    textClassName: "text-success",
  },
  failed: {
    label: "Coach failed",
    dotClassName: "bg-error",
    textClassName: "text-error",
  },
};

export default function LessonDetail() {
  const { id, mode } = useLocalSearchParams<{ id: string; mode?: string }>();
  const lesson = getLessonById(id);

  if (!lesson) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
        <View className="flex-1 items-center justify-center px-6">
          <Text className="body-medium text-center">Lesson not found.</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (mode === "practice") {
    return <LessonPracticeScreen lesson={lesson} />;
  }

  return <LessonCallScreen lesson={lesson} />;
}

function LessonPracticeScreen({ lesson }: { lesson: Lesson }) {
  const { getToken, isSignedIn } = useAuth();
  const [stepIndex, setStepIndex] = useState(0);
  const [attemptStatus, setAttemptStatus] = useState<PracticeAttemptStatus>("idle");
  const [cantSpeakNow, setCantSpeakNow] = useState(false);
  const [hasWatchedIntro, setHasWatchedIntro] = useState(false);
  const [videoStatus, setVideoStatus] = useState<LessonVideoStatus>("idle");
  const [videoUrl, setVideoUrl] = useState<string>();
  const [videoErrorMessage, setVideoErrorMessage] = useState<string>();
  const [generationProgress, setGenerationProgress] = useState(0.08);
  const practiceSteps = lesson.phrases.slice(0, 2);
  const activeStep = practiceSteps[stepIndex] ?? lesson.phrases[0];
  const localIntroVideoSource = lessonIntroVideos[lesson.id];
  const isListening = attemptStatus === "listening";
  const isComplete = attemptStatus === "complete";
  const progress = practiceSteps.length > 1 ? stepIndex / (practiceSteps.length - 1) : 1;

  useEffect(() => {
    if (!isListening) return undefined;

    const timeout = setTimeout(() => {
      setAttemptStatus("complete");
    }, 2600);

    return () => clearTimeout(timeout);
  }, [isListening, stepIndex]);

  useEffect(() => {
    if (videoStatus !== "generating") return undefined;

    const interval = setInterval(() => {
      setGenerationProgress((currentProgress) => Math.min(currentProgress + 0.045, 0.92));
    }, 1200);

    return () => clearInterval(interval);
  }, [videoStatus]);

  useEffect(() => {
    if (hasWatchedIntro) return undefined;

    if (localIntroVideoSource) return undefined;

    if (!isSignedIn) return undefined;

    let cancelled = false;
    let pollTimeout: ReturnType<typeof setTimeout> | undefined;

    async function requestLessonVideo(): Promise<LessonVideoResponse> {
      const token = await getToken();
      const res = await fetch(`/api/lesson-video/${encodeURIComponent(lesson.id)}`, {
        method: "GET",
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      const body = (await res.json().catch(() => ({}))) as LessonVideoResponse;

      if (!res.ok) {
        throw new Error(body.error ?? body.errorMessage ?? `Video request failed (${res.status}).`);
      }

      return body;
    }

    async function loadVideoStatus(isInitialLoad = false) {
      try {
        if (isInitialLoad) {
          setVideoStatus("checking");
          setVideoErrorMessage(undefined);
        }

        const body = await requestLessonVideo();
        if (cancelled) return;

        setVideoStatus(body.status ?? "idle");
        setVideoUrl(body.videoUrl);
        setVideoErrorMessage(body.errorMessage);
        if (body.status === "ready") setGenerationProgress(1);

        if (body.status === "generating") {
          pollTimeout = setTimeout(() => loadVideoStatus(false), 8000);
        }
      } catch (err) {
        if (cancelled) return;
        setVideoStatus("failed");
        setVideoErrorMessage(err instanceof Error ? err.message : "Could not check the lesson video.");
      }
    }

    loadVideoStatus(true);

    return () => {
      cancelled = true;
      if (pollTimeout) clearTimeout(pollTimeout);
    };
  }, [getToken, hasWatchedIntro, isSignedIn, lesson.id, localIntroVideoSource]);

  const handleStartAttempt = () => {
    if (cantSpeakNow || isListening) return;
    setAttemptStatus("listening");
  };

  const handleRestart = () => {
    setAttemptStatus("idle");
  };

  const handlePrevious = () => {
    setStepIndex((currentIndex) => Math.max(currentIndex - 1, 0));
    setAttemptStatus("idle");
  };

  const handleNext = () => {
    setStepIndex((currentIndex) => Math.min(currentIndex + 1, practiceSteps.length - 1));
    setAttemptStatus("idle");
  };

  if (!hasWatchedIntro) {
    const effectiveVideoStatus = isSignedIn ? videoStatus : "failed";
    const effectiveVideoErrorMessage = isSignedIn
      ? videoErrorMessage
      : "Sign in to watch the lesson demo video.";
    const introVideoSource: VideoSource | undefined = localIntroVideoSource ?? videoUrl;
    const canWatchVideo = Boolean(introVideoSource) && (Boolean(localIntroVideoSource) || effectiveVideoStatus === "ready");
    const isWaitingForVideo = effectiveVideoStatus === "checking" || effectiveVideoStatus === "generating";
    const videoTitle =
      effectiveVideoStatus === "idle"
        ? "Demo not ready"
        : effectiveVideoStatus === "checking"
          ? "Checking demo"
          : effectiveVideoStatus === "generating"
            ? "Preparing demo"
            : "Demo unavailable";
    const videoStatusMessage =
      effectiveVideoErrorMessage ??
      (effectiveVideoStatus === "idle"
        ? "This lesson demo has not been generated by the backend yet."
        : effectiveVideoStatus === "checking"
          ? "Looking for a prepared AI video for this lesson."
          : effectiveVideoStatus === "generating"
            ? "The backend is preparing a short coach video for this exercise."
            : "The prepared lesson demo could not be loaded.");

    if (canWatchVideo && introVideoSource) {
      return (
        <LessonDemoVideoPlayer
          lesson={lesson}
          videoSource={introVideoSource}
          onClose={() => router.back()}
          onDone={() => setHasWatchedIntro(true)}
        />
      );
    }

    return (
      <SafeAreaView style={styles.practiceRoot}>
        <View className="flex-1 justify-between px-5 pb-8 pt-8">
          <View className="flex-row items-center justify-between">
            <TouchableOpacity onPress={() => router.back()} hitSlop={10} activeOpacity={0.8}>
              <Ionicons name="close" size={40} color="#FFFFFF" />
            </TouchableOpacity>

            <View className="rounded-full bg-white/15 px-4 py-2">
              <Text className="font-poppins-medium text-[18px] leading-[24px] text-white">
                Demo first
              </Text>
            </View>
          </View>

          <View className="items-center gap-5">
            <View className="h-[505px] w-full rounded-[24px] bg-white px-7 pb-8 pt-7" style={styles.practiceCard}>
              <View className="flex-row items-center justify-between">
                <Ionicons name="videocam-outline" size={31} color="#AEB5BF" />
                <View
                  className={`min-w-[132px] items-center rounded-2xl px-5 py-2 ${
                    effectiveVideoStatus === "failed" ? "bg-[#FF5E63]" : "bg-[#E8EBFF]"
                  }`}
                >
                  {isWaitingForVideo ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <Ionicons
                      name={effectiveVideoStatus === "failed" ? "alert" : "sparkles"}
                      size={34}
                      color="#FFFFFF"
                    />
                  )}
                </View>
                <Ionicons name="bookmark-outline" size={31} color="#AEB5BF" />
              </View>

              <View className="flex-1 items-center justify-center gap-12">
                <View className="items-center gap-7">
                  <Text className="text-center font-poppins-semibold text-[38px] leading-[46px] text-[#C6C6C8]">
                    {videoTitle}
                  </Text>
                  <Text className="text-center font-poppins-medium text-[20px] leading-[27px] text-[#16181D]">
                    {lesson.title}
                  </Text>
                  <Text className="text-center body-small">
                    {videoStatusMessage}
                  </Text>
                </View>

                {isWaitingForVideo ? (
                  <View className="w-full gap-4">
                    <View className="h-2 overflow-hidden rounded-full bg-[#EEF1F5]">
                      <View
                        className="h-full rounded-full bg-[#2257FF]"
                        style={{ width: `${generationProgress * 100}%` }}
                      />
                    </View>
                    <Text className="text-center font-poppins-bold text-[22px] leading-[28px] text-[#2257FF]">
                      {Math.round(generationProgress * 100)}%
                    </Text>
                  </View>
                ) : null}

                {!isWaitingForVideo ? (
                  <TouchableOpacity
                    onPress={() => setHasWatchedIntro(true)}
                    activeOpacity={0.85}
                    className="flex-row items-center gap-3 rounded-full bg-[#F1F2F4] px-9 py-3.5"
                  >
                    <Ionicons name="arrow-forward" size={26} color="#2257FF" />
                    <Text className="font-poppins-bold text-[22px] leading-[28px] text-[#2257FF]">
                      Start practice
                    </Text>
                  </TouchableOpacity>
                ) : null}
              </View>
            </View>

            <Text className="font-poppins-medium text-[20px] leading-[26px] text-white/55">
              Demo first
            </Text>
          </View>

          <View className="gap-7">
            <View className="h-1.5 overflow-hidden rounded-full bg-white/70">
              <View
                className="h-full rounded-full bg-white"
                style={{ width: `${isWaitingForVideo ? generationProgress * 100 : 0}%` }}
              />
            </View>

            <View className="flex-row items-center justify-center">
              <View className="h-[94px] w-[94px] items-center justify-center rounded-full border-[3px] border-white">
                {isWaitingForVideo ? (
                  <ActivityIndicator color="#FFFFFF" size="large" />
                ) : (
                  <Ionicons name="arrow-forward" size={42} color="#FFFFFF" />
                )}
              </View>
            </View>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.practiceRoot}>
      <View className="flex-1 justify-between px-5 pb-8 pt-8">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity onPress={() => router.back()} hitSlop={10} activeOpacity={0.8}>
            <Ionicons name="close" size={40} color="#FFFFFF" />
          </TouchableOpacity>

          <View className="flex-row items-center gap-2">
            <Text className="font-poppins-medium text-[20px] leading-[26px] text-white">
              {"Can't speak now"}
            </Text>
            <Switch
              value={cantSpeakNow}
              onValueChange={setCantSpeakNow}
              trackColor={{ false: "#BFC1C5", true: "#D8E3F6" }}
              thumbColor="#FFFFFF"
              ios_backgroundColor="#BFC1C5"
              style={styles.practiceSwitch}
            />
          </View>
        </View>

        <View className="items-center gap-5">
          <View className="h-[505px] w-full rounded-[24px] bg-white px-7 pb-7 pt-7" style={styles.practiceCard}>
            <View className="flex-row items-center justify-between">
              <Ionicons name="flag-outline" size={31} color="#AEB5BF" />
              <View
                className={`min-w-[132px] items-center rounded-2xl px-5 py-2 ${
                  isComplete ? "bg-[#10C89B]" : "bg-[#E8EBFF]"
                }`}
              >
                {isComplete ? (
                  <Ionicons name="checkmark" size={34} color="#FFFFFF" />
                ) : (
                  <Text className="font-poppins-medium text-[23px] leading-[30px] text-white">
                    {isListening ? "Listening..." : "Speak now..."}
                  </Text>
                )}
              </View>
              <Ionicons name="bookmark-outline" size={31} color="#AEB5BF" />
            </View>

            <View className="flex-1 items-center justify-center gap-20">
              <View className="items-center gap-12">
                <Text
                  className={`text-center font-poppins-semibold text-[40px] leading-[48px] ${
                    isComplete ? "text-[#08B768]" : "text-[#C6C6C8]"
                  }`}
                  numberOfLines={2}
                  adjustsFontSizeToFit
                  minimumFontScale={0.68}
                >
                  {activeStep?.text ?? lesson.title}
                </Text>
                <Text className="text-center font-poppins-medium text-[20px] leading-[27px] text-[#16181D]">
                  {activeStep?.translation ?? lesson.goal}
                </Text>
              </View>

              <TouchableOpacity
                onPress={handleRestart}
                activeOpacity={0.85}
                className="flex-row items-center gap-3 rounded-full bg-[#F1F2F4] px-9 py-3.5"
              >
                <Ionicons name="refresh" size={28} color="#2257FF" />
                <Text className="font-poppins-bold text-[22px] leading-[28px] text-[#2257FF]">
                  Restart
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <Text className="font-poppins-medium text-[20px] leading-[26px] text-white/55">
            {stepIndex + 1} of {practiceSteps.length}
          </Text>
        </View>

        <View className="gap-7">
          <View className="h-1.5 overflow-hidden rounded-full bg-white/70">
            <View className="h-full rounded-full bg-white" style={{ width: `${progress * 100}%` }} />
          </View>

          <View className="flex-row items-center justify-between">
            <Text className="font-poppins-bold text-[20px] leading-[26px] text-white">
              <Text className="text-white/35">OFF / </Text>
              CC
            </Text>

            <TouchableOpacity onPress={handlePrevious} activeOpacity={0.8} hitSlop={8}>
              <Ionicons name="arrow-undo" size={40} color="#FFFFFF" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleStartAttempt}
              activeOpacity={0.86}
              disabled={cantSpeakNow || isListening}
              className={`h-[94px] w-[94px] items-center justify-center rounded-full border-[3px] border-white ${
                cantSpeakNow ? "opacity-50" : ""
              }`}
            >
              <Ionicons name="pause" size={44} color="#FFFFFF" />
            </TouchableOpacity>

            <TouchableOpacity onPress={handleNext} activeOpacity={0.8} hitSlop={8}>
              <Ionicons name="arrow-redo" size={40} color="#FFFFFF" />
            </TouchableOpacity>

            <Text className="font-poppins-medium text-[20px] leading-[26px] text-white">1x</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

function LessonDemoVideoPlayer({
  lesson,
  onClose,
  onDone,
  videoSource,
}: {
  lesson: Lesson;
  onClose: () => void;
  onDone: () => void;
  videoSource: VideoSource;
}) {
  const [isFirstFrameReady, setIsFirstFrameReady] = useState(false);
  const player = useVideoPlayer(videoSource, (videoPlayer) => {
    videoPlayer.loop = false;
    videoPlayer.play();
  });

  useEventListener(player, "playToEnd", onDone);

  return (
    <SafeAreaView style={styles.reelsRoot}>
      <View className="flex-1 bg-black">
        <VideoView
          player={player}
          nativeControls={false}
          contentFit="cover"
          style={styles.reelsVideo}
          onFirstFrameRender={() => setIsFirstFrameReady(true)}
        />

        {!isFirstFrameReady ? (
          <View className="absolute inset-0 items-center justify-center bg-black">
            <ActivityIndicator color="#FFFFFF" size="large" />
          </View>
        ) : null}

        <View className="absolute left-5 right-5 top-8 flex-row items-center justify-between">
          <TouchableOpacity onPress={onClose} hitSlop={10} activeOpacity={0.8}>
            <Ionicons name="close" size={40} color="#FFFFFF" />
          </TouchableOpacity>

          <View className="rounded-full bg-black/35 px-4 py-2">
            <Text className="font-poppins-medium text-[18px] leading-[24px] text-white">
              Demo
            </Text>
          </View>
        </View>

        <View className="absolute bottom-8 left-5 right-5 gap-5">
          <View className="gap-2">
            <Text className="font-poppins-bold text-[30px] leading-[36px] text-white">
              {lesson.title}
            </Text>
            <Text className="font-poppins-medium text-[17px] leading-[24px] text-white/80">
              Watch the coach, then copy it in the next card.
            </Text>
          </View>

          <TouchableOpacity
            onPress={onDone}
            activeOpacity={0.86}
            className="self-start rounded-full bg-white px-6 py-3"
          >
            <Text className="font-poppins-bold text-[17px] leading-[23px] text-[#111318]">
              Start practice
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

function LessonCallScreen({ lesson }: { lesson: Lesson }) {
  const language = getLanguageByCode(lesson.languageCode);
  const { user } = useUser();
  const {
    status,
    errorMessage,
    agentStatus,
    agentErrorMessage,
    client,
    call,
    isMicOn,
    toggleMic,
    isCameraOn,
    toggleCamera,
    endCall,
  } = useLessonCall(lesson);

  const [showCaptions, setShowCaptions] = useState(true);

  const practicePhrase = lesson.phrases[0];
  const statusMeta = CALL_STATUS_META[status];
  const agentMeta = AGENT_STATUS_META[agentStatus];
  const isConnected = status === "joined" || status === "reconnecting";

  const handleEndCall = async () => {
    await endCall();
    router.back();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }} edges={["top"]}>
      <View className="flex-row items-start justify-between px-6 pb-3 pt-2">
        <View className="flex-row items-start gap-3">
          <TouchableOpacity onPress={() => router.back()} hitSlop={8} className="pt-1">
            <Ionicons name="chevron-back" size={26} color={colors.neutral.textPrimary} />
          </TouchableOpacity>
          <View className="gap-0.5">
            <Text className="font-poppins-semibold text-h3 text-text-primary">AI Vocal Coach</Text>
            <View className="flex-row items-center gap-1.5">
              <View className={`h-2 w-2 rounded-full ${statusMeta.dotClassName}`} />
              <Text className={`font-poppins-medium text-body-sm ${statusMeta.textClassName}`}>
                {statusMeta.label}
              </Text>
            </View>
            <View className="flex-row items-center gap-1.5">
              <View className={`h-2 w-2 rounded-full ${agentMeta.dotClassName}`} />
              <Text className={`font-poppins-medium text-caption ${agentMeta.textClassName}`}>
                {agentMeta.label}
              </Text>
            </View>
          </View>
        </View>

        <View className="flex-row items-center gap-2">
          <View className="h-10 w-10 items-center justify-center rounded-full bg-surface">
            <Ionicons name="musical-notes-outline" size={19} color={colors.neutral.textPrimary} />
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
          {language?.name ?? "Vocal lesson"} • {lesson.title}
        </Text>
        <Text className="body-small">{lesson.goal}</Text>
        {agentStatus === "failed" ? (
          <Text className="font-poppins-medium text-caption text-error" numberOfLines={2}>
            {agentErrorMessage ?? "The AI vocal coach could not join."}
          </Text>
        ) : null}
      </View>

      <ScrollView
        className="flex-1"
        contentContainerClassName="gap-5 pb-8"
        showsVerticalScrollIndicator={false}
      >
        <View className="relative h-[400px] overflow-hidden rounded-b-[32px] bg-text-primary">
          {client && call ? (
            <View className="absolute inset-0">
              <StreamVideo client={client}>
                <StreamCall call={call}>
                  <CallContent CallControls={null} />
                </StreamCall>
              </StreamVideo>
            </View>
          ) : (
            <>
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
            </>
          )}

          <View className="absolute right-4 top-4 items-center gap-1">
            <Image
              source={{ uri: user?.imageUrl || SELF_PREVIEW_URI }}
              className="h-28 w-20 rounded-2xl border-2 border-white"
              resizeMode="cover"
            />
            <View className="rounded-full bg-black/50 px-2 py-0.5">
              <Text className="font-poppins-medium text-caption text-white">
                {user?.firstName ?? "You"}
              </Text>
            </View>
          </View>

          {(status === "connecting" || status === "joining" || status === "reconnecting") && (
            <View className="absolute inset-0 items-center justify-center gap-3 bg-black/40">
              <ActivityIndicator color="#FFFFFF" size="large" />
              <Text className="font-poppins-medium text-body-md text-white">{statusMeta.label}</Text>
            </View>
          )}

          {status === "error" && (
            <View className="absolute inset-0 items-center justify-center gap-2 bg-black/60 px-8">
              <Ionicons name="alert-circle" size={32} color={colors.semantic.error} />
              <Text className="text-center font-poppins-semibold text-body-md text-white">
                Could not connect the call
              </Text>
              {errorMessage ? (
                <Text className="text-center body-small text-white">{errorMessage}</Text>
              ) : null}
            </View>
          )}

          {status === "ended" && (
            <View className="absolute inset-0 items-center justify-center bg-black/60">
              <Text className="font-poppins-semibold text-body-md text-white">Call ended</Text>
            </View>
          )}

          {practicePhrase && status === "joined" ? (
            <View className="absolute bottom-4 left-4 right-4 flex-row items-start justify-between gap-3 rounded-2xl bg-white p-4">
              <View className="flex-1 gap-1">
                <Text className="font-poppins-semibold text-body-lg text-text-primary">
                  {practicePhrase.text}
                </Text>
                {showCaptions ? (
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
              onPress={toggleCamera}
              disabled={!isConnected}
              activeOpacity={0.85}
              className={`h-14 w-14 items-center justify-center rounded-full border border-border bg-white ${
                isConnected ? "" : "opacity-40"
              }`}
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
              onPress={toggleMic}
              disabled={!isConnected}
              activeOpacity={0.85}
              className={`h-14 w-14 items-center justify-center rounded-full border border-border bg-white ${
                isConnected ? "" : "opacity-40"
              }`}
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
              onPress={() => setShowCaptions((value) => !value)}
              activeOpacity={0.85}
              className="h-14 w-14 items-center justify-center rounded-full border border-border bg-white"
            >
              <Ionicons
                name="musical-notes"
                size={22}
                color={showCaptions ? colors.primary.purple : colors.neutral.textSecondary}
              />
            </TouchableOpacity>
            <Text className="caption-text">Captions</Text>
          </View>

          <View className="items-center gap-2">
            <TouchableOpacity
              onPress={handleEndCall}
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

const styles = StyleSheet.create({
  practiceRoot: {
    flex: 1,
    backgroundColor: "#666463",
  },
  reelsRoot: {
    flex: 1,
    backgroundColor: "#000000",
  },
  reelsVideo: {
    bottom: 0,
    left: 0,
    position: "absolute",
    right: 0,
    top: 0,
  },
  practiceCard: {
    shadowColor: "#151515",
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.12,
    shadowRadius: 28,
    elevation: 10,
  },
  practiceSwitch: {
    transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }],
  },
});
