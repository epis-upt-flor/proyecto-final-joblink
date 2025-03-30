import loginSvg from "@/assets/login.svg";

export default function AuthIllustration() {
  return (
    <div className="w-full lg:w-1/2 p-8 flex items-center justify-center">
      <img
        src={loginSvg}
        alt="Ilustración de login"
        className="max-w-full h-auto object-contain rounded-xl shadow-md"
      />
    </div>
  );
}
