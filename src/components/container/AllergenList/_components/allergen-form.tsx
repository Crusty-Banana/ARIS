import { AllergenTypeDropdown } from "@/components/allergen-type-dropdown";
import { LanguageDropdown } from "@/components/language-dropdown";
import { NameInput } from "@/components/name-input";
import { ScrollableSelect } from "@/components/scrollable-select";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AllergenType, DisplayString, Language, Symptom, Allergen } from "@/modules/business-types";
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
  symptoms: Symptom[];
  allergens: Allergen[];
  selectedSymptoms: string[];
  setSelectedSymptoms: (value: string[]) => void;
  selectedCrossSensitivity: string[];
  setSelectedCrossSensitivity: (value: string[]) => void;
  isWholeAllergen: boolean,
  setIsWholeAllergen: (value: boolean) => void,
  treatment: {lvl1: DisplayString, lvl2: DisplayString, lvl3: DisplayString},
  handleTreatmentChange: (level: "lvl1" | "lvl2" | "lvl3", value: string) => void,
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
    symptoms,
    allergens,
    selectedSymptoms,
    setSelectedSymptoms,
    selectedCrossSensitivity,
    setSelectedCrossSensitivity,
    isWholeAllergen,
    setIsWholeAllergen,
    treatment,
    handleTreatmentChange,
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
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {t("lvl1Treatment")} ({selectedLanguage === "en" ? "English" : "Tiếng Việt"})
        </label>
        <Textarea
          value={treatment.lvl1[selectedLanguage]}
          onChange={(e) => handleTreatmentChange("lvl1", e.target.value)}
          placeholder={t('enterTreatment')}
          required
          className="border-cyan-300 focus:border-cyan-500 min-h-[80px]" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {t("lvl2Treatment")} ({selectedLanguage === "en" ? "English" : "Tiếng Việt"})
        </label>
        <Textarea
          value={treatment.lvl2[selectedLanguage]}
          onChange={(e) => handleTreatmentChange("lvl2", e.target.value)}
          placeholder={t('enterTreatment')}
          required
          className="border-cyan-300 focus:border-cyan-500 min-h-[80px]" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {t("lvl3Treatment")} ({selectedLanguage === "en" ? "English" : "Tiếng Việt"})
        </label>
        <Textarea
          value={treatment.lvl3[selectedLanguage]}
          onChange={(e) => handleTreatmentChange("lvl3", e.target.value)}
          placeholder={t('enterTreatment')}
          required
          className="border-cyan-300 focus:border-cyan-500 min-h-[80px]" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {t("allergenType")} 
        </label>
        <Select
          value={isWholeAllergen ? "whole" : "component"}
          onValueChange={(value) => setIsWholeAllergen(value === "whole")}
        >
          <SelectTrigger className="w-full border-cyan-300 focus:border-cyan-500">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="whole">{t("wholeAllergen")}</SelectItem>
            <SelectItem value="component">{t("componentAllergen")}</SelectItem>
          </SelectContent>
        </Select>
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
        <div>
          <ScrollableSelect
            items={allergens.sort((a, b) => a.name[localLanguage].localeCompare(b.name[localLanguage]))}
            selectedItems={selectedCrossSensitivity}
            onSelectionChange={setSelectedCrossSensitivity}
            getItemId={(allergen: Allergen) => allergen.id}
            getItemLabel={(allergen: Allergen) => allergen.name[localLanguage]}
            label={t('crossSensitivity')}
            maxHeight="max-h-32" />
        </div>
      </div>
    </>
  )
}