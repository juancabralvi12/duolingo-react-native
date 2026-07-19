import { Ionicons } from "@expo/vector-icons";
import type { BottomTabBarProps } from "expo-router/tabs";
import type { ComponentProps } from "react";
import { useEffect, useRef, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

import { colors } from "@/theme";

type IoniconName = ComponentProps<typeof Ionicons>["name"];

type TabConfig = {
  label: string;
  activeIcon: IoniconName;
  inactiveIcon: IoniconName;
};

const TAB_CONFIG: Record<string, TabConfig> = {
  index: { label: "Home", activeIcon: "home", inactiveIcon: "home-outline" },
  learn: { label: "Learn", activeIcon: "book", inactiveIcon: "book-outline" },
  "ai-teacher": {
    label: "Coach",
    activeIcon: "mic",
    inactiveIcon: "mic-outline",
  },
  chat: { label: "Chat", activeIcon: "chatbubble", inactiveIcon: "chatbubble-outline" },
  profile: { label: "Profile", activeIcon: "person", inactiveIcon: "person-outline" },
};

const BAR_HEIGHT = 64;
const CIRCLE_SIZE = 48;

export function CustomTabBar({ state, navigation, insets }: BottomTabBarProps) {
  const [tabWidth, setTabWidth] = useState(0);
  const translateX = useSharedValue(0);
  const hasMeasured = useRef(false);

  useEffect(() => {
    if (tabWidth === 0) return;

    if (!hasMeasured.current) {
      hasMeasured.current = true;
      translateX.value = state.index * tabWidth;
      return;
    }

    translateX.value = withTiming(state.index * tabWidth, { duration: 250 });
  }, [state.index, tabWidth, translateX]);

  const circleStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <View
      className="flex-row border-t border-border bg-background"
      style={{ paddingBottom: insets.bottom }}
      onLayout={(event) => setTabWidth(event.nativeEvent.layout.width / state.routes.length)}
    >
      {tabWidth > 0 && (
        <Animated.View
          pointerEvents="none"
          style={[
            {
              position: "absolute",
              top: 0,
              height: BAR_HEIGHT,
              width: tabWidth,
              alignItems: "center",
              justifyContent: "center",
            },
            circleStyle,
          ]}
        >
          <View
            className="rounded-full bg-primary-purple"
            style={{ width: CIRCLE_SIZE, height: CIRCLE_SIZE }}
          />
        </Animated.View>
      )}

      {state.routes.map((route, index) => {
        const config = TAB_CONFIG[route.name];
        if (!config) return null;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <TouchableOpacity
            key={route.key}
            onPress={onPress}
            activeOpacity={0.8}
            className="flex-1 items-center justify-center"
            style={{ height: BAR_HEIGHT }}
          >
            <Ionicons
              name={isFocused ? config.activeIcon : config.inactiveIcon}
              size={22}
              color={isFocused ? "#FFFFFF" : colors.neutral.textSecondary}
            />
            {!isFocused && <Text className="caption-text mt-1">{config.label}</Text>}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
