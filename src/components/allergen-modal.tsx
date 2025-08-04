"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus } from "lucide-react"
import { GradientSlider } from "./gradient-slider"
import { ScrollableSelect } from "./scrollable-select"
import { Symptom } from "@/modules/business-types"
import { AddAllergen$Params } from "@/modules/commands/AddAllergen/typing"
import { useTranslations } from "next-intl"

interface AllergenModalProps {
  symptoms: Symptom[]
  onAddAllergen: (allergen: AddAllergen$Params) => void
}

export function AllergenModal({ symptoms, onAddAllergen }: AllergenModalProps) {
  const t = useTranslations('allergenModal');
  const [open, setOpen] = useState(false)
  const [type, setType] = useState<"food" | "drug" | "respiratory" | "">("")
  const [name, setName] = useState("")
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([])
  const [prevalence, setPrevalence] = useState([1])
  const [description, setDescription] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (type && name && description && selectedSymptoms.length > 0) {
      onAddAllergen({
        type: type as "food" | "drug" | "respiratory",
        name,
        symptomsId: selectedSymptoms,
        prevalence: prevalence[0],
        description,
      })
      setType("")
      setName("")
      setSelectedSymptoms([])
      setPrevalence([1])
      setDescription("")
      setOpen(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          {t('addAllergen')}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-cyan-800">{t('addNewAllergen')}</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 max-h-[70vh] overflow-y-auto">
          <form onSubmit={handleSubmit} className="space-y-4 col-span-2">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('type')}</label>
                <Select value={type} onValueChange={(value) => setType(value as "food" | "drug" | "respiratory" | "")}>
                  <SelectTrigger className="border-cyan-300 focus:border-cyan-500">
                    <SelectValue placeholder={t('selectType')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="food">{t('food')}</SelectItem>
                    <SelectItem value="drug">{t('drug')}</SelectItem>
                    <SelectItem value="respiratory">{t('respiratory')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('name')}</label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t('enterName')}
                  required
                  className="border-cyan-300 focus:border-cyan-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <ScrollableSelect
                  items={symptoms.sort((a, b) => a.name.localeCompare(b.name))}
                  selectedItems={selectedSymptoms}
                  onSelectionChange={setSelectedSymptoms}
                  getItemId={(symptom: Symptom) => symptom.id}
                  getItemLabel={(symptom: Symptom) => symptom.name}
                  label={t('associatedSymptoms')}
                  maxHeight="max-h-32"
                />
              </div>

              <div>
                <GradientSlider value={prevalence} onValueChange={setPrevalence} min={1} max={5} label={t('prevalence')} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('description')}</label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={t('enterDescription')}
                required
                className="border-cyan-300 focus:border-cyan-500 min-h-[80px]"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
            >
              {t('addAllergen')}
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}