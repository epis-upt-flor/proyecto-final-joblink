import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";

export default function LoginForm() {
  return (
    <div className="w-full lg:w-1/2 p-8">
      <div className="bg-slate-100 rounded-lg p-8">
        <h1 className="text-3xl font-bold text-blue-900 mb-8">WELCOME</h1>

        <div className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="username" className="block text-blue-900">
              Username
            </label>
            <Input id="username" type="text" className="w-full border-b-2 border-blue-900 bg-transparent focus:outline-none" />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="block text-blue-900">
              Password
            </label>
            <Input id="password" type="password" className="w-full border-b-2 border-blue-900 bg-transparent focus:outline-none" />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Checkbox id="remember" />
              <label htmlFor="remember" className="text-sm text-blue-900">
                Remember
              </label>
            </div>
            <a href="#" className="text-sm text-blue-900 hover:underline">
              Forgot Password?
            </a>
          </div>

          <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded">SUBMIT</Button>
        </div>
      </div>
    </div>
  );
}
