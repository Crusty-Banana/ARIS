"use client";

import { useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Paperclip, X } from "lucide-react";
import {
  Language,
  Symptom,
  TestType,
  TimeFromContactToSymptom,
} from "@/modules/business-types";
import { useLocale, useTranslations } from "next-intl";
import { PAPAllergen } from "@/modules/commands/UpdatePAPWithUserId/typing";
import { getTypeColor } from "@/lib/client-side-utils";
import { TestTypeDropdown } from "@/components/test-type-dropdown";
import { DoneTestTickbox } from "@/components/done-test-tickbox";
import { toast } from "sonner";
import { httpPost$AddFileToS3 } from "@/modules/commands/AddFileToS3/fetcher";
import { DatePicker } from "@/components/ui/custom-date-picker";
import { GroupedSymptomSelect } from "@/components/grouped-symptoms-select";
import { TimeFromContactToSymptomDropdown } from "@/components/time-to-symptom-dropdown";
import { DragAndDrop } from "./drag-and-drop-result";
import { RemainAllergen } from "@/modules/commands/GetRemainAllergens/typing";
import { httpGet$GetRemainAllergens } from "@/modules/commands/GetRemainAllergens/fetcher";
import useSWR from "swr";
import { SearchBar } from "@/components/container/AllergenList/_components/search-bar";

interface AddAllergenModalProps {
  open: boolean;
  onClose: () => void;
  availableSymptoms: Symptom[];
  onAddAllergen: (allergen: PAPAllergen) => void;
}

