import { AllergenTypeDropdown } from "@/components/allergen-type-dropdown";
import { LanguageDropdown } from "@/components/language-dropdown";
import { NameInput } from "@/components/name-input";
import { ScrollableSelect } from "@/components/scrollable-select";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AllergenType,
  DisplayString,
  Language,
  Allergen,
} from "@/modules/business-types";
import { useLocale, useTranslations } from "next-intl";
import { RichTextEditor } from "@/components/rich-text-editor";
import { BriefAllergen } from "@/modules/commands/GetBriefAllergens/typing";
import { useCallback, useEffect, useState } from "react";
import { httpGet$GetBriefAllergens } from "@/modules/commands/GetBriefAllergens/fetcher";
import { toast } from "sonner";

interface AllergenFormProps {
  type: AllergenType;
  setType: (type: AllergenType) => void;
  selectedLanguage: Language;
  setSelectedLanguage: (language: Language) => void;
  name: DisplayString;
  handleNameChange: (value: string) => void;
  description: DisplayString;
  handleDescriptionChange: (value: string) => void;
  selectedCrossSensitivity: string[];
  setSelectedCrossSensitivity: (value: string[]) => void;
}

export function AllergenForm({
  type,
  setType,
  selectedLanguage,
  setSelectedLanguage,
  name,
  handleNameChange,
  description,
  handleDescriptionChange,
  selectedCrossSensitivity,
  setSelectedCrossSensitivity,
}: AllergenFormProps) {
  const t = useTranslations("allergenModal");
  const localLanguage = useLocale() as Language;

  const [allergens, setAllergens] = useState<BriefAllergen[]>([]);

  const fetchAllergens = useCallback(async () => {
    const params = {
      lang: localLanguage,
    };

    try {
      const data = await httpGet$GetBriefAllergens(
        "/api/allergens/brief",
        params
      );
      if (data.success) {
        setAllergens(data.result as BriefAllergen[]);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Failed to fetch allergens.");
    }
  }, []);

  useEffect(() => {
    fetchAllergens();
  }, []);

  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <AllergenTypeDropdown type={type} setType={setType} />
        <LanguageDropdown
          selectedLanguage={selectedLanguage}
          setSelectedLanguage={setSelectedLanguage}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <NameInput
          name={name}
          selectedLanguage={selectedLanguage}
          handleNameChange={handleNameChange}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {t("description")} (
          {selectedLanguage === "en" ? "English" : "Tiếng Việt"})
        </label>
        {/* <Textarea
          value={description[selectedLanguage]}
          onChange={(e) => handleDescriptionChange(e.target.value)}
          placeholder={t('enterDescription')}
          required
          className="border-cyan-300 focus:border-cyan-500 min-h-[80px]" /> */}

        {selectedLanguage == "vi" ? (
          <RichTextEditor
            content={description["vi"]}
            key="allergen-text-editor-vi"
            onChange={(content) => handleDescriptionChange(content)}
            placeholder={t("enterDescription")}
          />
        ) : (
          <RichTextEditor
            content={description["en"]}
            key="allergen-text-editor-en"
            onChange={(content) => handleDescriptionChange(content)}
            placeholder={t("enterDescription")}
          />
        )}
      </div>

      <div>
        <div>
          <ScrollableSelect
            // TODO: sorting in front end?
            items={allergens.sort((a, b) =>
              a.name[localLanguage].localeCompare(b.name[localLanguage])
            )}
            selectedItems={selectedCrossSensitivity}
            onSelectionChange={setSelectedCrossSensitivity}
            getItemId={(allergen: BriefAllergen) => allergen.id}
            getItemLabel={(allergen: BriefAllergen) =>
              allergen.name[localLanguage]
            }
            label={t("crossSensitivity")}
            maxHeight="max-h-32"
          />
        </div>
      </div>
    </>
  );
}
