import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";

interface AddAllergenButtonProps {
  onClick: () => void;
}

export function AddAllergenButton({ onClick }: AddAllergenButtonProps) {
  const t = useTranslations("personalAllergyProfile");

  return (
    <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 hidden lg:block">
      <CardHeader>
        <CardTitle className="text-green-800 text-lg">
          {t("addNewAllergenCard")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Button
          onClick={onClick}
          className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          {t("addAllergenButton")}
        </Button>
      </CardContent>
    </Card>
  );
}
