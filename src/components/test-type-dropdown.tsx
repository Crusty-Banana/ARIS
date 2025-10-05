import { useTranslations } from "next-intl";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface TestTypeDropdownProps {
  value: string;
  onValueChange: (value: string) => void;
}

export function TestTypeDropdown({
  value,
  onValueChange,
}: TestTypeDropdownProps) {
  const t = useTranslations("addAllergenModal");

  return (
    <div className="flex items-center gap-3">
      <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
        {t("testDone")}:
      </label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className="border-cyan-300 focus:border-cyan-500 w-48">
          <SelectValue placeholder={t("selectTestType")} className="text-ellipsis whitespace-nowrap" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="skin">{t("skinTest")}</SelectItem>
          <SelectItem value="blood">{t("bloodTest")}</SelectItem>
          <SelectItem value="challenge">{t("challengeTest")}</SelectItem>
          <SelectItem value="intradermal">{t("intradermalTest")}</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
