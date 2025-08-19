import { DiscoveryMethodDropdown } from "@/components/discovery-method-dropdown";
import { DoneTestTickbox } from "@/components/done-test-tickbox";
import { ScrollableSelect } from "@/components/scrollable-select";
import { TestTypeDropdown } from "@/components/test-type-dropdown";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { DiscoveryMethod, Language, Symptom, TestType } from "@/modules/business-types";
import { DisplayPAPAllergen } from "@/modules/commands/GetPAPWithUserId/typing";
import { UpdatePAPAllergen$Params } from "@/modules/commands/UpdatePAPWithUserId/typing";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";

interface AllergenEditModalProps {
  allergen: DisplayPAPAllergen
  availableSymptoms: Symptom[]
  onUpdate: (updates: Omit<UpdatePAPAllergen$Params, "allergenId">) => void
  onClose: () => void
}

export function AllergenEditModal({ allergen, availableSymptoms, onUpdate, onClose }: AllergenEditModalProps) {
  const t = useTranslations('personalAllergyProfile');
  const localLanguage = useLocale() as Language;

  const [discoveryDate, setDiscoveryDate] = useState(allergen.discoveryDate)
  const [discoveryMethod, setDiscoveryMethod] = useState(allergen.discoveryMethod)
  const [selectedSymptoms, setSelectedSymptoms] = useState(allergen.symptoms.map((symptom) => symptom.symptomId))
  const [doneTest, setDoneTest] = useState(false);
  const [testDone, setTestDone] = useState<TestType>("");

  const formatDateForInput = (timestamp: number | null) => {
    if (!timestamp) return ""
    return new Date(timestamp * 1000).toISOString().split("T")[0]
  }

  const parseInputDate = (dateString: string) => {
    if (!dateString) return null
    return Math.floor(new Date(dateString).getTime() / 1000)
  }

  const handleSave = () => {
    onUpdate({
      discoveryDate,
      discoveryMethod,
      doneTest,
      testDone,
      symptomsId: selectedSymptoms,
    })
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-cyan-800">{t('editAllergenTitle', {allergenName: allergen.name[localLanguage]})}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('discoveryDate')}</label>
            <Input
              type="date"
              value={formatDateForInput(discoveryDate)}
              onChange={(e) => setDiscoveryDate(parseInputDate(e.target.value))}
              className="border-cyan-300 focus:border-cyan-500"
            />
          </div>

          <div className="flex gap-6">
            <div className="flex-1">
              <DiscoveryMethodDropdown value={discoveryMethod} onValueChange={(value) => setDiscoveryMethod(value as DiscoveryMethod)}/>
            </div>
            {doneTest && (
              <div className="flex-1">
                <TestTypeDropdown value={testDone} onValueChange={(value) => setTestDone(value as TestType)} />
              </div>
            )}
          </div>
          <div>
            {discoveryMethod === "Clinical symptoms" && (
              <DoneTestTickbox 
                checked={doneTest} 
                onCheckedChange={(checked) => {
                  setDoneTest(checked as boolean)
                  if (!checked) setTestDone("")
                }}
              />
            )}
          </div>
          <ScrollableSelect
            items={availableSymptoms.sort((a, b) => a.name[localLanguage].localeCompare(b.name[localLanguage]))}
            selectedItems={selectedSymptoms}
            onSelectionChange={setSelectedSymptoms}
            getItemId={(symptom) => symptom.id}
            getItemLabel={(symptom) => symptom.name[localLanguage]}
            label={t('associatedSymptoms')}
            maxHeight="max-h-48"
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