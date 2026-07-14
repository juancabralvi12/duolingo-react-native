import { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Href, router } from "expo-router";

import { AuthInput } from "@/components/AuthInput";
import { PrimaryButton } from "@/components/PrimaryButton";
import { SocialButton } from "@/components/SocialButton";
import { VerificationModal } from "@/components/VerificationModal";
import { images } from "@/constants/images";
import { colors } from "@/theme";

type AuthScreenProps = {
  mode: "sign-up" | "sign-in";
  title: string;
  subtitle: string;
  submitLabel: string;
  footerText: string;
  footerLinkText: string;
  footerLinkHref: Href;
};

export function AuthScreen({
  mode,
  title,
  subtitle,
  submitLabel,
  footerText,
  footerLinkText,
  footerLinkHref,
}: AuthScreenProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  const showPassword = mode === "sign-up";

  const handleSubmit = () => setIsVerifying(true);

  const handleVerified = () => {
    setIsVerifying(false);
    router.replace("/");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerClassName="flex-grow gap-5 px-6 pb-6"
          keyboardShouldPersistTaps="handled"
        >
          <TouchableOpacity
            onPress={() => router.back()}
            hitSlop={8}
            className="-ml-2 h-11 w-11 items-center justify-center self-start"
          >
            <Ionicons name="chevron-back" size={26} color={colors.neutral.textPrimary} />
          </TouchableOpacity>

          <View className="gap-2">
            <Text className="heading-1">{title}</Text>
            <Text className="body-medium text-text-secondary">{subtitle}</Text>
          </View>

          <View className="items-center justify-center py-2">
            <View className="relative items-center justify-center">
              <Ionicons
                name="sparkles"
                size={18}
                color={colors.semantic.warning}
                style={{ position: "absolute", left: -12, top: 0 }}
              />
              <Ionicons
                name="sparkles"
                size={16}
                color={colors.primary.blue}
                style={{ position: "absolute", right: -16, top: 36 }}
              />
              <Ionicons
                name="sparkles"
                size={14}
                color={colors.semantic.warning}
                style={{ position: "absolute", right: 8, bottom: 4 }}
              />
              <Image
                source={images.mascotAuth}
                className="h-40 w-40"
                style={{ width: 160, height: 160 }}
                resizeMode="contain"
              />
            </View>
          </View>

          <View className="gap-4">
            <AuthInput
              label="Email"
              placeholder="alex@gmail.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
            {showPassword && (
              <AuthInput
                label="Password"
                placeholder="••••••••"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            )}
          </View>

          <PrimaryButton label={submitLabel} onPress={handleSubmit} />

          <View className="flex-row items-center gap-3">
            <View className="h-px flex-1 bg-border" />
            <Text className="caption-text">or continue with</Text>
            <View className="h-px flex-1 bg-border" />
          </View>

          <View className="gap-3">
            <SocialButton
              label="Continue with Google"
              iconName="logo-google"
              iconColor={colors.neutral.textPrimary}
            />
            <SocialButton
              label="Continue with Facebook"
              iconName="logo-facebook"
              iconColor="#1877F2"
            />
            <SocialButton
              label="Continue with Apple"
              iconName="logo-apple"
              iconColor="#000000"
            />
          </View>

          <View className="flex-1 items-center justify-end pt-4">
            <Text className="body-medium text-text-secondary">
              {footerText}{" "}
              <Text
                onPress={() => router.push(footerLinkHref)}
                className="font-poppins-semibold text-primary-purple"
              >
                {footerLinkText}
              </Text>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <VerificationModal
        visible={isVerifying}
        email={email}
        onClose={() => setIsVerifying(false)}
        onComplete={handleVerified}
      />
    </SafeAreaView>
  );
}
