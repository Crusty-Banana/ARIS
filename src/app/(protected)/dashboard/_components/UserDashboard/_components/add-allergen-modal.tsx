"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search } from "lucide-react"
import { ScrollableSelect } from "@/components/scrollable-select"
import { Allergen, DiscoveryMethod, Symptom } from "@/modules/business-types"

interface AddAllergenModalProps {
  open: boolean
  onClose: () => void
  availableAllergens: Allergen[]
  availableSymptoms: Symptom[]
  onAddAllergen: (allergen: {
    allergenId: string
    name: string
    type: "food" | "drug" | "respiratory"
    severity: number
    discoveryDate: number | null
    discoveryMethod: DiscoveryMethod
    symptomsId: string[]
  }) => void
}

export function AddAllergenModal({
  open,
  onClose,
  availableAllergens,
  availableSymptoms,
  onAddAllergen,
}: AddAllergenModalProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedAllergen, setSelectedAllergen] = useState<Allergen | null>(null)
  const [severity, setSeverity] = useState(1)
  const [discoveryDate, setDiscoveryDate] = useState<string>("")
  const [discoveryMethod, setDiscoveryMethod] = useState<DiscoveryMethod>(
    "Clinical symptoms",
  )
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([])

  const filteredAllergens = availableAllergens.filter((allergen) =>
    allergen.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getTypeColor = (type: string) => {
    switch (type) {
      case "food":
        return "bg-blue-500"
      case "drug":
        return "bg-purple-500"
      case "respiratory":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  const parseInputDate = (dateString: string) => {
    if (!dateString) return null
    return Math.floor(new Date(dateString).getTime() / 1000)
  }

  const handleSubmit = () => {
    if (!selectedAllergen) return

    onAddAllergen({
      allergenId: selectedAllergen.id,
      name: selectedAllergen.name,
      type: selectedAllergen.type,
      severity,
      discoveryDate: parseInputDate(discoveryDate),
      discoveryMethod,
      symptomsId: selectedSymptoms,
    })

    // Reset form
    setSelectedAllergen(null)
    setSeverity(1)
    setDiscoveryDate("")
    setDiscoveryMethod("Clinical symptoms")
    setSelectedSymptoms([])
    setSearchTerm("")
    onClose()
  }

  const handleAllergenSelect = (allergen: Allergen) => {
    setSelectedAllergen(allergen)
    // Pre-select symptoms that are associated with this allergen
    setSelectedSymptoms(allergen.symptomsId)
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-cyan-800">Add New Allergen</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-6 max-h-[70vh] overflow-y-auto">
          {/* Left Column - Allergen Selection */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search Allergens</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search for allergens..."
                  className="pl-10 border-cyan-300 focus:border-cyan-500"
                />
              </div>
            </div>

            <div className="border border-cyan-200 rounded-md max-h-64 overflow-y-auto">
              {filteredAllergens.map((allergen) => (
                <div
                  key={allergen.id}
                  className={`p-3 cursor-pointer hover:bg-cyan-50 border-b border-cyan-100 last:border-b-0 ${
                    selectedAllergen?.id === allergen.id ? "bg-cyan-100" : ""
                  }`}
                  onClick={() => handleAllergenSelect(allergen)}
                >
                  <div className="font-medium text-cyan-800">{allergen.name}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge className={`${getTypeColor(allergen.type)} text-white text-xs capitalize`}>
                      {allergen.type}
                    </Badge>
                    <span className="text-xs text-gray-500">{allergen.symptomsId.length} symptoms</span>
                  </div>
                </div>
              ))}
              {filteredAllergens.length === 0 && (
                <div className="p-4 text-center text-gray-500">No allergens found</div>
              )}
            </div>
          </div>

          {/* Right Column - Details */}
          <div className="space-y-4">
            {selectedAllergen && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Selected Allergen</label>
                  <div className="p-2 bg-cyan-50 rounded border">
                    <div className="font-medium">{selectedAllergen.name}</div>
                    <div className="text-sm text-gray-600 mt-1">{selectedAllergen.description}</div>
                  </div>
                </div>

                {/* <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Personal Severity (1-3)</label>
                  <Select value={severity.toString()} onValueChange={(value) => setSeverity(Number.parseInt(value))}>
                    <SelectTrigger className="border-cyan-300 focus:border-cyan-500">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 - Mild</SelectItem>
                      <SelectItem value="2">2 - Moderate</SelectItem>
                      <SelectItem value="3">3 - Severe</SelectItem>
                    </SelectContent>
                  </Select>
                </div> */}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Discovery Date</label>
                  <Input
                    type="date"
                    value={discoveryDate}
                    onChange={(e) => setDiscoveryDate(e.target.value)}
                    className="border-cyan-300 focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Discovery Method</label>
                  <Select value={discoveryMethod} onValueChange={(value) => setDiscoveryMethod(value as DiscoveryMethod)}>
                    <SelectTrigger className="border-cyan-300 focus:border-cyan-500">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Clinical symptoms">Clinical symptoms</SelectItem>
                      <SelectItem value="Paraclinical tests">Paraclinical tests</SelectItem>
                      <SelectItem value="Paraclinical tests">Potential</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <ScrollableSelect
                  items={availableSymptoms.sort((a, b) => a.name.localeCompare(b.name))}
                  selectedItems={selectedSymptoms}
                  onSelectionChange={setSelectedSymptoms}
                  getItemId={(symptom) => symptom.id}
                  getItemLabel={(symptom) => symptom.name}
                  label="Associated Symptoms"
                  maxHeight="max-h-32"
                />
              </>
            )}
          </div>
        </div>

        <div className="flex gap-2 pt-4 border-t">
          <Button
            onClick={handleSubmit}
            disabled={!selectedAllergen}
            className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
          >
            Add Allergen
          </Button>
          <Button variant="outline" onClick={onClose} className="flex-1 bg-transparent">
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
