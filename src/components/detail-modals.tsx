"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Trash2, Edit, Save, X } from "lucide-react"
import { GradientSlider } from "./gradient-slider"
import { ScrollableSelect } from "./scrollable-select"
import { Allergen, Allergy, Symptom } from "@/modules/business-types"
import { useTranslations } from "next-intl"


interface SymptomDetailModalProps {
  symptom: Symptom | null
  open: boolean
  onClose: () => void
  onUpdate: (symptom: Symptom) => void
  onDelete: (id: string) => void
}

export function SymptomDetailModal({ symptom, open, onClose, onUpdate, onDelete }: SymptomDetailModalProps) {
  const t = useTranslations('detailModals');
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState<Symptom | null>(null)

  const startEdit = () => {
    if (symptom) {
      setEditData({ ...symptom })
      setIsEditing(true)
    }
  }

  const cancelEdit = () => {
    setIsEditing(false)
    setEditData(null)
  }

  const saveEdit = () => {
    if (editData) {
      onUpdate(editData)
      setIsEditing(false)
      setEditData(null)
      onClose()
    }
  }

  const handleDelete = () => {
    if (symptom && confirm(t('areYouSureSymptom'))) {
      onDelete(symptom.id)
      onClose()
    }
  }

  if (!symptom) return null

  const currentData = isEditing ? editData! : symptom

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-cyan-800 flex items-center justify-between pr-8">
            {t('symptomDetails')}
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
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('name')}</label>
            {isEditing ? (
              <Input
                value={currentData.name}
                onChange={(e) => setEditData({ ...editData!, name: e.target.value })}
                className="border-cyan-300 focus:border-cyan-500"
              />
            ) : (
              <div className="p-2 bg-gray-50 rounded">{currentData.name}</div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('severity')}</label>
            {isEditing ? (
              <GradientSlider
                value={[currentData.severity]}
                onValueChange={(value) => setEditData({ ...editData!, severity: value[0] })}
                min={1}
                max={3}
                label=""
              />
            ) : (
              <Badge
                className={`${currentData.severity === 1 ? "bg-green-500" : currentData.severity === 2 ? "bg-yellow-500" : "bg-red-500"} text-white`}
              >
                {t('severity')}: {currentData.severity}
              </Badge>
            )}
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('prevalence')}</label>
            {isEditing ? (
              <GradientSlider
                value={[currentData.prevalence]}
                onValueChange={(value) => setEditData({ ...editData!, prevalence: value[0] })}
                min={1}
                max={5}
                label=""
              />
            ) : (
              <Badge
                className={`${currentData.prevalence <= 2 ? "bg-green-500" : currentData.prevalence <= 3 ? "bg-yellow-500" : "bg-red-500"} text-white`}
              >
                {t('prevalence')}: {currentData.prevalence}
              </Badge>
            )}
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('treatment')}</label>
            {isEditing ? (
              <Textarea
                value={currentData.treatment}
                onChange={(e) => setEditData({ ...editData!, treatment: e.target.value })}
                className="border-cyan-300 focus:border-cyan-500 min-h-[100px]"
              />
            ) : (
              <div className="p-2 bg-gray-50 rounded min-h-[100px]">{currentData.treatment}</div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

interface AllergenDetailModalProps {
  allergen: Allergen | null
  symptoms: Symptom[]
  open: boolean
  onClose: () => void
  onUpdate: (allergen: Allergen) => void
  onDelete: (id: string) => void
}

export function AllergenDetailModal({
  allergen,
  symptoms,
  open,
  onClose,
  onUpdate,
  onDelete,
}: AllergenDetailModalProps) {
  const t = useTranslations('detailModals');
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState<Allergen | null>(null)

  const startEdit = () => {
    if (allergen) {
      setEditData({ ...allergen })
      setIsEditing(true)
    }
  }

  const cancelEdit = () => {
    setIsEditing(false)
    setEditData(null)
  }

  const saveEdit = () => {
    if (editData) {
      onUpdate(editData)
      setIsEditing(false)
      setEditData(null)
      onClose()
    }
  }

  const handleDelete = () => {
    if (allergen && confirm(t('areYouSureAllergen'))) {
      onDelete(allergen.id)
      onClose()
    }
  }

  if (!allergen) return null

  const currentData = isEditing ? editData! : allergen

  return (
    <Dialog open={open} onOpenChange={onClose}>
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
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('name')}</label>
            {isEditing ? (
              <Input
                value={currentData.name}
                onChange={(e) => setEditData({ ...editData!, name: e.target.value })}
                className="border-cyan-300 focus:border-cyan-500"
              />
            ) : (
              <div className="p-2 bg-gray-50 rounded">{currentData.name}</div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('type')}</label>
            {isEditing ? (
              <Select
                value={currentData.type}
                onValueChange={(value) => setEditData({ ...editData!, type: value as "food" | "drug" | "respiratory" })}
              >
                <SelectTrigger className="border-cyan-300 focus:border-cyan-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="food">{t('food')}</SelectItem>
                  <SelectItem value="drug">{t('drug')}</SelectItem>
                  <SelectItem value="respiratory">{t('respiratory')}</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <Badge
                className={`${currentData.type === "food" ? "bg-blue-500" : currentData.type === "drug" ? "bg-purple-500" : "bg-green-500"} text-white capitalize`}
              >
                {t(currentData.type)}
              </Badge>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('associatedSymptoms')}</label>
            {isEditing ? (
              <ScrollableSelect
                items={symptoms.sort((a, b) => a.name.localeCompare(b.name))}
                selectedItems={currentData.symptomsId}
                onSelectionChange={(selected) => setEditData({ ...editData!, symptomsId: selected })}
                getItemId={(symptom) => symptom.id}
                getItemLabel={(symptom) => symptom.name}
                label=""
                maxHeight="max-h-32"
              />
            ) : (
              <div className="flex flex-wrap gap-1">
                {currentData.symptomsId.map((symptomId) => {
                  const symptom = symptoms.find((s) => s.id === symptomId)
                  return symptom ? (
                    <Badge key={symptomId} variant="outline" className="text-xs">
                      {symptom.name}
                    </Badge>
                  ) : null
                })}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('prevalence')}</label>
            {isEditing ? (
              <GradientSlider
                value={[currentData.prevalence]}
                onValueChange={(value) => setEditData({ ...editData!, prevalence: value[0] })}
                min={1}
                max={5}
                label=""
              />
            ) : (
              <Badge
                className={`${currentData.prevalence <= 2 ? "bg-green-500" : currentData.prevalence <= 3 ? "bg-yellow-500" : "bg-red-500"} text-white`}
              >
                {t('prevalence')}: {currentData.prevalence}
              </Badge>
            )}
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('description')}</label>
            {isEditing ? (
              <Textarea
                value={currentData.description}
                onChange={(e) => setEditData({ ...editData!, description: e.target.value })}
                className="border-cyan-300 focus:border-cyan-500 min-h-[100px]"
              />
            ) : (
              <div className="p-2 bg-gray-50 rounded min-h-[100px]">{currentData.description}</div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

interface AllergyDetailModalProps {
  allergy: Allergy | null
  allergens: Allergen[]
  open: boolean
  onClose: () => void
  onUpdate: (allergy: Allergy) => void
  onDelete: (id: string) => void
}

export function AllergyDetailModal({ allergy, allergens, open, onClose, onUpdate, onDelete }: AllergyDetailModalProps) {
  const t = useTranslations('detailModals');
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState<Allergy | null>(null)

  const startEdit = () => {
    if (allergy) {
      setEditData({ ...allergy })
      setIsEditing(true)
    }
  }

  const cancelEdit = () => {
    setIsEditing(false)
    setEditData(null)
  }

  const saveEdit = () => {
    if (editData) {
      onUpdate(editData)
      setIsEditing(false)
      setEditData(null)
      onClose()
    }
  }

  const handleDelete = () => {
    if (allergy && confirm(t('areYouSureAllergy'))) {
      onDelete(allergy.id)
      onClose()
    }
  }

  if (!allergy) return null

  const currentData = isEditing ? editData! : allergy

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-cyan-800 flex items-center justify-between pr-8">
            {t('allergyDetails')}
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
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('name')}</label>
            {isEditing ? (
              <Input
                value={currentData.name}
                onChange={(e) => setEditData({ ...editData!, name: e.target.value })}
                className="border-cyan-300 focus:border-cyan-500"
              />
            ) : (
              <div className="p-2 bg-gray-50 rounded">{currentData.name}</div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('associatedAllergens')}</label>
            {isEditing ? (
              <ScrollableSelect
                items={allergens.sort((a, b) => a.name.localeCompare(b.name))}
                selectedItems={currentData.allergensId}
                onSelectionChange={(selected) => setEditData({ ...editData!, allergensId: selected })}
                getItemId={(allergen) => allergen.id}
                getItemLabel={(allergen) => allergen.name}
                label=""
                maxHeight="max-h-48"
              />
            ) : (
              <div className="flex flex-wrap gap-1">
                {currentData.allergensId.map((allergenId) => {
                  const allergen = allergens.find((a) => a.id === allergenId)
                  return allergen ? (
                    <Badge key={allergenId} variant="outline" className="text-xs">
                      {allergen.name}
                    </Badge>
                  ) : null
                })}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}