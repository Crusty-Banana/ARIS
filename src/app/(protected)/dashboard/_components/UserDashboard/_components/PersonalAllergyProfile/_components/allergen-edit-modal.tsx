import { DoneTestTickbox } from "@/components/done-test-tickbox";
import { GroupedSymptomSelect } from "@/components/grouped-symptoms-select";
import { ScrollableSelect } from "@/components/scrollable-select";
import { TestTypeDropdown } from "@/components/test-type-dropdown";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/custom-date-picker";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Language, Symptom, TestType } from "@/modules/business-types";
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

  const [discoveryDate, setDiscoveryDate] = useState<Date | undefined>(allergen.discoveryDate ? new Date(allergen.discoveryDate * 1000) : undefined);
  const [selectedSymptoms, setSelectedSymptoms] = useState(allergen.symptoms.map((symptom) => symptom.symptomId));
  const [doneTest, setDoneTest] = useState(allergen.doneTest);
  const [testDone, setTestDone] = useState<TestType>(allergen.testDone ? allergen.testDone : "");

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
                  setDoneTest(checked as boolean)
                  if (!checked) setTestDone("")
                }}
              />
          </div>
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