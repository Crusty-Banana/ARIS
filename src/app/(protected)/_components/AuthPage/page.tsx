"use client";

import type React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Lock, User, KeyRound } from "lucide-react";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { httpPost$Register } from "@/modules/commands/Authenticate/fetcher";
import { useTranslations } from "next-intl";
import { httpPost$RequestReset } from "@/modules/commands/RecoverAccount/fetcher";

// Import the new sub-components
import { LoginForm } from "./_components/LoginForm";
import { RegisterForm } from "./_components/RegisterForm";
import { ForgotPasswordForm } from "./_components/ForgotPasswordForm";

type AuthMode = "login" | "register" | "forgotPassword";

export default function AuthPage() {
  const t = useTranslations("authPage");
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const router = useRouter();

  const handleSwitchMode = (mode: AuthMode) => {
    setAuthMode(mode);
    setNotification(null); // Clear notifications when switching modes
  };

  const handleLoginSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setNotification(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.ok) {
        router.push("/dashboard");
      } else {
        const errorMessage =
          result?.error === "EmailNotVerified"
            ? t("pleaseVerifyEmail")
            : t("loginFailed");
        setNotification({ message: errorMessage, type: "error" });
      }
    } catch (error) {
      console.error("Login error:", error);
      setNotification({ message: t("loginFailed"), type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setNotification(null);

    const formData = new FormData(e.currentTarget);
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (password !== confirmPassword) {
      setNotification({ message: t("passwordsDoNotMatch"), type: "error" });
      setIsLoading(false);
      return;
    }

    try {
      const res = await httpPost$Register("/api/auth/register", {
        firstName,
        lastName,
        email,
        password,
      });

      if (res.success) {
        handleSwitchMode("login");
        setNotification({
          message: t("accountCreated") + "\n" + t("pleaseVerifyEmail"),
          type: "success",
        });
      } else {
        setNotification({ message: t("registrationFailed"), type: "error" });
      }
    } catch (error) {
      console.error("Registration error:", error);
      setNotification({ message: t("registrationFailed"), type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPasswordSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    setIsLoading(true);
    setNotification(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;

    await httpPost$RequestReset("/api/auth/recover", { email });

    setNotification({
      message: t("forgotPasswordRequestSent"),
      type: "success",
    });
    setIsLoading(false);
  };

  const getHeaderContent = () => {
    switch (authMode) {
      case "register":
        return {
          title: t("createAccount"),
          description: t("signUpPrompt"),
          icon: <User className="w-6 h-6 text-white" />,
        };
      case "forgotPassword":
        return {
          title: t("forgotPasswordTitle"),
          description: t("forgotPasswordPrompt"),
          icon: <KeyRound className="w-6 h-6 text-white" />,
        };
      case "login":
      default:
        return {
          title: t("welcomeBack"),
          description: t("signInPrompt"),
          icon: <Lock className="w-6 h-6 text-white" />,
        };
    }
  };

  const { title, description, icon } = getHeaderContent();

  return (
    <div className="flex-grow bg-gradient-to-br from-cyan-400 via-cyan-500 to-blue-600 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-sm sm:max-w-md">
        <Card className="backdrop-blur-sm bg-white/95 shadow-2xl border-0">
          <CardHeader className="space-y-1 text-center">
            <div className="mx-auto w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full flex items-center justify-center mb-4">
              {icon}
            </div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
              {title}
            </CardTitle>
            <CardDescription className="text-gray-600">
              {description}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {notification && (
              <div
                className={`p-3 rounded-md text-sm ${notification.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
              >
                {notification.message}
              </div>
            )}

            {authMode === "login" && (
              <LoginForm
                onSubmit={handleLoginSubmit}
                isLoading={isLoading}
                onSwitchToRegister={() => handleSwitchMode("register")}
                onSwitchToForgotPassword={() =>
                  handleSwitchMode("forgotPassword")
                }
                t={t}
              />
            )}
            {authMode === "register" && (
              <RegisterForm
                onSubmit={handleRegisterSubmit}
                isLoading={isLoading}
                onSwitchToLogin={() => handleSwitchMode("login")}
                t={t}
              />
            )}
            {authMode === "forgotPassword" && (
              <ForgotPasswordForm
                onSubmit={handleForgotPasswordSubmit}
                isLoading={isLoading}
                onSwitchToLogin={() => handleSwitchMode("login")}
                t={t}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}