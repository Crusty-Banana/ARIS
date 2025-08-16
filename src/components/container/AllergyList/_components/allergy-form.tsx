import { LanguageDropdown } from "@/components/language-dropdown";
import { NameInput } from "@/components/name-input";
import { ScrollableSelect } from "@/components/scrollable-select";
import { Allergen, DisplayString, Language } from "@/modules/business-types";
import { useLocale, useTranslations } from "next-intl";

interface AllergyFormProps {
  selectedLanguage: Language;
  setSelectedLanguage: (language: Language) => void;
  name: DisplayString;
  handleNameChange: (value: string) => void;
  allergens: Allergen[];
  selectedAllergens: string[];
  setSelectedAllergens: (value: string[]) => void;
}

export function AllergyForm(
  {
    selectedLanguage,
    setSelectedLanguage,
    name,
    handleNameChange,
    allergens,
    selectedAllergens,
    setSelectedAllergens,
  } : AllergyFormProps
) {
  const t = useTranslations('allergyModal');
  const localLanguage = useLocale() as Language;
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <NameInput name={name} selectedLanguage={selectedLanguage} handleNameChange={handleNameChange} />
        <LanguageDropdown selectedLanguage={selectedLanguage} setSelectedLanguage={setSelectedLanguage} />
      </div>
      <div>
        <div>
          <ScrollableSelect
            items={allergens.sort((a, b) => a.name[localLanguage].localeCompare(b.name[localLanguage]))}
            selectedItems={selectedAllergens}
            onSelectionChange={setSelectedAllergens}
            getItemId={(allergen) => allergen.id}
            getItemLabel={(allergen) => allergen.name[localLanguage]}
            label={t('associatedAllergens')}
            maxHeight="max-h-48"
          />
        </div>
      </div>
    </>
  )
}


