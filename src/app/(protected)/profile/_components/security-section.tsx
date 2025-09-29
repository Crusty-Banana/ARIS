import { Card, CardContent } from "@/components/ui/card";
import { ChangePasswordDialog } from "./change-password-dialog";
import { useTranslations } from "next-intl";
export function SecuritySection() {
  const t = useTranslations("security");
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-cyan-800">{t("title")}</h2>

      <Card className="bg-white/70 backdrop-blur-sm border-white/20">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">{t("passwordChange")}</h3>
                <p className="text-sm text-gray-600">
                  {t("passwordChangeDescription")}
                </p>
              </div>
              <ChangePasswordDialog />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
