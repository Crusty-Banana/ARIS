import { useTranslations } from "next-intl";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

interface TestTypeDropdownProps {
  value: string;
  onValueChange: (value: string) => void;
}

export function DiscoveryMethodDropdown({value, onValueChange}: TestTypeDropdownProps) {
  const t = useTranslations("addAllergenModal")
  return (
    <>
      <label className="block text-sm font-medium text-gray-700 mb-1">{t("discoveryMethod")}</label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className="border-cyan-300 focus:border-cyan-500">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Clinical symptoms">{t("clinicalSymptoms")}</SelectItem>
          <SelectItem value="Potential">{t("potential")}</SelectItem>
        </SelectContent>
      </Select>
    </>
  )
}