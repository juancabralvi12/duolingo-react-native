import { useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { colors } from "@/theme";

const CODE_LENGTH = 6;

type VerificationModalProps = {
  visible: boolean;
  email: string;
  onClose: () => void;
  onComplete: () => void;
};

export function VerificationModal({
  visible,
  email,
  onClose,
  onComplete,
}: VerificationModalProps) {
  const [code, setCode] = useState("");
  const inputRef = useRef<TextInput>(null);

  const handleShow = () => {
    setCode("");
    inputRef.current?.focus();
  };

  const handleChangeCode = (text: string) => {
    const digitsOnly = text.replace(/[^0-9]/g, "").slice(0, CODE_LENGTH);
    setCode(digitsOnly);
    if (digitsOnly.length === CODE_LENGTH) {
      onComplete();
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      onShow={handleShow}
    >
      <View className="flex-1 bg-black/50">
        <Pressable className="absolute inset-0" onPress={onClose} />
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={{ flex: 1, justifyContent: "flex-end" }}
          pointerEvents="box-none"
        >
          <View className="gap-5 rounded-t-3xl bg-white px-6 pb-10 pt-6">
            <View className="flex-row items-start justify-between">
              <View className="flex-1 gap-2 pr-4">
                <Text className="heading-3">Check your email</Text>
                <Text className="body-medium text-text-secondary">
                  We sent a 6-digit code to{" "}
                  <Text className="font-poppins-semibold text-text-primary">
                    {email || "your email"}
                  </Text>
                  . Enter it below to continue.
                </Text>
              </View>
              <Pressable onPress={onClose} hitSlop={8}>
                <Ionicons name="close" size={24} color={colors.neutral.textSecondary} />
              </Pressable>
            </View>

            <Pressable
              onPress={() => inputRef.current?.focus()}
              className="relative flex-row justify-center gap-2"
            >
              {Array.from({ length: CODE_LENGTH }).map((_, index) => (
                <View
                  key={index}
                  className={`h-14 w-11 items-center justify-center rounded-xl border bg-surface ${
                    index === code.length ? "border-primary-purple" : "border-border"
                  }`}
                >
                  <Text className="font-poppins-semibold text-h3 text-text-primary">
                    {code[index] ?? ""}
                  </Text>
                </View>
              ))}
              <TextInput
                ref={inputRef}
                value={code}
                onChangeText={handleChangeCode}
                keyboardType="number-pad"
                maxLength={CODE_LENGTH}
                className="absolute inset-0 opacity-0"
              />
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}
