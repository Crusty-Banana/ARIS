import { GradientSlider } from "@/components/gradient-slider";
import { LanguageDropdown } from "@/components/language-dropdown";
import { NameInput } from "@/components/name-input";
import { RichTextEditor } from "@/components/rich-text-editor";
import { Textarea } from "@/components/ui/textarea";

import { DisplayString, Language } from "@/modules/business-types";
import { useTranslations } from "next-intl";


interface SymptomFormProps {
  selectedLanguage: Language;
  setSelectedLanguage: (language: Language) => void;
  name: DisplayString;
  handleNameChange: (value: string) => void;
  severity: number;
  setSeverity: (value: number) => void;
  prevalence: number;
  setPrevalence: (value: number) => void;
  description: DisplayString;
  handleDescriptionChange: (value: string) => void;
}

export function SymptomForm(
  {
    selectedLanguage,
    setSelectedLanguage,
    name,
    handleNameChange,
    severity,
    setSeverity,
    prevalence,
    setPrevalence,
    description,
    handleDescriptionChange,
  } : SymptomFormProps
) {
  const t = useTranslations('common');

  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <NameInput name={name} selectedLanguage={selectedLanguage} handleNameChange={handleNameChange} />
        <LanguageDropdown selectedLanguage={selectedLanguage} setSelectedLanguage={setSelectedLanguage} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <GradientSlider value={[severity]} onValueChange={value => setSeverity(value[0])} min={1} max={3} label={t('detailModals.severityLabel')} />
        <GradientSlider value={[prevalence]} onValueChange={value => setPrevalence(value[0])} min={1} max={5} label={t('detailModals.prevalenceLabel')} />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {t("description")} ({selectedLanguage === "en" ? "English" : "Tiếng Việt"})
        </label>
        <Textarea
          value={description[selectedLanguage]}
          onChange={(e) => handleDescriptionChange(e.target.value)}
          placeholder={t('detailModals.descriptionPlaceholder')}
          required
          className="border-cyan-300 focus:border-cyan-500 min-h-[80px]" />
        <RichTextEditor />
      </div>
    </>
  )
}