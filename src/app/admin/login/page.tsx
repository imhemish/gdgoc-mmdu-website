"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle, Eye, EyeOff, XCircle } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const ErrorAlert = ({
  message,
  onClose,
}: {
  message: string;
  onClose: () => void;
}) => (
  <div className="bg-red-900/50 border border-red-500 rounded-lg p-4 mb-6 relative">
    <div className="flex items-start gap-3">
      <XCircle className="h-5 w-5 text-red-500 mt-0.5" />
      <div className="flex-1 text-sm text-red-200">{message}</div>
      <button
        onClick={onClose}
        className="text-red-300 hover:text-red-100 transition-colors"
      >
        <XCircle className="h-5 w-5" />
      </button>
    </div>
  </div>
);

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await axios.post("/api/user/login", {
        email,
        password,
      });

      if (response.data.success) {
        toast.success("Login successful", {
          duration: 3000,
          icon: <CheckCircle size={20} />,
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        });
        router.push("/admin");
      } else {
        setError(response.data.message || "Login failed. Please try again.");
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.message ||
            err.message ||
            "An error occurred during login. Please try again."
        );
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo Section */}
        <div className="flex justify-center mb-8">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/images/logo.png"
              alt="GDG Logo"
              width={50}
              height={50}
            />
            <div className="text-sm">
              <div className="font-bold text-white text-md">
                Google Developer Groups
              </div>
              <div className="text-gray-400 text-xs">
                Maharishi Markendeshwar University
              </div>
            </div>
          </Link>
        </div>

        {/* Login Form */}
        <div className="bg-neutral-900 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            Welcome Back
          </h2>

          {error && <ErrorAlert message={error} onClose={() => setError("")} />}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 bg-black border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                placeholder="Enter your email"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 bg-black border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                  placeholder="Enter your password"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-700 bg-black text-gray-600 focus:ring-gray-500"
                  disabled={isLoading}
                />
                <label
                  htmlFor="remember"
                  className="ml-2 text-sm text-gray-300"
                >
                  Remember me
                </label>
              </div>
              <Link
                href="/forgot-password"
                className={`text-sm text-gray-300 hover:text-white ${
                  isLoading ? "pointer-events-none" : ""
                }`}
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-2 px-4 rounded-full transition-colors ${
                isLoading
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-gray-200 hover:bg-gray-300 text-black"
              }`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5 text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Logging in...
                </span>
              ) : (
                "Log in"
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-400">
            Admin Panel is restricted to GDG Members.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
