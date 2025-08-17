import { LanguageDropdown } from "@/components/language-dropdown"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Allergen, Allergy, Language } from "@/modules/business-types"
import { Edit, Save, Trash2, X } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { useState } from "react"
import { AllergyForm } from "./allergy-form"

interface AllergyDetailModalProps {
  allergy: Allergy
  allergens: Allergen[]
  onClose: () => void
  onUpdate?: (allergy: Allergy) => void
  onDelete?: (id: string) => void
}

export function AllergyDetailModal({ allergy, allergens, onClose, onUpdate, onDelete }: AllergyDetailModalProps) {
  const t = useTranslations('detailModals');
  const localLanguage = useLocale() as Language;
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState<Allergy>(allergy)
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
    if (confirm(t('areYouSureAllergy'))) {
      if(onDelete) onDelete(allergy.id)
      onClose()
    }
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-cyan-800 flex items-center justify-between pr-8">
            {t('allergyDetails')}
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
          <AllergyForm 
            selectedLanguage={selectedLanguage}
            setSelectedLanguage={setSelectedLanguage}
            name={editData.name}
            handleNameChange={(value) => {setEditData({...editData, name: {...editData.name, [selectedLanguage]: value}})}}
            allergens={allergens}
            selectedAllergens={editData.allergensId}
            setSelectedAllergens={(value) => {setEditData({...editData, allergensId: value})}}
          />
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('name')}</label>
                <div className="p-2 bg-gray-50 rounded">{allergy.name[localLanguage]}</div>
              </div>
              {(onUpdate && onDelete) && <LanguageDropdown selectedLanguage={selectedLanguage} setSelectedLanguage={setSelectedLanguage} />}
            </div>
            <div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('associatedAllergens')}</label>
                <div className="flex flex-wrap gap-1">
                  {allergy.allergensId.map((allergenId) => {
                    const allergen = allergens.find((a) => a.id === allergenId)
                    return allergen ? (
                      <Badge key={allergenId} variant="outline" className="text-xs">
                        {allergen.name[localLanguage]}
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