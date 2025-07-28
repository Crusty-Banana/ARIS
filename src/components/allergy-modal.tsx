"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus } from "lucide-react"
import { ScrollableSelect } from "./scrollable-select"
import { Allergen } from "@/modules/business-types"
import { AddAllergy$Params } from "@/modules/commands/AddAllergy/typing"

interface AllergyModalProps {
  allergens: Allergen[]
  onAddAllergy: (allergy: AddAllergy$Params) => void
}

export function AllergyModal({ allergens, onAddAllergy }: AllergyModalProps) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [selectedAllergens, setSelectedAllergens] = useState<string[]>([])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name && selectedAllergens.length > 0) {
      onAddAllergy({
        name,
        allergensId: selectedAllergens,
      })
      setName("")
      setSelectedAllergens([])
      setOpen(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Add Allergy
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-cyan-800">Add New Allergy</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Allergy Name</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter allergy name"
              required
              className="border-cyan-300 focus:border-cyan-500"
            />
          </div>

          <ScrollableSelect
            items={allergens.sort((a, b) => a.name.localeCompare(b.name))}
            selectedItems={selectedAllergens}
            onSelectionChange={setSelectedAllergens}
            getItemId={(allergen) => allergen.id}
            getItemLabel={(allergen) => allergen.name}
            label="Associated Allergens"
            maxHeight="max-h-48"
          />

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
          >
            Add Allergy
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
