import { useTranslations } from "next-intl";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface TimeFromContactToSymptomProps {
  value: string;
  onValueChange: (value: string) => void;
}

export function TimeFromContactToSymptomDropdown({
  value,
  onValueChange,
}: TimeFromContactToSymptomProps) {
  const t = useTranslations("addAllergenModal");
  return (
    <>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {t("timeFromContactToSymptom")}
      </label>
        <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className="border-cyan-300 focus:border-cyan-500">
            <SelectValue placeholder={t("selectTimeFromContactToSymptom")} />
        </SelectTrigger>
        <SelectContent>
            <SelectItem value="<2">{t("lessThan2Hours")}</SelectItem>
            <SelectItem value="2-6">{t("twoToSixHours")}</SelectItem>
            <SelectItem value="6-12">{t("sixToTwelveHours")}</SelectItem>
            <SelectItem value="12-24">{t("twelveToTwentyFourHours")}</SelectItem>
            <SelectItem value=">24">{t("moreThan24Hours")}</SelectItem>
        </SelectContent>
        </Select>
    </>
  );
}
