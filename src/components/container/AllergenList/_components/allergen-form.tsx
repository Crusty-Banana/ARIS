import { AllergenTypeDropdown } from "@/components/allergen-type-dropdown";
import { GradientSlider } from "@/components/gradient-slider";
import { LanguageDropdown } from "@/components/language-dropdown";
import { NameInput } from "@/components/name-input";
import { ScrollableSelect } from "@/components/scrollable-select";
import { Textarea } from "@/components/ui/textarea";
import { AllergenType, DisplayString, Language, Symptom } from "@/modules/business-types";
import { useLocale, useTranslations } from "next-intl";

interface AllergenFormProps {
  type: AllergenType;
  setType: (type: AllergenType) => void;
  selectedLanguage: Language;
  setSelectedLanguage: (language: Language) => void;
  name: DisplayString;
  handleNameChange: (value: string) => void;
  description: DisplayString;
  handleDescriptionChange: (value: string) => void;
  prevalence: number;
  setPrevalence: (value: number) => void;
  symptoms: Symptom[];
  selectedSymptoms: string[];
  setSelectedSymptoms: (value: string[]) => void;
}

export function AllergenForm(
  {
    type,
    setType,
    selectedLanguage,
    setSelectedLanguage,
    name,
    handleNameChange,
    description,
    handleDescriptionChange,
    prevalence,
    setPrevalence,
    symptoms,
    selectedSymptoms,
    setSelectedSymptoms,
  } : AllergenFormProps
) {
  const t = useTranslations('allergenModal');
  const localLanguage = useLocale() as Language;
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <AllergenTypeDropdown type={type} setType={setType} />
        <LanguageDropdown selectedLanguage={selectedLanguage} setSelectedLanguage={setSelectedLanguage} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <NameInput name={name} selectedLanguage={selectedLanguage} handleNameChange={handleNameChange} />
        <div>
          <GradientSlider value={[prevalence]} onValueChange={value => setPrevalence(value[0])} min={1} max={5} label={t('prevalence')} />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {t("description")} ({selectedLanguage === "en" ? "English" : "Tiếng Việt"})
        </label>
        <Textarea
          value={description[selectedLanguage]}
          onChange={(e) => handleDescriptionChange(e.target.value)}
          placeholder={t('enterDescription')}
          required
          className="border-cyan-300 focus:border-cyan-500 min-h-[80px]" />
      </div>
      <div>
        <div>
          <ScrollableSelect
            items={symptoms.sort((a, b) => a.name[localLanguage].localeCompare(b.name[localLanguage]))}
            selectedItems={selectedSymptoms}
            onSelectionChange={setSelectedSymptoms}
            getItemId={(symptom: Symptom) => symptom.id}
            getItemLabel={(symptom: Symptom) => symptom.name[localLanguage]}
            label={t('associatedSymptoms')}
            maxHeight="max-h-32" />
        </div>
      </div>
    </>
  )
}