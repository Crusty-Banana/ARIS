import { DoneTestTickbox } from "@/components/done-test-tickbox";
import { GroupedSymptomSelect } from "@/components/grouped-symptoms-select";
import { TestTypeDropdown } from "@/components/test-type-dropdown";
import { TimeFromContactToSymptomDropdown } from "@/components/time-to-symptom-dropdown";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/custom-date-picker";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Language,
  Symptom,
  TestType,
  TimeFromContactToSymptom,
} from "@/modules/business-types";
import { httpPost$AddFileToS3 } from "@/modules/commands/AddFileToS3/fetcher";
import { DisplayPAPAllergen } from "@/modules/commands/GetPAPWithUserId/typing";
import { UpdatePAPAllergen$Params } from "@/modules/commands/UpdatePAPWithUserId/typing";
import { Paperclip, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";
import { DragAndDrop } from "./drag-and-drop-result";

interface AllergenEditModalProps {
  allergen: DisplayPAPAllergen;
  availableSymptoms: Symptom[];
  onUpdate: (updates: Omit<UpdatePAPAllergen$Params, "allergenId">) => void;
  onClose: () => void;
}

export function AllergenEditModal({
  allergen,
  availableSymptoms,
  onUpdate,
  onClose,
}: AllergenEditModalProps) {
  const t = useTranslations("personalAllergyProfile");
  const localLanguage = useLocale() as Language;

  const [discoveryDate, setDiscoveryDate] = useState<Date | undefined>(
    allergen.discoveryDate ? new Date(allergen.discoveryDate * 1000) : undefined
  );
  const [selectedSymptoms, setSelectedSymptoms] = useState(
    allergen.symptoms.map((symptom) => symptom.symptomId)
  );
  const [doneTest, setDoneTest] = useState(allergen.doneTest);
  const [testDone, setTestDone] = useState<TestType>(
    allergen.testDone ? allergen.testDone : ""
  );
  const [selectedResultFile, setSelectedResultFile] = useState<File | null>(
    null
  );
  const [isSaving, setIsSaving] = useState(false);
  const [testResultUrl, setTestResultUrl] = useState<string | undefined>(
    allergen.testResult
  );
  const [filePreviewUrl, setFilePreviewUrl] = useState<string>("");
  const [timeFromContactToSymptom, setTimeFromContactToSymptom] =
    useState<TimeFromContactToSymptom>(
      allergen.timeFromContactToSymptom ? allergen.timeFromContactToSymptom : ""
    );

  const parseInputDate = (date: Date | undefined) => {
    if (!date) return null;
    return Math.floor(date.getTime() / 1000);
  };

  const handleSave = async () => {
    setIsSaving(true);
    let finalTestResultUrl = testResultUrl;

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

    onUpdate({
      discoveryDate: parseInputDate(discoveryDate),
      doneTest: doneTest,
      testDone: testDone,
      symptomsId: selectedSymptoms,
      testResult: testResultUrl,
      timeFromContactToSymptom: timeFromContactToSymptom,
    });

    setIsSaving(false);
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
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-cyan-800">
            {t("editAllergenTitle", {
              allergenName: allergen.name[localLanguage],
            })}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 max-h-[70vh] overflow-y-auto">
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

          <div className="flex gap-6">
            {doneTest && (
              <div className="flex-1">
                <TestTypeDropdown
                  value={testDone}
                  onValueChange={(value) => setTestDone(value as TestType)}
                />
              </div>
            )}
          </div>

          <div>
            <DoneTestTickbox
              checked={doneTest}
              onCheckedChange={(checked) => {
                setDoneTest(checked as boolean);
                if (!checked) setTestDone("");
                setTestResultUrl(undefined);
                setSelectedResultFile(null);
              }}
            />
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
                    onClick={handleFileDeselect}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </div>
          )}

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
          {(selectedSymptoms.length > 0 || timeFromContactToSymptom !== "") && (
            <TimeFromContactToSymptomDropdown
              value={timeFromContactToSymptom}
              onValueChange={(value) =>
                setTimeFromContactToSymptom(value as TimeFromContactToSymptom)
              }
            />
          )}
        </div>
        <div className="flex gap-2 pt-4">
          <Button
            onClick={handleSave}
            className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
          >
            {t("saveChanges")}
          </Button>
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1 bg-transparent"
          >
            {t("cancel")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
