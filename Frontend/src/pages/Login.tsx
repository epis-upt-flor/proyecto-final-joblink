import AuthHeader from "@/components/auth/AuthHeader";
import LoginForm from "@/components/auth/LoginForm";
import AuthIllustration from "@/components/auth/AuthIllustration";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-6xl overflow-hidden">
        <AuthHeader />
        <div className="flex flex-col lg:flex-row">
          <LoginForm />
          <AuthIllustration />
        </div>
      </div>
    </div>
  );
}
