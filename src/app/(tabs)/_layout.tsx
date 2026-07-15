import { useAuth, useUser } from "@clerk/expo";
import { Redirect } from "expo-router";
import { Tabs } from "expo-router/tabs";
import { useEffect } from "react";
import { usePostHog } from "posthog-react-native";

import { CustomTabBar } from "@/components/CustomTabBar";
import { useLanguageStore } from "@/store/languageStore";

export default function TabsLayout() {
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();
  const { selectedLanguageCode, hasHydrated } = useLanguageStore();
  const posthog = usePostHog();

  useEffect(() => {
    if (user) {
      posthog.identify(user.id, {
        $set: {
          email: user.primaryEmailAddress?.emailAddress,
          name: user.fullName ?? undefined,
        },
      });
    }
  }, [user, posthog]);

  if (!isLoaded || !hasHydrated) {
    return null;
  }

  if (!isSignedIn) {
    return <Redirect href="/onboarding" />;
  }

  if (!selectedLanguageCode) {
    return <Redirect href="/language-selection" />;
  }

  return (
    <Tabs tabBar={(props) => <CustomTabBar {...props} />} screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="index" options={{ title: "Home" }} />
      <Tabs.Screen name="learn" options={{ title: "Learn" }} />
      <Tabs.Screen name="ai-teacher" options={{ title: "AI Teacher" }} />
      <Tabs.Screen name="chat" options={{ title: "Chat" }} />
      <Tabs.Screen name="profile" options={{ title: "Profile" }} />
    </Tabs>
  );
}
