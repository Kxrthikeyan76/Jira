"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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
        console.log("Jira login successful:", { email, rememberMe });
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
    <div className="min-h-screen flex items-center justify-center bg-[#F5F5F5] p-4">
      
    
      <div className="w-full max-w-[400px]">
        
       
        <div className="text-center mb-10">
          <div className="flex items-center justify-center mb-6">
            <div>
              <span className="text-3xl font-bold text-gray-900 tracking-tight">
                Trackflow
              </span>
            </div>
          </div>

          <h1 className="text-2xl font-semibold text-gray-900 mb-3">
            Log in to Trackflow
          </h1>
          <p className="text-sm text-gray-600">
            Enter your details to access your projects and issues
          </p>
        </div>

        
        <div className="bg-white rounded-lg shadow-sm border border-gray-300 p-8">
          
         
          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
              ⚠️ {error}
            </div>
          )}

          
          <button
            onClick={handleMicrosoftLogin}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 border border-gray-300 rounded-md py-3 px-4 hover:bg-gray-50 transition-all duration-200 mb-6 disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.99]"
          >
            <svg className="w-5 h-5" viewBox="0 0 23 23" fill="none">
              <path d="M11.5 1L1 5.5V11.5H11.5V1Z" fill="#F1511B" />
              <path d="M22 5.5L11.5 1V11.5H22V5.5Z" fill="#80CC28" />
              <path d="M1 11.5V17.5L11.5 22V11.5H1Z" fill="#00ADEF" />
              <path d="M11.5 22L22 17.5V11.5H11.5V22Z" fill="#FBBC09" />
            </svg>
            <span className="text-sm font-medium text-gray-700">
              {isLoading ? "Connecting..." : "Continue with Microsoft"}
            </span>
          </button>

          
          <div className="relative mb-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          
          <form onSubmit={handleEmailLogin} className="space-y-5">
            
           
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="w-full px-3 py-2.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-sm disabled:bg-gray-100"
                required
                disabled={isLoading}
              />
            </div>

            
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <button
                  type="button"
                  className="text-sm text-blue-600 hover:text-blue-800 hover:underline focus:outline-none"
                  onClick={() => console.log("Forgot password clicked")}
                >
                  Forgot password?
                </button>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-3 py-2.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-sm disabled:bg-gray-100"
                required
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

            
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-2.5 rounded text-sm font-medium transition-all duration-200 ${
                isLoading
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-[#0052CC] hover:bg-[#0041A8] active:bg-[#00307D]"
              } text-white shadow-sm hover:shadow disabled:shadow-none`}
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
            </button>
          </form>

          
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-center text-sm text-gray-600">
              New to Trackflow?{" "}
              <button
                onClick={() => console.log("Sign up clicked")}
                className="text-blue-600 hover:text-blue-800 font-medium hover:underline focus:outline-none"
              >
                Create an account
              </button>
            </p>
          </div>
        </div>

        
        <div className="mt-8 text-center">
          <div className="flex flex-wrap justify-center gap-4 mb-4">
            <a href="#" className="text-xs text-gray-500 hover:text-gray-700 hover:underline">
              Privacy policy
            </a>
            <a href="#" className="text-xs text-gray-500 hover:text-gray-700 hover:underline">
              User notice
            </a>
            <a href="#" className="text-xs text-gray-500 hover:text-gray-700 hover:underline">
              Terms
            </a>
            <a href="#" className="text-xs text-gray-500 hover:text-gray-700 hover:underline">
              Cookies
            </a>
            <a href="#" className="text-xs text-gray-500 hover:text-gray-700 hover:underline">
              Help
            </a>
          </div>
          
          
          <p className="text-xs text-gray-400">
            This site is protected by reCAPTCHA and the Google{" "}
            <a href="#" className="text-blue-600 hover:underline">
              Privacy Policy
            </a>{" "}
            and{" "}
            <a href="#" className="text-blue-600 hover:underline">
              Terms of Service
            </a>{" "}
            apply.
          </p>
          
          <p className="text-xs text-gray-400 mt-2">
            © {new Date().getFullYear()} Atlassian. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}