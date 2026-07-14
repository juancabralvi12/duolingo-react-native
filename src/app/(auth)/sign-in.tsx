import { AuthScreen } from "@/components/AuthScreen";

export default function SignIn() {
  return (
    <AuthScreen
      mode="sign-in"
      title="Welcome back"
      subtitle="Continue your language journey ✨"
      submitLabel="Log in"
      footerText="Don't have an account?"
      footerLinkText="Sign up"
      footerLinkHref="/sign-up"
    />
  );
}
