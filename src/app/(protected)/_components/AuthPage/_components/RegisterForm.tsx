"use client";

import type React from "react";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Lock, Mail, User, ArrowLeft } from "lucide-react";
import { useTranslations } from "next-intl";

type RegisterFormProps = {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  isLoading: boolean;
  onSwitchToLogin: () => void;
  t: ReturnType<typeof useTranslations>;
};

export function RegisterForm({
  onSubmit,
  isLoading,
  onSwitchToLogin,
  t,
}: RegisterFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <form key="register-form" onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label
            htmlFor="firstName"
            className="text-sm font-medium text-gray-700"
          >
            {t("firstName")}
          </Label>
          <div className="relative">
            <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="firstName"
              name="firstName"
              type="text"
              placeholder={t("firstNamePlaceholder")}
              className="pl-10 border-gray-200 focus:border-cyan-500 focus:ring-cyan-500"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="lastName"
            className="text-sm font-medium text-gray-700"
          >
            {t("lastName")}
          </Label>
          <div className="relative">
            <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="lastName"
              name="lastName"
              type="text"
              placeholder={t("lastNamePlaceholder")}
              className="pl-10 border-gray-200 focus:border-cyan-500 focus:ring-cyan-500"
              required
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label
          htmlFor="registerEmail"
          className="text-sm font-medium text-gray-700"
        >
          {t("email")}
        </Label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="registerEmail"
            name="email"
            type="email"
            placeholder={t("enterYourEmail")}
            className="pl-10 border-gray-200 focus:border-cyan-500 focus:ring-cyan-500"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label
          htmlFor="registerPassword"
          className="text-sm font-medium text-gray-700"
        >
          {t("password")}
        </Label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="registerPassword"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder={t("createAPassword")}
            className="pl-10 pr-10 border-gray-200 focus:border-cyan-500 focus:ring-cyan-500"
            required
            minLength={6}
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

      <div className="space-y-2">
        <Label
          htmlFor="confirmPassword"
          className="text-sm font-medium text-gray-700"
        >
          {t("confirmPassword")}
        </Label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            placeholder={t("confirmYourPassword")}
            className="pl-10 pr-10 border-gray-200 focus:border-cyan-500 focus:ring-cyan-500"
            required
            minLength={6}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
            aria-label={
              showConfirmPassword ? "Hide password" : "Show password"
            }
          >
            {showConfirmPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      <div className="flex items-start space-x-2">
        <input
          id="terms"
          type="checkbox"
          className="w-4 h-4 text-cyan-600 bg-gray-100 border-gray-300 rounded focus:ring-cyan-500 mt-0.5"
          required
        />
        <Label htmlFor="terms" className="text-sm text-gray-600">
          {t.rich("termsAgreement", {
            termsOfService: (chunks: React.ReactNode) => (
              <Link
                href="/terms"
                className="text-cyan-600 hover:text-blue-700 font-medium"
              >
                {chunks}
              </Link>
            ),
            privacyPolicy: (chunks: React.ReactNode) => (
              <Link
                href="/privacy"
                className="text-cyan-600 hover:text-blue-700 font-medium"
              >
                {chunks}
              </Link>
            ),
          })}
        </Label>
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-medium py-2.5 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50"
      >
        {isLoading ? t("creatingAccount") : t("createAccountButton")}
      </Button>
      <div className="text-center">
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="text-sm text-cyan-600 hover:text-blue-700 font-medium focus:outline-none inline-flex items-center"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          {t("backToLogin")}
        </button>
      </div>
    </form>
  );
}