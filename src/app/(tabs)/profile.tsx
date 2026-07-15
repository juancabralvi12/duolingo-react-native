import { useClerk, useUser } from "@clerk/expo";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useLanguageStore } from "@/store/languageStore";

export default function Profile() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const clearSelectedLanguageCode = useLanguageStore((state) => state.clearSelectedLanguageCode);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <View className="flex-1 justify-center gap-4 px-6">
        <View className="gap-2">
          <Text className="heading-2 text-center">Profile</Text>
          <Text className="body-medium text-center text-text-secondary">
            Your profile settings are coming soon.
          </Text>
        </View>

        <View className="gap-3 rounded-2xl border border-border bg-surface p-4">
          <Text className="body-medium text-text-primary">
            Signed in as {user?.primaryEmailAddress?.emailAddress}
          </Text>
          <TouchableOpacity onPress={() => signOut()}>
            <Text className="font-poppins-semibold text-body-md text-primary-purple">
              Sign out
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={async () => {
            await AsyncStorage.clear();
            clearSelectedLanguageCode();
          }}
          className="items-center rounded-full bg-error px-6 py-4"
        >
          <Text className="font-poppins-semibold text-body-lg text-white">
            Clear Async Storage (Testing)
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
