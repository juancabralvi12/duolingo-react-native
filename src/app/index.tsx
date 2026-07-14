import { ScrollView, Text, View } from "react-native";

const SWATCHES: { label: string; className: string }[] = [
  { label: "primary.purple", className: "bg-primary-purple" },
  { label: "primary.deep-purple", className: "bg-primary-deep-purple" },
  { label: "primary.blue", className: "bg-primary-blue" },
  { label: "primary.green", className: "bg-primary-green" },
  { label: "success", className: "bg-success" },
  { label: "warning", className: "bg-warning" },
  { label: "streak", className: "bg-streak" },
  { label: "error", className: "bg-error" },
  { label: "info", className: "bg-info" },
];

export default function Index() {
  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName="gap-6 px-6 py-16"
    >
      <View className="gap-2">
        <Text className="heading-1">Design System</Text>
        <Text className="body-medium text-text-secondary">
          Lingua tokens, typography, and utilities.
        </Text>
      </View>

      <View className="gap-3">
        <Text className="heading-3">Colors</Text>
        <View className="flex-row flex-wrap gap-3">
          {SWATCHES.map((swatch) => (
            <View key={swatch.label} className="w-24 gap-1">
              <View
                className={`h-16 w-16 rounded-2xl border border-border ${swatch.className}`}
              />
              <Text className="caption-text">{swatch.label}</Text>
            </View>
          ))}
        </View>
      </View>

      <View className="gap-2 rounded-2xl border border-border bg-surface p-4">
        <Text className="heading-3">Typography</Text>
        <Text className="heading-1">Heading 1</Text>
        <Text className="heading-2">Heading 2</Text>
        <Text className="heading-3">Heading 3</Text>
        <Text className="heading-4">Heading 4</Text>
        <Text className="body-large">Body Large - important content</Text>
        <Text className="body-medium">Body Medium - body text</Text>
        <Text className="body-small">Body Small - supporting text</Text>
        <Text className="caption-text">Caption - labels, meta text</Text>
      </View>
    </ScrollView>
  );
}
