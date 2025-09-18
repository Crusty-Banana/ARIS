import { LanguageDropdown } from "@/components/language-dropdown"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { getTypeColor } from "@/lib/client-side-utils"
import { Allergen, Language, Symptom } from "@/modules/business-types"
import { Edit, Save, Trash2, X } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { useState } from "react"
import { AllergenForm } from "./allergen-form"

interface AllergenDetailModalProps {
  allergen: Allergen
  symptoms: Symptom[]
  onClose: () => void
  onUpdate?: (allergen: Allergen) => void
  onDelete?: (id: string) => void
  allergens: Allergen[]
}

export function AllergenDetailModal({
  allergen,
  symptoms,
  onClose,
  onUpdate,
  onDelete,
  allergens,
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
    if (onUpdate) onUpdate(editData)
    setIsEditing(false)
    onClose()
  }

  const handleDelete = () => {
    if (confirm(t('areYouSureAllergen'))) {
      if (onDelete) onDelete(allergen.id)
      onClose()
    }
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-cyan-800 flex items-center justify-between pr-8">
            {t('allergenDetails')}
            <div className="flex gap-3">
              {(onUpdate && onDelete) && (!isEditing ? (
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
              ))}
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
            symptoms={symptoms}
            allergens={allergens}
            selectedSymptoms={editData.symptomsId}
            setSelectedSymptoms={(value) => {setEditData({...editData!, symptomsId: value})}}
            selectedCrossSensitivity={editData.crossSensitivityId}
            setSelectedCrossSensitivity={(value) => setEditData({...editData!, crossSensitivityId: value})}
            isWholeAllergen={editData.isWholeAllergen}
            setIsWholeAllergen={(value) => setEditData({...editData!, isWholeAllergen: value})}
            treatment={editData.treatment}
            handleTreatmentChange={(level, value) => setEditData({
              ...editData,
              treatment: {
                ...editData.treatment,
                [level]: {...editData.treatment[level], [selectedLanguage]: value},
              },
            })}
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
              {(onUpdate && onDelete) && <LanguageDropdown selectedLanguage={selectedLanguage} setSelectedLanguage={setSelectedLanguage} />}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('name')}</label>
                <div className="p-2 bg-gray-50 rounded">{allergen.name[selectedLanguage]}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('isWholeAllergen')}</label>
                <div className="p-2 bg-gray-50 rounded">
                  {allergen.isWholeAllergen ? t("wholeAllergen") : t("componentAllergen")}
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t("description")} ({selectedLanguage === "en" ? "English" : "Tiếng Việt"})</label>
              <div 
                className="p-2 bg-gray-50 rounded min-h-[100px] prose prose-sm max-w-none" 
                dangerouslySetInnerHTML={{ __html: allergen.description[selectedLanguage] }} 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('level_1Treatment')}</label>
              <div className="p-2 bg-gray-50 rounded min-h-[100px]">{allergen.treatment.level_1[selectedLanguage]}</div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('level_2Treatment')}</label>
              <div className="p-2 bg-gray-50 rounded min-h-[100px]">{allergen.treatment.level_2[selectedLanguage]}</div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('level_3Treatment')}</label>
              <div className="p-2 bg-gray-50 rounded min-h-[100px]">{allergen.treatment.level_3[selectedLanguage]}</div>
            </div>
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
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('crossSensitivity')}</label>
                <div className="flex flex-wrap gap-1">
                  {allergen.crossSensitivityId.map((allergenId) => {
                    const allergen = allergens.find((s) => s.id === allergenId)
                    return allergen ? (
                      <Badge key={allergenId} variant="outline" className="text-xs">
                        {allergen.name[localLanguage]}
                      </Badge>
                    ) : null
                  })}
                </div>
            </div>
          </>
        )}
        
      </DialogContent>
    </Dialog>
  )
}