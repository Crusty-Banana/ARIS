import { useTranslations } from "next-intl";
import { Input } from "./ui/input";
import { DisplayString, Language } from "@/modules/business-types";

interface NameInputProps {
  selectedLanguage: Language;
  name: DisplayString;
  handleNameChange: (value: string) => void;
}


export function NameInput({ selectedLanguage, name, handleNameChange }: NameInputProps) {
  const t = useTranslations("common");
  return (              
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {t("name")} ({selectedLanguage === "en" ? "English" : "Tiếng Việt"})
      </label>
      <Input
        value={name[selectedLanguage]}
        onChange={(e) => handleNameChange(e.target.value)}
        placeholder={t('enterName')}
        required
        className="border-cyan-300 focus:border-cyan-500"
      />
    </div>
  );
}