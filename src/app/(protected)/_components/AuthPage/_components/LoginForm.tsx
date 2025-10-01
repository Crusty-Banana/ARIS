"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";

type LoginFormProps = {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  isLoading: boolean;
  onSwitchToRegister: () => void;
  onSwitchToForgotPassword: () => void;
  t: any;
};

export function LoginForm({
  onSubmit,
  isLoading,
  onSwitchToRegister,
  onSwitchToForgotPassword,
  t,
}: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form key="login-form" onSubmit={onSubmit} className="space-y-4">
      {/* Email Input */}
      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-medium text-gray-700">
          {t("email")}
        </Label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="email"
            name="email"
            type="email"
            placeholder={t("enterYourEmail")}
            className="pl-10"
            required
          />
        </div>
      </div>

      {/* Password Input */}
      <div className="space-y-2">
        <Label
          htmlFor="password"
          className="text-sm font-medium text-gray-700"
        >
          {t("password")}
        </Label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder={t("enterYourPassword")}
            className="pl-10 pr-10"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      {/* Remember Me & Forgot Password */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <input
            id="remember"
            type="checkbox"
            className="w-4 h-4 text-cyan-600 bg-gray-100 border-gray-300 rounded focus:ring-cyan-500"
          />
          <Label htmlFor="remember" className="text-sm text-gray-600">
            {t("rememberMe")}
          </Label>
        </div>
        <button
          type="button"
          onClick={onSwitchToForgotPassword}
          className="text-sm text-cyan-600 hover:text-blue-700 font-medium focus:outline-none"
        >
          {t("forgotPasswordLink")}
        </button>
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-medium py-2.5"
      >
        {isLoading ? t("signingIn") : t("signIn")}
      </Button>

      <p className="text-center text-sm text-gray-600">
        {t("noAccount")}
        <button
          type="button"
          onClick={onSwitchToRegister}
          className="text-cyan-600 hover:text-blue-700 font-medium focus:outline-none ml-1"
        >
          {t("signUp")}
        </button>
      </p>
    </form>
  );
}