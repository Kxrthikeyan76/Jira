// app/login/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  FaMicrosoft,
  FaEye,
  FaEyeSlash,
  FaLock,
  FaEnvelope,
  FaKey,
  FaInfoCircle
} from "react-icons/fa";
import { Button, Input, Card, Heading, Text } from "@/components/ui";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPasswordInfo, setShowPasswordInfo] = useState(false);
  const router = useRouter();

  // Static default password for all new users
  const DEFAULT_PASSWORD = "Welcome@123";

  useEffect(() => {
    // Check if user is already logged in
    const userData = sessionStorage.getItem('currentUser');
    if (userData) {
      router.push('/dashboard');
    }
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Simple validation
    if (!email || !password) {
      setError("Please enter both email and password");
      setLoading(false);
      return;
    }

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // For demo: Check if it's a default demo user
      let userRole = "user";
      let userName = "";
      let isDefaultUser = false;

      // Default demo users (for testing without creating users)
      const defaultUsers = [
        { email: "admin@trackflow.com", password: DEFAULT_PASSWORD, role: "admin", name: "Admin User" },
        { email: "manager@trackflow.com", password: DEFAULT_PASSWORD, role: "manager", name: "Manager User" },
        { email: "user@trackflow.com", password: DEFAULT_PASSWORD, role: "user", name: "Regular User" },
        { email: "viewer@trackflow.com", password: DEFAULT_PASSWORD, role: "viewer", name: "Viewer User" },
      ];

      // Check default users first
      const defaultUser = defaultUsers.find(u => 
        u.email.toLowerCase() === email.toLowerCase() && 
        u.password === password
      );

      if (defaultUser) {
        userRole = defaultUser.role;
        userName = defaultUser.name;
        isDefaultUser = true;
      } else {
        // Check users created by admin (from localStorage)
        const savedUsers = localStorage.getItem('users');
        const users = savedUsers ? JSON.parse(savedUsers) : [];
        
        // Find user by email
        const user = users.find((u: any) => u.email.toLowerCase() === email.toLowerCase());
        
        if (!user) {
          setError("User not found. Please check your email or contact your administrator.");
          setLoading(false);
          return;
        }

        // Check if password matches the default password
        if (password !== DEFAULT_PASSWORD) {
          setError("Invalid password. New users should use the default password: Welcome@123");
          setLoading(false);
          return;
        }

        // Check if this is user's first login
        if (user.status === "pending") {
          // Prompt user to change password on first login
          const changePassword = window.confirm(
            `Welcome ${user.name}!\n\nThis is your first login.\n\nWould you like to set a new password now?`
          );
          
          if (changePassword) {
            let newPassword = "";
            let confirmPassword = "";
            
            // Loop until valid password is entered or user cancels
            while (true) {
              newPassword = prompt("Enter your new password (min. 8 characters):") || "";
              
              if (!newPassword) {
                alert("Password change cancelled. Please use the default password for now.");
                setLoading(false);
                return;
              }
              
              if (newPassword.length < 8) {
                alert("Password must be at least 8 characters long.");
                continue;
              }
              
              confirmPassword = prompt("Confirm your new password:") || "";
              
              if (newPassword !== confirmPassword) {
                alert("Passwords do not match. Please try again.");
                continue;
              }
              
              break;
            }
            
            // Update user status (in real app, you'd update the password hash)
            const updatedUsers = users.map((u: any) => 
              u.id === user.id ? { ...u, status: "active" } : u
            );
            localStorage.setItem('users', JSON.stringify(updatedUsers));
            
            alert("Password updated successfully! Please login with your new password.");
            setLoading(false);
            return;
          }
        }

        userRole = user.role;
        userName = user.name;
      }

      // Get permissions based on role
      const permissions = getPermissionsByRole(userRole);

      // Create user object
      const userData = {
        id: Date.now(),
        name: userName,
        email: email,
        role: userRole,
        permissions: permissions,
        isDefaultUser: isDefaultUser
      };

      // Store user data
      sessionStorage.setItem("currentUser", JSON.stringify(userData));
      localStorage.setItem("currentUserEmail", email);

      // Set auth cookie
      document.cookie = `auth-token=mock-jwt-token-${userRole}; path=/; max-age=86400`;

      // Show welcome message
      if (!isDefaultUser) {
        alert(`Welcome back, ${userName}!`);
      }

      // Redirect to dashboard
      router.push("/dashboard");
      router.refresh();

    } catch (err) {
      setError("An error occurred during login");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  const getPermissionsByRole = (role: string): string[] => {
    switch(role) {
      case 'admin':
        return ['view:dashboard', 'view:users', 'create:users', 'edit:users', 'delete:users', 
                'view:projects', 'create:projects', 'edit:projects', 'delete:projects',
                'view:reports', 'manage:settings'];
      case 'manager':
        return ['view:dashboard', 'view:users', 'create:users', 'edit:users',
                'view:projects', 'create:projects', 'edit:projects', 'view:reports'];
      case 'user':
        return ['view:dashboard', 'view:users', 'view:projects', 'create:tasks'];
      case 'viewer':
        return ['view:dashboard', 'view:users', 'view:projects'];
      default:
        return [];
    }
  };

  const handleMicrosoftLogin = () => {
    setLoading(true);
    setError("");
    
    // Simulate Microsoft login process
    setTimeout(() => {
      // For Microsoft login, create a generic user
      const microsoftUser = {
        id: Date.now(),
        name: "Microsoft User",
        email: "user@microsoft.com",
        role: "user",
        permissions: getPermissionsByRole("user"),
        isDefaultUser: false
      };

      // Store user data
      sessionStorage.setItem("currentUser", JSON.stringify(microsoftUser));
      localStorage.setItem("currentUserEmail", "user@microsoft.com");

      // Set auth cookie
      document.cookie = `auth-token=mock-microsoft-token; path=/; max-age=86400`;

      // Redirect to dashboard
      router.push("/dashboard");
      router.refresh();
    }, 1000);
  };

  const fillDemoCredentials = (role: string) => {
    switch(role) {
      case 'admin':
        setEmail("admin@trackflow.com");
        setPassword(DEFAULT_PASSWORD);
        setError("");
        break;
      case 'manager':
        setEmail("manager@trackflow.com");
        setPassword(DEFAULT_PASSWORD);
        setError("");
        break;
      case 'user':
        setEmail("user@trackflow.com");
        setPassword(DEFAULT_PASSWORD);
        setError("");
        break;
      case 'viewer':
        setEmail("viewer@trackflow.com");
        setPassword(DEFAULT_PASSWORD);
        setError("");
        break;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center mx-auto mb-4 shadow-lg">
  <span className="text-2xl font-bold text-white">TF</span>
</div>
          <Heading level={1} className="text-gray-800 mb-2">
            Welcome to TrackFlow
          </Heading>
          <Text variant="muted">
            Secure login to your workspace
          </Text>
        </div>

        {/* Microsoft Login Button */}
        <Card className="p-6 mb-6 border-0 shadow-lg">
          <Button
            onClick={handleMicrosoftLogin}
            variant="outline"
            size="lg"
            className="w-full mb-6 border-2 hover:bg-gray-50"
            disabled={loading}
          >
            <span className="flex items-center justify-center gap-3">
              <FaMicrosoft className="text-xl text-blue-600" />
              Sign in with Microsoft
            </span>
          </Button>
          
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">Or sign in with email</span>
            </div>
          </div>

          

          {/* Password Info Panel */}
          {showPasswordInfo && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-3">
                <FaKey className="text-blue-600 mt-0.5" />
                <div>
                  <Text size="sm" className="font-medium text-blue-800">
                    Password Information
                  </Text>
                  <Text size="xs" className="text-blue-700 mt-1">
                    All new users are created with the default password:{" "}
                    <code className="bg-white px-2 py-1 rounded border font-mono">Welcome@123</code>
                  </Text>
                  <Text size="xs" className="text-blue-700 mt-2">
                    On first login, users will be prompted to change their password for security.
                  </Text>
                </div>
              </div>
            </div>
          )}

          {/* Email/Password Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10" />
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full pl-10"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-sm text-blue-600 hover:text-blue-500 flex items-center gap-1"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                  <span>{showPassword ? "Hide" : "Show"}</span>
                </button>
              </div>
              <div className="relative">
                <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10" />
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-10"
                  required
                  disabled={loading}
                />
              </div>
              <Text size="xs" variant="muted" className="mt-2">
                New users: Use default password <code className="bg-gray-100 px-1 rounded">Welcome@123</code>
              </Text>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <Text size="sm" className="text-red-600 text-center">
                  {error}
                </Text>
              </div>
            )}

            {/* Login Button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-2"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Signing in...
                </span>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          {/* Forgot Password & Sign Up */}
          <div className="mt-6 text-center space-y-3">
            <button
              type="button"
              onClick={() => {
                const email = prompt("Enter your email to reset password:");
                if (email) {
                  alert(`Password reset link has been sent to ${email}\n\nFor demo: Use default password "Welcome@123"`);
                }
              }}
              className="text-sm text-blue-600 hover:text-blue-500 hover:underline block mx-auto"
            >
              Forgot your password?
            </button>
            <div>
              <Text size="sm" className="text-gray-600">
                Need an account?{" "}
                <button
                  type="button"
                  onClick={() => {
                    alert("Please contact your administrator to create a new account.\n\nFor demo: Use the quick login buttons above.");
                  }}
                  className="font-medium text-blue-600 hover:text-blue-500 hover:underline"
                >
                  Request Access
                </button>
              </Text>
            </div>
          </div>
        </Card>

        {/* Security Notice */}
        <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <Text size="xs" className="text-gray-600 text-center">
            <strong>Security Note:</strong> Admin creates users with email only. 
            All new users receive the default password and must change it on first login.
          </Text>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <Text size="sm" variant="muted">
            © {new Date().getFullYear()} TrackFlow. All rights reserved.
          </Text>
          <Text size="xs" variant="muted" className="mt-1">
            Version 2.0 • Enhanced Security
          </Text>
        </div>
      </div>
    </div>
  );
}