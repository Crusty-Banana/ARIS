import { useTranslations } from "next-intl";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

interface TestTypeDropdownProps {
  value: string;
  onValueChange: (value: string) => void;
}

export function TestTypeDropdown({value, onValueChange} : TestTypeDropdownProps) {
  const t = useTranslations("addAllergenModal");
  return (
    <>
      <label className="block text-sm font-medium text-gray-700 mb-1">{t("testDone")}</label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className="border-cyan-300 focus:border-cyan-500">
          <SelectValue placeholder={t("selectTestType")} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="skin">{t("skinTest")}</SelectItem>
          <SelectItem value="blood">{t("bloodTest")}</SelectItem>
          <SelectItem value="provocation">{t("provocationTest")}</SelectItem>
        </SelectContent>
      </Select>
    </>
  )
}