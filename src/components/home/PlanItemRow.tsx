import { Ionicons } from "@expo/vector-icons";
import type { ComponentProps } from "react";
import { Text, View } from "react-native";

type PlanItemRowProps = {
  icon: ComponentProps<typeof Ionicons>["name"];
  iconBackgroundClassName: string;
  title: string;
  subtitle: string;
  completed: boolean;
};

export function PlanItemRow({
  icon,
  iconBackgroundClassName,
  title,
  subtitle,
  completed,
}: PlanItemRowProps) {
  return (
    <View className="flex-row items-center gap-3">
      <View
        className={`h-12 w-12 items-center justify-center rounded-2xl ${iconBackgroundClassName}`}
      >
        <Ionicons name={icon} size={22} color="#FFFFFF" />
      </View>

      <View className="flex-1 gap-0.5">
        <Text className="font-poppins-semibold text-body-md text-text-primary" numberOfLines={1}>
          {title}
        </Text>
        <Text className="body-small" numberOfLines={1}>
          {subtitle}
        </Text>
      </View>

      {completed ? (
        <View className="h-7 w-7 items-center justify-center rounded-full bg-primary-purple">
          <Ionicons name="checkmark" size={16} color="#FFFFFF" />
        </View>
      ) : (
        <View className="h-7 w-7 rounded-full border-2 border-border" />
      )}
    </View>
  );
}
