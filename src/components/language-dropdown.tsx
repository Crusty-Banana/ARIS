import { Language } from "@/modules/business-types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { useTranslations } from "next-intl";
import { Languages } from "lucide-react";

interface LanguageDropdownProps {
  selectedLanguage: Language;
  setSelectedLanguage: (type: Language) => void;
}

export function LanguageDropdown({ selectedLanguage, setSelectedLanguage }: LanguageDropdownProps) {
  const t = useTranslations('common');
  return (            
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{t("language")}</label>
      <Select value={selectedLanguage} onValueChange={(value: Language) => setSelectedLanguage(value)}>
        <SelectTrigger className="border-cyan-300 focus:border-cyan-500">
          <Languages className="h-4 w-4 mr-2" />
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="en">English</SelectItem>
          <SelectItem value="vi">Tiếng Việt</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}