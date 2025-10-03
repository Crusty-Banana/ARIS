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
    <div className="flex items-center gap-3 lg:justify-between">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {t("timeFromContactToSymptom")}
      </label>
        <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className="border-cyan-300 focus:border-cyan-500 w-48">
            <SelectValue placeholder={t("selectTimeFromContactToSymptom")} />
        </SelectTrigger>
        <SelectContent>
            <SelectItem value="<2">{t("timeToSymptom.lessThan2")}</SelectItem>
            <SelectItem value="2-6">{t("timeToSymptom.twoToSix")}</SelectItem>
            <SelectItem value="6-12">{t("timeToSymptom.sixToTwelve")}</SelectItem>
            <SelectItem value="12-24">{t("timeToSymptom.twelveToTwentyFour")}</SelectItem>
            <SelectItem value=">24">{t("timeToSymptom.moreThan24")}</SelectItem>
        </SelectContent>
        </Select>
    </div>
  );
}
