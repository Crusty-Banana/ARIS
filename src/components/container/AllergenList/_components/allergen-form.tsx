import { AllergenTypeDropdown } from "@/components/allergen-type-dropdown";
import { LanguageDropdown } from "@/components/language-dropdown";
import { NameInput } from "@/components/name-input";
import { ScrollableSelect } from "@/components/scrollable-select";
import {
  AllergenType,
  DisplayString,
  Language,
} from "@/modules/business-types";
import { useLocale, useTranslations } from "next-intl";
import { RichTextEditor } from "@/components/rich-text-editor";
import {
  BriefAllergen,
  GetBriefAllergens$Params,
} from "@/modules/commands/GetBriefAllergens/typing";
import { useCallback, useEffect, useMemo, useState } from "react";
import { httpGet$GetBriefAllergens } from "@/modules/commands/GetBriefAllergens/fetcher";
import { toast } from "sonner";
import useSWR from "swr";
import useSWRInfinite from "swr/infinite";

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

  const fetchAllergens = async (
    url: string,
    params: GetBriefAllergens$Params
  ) => {
    const data = await httpGet$GetBriefAllergens(url, params);
    if (data.success) {
      return data;
    } else {
      throw new Error(data?.message);
    }
  };

  const [searchTerm, setSearchTerm] = useState("");

  // const searchParams = useMemo(() => {
  //   // use useMemo to prevent re-creating params on re-renders
  //   return {
  //     page,
  //     lang: localLanguage,
  //     ...(searchTerm && { name: searchTerm }),
  //   };
  // }, [page, searchTerm, localLanguage]);

  const getKey = (pageIndex: number, previousPageData: any) => {
    if (previousPageData && !previousPageData.result.length) return null;

    const params = {
      page: pageIndex + 1,
      limit: 100,
      lang: localLanguage,
      ...(searchTerm && { name: searchTerm }),
    };

    return ["/api/allergens/brief", params] as const;
  };

  const { data, size, setSize, isLoading, mutate } = useSWRInfinite(
    getKey,
    ([url, params]) => fetchAllergens(url, params),
    {
      revalidateFirstPage: false,
      parallel: true,
    }
  );

  const allItems = data ? data.flatMap((page) => page?.result ?? []) : [];

  const totalItems = (data && data[0]?.total) ?? 0;
  const isLoadingMore =
    isLoading ||
    (size > 0 && data && typeof data[size - 1] === "undefined") ||
    false;

  // Fetch selected IDs (once, on mount)
  const [initialIDsToFetch] = useState<string[]>(() => {
    return selectedCrossSensitivity.length > 0 ? selectedCrossSensitivity : [];
  });

  const initialFetchParams = useMemo(
    () => ({
      ids: initialIDsToFetch,
      page: 1,
      limit: 100,
      lang: localLanguage,
    }),
    [localLanguage, initialIDsToFetch]
  );

  const { data: initialData } = useSWR(
    initialIDsToFetch.length > 0
      ? ["/api/allergens/brief", initialFetchParams]
      : null,
    ([url, params]) => fetchAllergens(url, params),
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
    }
  );

  useEffect(() => {
    setSize(1);
  }, [searchTerm, setSize]);

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
            items={allItems}
            total={totalItems}
            initialItems={initialData?.result || []}
            selectedItemIDs={selectedCrossSensitivity}
            isLoading={isLoadingMore}
            mutateList={mutate}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onPageChange={() => setSize(size + 1)}
            onSelectionChange={setSelectedCrossSensitivity}
            getItemId={(allergen: BriefAllergen) => allergen.id}
            getItemLabel={(allergen: BriefAllergen) => allergen.name}
            label={t("crossSensitivity")}
            maxHeight="max-h-32"
          />
        </div>
      </div>
    </>
  );
}
