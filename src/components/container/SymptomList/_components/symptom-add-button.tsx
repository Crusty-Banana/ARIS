"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useTranslations } from "next-intl"
import { AddSymptom$Params } from "@/modules/commands/AddBusinessType/typing"
import { SymptomForm } from "./symptom-form"
import { Language, Organ } from "@/modules/business-types"

interface AddSymptomButtonProps {
  onAddSymptom: (symptom: AddSymptom$Params) => void
}

export function AddSymptomButton({ onAddSymptom }: AddSymptomButtonProps) {
  const t = useTranslations('symptomModal');
  const [open, setOpen] = useState(false)
  const [name, setName] = useState({"en": "", "vi": ""})
  const [severity, setSeverity] = useState(1)
  const [description, setDescription] = useState({"en": "", "vi": ""})
  const [organ, setOrgan] = useState<Organ>("respiratory")
  const [selectedLanguage, setSelectedLanguage] = useState<Language>("en")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name && description && organ) {
      onAddSymptom({
        name,
        severity: severity,
        description,
        organ,
      })
      setName({"en": "", "vi": ""})
      setOrgan("respiratory")
      setSeverity(1)
      setDescription({"en": "", "vi": ""})
      setOpen(false)
    }
  }
  const handleNameChange = (value: string) => {
    setName((prev) => ({
      ...prev,
      [selectedLanguage]: value,
    }))
  }

  const handleDescriptionChange = (value: string) => {
    setDescription((prev) => ({
      ...prev,
      [selectedLanguage]: value,
    }))
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          {t('addSymptom')}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-cyan-800">{t('addNewSymptom')}</DialogTitle>
          <DialogDescription />
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <SymptomForm 
            selectedLanguage={selectedLanguage}
            setSelectedLanguage={setSelectedLanguage}
            name={name}
            handleNameChange={handleNameChange}
            severity={severity}
            setSeverity={setSeverity}
            description={description}
            organ={organ}
            setOrgan={setOrgan}
            handleDescriptionChange={handleDescriptionChange}
          />
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
          >
            {t('addSymptom')}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}