export function AddAllergenModal({
  open,
  onClose,
  availableSymptoms,
  onAddAllergen,
}: AddAllergenModalProps) {
  const t = useTranslations("addAllergenModal");
  const localLanguage = useLocale() as Language;

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAllergen, setSelectedAllergen] =
    useState<RemainAllergen | null>(null);
  const [discoveryDate, setDiscoveryDate] = useState<Date | undefined>();
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [doneTest, setDoneTest] = useState(false);
  const [testDone, setTestDone] = useState<TestType>("");
  const [timeFromContactToSymptom, setTimeFromContactToSymptom] =
    useState<TimeFromContactToSymptom>("");

  const [testResultUrl, setTestResultUrl] = useState<string | undefined>();

  const [selectedResultFile, setSelectedResultFile] = useState<File | null>(
    null
  );
  const [isSaving, setIsSaving] = useState(false);
  const [filePreviewUrl, setFilePreviewUrl] = useState<string>("");

  const params = useMemo(() => {
    return {
      lang: localLanguage,
      name: searchTerm,
    };
  }, [searchTerm, localLanguage]);

  const fetchAvailableAllergens = async () => {
    const data = await httpGet$GetRemainAllergens(
      "/api/allergens/remain",
      params
    );

    if (data.success) {
      return data;
    } else {
      toast.error(data?.message);
      throw new Error(data?.message);
    }
  };

  const fetchAvailableAllergensKey = [`/api/allergens/remain`, params];

  const { data } = useSWR(fetchAvailableAllergensKey, fetchAvailableAllergens, {
    keepPreviousData: true,
  });

  const availableAllergens = data?.result || [];

  const parseInputDate = (date: Date | undefined) => {
    if (!date) return null;
    return Math.floor(date.getTime() / 1000);
  };

  const handleSubmit = async () => {
    if (!selectedAllergen) return;

    setIsSaving(true);
    let finalTestResultUrl = "";

    // Upload test result first
    if (selectedResultFile) {
      const uploadToast = toast.loading("Uploading file...");
      const response = await httpPost$AddFileToS3(
        "/api/user-s3-upload",
        selectedResultFile
      );

      if (response.success && response.result) {
        toast.success("Upload Success", { id: uploadToast });
        finalTestResultUrl = response.result; // Get new S3 URL
      } else {
        toast.error(response.message, { id: uploadToast });
        setIsSaving(false);
        return; // Stop if upload fails
      }
    }

    onAddAllergen({
      allergenId: selectedAllergen.id,
      discoveryDate: parseInputDate(discoveryDate),
      doneTest,
      testDone,
      symptomsId: selectedSymptoms,
      testResult: testResultUrl,
      timeFromContactToSymptom: timeFromContactToSymptom,
    });

    // Reset form
    setSelectedAllergen(null);
    setDiscoveryDate(undefined);
    setSelectedSymptoms([]);
    setSearchTerm("");
    setDoneTest(false);
    setTestDone("");
    setSelectedResultFile(null);
    setTestResultUrl(undefined);
    onClose();
    setTimeFromContactToSymptom("");
    handleFileDeselect();

    setIsSaving(false);
  };

  const handleAllergenSelect = (allergen: RemainAllergen) => {
    setSelectedAllergen(allergen);
    // Pre-select symptoms that are associated with this allergen
    setSelectedSymptoms([]);
  };

  const handleFileSelect = (file: File) => {
    setSelectedResultFile(file);
    if (filePreviewUrl) {
      URL.revokeObjectURL(filePreviewUrl);
    }
    setFilePreviewUrl(URL.createObjectURL(file));
  };

  const handleFileDeselect = () => {
    if (filePreviewUrl) {
      URL.revokeObjectURL(filePreviewUrl);
    }
    setFilePreviewUrl("");
    setTestResultUrl(undefined);
    setSelectedResultFile(null);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl lg:max-w-5xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-cyan-800">
            {t("addNewAllergen")}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-h-[70vh] overflow-y-auto lg:overflow-y-hidden">
          {/* Left Column - Allergen Selection */}
          <div className="space-y-4 flex flex-col h-full lg:overflow-y-auto">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("searchAllergen")}
              </label>
              <SearchBar
                value={searchTerm}
                setValue={setSearchTerm}
                className="relative"
                searchPlaceholder={t("searchAllergen")}
              ></SearchBar>
            </div>

            {/* Allergen list grows + has its own scroll */}
            <div className="border border-cyan-200 rounded-md max-h-64 lg:max-h-[64vh] lg:min-h-64 overflow-y-auto">
              {availableAllergens.map((allergen) => (
                <div
                  key={allergen.id}
                  className={`p-3 cursor-pointer hover:bg-cyan-50 border-b border-cyan-100 last:border-b-0 ${
                    selectedAllergen?.id === allergen.id ? "bg-cyan-100" : ""
                  }`}
                  onClick={() => handleAllergenSelect(allergen)}
                >
                  <div className="font-medium text-cyan-800">
                    {allergen.name}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge
                      className={`${getTypeColor(allergen.type)} text-white text-xs capitalize`}
                    >
                      {t(allergen.type)}
                    </Badge>
                  </div>
                </div>
              ))}
              {availableAllergens.length === 0 && (
                <div className="p-4 text-center text-gray-500">
                  No allergens found
                </div>
              )}
            </div>
            {selectedAllergen && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t("selectedAllergen")}
                  </label>
                  <div className="p-2 bg-cyan-50 rounded border">
                    <div className="font-medium">{selectedAllergen.name}</div>
                    <div className="text-sm text-gray-600 mt-1">
                      {selectedAllergen.description}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Right Column - Details */}
          <div className="space-y-4 lg:overflow-y-auto">
            {selectedAllergen && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t("discoveryDate")}
                  </label>
                  <DatePicker
                    value={discoveryDate}
                    onChange={setDiscoveryDate}
                    placeholder={t("selectDate")}
                    localLanguage={localLanguage}
                  />
                </div>
                <div className="flex items-center justify-between gap-6">
                  <div className="h-10 flex items-center">
                    <DoneTestTickbox
                      checked={doneTest}
                      onCheckedChange={(checked) => {
                        setDoneTest(checked as boolean);
                        if (!checked) setTestDone("");
                        setSelectedResultFile(null);
                        setTestResultUrl(undefined);
                        setFilePreviewUrl("");
                      }}
                    />
                  </div>

                  {doneTest && (
                    <div className="">
                      <TestTypeDropdown
                        value={testDone}
                        onValueChange={(value) => {
                          setTestDone(value as TestType);
                          setTestResultUrl(undefined);
                          setSelectedResultFile(null);
                          setFilePreviewUrl("");
                        }}
                      />
                    </div>
                  )}
                </div>

                {doneTest && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t("testResult")}
                    </label>
                    {!selectedResultFile && !testResultUrl && (
                      <DragAndDrop
                        onFilesDropped={handleFileSelect}
                        labelText={t("uploadTestResultFile")}
                      />
                    )}

                    {filePreviewUrl && (
                      <div className="mt-2 flex items-center justify-between p-2 bg-green-100 border border-green-300 text-green-800 rounded-md">
                        <a
                          href={filePreviewUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-sm hover:underline"
                        >
                          <Paperclip className="h-4 w-4" />
                          <span>{t("previewTestResultFile")}</span>
                        </a>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-4 w-4 p-0 hover:bg-red-100"
                          onClick={() => {
                            setTestResultUrl(undefined);
                            setSelectedResultFile(null);
                            setFilePreviewUrl("");
                          }}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                )}

                <div className="flex-1">
                  <TimeFromContactToSymptomDropdown
                    value={timeFromContactToSymptom}
                    onValueChange={(value) =>
                      setTimeFromContactToSymptom(
                        value as TimeFromContactToSymptom
                      )
                    }
                  />
                </div>
                <GroupedSymptomSelect
                  items={availableSymptoms.sort((a, b) =>
                    a.name[localLanguage].localeCompare(b.name[localLanguage])
                  )}
                  selectedItems={selectedSymptoms}
                  onSelectionChange={setSelectedSymptoms}
                  getItemId={(symptom) => symptom.id}
                  getItemLabel={(symptom) => symptom.name[localLanguage]}
                  label={t("associatedSymptoms")}
                />
              </>
            )}
          </div>
        </div>

        <div className="flex gap-2 pt-4 border-t">
          <Button
            onClick={handleSubmit}
            disabled={!selectedAllergen || isSaving}
            className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
          >
            {isSaving ? t("saving") : t("addAllergen")}
          </Button>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isSaving}
            className="flex-1 bg-transparent"
          >
            {isSaving ? t("saving") : t("cancel")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
