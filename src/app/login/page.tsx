"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  BookOpen,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { ensureJwtToken } from "@/lib/api-client";
import { toast } from "@/components/ui/toast";

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    document.title = "BookNook | Login";
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim() || !password.trim()) {
      const msg = "Please enter both your email and password.";
      setErrorMessage(msg);
      toast.add({
        title: "Missing Fields",
        description: msg,
        type: "error",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await authClient.signIn.email({
        email: email.trim(),
        password: password,
        callbackURL: callbackUrl,
      });

      if (error) {
        const msg =
          error.message || "Invalid email or password. Please try again.";
        setErrorMessage(msg);
        toast.add({
          title: "Login Failed",
          description: msg,
          type: "error",
        });
      } else {
        await ensureJwtToken(email.trim());
        toast.add({
          title: "Login Successful!",
          description: "Welcome back to BookNook.",
          type: "success",
        });
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "An unexpected error occurred.";
      setErrorMessage(msg);
      toast.add({
        title: "Login Error",
        description: msg,
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const { error } = await authClient.signIn.social({
        provider: "google",
        callbackURL: callbackUrl,
      });

      if (error) {
        const msg = error.message || "Google authentication failed.";
        setErrorMessage(msg);
        toast.add({
          title: "Google Login Failed",
          description: msg,
          type: "error",
        });
        setIsLoading(false);
      }
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Failed to connect to Google.";
      setErrorMessage(msg);
      toast.add({
        title: "Google Login Error",
        description: msg,
        type: "error",
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="bg-white rounded-3xl border border-neutral-200/90 shadow-sm p-6 sm:p-8">
        {/* Brand & Title Header */}
        <div className="text-center pb-5 border-b border-neutral-100">
          <Link href="/" className="inline-flex items-center gap-2 mb-3 group">
            <div className="w-10 h-10 rounded-xl bg-tomato flex items-center justify-center text-white shadow-sm shadow-tomato/30 transition-transform group-hover:scale-105">
              <BookOpen className="w-5 h-5" strokeWidth={2.5} />
            </div>
            <span className="text-xl font-bold tracking-tight text-neutral-900">
              Book<span className="text-tomato">Nook</span>
            </span>
          </Link>

          <h1 className="text-2xl font-extrabold text-neutral-900 tracking-tight">
            Login to Your Account
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            {callbackUrl !== "/"
              ? "Please log in to continue to your requested page."
              : "Enter your credentials to access your library shelf."}
          </p>
        </div>

        {/* Inline Error Message in Form */}
        {errorMessage && (
          <div className="mt-4 p-3 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2 text-xs text-red-700 animate-in fade-in duration-200">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Email Field */}
          <div>
            <label
              htmlFor="email"
              className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700 mb-1.5"
            >
              Email <span className="text-tomato">*</span>
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-3 text-neutral-400" />
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                placeholder="reader@booknook.lib"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-neutral-200 bg-white text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-tomato/20 focus:border-tomato transition-all"
              />
            </div>
          </div>

          {/* Password Field & Forget Password */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="password"
                className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700"
              >
                Password <span className="text-tomato">*</span>
              </label>
              <button
                type="button"
                className="text-[11px] font-semibold text-tomato hover:underline cursor-pointer"
              >
                Forget Password?
              </button>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-3 text-neutral-400" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 text-sm rounded-xl border border-neutral-200 bg-white text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-tomato/20 focus:border-tomato transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3 text-neutral-400 hover:text-neutral-600 transition-colors cursor-pointer"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Login Button */}
          <div className="pt-1">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 text-sm font-bold text-white bg-tomato hover:bg-tomato-hover disabled:bg-neutral-300 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer active:scale-[0.99]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Logging in...</span>
                </>
              ) : (
                <>
                  <span>Login</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Divider */}
        <div className="relative my-5 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-neutral-200/80" />
          </div>
          <span className="relative px-3 bg-white text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
            Or continue with
          </span>
        </div>

        {/* Social Login Button (Google only) */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          className="w-full inline-flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-700 text-xs sm:text-sm font-semibold transition-all duration-200 shadow-2xs hover:shadow-xs active:scale-[0.99] cursor-pointer disabled:opacity-50"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>Continue with Google</span>
        </button>

        {/* Link to Register Page */}
        <div className="pt-5 mt-5 border-t border-neutral-100 text-center text-xs text-neutral-500">
          Don&apos;t have an account?{" "}
          <Link
            href={
              callbackUrl !== "/"
                ? `/register?callbackUrl=${encodeURIComponent(callbackUrl)}`
                : "/register"
            }
            className="font-bold text-tomato hover:underline inline-block"
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-[calc(100vh-80px)] bg-neutral-50/50 flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
      <Suspense
        fallback={
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 animate-spin text-tomato" />
          </div>
        }
      >
        <LoginFormContent />
      </Suspense>
    </div>
  );
}
