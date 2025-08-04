"use client"

import type React from "react"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, ArrowUp, ArrowDown, Edit, Trash2 } from "lucide-react"
import { Allergen, Allergy, Symptom } from "@/modules/business-types"
import { useTranslations } from "next-intl"

type SortOption = "name" | "severity" | "prevalence"
type SortDirection = "asc" | "desc"

interface SymptomListProps {
  symptoms: Symptom[]
  onItemClick: (symptom: Symptom) => void
  onEdit: (symptom: Symptom) => void
  onDelete: (id: string) => void
}

export function SymptomList({ symptoms, onItemClick, onEdit, onDelete }: SymptomListProps) {
  const t = useTranslations('wikiLists');
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState<SortOption>("name")
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc")

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

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    if (confirm(t('detailModals.areYouSureSymptom'))) {
      onDelete(id)
    }
  }

  const handleEdit = (e: React.MouseEvent, symptom: Symptom) => {
    e.stopPropagation()
    onEdit(symptom)
  }

  return (
    <Card className="bg-gradient-to-br from-cyan-50 to-blue-50 border-cyan-200">
      <CardHeader>
        <CardTitle className="text-cyan-800 flex items-center justify-between">
          {t('symptoms')}
          <Badge variant="secondary">{symptoms.length}</Badge>
        </CardTitle>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t('searchSymptoms')}
              className="pl-10 border-cyan-300 focus:border-cyan-500"
            />
          </div>
          <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
            <SelectTrigger className="w-40 border-cyan-300 focus:border-cyan-500">
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
      </CardHeader>
      <CardContent>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {filteredAndSortedSymptoms.map((symptom) => (
            <div
              key={symptom.id}
              className="bg-white/70 backdrop-blur-sm p-3 rounded-lg border border-cyan-200 cursor-pointer hover:bg-white/90 transition-colors"
              onClick={() => onItemClick(symptom)}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="font-medium text-cyan-800">{symptom.name}</div>
                  <div className="text-sm text-gray-600 flex items-center gap-2 mt-1">
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
                <div className="flex gap-1 ml-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => handleEdit(e, symptom)}
                    className="h-8 w-8 p-0 hover:bg-cyan-100"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => handleDelete(e, symptom.id)}
                    className="h-8 w-8 p-0 hover:bg-red-100 text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
          {filteredAndSortedSymptoms.length === 0 && (
            <div className="text-center text-gray-500 py-4">{t('noSymptomsFound')}</div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

interface AllergenListProps {
  allergens: Allergen[]
  symptoms: Symptom[]
  onItemClick: (allergen: Allergen) => void
  onEdit: (allergen: Allergen) => void
  onDelete: (id: string) => void
}

export function AllergenList({ allergens, symptoms, onItemClick, onEdit, onDelete }: AllergenListProps) {
  const t = useTranslations('wikiLists');
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState<SortOption>("name")
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc")
  const [typeFilter, setTypeFilter] = useState<string>("all")

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

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    if (confirm(t('detailModals.areYouSureAllergen'))) {
      onDelete(id)
    }
  }

  const handleEdit = (e: React.MouseEvent, allergen: Allergen) => {
    e.stopPropagation()
    onEdit(allergen)
  }

  return (
    <Card className="bg-gradient-to-br from-cyan-50 to-blue-50 border-cyan-200">
      <CardHeader>
        <CardTitle className="text-cyan-800 flex items-center justify-between">
          {t('allergens')}
          <Badge variant="secondary">{allergens.length}</Badge>
        </CardTitle>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t('searchAllergens')}
              className="pl-10 border-cyan-300 focus:border-cyan-500"
            />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-32 border-cyan-300 focus:border-cyan-500">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('allTypes')}</SelectItem>
              <SelectItem value="food">{t('food')}</SelectItem>
              <SelectItem value="drug">{t('drug')}</SelectItem>
              <SelectItem value="respiratory">{t('respiratory')}</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
            <SelectTrigger className="w-40 border-cyan-300 focus:border-cyan-500">
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
      </CardHeader>
      <CardContent>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {filteredAndSortedAllergens.map((allergen) => (
            <div
              key={allergen.id}
              className="bg-white/70 backdrop-blur-sm p-3 rounded-lg border border-cyan-200 cursor-pointer hover:bg-white/90 transition-colors"
              onClick={() => onItemClick(allergen)}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="font-medium text-cyan-800">{allergen.name}</div>
                  <div className="text-sm text-gray-600 flex items-center gap-2 mt-1">
                    <Badge className={`${getTypeColor(allergen.type)} text-white text-xs capitalize`}>
                      {allergen.type}
                    </Badge>
                    <Badge
                      className={`${allergen.prevalence <= 2 ? "bg-green-500" : allergen.prevalence <= 3 ? "bg-yellow-500" : "bg-red-500"} text-white text-xs`}
                    >
                      {t('prevalence')}: {allergen.prevalence}
                    </Badge>
                  </div>
                  {/* Show up to 3 associated symptoms */}
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
                <div className="flex gap-1 ml-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => handleEdit(e, allergen)}
                    className="h-8 w-8 p-0 hover:bg-cyan-100"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => handleDelete(e, allergen.id)}
                    className="h-8 w-8 p-0 hover:bg-red-100 text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
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
  )
}

interface AllergyListProps {
  allergies: Allergy[]
  allergens: Allergen[]
  onItemClick: (allergy: Allergy) => void
  onEdit: (allergy: Allergy) => void
  onDelete: (id: string) => void
}

export function AllergyList({ allergies, allergens, onItemClick, onEdit, onDelete }: AllergyListProps) {
  const t = useTranslations('wikiLists');
  const [searchTerm, setSearchTerm] = useState("")

  const filteredAllergies = allergies
    .filter((allergy) => allergy.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => a.name.localeCompare(b.name))

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    if (confirm(t('detailModals.areYouSureAllergy'))) {
      onDelete(id)
    }
  }

  const handleEdit = (e: React.MouseEvent, allergy: Allergy) => {
    e.stopPropagation()
    onEdit(allergy)
  }

  return (
    <Card className="bg-gradient-to-br from-cyan-50 to-blue-50 border-cyan-200">
      <CardHeader>
        <CardTitle className="text-cyan-800 flex items-center justify-between">
          {t('allergies')}
          <Badge variant="secondary">{allergies.length}</Badge>
        </CardTitle>
        <div className="relative">
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
              onClick={() => onItemClick(allergy)}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="font-medium text-cyan-800">{allergy.name}</div>
                  <div className="text-sm text-gray-600 mt-1">{allergy.allergensId.length} {t('allergen(s) associated')}</div>
                  {/* Show up to 3 associated allergens */}
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
                <div className="flex gap-1 ml-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => handleEdit(e, allergy)}
                    className="h-8 w-8 p-0 hover:bg-cyan-100"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => handleDelete(e, allergy.id)}
                    className="h-8 w-8 p-0 hover:bg-red-100 text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
          {filteredAllergies.length === 0 && <div className="text-center text-gray-500 py-4">{t('noAllergiesFound')}</div>}
        </div>
      </CardContent>
    </Card>
  )
}