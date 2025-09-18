"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Paperclip, Search, UploadCloud, XCircle } from "lucide-react"
import { Allergen, Language, Symptom, TestType } from "@/modules/business-types"
import { useLocale, useTranslations } from "next-intl"
import { PAPAllergen } from "@/modules/commands/UpdatePAPWithUserId/typing"
import { getTypeColor } from "@/lib/client-side-utils"
import { TestTypeDropdown } from "@/components/test-type-dropdown"
import { DoneTestTickbox } from "@/components/done-test-tickbox"
import { toast } from "sonner"
import { httpPost$AddFileToS3 } from "@/modules/commands/AddFileToS3/fetcher"
import { DatePicker } from "@/components/ui/custom-date-picker"
import { GroupedSymptomSelect } from "@/components/grouped-symptoms-select"

interface AddAllergenModalProps {
  open: boolean
  onClose: () => void
  availableAllergens: Allergen[]
  availableSymptoms: Symptom[]
  onAddAllergen: (allergen: PAPAllergen) => void
}

export function AddAllergenModal({
  open,
  onClose,
  availableAllergens,
  availableSymptoms,
  onAddAllergen,
}: AddAllergenModalProps) {
  const t = useTranslations('addAllergenModal');
  const localLanguage = useLocale() as Language;

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedAllergen, setSelectedAllergen] = useState<Allergen | null>(null)
  const [discoveryDate, setDiscoveryDate] = useState<Date | undefined>()
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([])
  const [doneTest, setDoneTest] = useState(false);
  const [testDone, setTestDone] = useState<TestType>("");

  const [selectedResultFile, setSelectedResultFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [testResultUrl, setTestResultUrl] = useState<string | undefined>();

  const filteredAllergens = availableAllergens.filter((allergen) =>
    allergen.name[localLanguage].toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // const parseInputDate = (dateString: string) => {
  //   if (!dateString) return null
  //   return Math.floor(new Date(dateString).getTime() / 1000)
  // };

  const parseInputDate = (date: Date | undefined) => {
    if (!date) return null
    return Math.floor(date.getTime() / 1000)
  };

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

  const handleSubmit = () => {
    if (!selectedAllergen) return;

    onAddAllergen({
      allergenId: selectedAllergen.id,
      discoveryDate: parseInputDate(discoveryDate),
      doneTest,
      testDone,
      symptomsId: selectedSymptoms,
      testResult: testResultUrl,
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
    setIsUploading(false);
    onClose()
  };

  const handleAllergenSelect = (allergen: Allergen) => {
    setSelectedAllergen(allergen);
    // Pre-select symptoms that are associated with this allergen
    setSelectedSymptoms(allergen.symptomsId);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent 
        className="max-w-3xl lg:max-w-5xl max-h-[90vh]"
      >
        <DialogHeader>
          <DialogTitle className="text-cyan-800">{t("addNewAllergen")}</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-h-[70vh] overflow-y-auto">
          {/* Left Column - Allergen Selection */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t("searchAllergen")}</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={t("searchAllergen")}
                  className="pl-10 border-cyan-300 focus:border-cyan-500"
                />
              </div>
            </div>

            <div className="border border-cyan-200 rounded-md max-h-64 overflow-y-auto">
              {filteredAllergens.map((allergen) => (
                <div
                  key={allergen.id}
                  className={`p-3 cursor-pointer hover:bg-cyan-50 border-b border-cyan-100 last:border-b-0 ${
                    selectedAllergen?.id === allergen.id ? "bg-cyan-100" : ""
                  }`}
                  onClick={() => handleAllergenSelect(allergen)}
                >
                  <div className="font-medium text-cyan-800">{allergen.name[localLanguage]}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge className={`${getTypeColor(allergen.type)} text-white text-xs capitalize`}>
                      {t(allergen.type)}
                    </Badge>
                    <span className="text-xs text-gray-500">{allergen.symptomsId.length} {t("symptoms")}</span>
                  </div>
                </div>
              ))}
              {filteredAllergens.length === 0 && (
                <div className="p-4 text-center text-gray-500">No allergens found</div>
              )}
            </div>
          </div>

          {/* Right Column - Details */}
          <div className="space-y-4">
            {selectedAllergen && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t("selectedAllergen")}</label>
                  <div className="p-2 bg-cyan-50 rounded border">
                    <div className="font-medium">{selectedAllergen.name[localLanguage]}</div>
                    <div className="text-sm text-gray-600 mt-1">{selectedAllergen.description[localLanguage]}</div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t("discoveryDate")}</label>
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
                        setSelectedResultFile(null);
                        setTestResultUrl(undefined);
                      }}
                    />
                </div>
                
                { doneTest && (
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
                          <span>{'View uploaded result'}</span>
                        </a>
                        <Button onClick={() => { setTestResultUrl(undefined); setSelectedResultFile(null); }} className="text-gray-500 hover:text-gray-700">
                          <XCircle className="h-5 w-5" />
                        </Button>
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
              </>
            )}
          </div>
        </div>

        <div className="flex gap-2 pt-4 border-t">
          <Button
            onClick={handleSubmit}
            disabled={!selectedAllergen}
            className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
          >
            {t("addAllergen")}
          </Button>
          <Button variant="outline" onClick={onClose} className="flex-1 bg-transparent">
            {t("cancel")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}