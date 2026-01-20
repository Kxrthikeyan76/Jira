"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  Heading,
  Text,
  Card,
  Input,
  Container
} from "@/components/ui";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    setTimeout(() => {
      if (email && password) {
        console.log("Login successful:", { email, rememberMe });
        router.push("/dashboard"); 
      } else {
        setError("Please enter both email and password");
      }
      setIsLoading(false);
    }, 1500);
  };

  const handleMicrosoftLogin = () => {
    setIsLoading(true);
    setError("");
    
    setTimeout(() => {
      console.log("Microsoft SSO initiated");
      router.push("/dashboard"); 
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Container size="sm">
        
        <div className="text-center mb-10">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg mb-4">
              <span className="text-3xl font-bold text-white">T</span>
            </div>
          </div>

          <Heading level={1} className="text-gray-900 mb-3">
            Log in to Trackflow
          </Heading>
          <Text variant="muted" className="text-center">
            Enter your details to access your projects and issues
          </Text>
        </div>

       
        <Card className="p-8">
          
          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
              ⚠️ {error}
            </div>
          )}

          
          <Button
            onClick={handleMicrosoftLogin}
            disabled={isLoading}
            variant="secondary"
            size="lg"
            fullWidth
            leftIcon={
              <svg className="w-5 h-5" viewBox="0 0 23 23" fill="none">
                <path d="M11.5 1L1 5.5V11.5H11.5V1Z" fill="#F1511B" />
                <path d="M22 5.5L11.5 1V11.5H22V5.5Z" fill="#80CC28" />
                <path d="M1 11.5V17.5L11.5 22V11.5H1Z" fill="#00ADEF" />
                <path d="M11.5 22L22 17.5V11.5H11.5V22Z" fill="#FBBC09" />
              </svg>
            }
            className="mb-6"
          >
            {isLoading ? "Connecting..." : "Continue with Microsoft"}
          </Button>

         
          <div className="relative mb-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center">
              <Text variant="muted" size="sm" className="bg-white px-3">
                Or continue with
              </Text>
            </div>
          </div>

         
          <form onSubmit={handleEmailLogin} className="space-y-5">
            <div>
              <Text size="sm" className="font-medium text-gray-700 mb-2">
                Email address
              </Text>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                disabled={isLoading}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Text size="sm" className="font-medium text-gray-700">
                  Password
                </Text>
                <button
                  type="button"
                  className="text-sm text-blue-600 hover:text-blue-800 hover:underline focus:outline-none"
                  onClick={() => console.log("Forgot password clicked")}
                >
                  Forgot password?
                </button>
              </div>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                disabled={isLoading}
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="remember-me"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 focus:ring-offset-0"
                disabled={isLoading}
              />
              <label htmlFor="remember-me" className="ml-2 text-sm text-gray-700">
                Remember me
              </label>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              variant="primary"
              size="lg"
              fullWidth
              className="mt-4"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin h-4 w-4 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </div>
              ) : (
                "Sign in to Trackflow"
              )}
            </Button>
          </form>

         
          <div className="mt-8 pt-6 border-t border-gray-200">
            <Text size="sm" className="text-center text-gray-600">
              New to Trackflow?{" "}
              <button
                onClick={() => console.log("Sign up clicked")}
                className="text-blue-600 hover:text-blue-800 font-medium hover:underline focus:outline-none"
              >
                Create an account
              </button>
            </Text>
          </div>
        </Card>

        
        <div className="mt-8 text-center">
          <div className="flex flex-wrap justify-center gap-4 mb-4">
            {["Privacy policy", "User notice", "Terms", "Cookies", "Help"].map((item) => (
              <button
                key={item}
                onClick={() => console.log(`${item} clicked`)}
                className="text-xs text-gray-500 hover:text-gray-700 hover:underline"
              >
                {item}
              </button>
            ))}
          </div>
          
        
          <Text size="xs" variant="muted" className="mb-2">
            This site is protected by reCAPTCHA and the Google{" "}
            <button
              onClick={() => console.log("Privacy Policy clicked")}
              className="text-blue-600 hover:underline"
            >
              Privacy Policy
            </button>{" "}
            and{" "}
            <button
              onClick={() => console.log("Terms of Service clicked")}
              className="text-blue-600 hover:underline"
            >
              Terms of Service
            </button>{" "}
            apply.
          </Text>
          
          <Text size="xs" variant="muted">
            © {new Date().getFullYear()} Trackflow. All rights reserved.
          </Text>
        </div>
      </Container>
    </div>
  );
}