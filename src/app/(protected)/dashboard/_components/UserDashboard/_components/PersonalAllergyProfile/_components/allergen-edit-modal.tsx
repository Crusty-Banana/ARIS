import { DoneTestTickbox } from "@/components/done-test-tickbox";
import { GroupedSymptomSelect } from "@/components/grouped-symptoms-select";
import { TestTypeDropdown } from "@/components/test-type-dropdown";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/custom-date-picker";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Language, Symptom, TestType } from "@/modules/business-types";
import { httpPost$AddFileToS3 } from "@/modules/commands/AddFileToS3/fetcher";
import { DisplayPAPAllergen } from "@/modules/commands/GetPAPWithUserId/typing";
import { UpdatePAPAllergen$Params } from "@/modules/commands/UpdatePAPWithUserId/typing";
import { Paperclip, UploadCloud, X, XCircle } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";

interface AllergenEditModalProps {
  allergen: DisplayPAPAllergen
  availableSymptoms: Symptom[]
  onUpdate: (updates: Omit<UpdatePAPAllergen$Params, "allergenId">) => void
  onClose: () => void
}

export function AllergenEditModal({ allergen, availableSymptoms, onUpdate, onClose }: AllergenEditModalProps) {
  const t = useTranslations('personalAllergyProfile');
  const localLanguage = useLocale() as Language;

  const [discoveryDate, setDiscoveryDate] = useState<Date | undefined>(allergen.discoveryDate ? new Date(allergen.discoveryDate * 1000) : undefined);
  const [selectedSymptoms, setSelectedSymptoms] = useState(allergen.symptoms.map((symptom) => symptom.symptomId));
  const [doneTest, setDoneTest] = useState(allergen.doneTest);
  const [testDone, setTestDone] = useState<TestType>(allergen.testDone ? allergen.testDone : "");
  const [selectedResultFile, setSelectedResultFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [testResultUrl, setTestResultUrl] = useState<string | undefined>(allergen.testResult);

  const parseInputDate = (date: Date | undefined) => {
    if (!date) return null;
    return Math.floor(date.getTime() / 1000);
  };

  const handleSave = () => {
    onUpdate({
      discoveryDate: parseInputDate(discoveryDate),
      doneTest: doneTest,
      testDone: testDone,
      symptomsId: selectedSymptoms,
      testResult: testResultUrl,
    });
  }

  const handleResultFileUpload = async () => {
      if (!selectedResultFile) return;
  
      setIsUploading(true);
      const uploadToast = toast.loading('Uploading File');
  
      const response = await httpPost$AddFileToS3('/api/user-s3-upload', selectedResultFile);
  
      if (response.success && response.result) {
        setTestResultUrl(response.result)
        toast.success('Upload Success', { id: uploadToast });
      } else {
        toast.error(response.message, { id: uploadToast });
      };
  
      setIsUploading(false);
    };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-cyan-800">{t('editAllergenTitle', {allergenName: allergen.name[localLanguage]})}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('discoveryDate')}</label>
            <DatePicker
              value={discoveryDate}
              onChange={setDiscoveryDate}
              placeholder={"select date"}
            />
          </div>

          <div className="flex gap-6">
            {doneTest && (
              <div className="flex-1">
                <TestTypeDropdown value={testDone} onValueChange={(value) => setTestDone(value as TestType)} />
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
              <label className="block text-sm font-medium text-gray-700 mb-1">{'Test Result'}</label>
                {!testResultUrl && (
                  <div className="relative border-2 border-dashed border-cyan-300 rounded-lg p-6 flex flex-col items-center justify-center text-center">
                    <UploadCloud className="h-10 w-10 text-cyan-500 mb-2" />
                    <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-cyan-600 hover:text-cyan-500 focus-within:outline-none">
                      <span>{'Upload Test Result file'}</span>
                      <input id="file-upload" name="file-upload" type="file" className="sr-only" accept=".pdf" onChange={(e) => setSelectedResultFile(e.target.files?.[0] || null)} />
                    </label>
                    <p className="text-xs text-gray-500 mt-1">{'pdf'}</p>
                  </div>
                )}

              {selectedResultFile && !testResultUrl && (
                <div className="mt-2 flex items-center justify-between p-2 bg-gray-100 rounded-md">
                  <div className="flex items-center gap-2 text-sm">
                    <Paperclip className="h-4 w-4" />
                    <span>{selectedResultFile.name}</span>
                  </div>
                  <Button onClick={handleResultFileUpload} disabled={isUploading} size="sm">
                    {isUploading ? 'Uploading' : 'Upload'}
                  </Button>
                </div>
              )}

              {testResultUrl && (
                <div className="mt-2 flex items-center justify-between p-2 bg-green-100 border border-green-300 text-green-800 rounded-md">
                  <a href={testResultUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm hover:underline">
                    <Paperclip className="h-4 w-4" />
                    <span>{'View Result'}</span>
                  </a>
                  {/* <Button onClick={() => { setTestResultUrl(undefined); setSelectedResultFile(null); }} className="text-gray-500 hover:text-gray-700">
                    <XCircle className="h-5 w-5" />
                  </Button> */}

                  <Badge variant="default" className="flex items-center gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 hover:bg-red-100"
                      onClick={() => { setTestResultUrl(undefined); setSelectedResultFile(null); }}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                </div>
              )}
            </div>
          )}

          <GroupedSymptomSelect
            items={availableSymptoms.sort((a, b) => a.name[localLanguage].localeCompare(b.name[localLanguage]))}
            selectedItems={selectedSymptoms}
            onSelectionChange={setSelectedSymptoms}
            getItemId={(symptom) => symptom.id}
            getItemLabel={(symptom) => symptom.name[localLanguage]}
            label={t("associatedSymptoms")}
          />

          <div className="flex gap-2 pt-4">
            <Button
              onClick={handleSave}
              className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
            >
              {t('saveChanges')}
            </Button>
            <Button variant="outline" onClick={onClose} className="flex-1 bg-transparent">
              {t('cancel')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}