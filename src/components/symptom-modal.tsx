"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Plus } from "lucide-react"
import { GradientSlider } from "./gradient-slider"
import { AddSymptom$Params } from "@/modules/commands/AddSymptom/typing"
import { useTranslations } from "next-intl"

interface SymptomModalProps {
  onAddSymptom: (symptom: AddSymptom$Params) => void
}

export function SymptomModal({ onAddSymptom }: SymptomModalProps) {
  const t = useTranslations('symptomModal');
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [severity, setSeverity] = useState([1])
  const [prevalence, setPrevalence] = useState([1])
  const [treatment, setTreatment] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name && treatment) {
      onAddSymptom({
        name,
        severity: severity[0],
        prevalence: prevalence[0],
        treatment,
      })
      setName("")
      setSeverity([1])
      setPrevalence([1])
      setTreatment("")
      setOpen(false)
    }
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
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('symptomName')}</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('enterSymptomName')}
              required
              className="border-cyan-300 focus:border-cyan-500"
            />
          </div>

          <GradientSlider value={severity} onValueChange={setSeverity} min={1} max={3} label={t('severityLabel')} />

          <GradientSlider value={prevalence} onValueChange={setPrevalence} min={1} max={5} label={t('prevalenceLabel')} />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('treatment')}</label>
            <Textarea
              value={treatment}
              onChange={(e) => setTreatment(e.target.value)}
              placeholder={t('treatmentPlaceholder')}
              required
              className="border-cyan-300 focus:border-cyan-500 min-h-[100px]"
            />
          </div>

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