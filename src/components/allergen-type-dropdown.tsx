import { AllergenType } from "@/modules/business-types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useTranslations } from "next-intl";

interface AllergenTypeDropdownProps {
  type: AllergenType;
  setType: (type: AllergenType) => void;
}

export function AllergenTypeDropdown({
  type,
  setType,
}: AllergenTypeDropdownProps) {
  const t = useTranslations("common");
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {t("type")}
      </label>
      <Select
        value={type}
        onValueChange={(value) => setType(value as AllergenType)}
      >
        <SelectTrigger className="border-cyan-300 focus:border-cyan-500">
          <SelectValue placeholder={t("selectType")} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="food">{t("food")}</SelectItem>
          <SelectItem value="drug">{t("drug")}</SelectItem>
          <SelectItem value="respiratory">{t("respiratory")}</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
