"use client";

import { PersonalInfoSection } from "./personal-info-section";
import { SecuritySection } from "./security-section";
import { AccountManagementSection } from "./account-management-section";
import { useTranslations } from "next-intl";
export function ProfilePage() {
  const t = useTranslations("profile");
  return (
    <div className="flex-1 bg-gradient-to-br from-cyan-100 via-blue-50 to-blue-100">
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-800 mb-2">
            {t("title")}
          </h1>
          <p className="text-gray-600">{t("description")}</p>
        </div>

        <div className="space-y-8">
          <PersonalInfoSection />
          <SecuritySection />
          <AccountManagementSection />
        </div>
      </div>
    </div>
  );
}
