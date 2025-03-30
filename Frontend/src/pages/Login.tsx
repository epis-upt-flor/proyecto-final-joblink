import AuthHeader from "@/components/auth/AuthHeader";
import AuthIllustration from "@/components/auth/AuthIllustration";
import LoginTabs from "@/components/auth/LoginTabs";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-muted flex items-center justify-center p-4">
      <div className="bg-background rounded-xl shadow-lg w-full max-w-6xl overflow-hidden">
        <AuthHeader />
        <div className="flex flex-col lg:flex-row">
          <div className="w-full lg:w-1/2 p-8">
            <LoginTabs />
          </div>
          <AuthIllustration />
        </div>
      </div>
    </div>
  );
}
