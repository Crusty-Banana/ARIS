"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { Allergen, DisplayString, Language } from "@/modules/business-types"
import { useLocale, useTranslations } from "next-intl"
import { AddAllergy$Params } from "@/modules/commands/AddBusinessType/typing"
import { AllergyForm } from "./allergy-form"

interface AddAllergyButtonProps {
  allergens: Allergen[]
  onAddAllergy: (allergy: AddAllergy$Params) => void
}

export function AddAllergyButton({ allergens, onAddAllergy }: AddAllergyButtonProps) {
  const t = useTranslations('allergyModal');
  const localLanguage = useLocale() as Language;

  const [open, setOpen] = useState(false)
  const [name, setName] = useState<DisplayString>({en: "", vi: ""})
  const [selectedAllergens, setSelectedAllergens] = useState<string[]>([])
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(localLanguage);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name && selectedAllergens.length > 0) {
      onAddAllergy({
        name,
        allergensId: selectedAllergens,
      })
      setName({en: "", vi: ""})
      setSelectedAllergens([])
      setOpen(false)
    }
  }
  const handleNameChange = (value: string) => {
    setName((prev) => ({
      ...prev,
      [selectedLanguage]: value,
    }))
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          {t('addAllergy')}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-cyan-800">{t('addNewAllergy')}</DialogTitle>
          <DialogDescription />
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <AllergyForm 
            selectedLanguage={selectedLanguage}
            setSelectedLanguage={setSelectedLanguage}
            name={name}
            handleNameChange={handleNameChange}
            allergens={allergens}
            selectedAllergens={selectedAllergens}
            setSelectedAllergens={setSelectedAllergens}
          />
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
          >
            {t('addAllergy')}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}