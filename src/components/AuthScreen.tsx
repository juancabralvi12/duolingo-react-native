import { useEffect, useState } from "react";
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
import { useSignIn, useSignUp, useSSO } from "@clerk/expo";
import { Href, router } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { usePostHog } from "posthog-react-native";

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

const navigateAfterAuth = ({ decorateUrl }: { decorateUrl: (url: string) => string }) => {
  router.replace(decorateUrl("/") as Href);
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
  const [formError, setFormError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const { signUp, errors: signUpErrors, fetchStatus: signUpFetchStatus } = useSignUp();
  const { signIn, errors: signInErrors, fetchStatus: signInFetchStatus } = useSignIn();
  const { startSSOFlow } = useSSO();
  const posthog = usePostHog();

  const showPassword = mode === "sign-up";
  const isSubmitting =
    mode === "sign-up" ? signUpFetchStatus === "fetching" : signInFetchStatus === "fetching";

  useEffect(() => {
    if (Platform.OS === "android") {
      void WebBrowser.warmUpAsync();
      return () => {
        void WebBrowser.coolDownAsync();
      };
    }
  }, []);

  const handleSubmit = async () => {
    setFormError(null);

    if (mode === "sign-up") {
      posthog.capture('sign_up_submitted', { method: 'email' });
      const { error } = await signUp.password({ emailAddress: email, password });
      if (error) {
        // Field-specific errors (email/password) are already surfaced inline via
        // signUpErrors.fields below; nothing generic to add here.
        return;
      }

      if (signUp.status === "complete") {
        await signUp.finalize({ navigate: navigateAfterAuth });
        return;
      }

      if (signUp.unverifiedFields.includes("email_address")) {
        const { error: codeError } = await signUp.verifications.sendEmailCode();
        if (codeError) {
          setFormError(codeError.longMessage ?? codeError.message);
          return;
        }
        setIsVerifying(true);
      }
      return;
    }

    posthog.capture('sign_in_submitted', { method: 'email' });
    const { error } = await signIn.emailCode.sendCode({ emailAddress: email });
    if (error) {
      // Field-specific errors (identifier) are already surfaced inline via
      // signInErrors.fields below; nothing generic to add here.
      return;
    }
    setIsVerifying(true);
  };

  const handleVerifyCode = async (code: string) => {
    if (mode === "sign-up") {
      const { error } = await signUp.verifications.verifyEmailCode({ code });
      if (error) {
        return { success: false, message: error.longMessage ?? error.message };
      }
      if (signUp.status === "complete") {
        posthog.capture('sign_up_completed', { method: 'email' });
        await signUp.finalize({ navigate: navigateAfterAuth });
      }
      return { success: true };
    }

    const { error } = await signIn.emailCode.verifyCode({ code });
    if (error) {
      return { success: false, message: error.longMessage ?? error.message };
    }
    if (signIn.status === "complete") {
      posthog.capture('sign_in_completed', { method: 'email' });
      await signIn.finalize({ navigate: navigateAfterAuth });
    }
    return { success: true };
  };

  const handleResendCode = async () => {
    if (mode === "sign-up") {
      await signUp.verifications.sendEmailCode();
    } else {
      await signIn.emailCode.sendCode();
    }
  };

  const handleSocialSignIn = async (strategy: "oauth_google") => {
    setFormError(null);
    posthog.capture('sso_sign_in_started', { strategy });
    try {
      const { createdSessionId, setActive } = await startSSOFlow({ strategy });
      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });
        router.replace("/");
      }
    } catch (err) {
      console.error("SSO error:", JSON.stringify(err, null, 2));
      posthog.captureException(err instanceof Error ? err : new Error(String(err)), {
        context: 'sso_sign_in',
        strategy,
      });
      setFormError("Something went wrong with social sign-in. Please try again.");
    }
  };

  const emailError =
    mode === "sign-up" ? signUpErrors.fields.emailAddress?.message : signInErrors.fields.identifier?.message;
  const passwordError = mode === "sign-up" ? signUpErrors.fields.password?.message : undefined;

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
              error={emailError}
            />
            {showPassword && (
              <AuthInput
                label="Password"
                placeholder="••••••••"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                error={passwordError}
              />
            )}
          </View>

          {formError && (
            <Text className="text-center font-poppins text-body-sm text-error">{formError}</Text>
          )}

          {mode === "sign-up" && <View nativeID="clerk-captcha" />}

          <PrimaryButton label={submitLabel} onPress={handleSubmit} disabled={isSubmitting} />

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
              onPress={() => handleSocialSignIn("oauth_google")}
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
        onVerify={handleVerifyCode}
        onResend={handleResendCode}
      />
    </SafeAreaView>
  );
}
