import { ScrollableSelect } from "@/components/scrollable-select";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DiscoveryMethod, Symptom } from "@/modules/business-types";
import { DisplayPAPAllergen } from "@/modules/commands/GetPAP/typing";
import { UpdatePAPAllergen$Params } from "@/modules/commands/UpdatePAP/typing";
import { useTranslations } from "next-intl";
import { useState } from "react";

interface AllergenEditModalProps {
  allergen: DisplayPAPAllergen
  availableSymptoms: Symptom[]
  onUpdate: (updates: Omit<UpdatePAPAllergen$Params, "allergenId">) => void
  onClose: () => void
}

export function AllergenEditModal({ allergen, availableSymptoms, onUpdate, onClose }: AllergenEditModalProps) {
  const t = useTranslations('personalAllergyProfile');
  const [discoveryDate, setDiscoveryDate] = useState(allergen.discoveryDate)
  const [discoveryMethod, setDiscoveryMethod] = useState(allergen.discoveryMethod)
  const [selectedSymptoms, setSelectedSymptoms] = useState(allergen.symptoms.map((symptom) => symptom.symptomId))

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
      symptomsId: selectedSymptoms,
    })
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-cyan-800">{t('editAllergenTitle', {allergenName: allergen.name})}</DialogTitle>
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('discoveryMethod')}</label>
            <Select value={discoveryMethod} onValueChange={(value: DiscoveryMethod) => setDiscoveryMethod(value as DiscoveryMethod)}>
              <SelectTrigger className="border-cyan-300 focus:border-cyan-500">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Clinical symptoms">{t('clinicalSymptoms')}</SelectItem>
                <SelectItem value="Paraclinical tests">{t('paraclinicalTests')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <ScrollableSelect
            items={availableSymptoms.sort((a, b) => a.name.localeCompare(b.name))}
            selectedItems={selectedSymptoms}
            onSelectionChange={setSelectedSymptoms}
            getItemId={(symptom) => symptom.id}
            getItemLabel={(symptom) => symptom.name}
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