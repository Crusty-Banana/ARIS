"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, ArrowUp, ArrowDown, Info, Plus, Check } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Allergen, Allergy, Symptom } from "@/modules/business-types"
import { useTranslations } from "next-intl"

type SortOption = "name" | "severity" | "prevalence"
type SortDirection = "asc" | "desc"

interface WikiSymptomListProps {
  symptoms: Symptom[]
}

export function WikiSymptomList({ symptoms }: WikiSymptomListProps) {
  const t = useTranslations('wikiLists');
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState<SortOption>("name")
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc")
  const [selectedSymptom, setSelectedSymptom] = useState<Symptom | null>(null)

  const toggleSortDirection = () => {
    setSortDirection(sortDirection === "asc" ? "desc" : "asc")
  }

  const filteredAndSortedSymptoms = symptoms
    .filter((symptom) => symptom.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      let comparison = 0
      switch (sortBy) {
        case "name":
          comparison = a.name.localeCompare(b.name)
          break
        case "severity":
          comparison = a.severity - b.severity
          break
        case "prevalence":
          comparison = a.prevalence - b.prevalence
          break
      }
      return sortDirection === "asc" ? comparison : -comparison
    })

  return (
    <>
      <Card className="bg-gradient-to-br from-cyan-50 to-blue-50 border-cyan-200 w-full">
        <CardHeader>
          <CardTitle className="text-cyan-800 flex items-center justify-between">
            {t('symptoms')}
            <Badge variant="secondary">{symptoms.length}</Badge>
          </CardTitle>
          <div className="flex flex-col md:flex-row gap-2 mt-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={t('searchSymptoms')}
                className="pl-10 border-cyan-300 focus:border-cyan-500"
              />
            </div>
            <div className="flex items-center gap-2">
                <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
                  <SelectTrigger className="w-full flex-1 md:w-40 border-cyan-300 focus:border-cyan-500">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">{t('sortByName')}</SelectItem>
                    <SelectItem value="severity">{t('sortBySeverity')}</SelectItem>
                    <SelectItem value="prevalence">{t('sortByPrevalence')}</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm" onClick={toggleSortDirection} className="px-3 bg-transparent">
                  {sortDirection === "asc" ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
                </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {filteredAndSortedSymptoms.map((symptom) => (
              <div
                key={symptom.id}
                className="bg-white/70 backdrop-blur-sm p-3 rounded-lg border border-cyan-200 cursor-pointer hover:bg-white/90 transition-colors"
                onClick={() => setSelectedSymptom(symptom)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="font-medium text-cyan-800">{symptom.name}</div>
                    <div className="text-sm text-gray-600 flex items-center flex-wrap gap-2 mt-1">
                      <Badge
                        className={`${symptom.severity === 1 ? "bg-green-500" : symptom.severity === 2 ? "bg-yellow-500" : "bg-red-500"} text-white text-xs`}
                      >
                        {t('severity')}: {symptom.severity}
                      </Badge>
                      <Badge
                        className={`${symptom.prevalence <= 2 ? "bg-green-500" : symptom.prevalence <= 3 ? "bg-yellow-500" : "bg-red-500"} text-white text-xs`}
                      >
                        {t('prevalence')}: {symptom.prevalence}
                      </Badge>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-cyan-100 flex-shrink-0 ml-2">
                    <Info className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            {filteredAndSortedSymptoms.length === 0 && (
              <div className="text-center text-gray-500 py-4">{t('noSymptomsFound')}</div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Symptom Detail Modal */}
      <Dialog open={!!selectedSymptom} onOpenChange={() => setSelectedSymptom(null)}>
        <DialogContent className="max-w-lg">
          {selectedSymptom && (
            <>
              <DialogHeader>
                <DialogTitle className="text-cyan-800">{t('symptomDetails')}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('name')}</label>
                  <div className="p-2 bg-gray-50 rounded">{selectedSymptom.name}</div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('severity')}</label>
                    <Badge
                      className={`${selectedSymptom.severity === 1 ? "bg-green-500" : selectedSymptom.severity === 2 ? "bg-yellow-500" : "bg-red-500"} text-white`}
                    >
                      {t('severity')}: {selectedSymptom.severity}
                    </Badge>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('prevalence')}</label>
                    <Badge
                      className={`${selectedSymptom.prevalence <= 2 ? "bg-green-500" : selectedSymptom.prevalence <= 3 ? "bg-yellow-500" : "bg-red-500"} text-white`}
                    >
                      {t('prevalence')}: {selectedSymptom.prevalence}
                    </Badge>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('treatment')}</label>
                  <div className="p-2 bg-gray-50 rounded min-h-[100px]">{selectedSymptom.treatment}</div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

interface WikiAllergenListProps {
  allergens: Allergen[]
  symptoms: Symptom[]
  onQuickAdd?: (allergen: Allergen) => void
  userAllergenIds?: string[]
}

export function WikiAllergenList({ allergens, symptoms, onQuickAdd, userAllergenIds }: WikiAllergenListProps) {
  const t = useTranslations('wikiLists');
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState<SortOption>("name")
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [selectedAllergen, setSelectedAllergen] = useState<Allergen | null>(null)

  const toggleSortDirection = () => {
    setSortDirection(sortDirection === "asc" ? "desc" : "asc")
  }

  const filteredAndSortedAllergens = allergens
    .filter((allergen) => {
      const matchesSearch = allergen.name.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesType = typeFilter === "all" || allergen.type === typeFilter
      return matchesSearch && matchesType
    })
    .sort((a, b) => {
      let comparison = 0
      switch (sortBy) {
        case "name":
          comparison = a.name.localeCompare(b.name)
          break
        case "prevalence":
          comparison = a.prevalence - b.prevalence
          break
      }
      return sortDirection === "asc" ? comparison : -comparison
    })

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

  return (
    <>
      <Card className="bg-gradient-to-br from-cyan-50 to-blue-50 border-cyan-200 w-full">
        <CardHeader>
          <CardTitle className="text-cyan-800 flex items-center justify-between">
            {t('allergens')}
            <Badge variant="secondary">{allergens.length}</Badge>
          </CardTitle>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t('searchAllergens')}
              className="pl-10 border-cyan-300 focus:border-cyan-500 w-full"
            />
          </div>

          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full md:w-32 border-cyan-300 focus:border-cyan-500">
              <SelectValue placeholder="Filter by Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('allTypes')}</SelectItem>
              <SelectItem value="food">{t('food')}</SelectItem>
              <SelectItem value="drug">{t('drug')}</SelectItem>
              <SelectItem value="respiratory">{t('respiratory')}</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex items-center gap-2">
                <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
                  <SelectTrigger className="w-full flex-1 md:w-40 border-cyan-300 focus:border-cyan-500">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">{t('sortByName')}</SelectItem>
                    <SelectItem value="prevalence">{t('sortByPrevalence')}</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm" onClick={toggleSortDirection} className="px-3 bg-transparent">
                  {sortDirection === "asc" ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
                </Button>
            </div>
        </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {filteredAndSortedAllergens.map((allergen) => (
              <div
                key={allergen.id}
                className="bg-white/70 backdrop-blur-sm p-3 rounded-lg border border-cyan-200 cursor-pointer hover:bg-white/90 transition-colors"
                onClick={() => setSelectedAllergen(allergen)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="font-medium text-cyan-800">{allergen.name}</div>
                    <div className="text-sm text-gray-600 flex items-center flex-wrap gap-2 mt-1">
                      <Badge className={`${getTypeColor(allergen.type)} text-white text-xs capitalize`}>
                        {t(allergen.type)}
                      </Badge>
                      <Badge
                        className={`${allergen.prevalence <= 2 ? "bg-green-500" : allergen.prevalence <= 3 ? "bg-yellow-500" : "bg-red-500"} text-white text-xs`}
                      >
                        {t('prevalence')}: {allergen.prevalence}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {allergen.symptomsId.slice(0, 3).map((symptomId) => {
                        const symptom = symptoms.find((s) => s.id === symptomId)
                        return symptom ? (
                          <Badge key={symptomId} variant="outline" className="text-xs">
                            {symptom.name}
                          </Badge>
                        ) : null
                      })}
                      {allergen.symptomsId.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{allergen.symptomsId.length - 3} {t('more')}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-1 ml-2 flex-shrink-0">
                    {onQuickAdd && !userAllergenIds?.includes(allergen.id) && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          onQuickAdd(allergen)
                        }}
                        className="h-8 w-8 p-0 hover:bg-green-100 text-green-600 border border-green-200 hover:border-green-300"
                        title={t('allergenAddButtonTitle')}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    )}
                    {userAllergenIds?.includes(allergen.id) && (
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled
                        className="h-8 w-8 p-0 text-gray-400 border border-gray-200"
                        title={t('potentialCrossAllergens.alreadyInAllergens')}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    )}
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-cyan-100">
                      <Info className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            {filteredAndSortedAllergens.length === 0 && (
              <div className="text-center text-gray-500 py-4">{t('noAllergensFound')}</div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Allergen Detail Modal */}
      <Dialog open={!!selectedAllergen} onOpenChange={() => setSelectedAllergen(null)}>
        <DialogContent className="max-w-2xl">
          {selectedAllergen && (
            <>
              <DialogHeader>
                <DialogTitle className="text-cyan-800">{t('allergenDetails')}</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('name')}</label>
                  <div className="p-2 bg-gray-50 rounded">{selectedAllergen.name}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('type')}</label>
                  <Badge className={`${getTypeColor(selectedAllergen.type)} text-white capitalize`}>
                    {t(selectedAllergen.type)}
                  </Badge>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('prevalence')}</label>
                  <Badge
                    className={`${selectedAllergen.prevalence <= 2 ? "bg-green-500" : selectedAllergen.prevalence <= 3 ? "bg-yellow-500" : "bg-red-500"} text-white`}
                  >
                    {t('prevalence')}: {selectedAllergen.prevalence}
                  </Badge>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('associatedSymptoms')}</label>
                  <div className="flex flex-wrap gap-1">
                    {selectedAllergen.symptomsId.map((symptomId) => {
                      const symptom = symptoms.find((s) => s.id === symptomId)
                      return symptom ? (
                        <Badge key={symptomId} variant="outline" className="text-xs">
                          {symptom.name}
                        </Badge>
                      ) : null
                    })}
                  </div>
                </div>
                <div className="col-span-1 md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('description')}</label>
                  <div className="p-2 bg-gray-50 rounded min-h-[100px]">{selectedAllergen.description}</div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

interface WikiAllergyListProps {
  allergies: Allergy[]
  allergens: Allergen[]
}

export function WikiAllergyList({ allergies, allergens }: WikiAllergyListProps) {
  const t = useTranslations('wikiLists');
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAllergy, setSelectedAllergy] = useState<Allergy | null>(null)

  const filteredAllergies = allergies
    .filter((allergy) => allergy.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => a.name.localeCompare(b.name))

  return (
    <>
      <Card className="bg-gradient-to-br from-cyan-50 to-blue-50 border-cyan-200 w-full">
        <CardHeader>
          <CardTitle className="text-cyan-800 flex items-center justify-between">
            {t('allergies')}
            <Badge variant="secondary">{allergies.length}</Badge>
          </CardTitle>
          <div className="relative mt-2">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t('searchAllergies')}
              className="pl-10 border-cyan-300 focus:border-cyan-500"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {filteredAllergies.map((allergy) => (
              <div
                key={allergy.id}
                className="bg-white/70 backdrop-blur-sm p-3 rounded-lg border border-cyan-200 cursor-pointer hover:bg-white/90 transition-colors"
                onClick={() => setSelectedAllergy(allergy)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="font-medium text-cyan-800">{allergy.name}</div>
                    <div className="text-sm text-gray-600 mt-1">{allergy.allergensId.length} {t('allergen(s) associated')}</div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {allergy.allergensId.slice(0, 3).map((allergenId) => {
                        const allergen = allergens.find((a) => a.id === allergenId)
                        return allergen ? (
                          <Badge key={allergenId} variant="outline" className="text-xs">
                            {allergen.name}
                          </Badge>
                        ) : null
                      })}
                      {allergy.allergensId.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{allergy.allergensId.length - 3} {t('more')}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-cyan-100 flex-shrink-0 ml-2">
                    <Info className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            {filteredAllergies.length === 0 && <div className="text-center text-gray-500 py-4">{t('noAllergiesFound')}</div>}
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!selectedAllergy} onOpenChange={() => setSelectedAllergy(null)}>
        <DialogContent className="max-w-lg">
          {selectedAllergy && (
            <>
              <DialogHeader>
                <DialogTitle className="text-cyan-800">{t('allergyDetails')}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('name')}</label>
                  <div className="p-2 bg-gray-50 rounded">{selectedAllergy.name}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('associatedAllergens')}</label>
                  <div className="flex flex-wrap gap-1">
                    {selectedAllergy.allergensId.map((allergenId) => {
                      const allergen = allergens.find((a) => a.id === allergenId)
                      return allergen ? (
                        <Badge key={allergenId} variant="outline" className="text-xs">
                          {allergen.name}
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
    </>
  )
}