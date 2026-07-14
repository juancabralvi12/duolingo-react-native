import { AuthScreen } from "@/components/AuthScreen";

export default function SignUp() {
  return (
    <AuthScreen
      mode="sign-up"
      title="Create your account"
      subtitle="Start your language journey today ✨"
      submitLabel="Sign Up"
      footerText="Already have an account?"
      footerLinkText="Log in"
      footerLinkHref="/sign-in"
    />
  );
}
