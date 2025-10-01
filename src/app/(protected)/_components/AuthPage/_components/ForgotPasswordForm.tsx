"use client";

import type React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, ArrowLeft } from "lucide-react";
import { useTranslations } from "next-intl";

type ForgotPasswordFormProps = {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  isLoading: boolean;
  onSwitchToLogin: () => void;
  t: ReturnType<typeof useTranslations>;
};

export function ForgotPasswordForm({
  onSubmit,
  isLoading,
  onSwitchToLogin,
  t,
}: ForgotPasswordFormProps) {
  return (
    <form key="forgot-form" onSubmit={onSubmit} className="space-y-4">
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

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-medium py-2.5"
      >
        {isLoading ? t("sendingLink") : t("sendResetLink")}
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