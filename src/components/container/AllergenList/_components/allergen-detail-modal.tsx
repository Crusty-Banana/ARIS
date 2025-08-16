import { LanguageDropdown } from "@/components/language-dropdown"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { getPrevalenceColor, getTypeColor } from "@/lib/client-side-utils"
import { Allergen, Language, Symptom } from "@/modules/business-types"
import { Edit, Save, Trash2, X } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { useState } from "react"
import { AllergenForm } from "./allergen-form"

interface AllergenDetailModalProps {
  allergen: Allergen
  symptoms: Symptom[]
  onClose: () => void
  onUpdate: (allergen: Allergen) => void
  onDelete: (id: string) => void
}

export function AllergenDetailModal({
  allergen,
  symptoms,
  onClose,
  onUpdate,
  onDelete,
}: AllergenDetailModalProps) {
  const t = useTranslations('detailModals');
  const localLanguage = useLocale() as Language;
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState<Allergen>(allergen)
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(localLanguage)

  const startEdit = () => {
    setIsEditing(true)
  }

  const cancelEdit = () => {
    setIsEditing(false)
  }

  const saveEdit = () => {
    onUpdate(editData)
    setIsEditing(false)
    onClose()
  }

  const handleDelete = () => {
    if (confirm(t('areYouSureAllergen'))) {
      onDelete(allergen.id)
      onClose()
    }
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-cyan-800 flex items-center justify-between pr-8">
            {t('allergenDetails')}
            <div className="flex gap-3">
              {!isEditing ? (
                <>
                  <Button variant="outline" size="sm" onClick={startEdit}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDelete}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 bg-transparent"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={saveEdit}
                    className="text-green-600 hover:bg-green-50 bg-transparent"
                  >
                    <Save className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={cancelEdit}>
                    <X className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
          </DialogTitle>
          <DialogDescription />
        </DialogHeader>
        {isEditing? (
          <AllergenForm 
            type={editData.type}
            setType={(type) => {setEditData({...editData!, type})}}
            selectedLanguage={selectedLanguage}
            setSelectedLanguage={setSelectedLanguage}
            name={editData.name}
            handleNameChange={(value) => {setEditData({...editData!, name: {...editData!.name, [selectedLanguage]: value}})}}
            description={editData.description}
            handleDescriptionChange={(value) => {setEditData({...editData!, description: {...editData!.description, [selectedLanguage]: value}})}}
            prevalence={editData.prevalence}
            setPrevalence={(value) => {setEditData({...editData!, prevalence: value})}}
            symptoms={symptoms}
            selectedSymptoms={editData.symptomsId}
            setSelectedSymptoms={(value) => {setEditData({...editData!, symptomsId: value})}}
          />
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('type')}</label>
                <Badge className={`${getTypeColor(allergen.type)} text-white capitalize`}>
                  {t(allergen.type)}
                </Badge>
              </div>
              <LanguageDropdown selectedLanguage={selectedLanguage} setSelectedLanguage={setSelectedLanguage} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('name')}</label>
                <div className="p-2 bg-gray-50 rounded">{allergen.name[selectedLanguage]}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('prevalence')}</label>
                <Badge className={`${getPrevalenceColor(allergen.prevalence)} text-white`}>
                  {t('prevalence')}: {allergen.prevalence}
                </Badge>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('description')}</label>
              <div className="p-2 bg-gray-50 rounded min-h-[100px]">{allergen.description[selectedLanguage]}</div>
            </div>
            <div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('associatedSymptoms')}</label>
                <div className="flex flex-wrap gap-1">
                  {allergen.symptomsId.map((symptomId) => {
                    const symptom = symptoms.find((s) => s.id === symptomId)
                    return symptom ? (
                      <Badge key={symptomId} variant="outline" className="text-xs">
                        {symptom.name[localLanguage]}
                      </Badge>
                    ) : null
                  })}
                </div>
              </div>
            </div>
          </>
        )}
        
      </DialogContent>
    </Dialog>
  )
}