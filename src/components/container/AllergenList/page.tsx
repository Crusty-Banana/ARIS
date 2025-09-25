import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Allergen, Language, ObjectIdAsHexString } from "@/modules/business-types"
import { ArrowDown, ArrowUp, Search } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { useState } from "react"
import { AllergenItem } from "./_components/item"
import { AllergenDetailModal } from "./_components/allergen-detail-modal"
import { localizeAllergen } from "@/lib/client-side-utils"

interface AllergenListProps {
  allergens: Allergen[]
  onQuickAdd?: (allergen: Allergen) => void,
  userAllergenIds?: ObjectIdAsHexString[],
  onEdit?: (allergen: Allergen) => void
  onDelete?: (id: string) => void
}

type AllergenSortOption = "name" | "severity"
type SortDirection = "asc" | "desc"

export function AllergenList({ allergens, onQuickAdd, userAllergenIds, onEdit, onDelete }: AllergenListProps) {
  const t = useTranslations('common');
  const localLanguage = useLocale() as Language;
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState<AllergenSortOption>("name")
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [selectedAllergen, setSelectedAllergen] = useState<Allergen | null>(null)

  const toggleSortDirection = () => {
    setSortDirection(sortDirection === "asc" ? "desc" : "asc")
  }

  const filteredAndSortedAllergens = allergens
    .filter((allergen) => {
      const matchesSearch = allergen.name[localLanguage].toLowerCase().includes(searchTerm.toLowerCase())
      const matchesType = typeFilter === "all" || allergen.type === typeFilter
      return matchesSearch && matchesType
    })
    .sort((a, b) => {
      let comparison = 0
      switch (sortBy) {
        case "name":
          comparison = a.name[localLanguage].localeCompare(b.name[localLanguage])
          break
      }
      return sortDirection === "asc" ? comparison : -comparison
    })

  const handleDelete = (id: string) => {
    if (confirm(t('areYouSureDeleteAllergen'))) {
      if (onDelete)onDelete(id)
    }
  }

  return (
    <>
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
            <Select value={sortBy} onValueChange={(value) => setSortBy(value as AllergenSortOption)}>
              <SelectTrigger className="w-40 border-cyan-300 focus:border-cyan-500">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">{t('sortByName')}</SelectItem>
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
              <AllergenItem 
                allergen={localizeAllergen(allergen, localLanguage)} 
                handleQuickAdd={onQuickAdd? () => onQuickAdd(allergen): undefined} 
                userAllergenIds={userAllergenIds} 
                onClick={() => setSelectedAllergen(allergen)} 
                key={allergen.id}
              />
            ))}
            {filteredAndSortedAllergens.length === 0 && (
              <div className="text-center text-gray-500 py-4">{t('noAllergensFound')}</div>
            )}
          </div>
        </CardContent>
      </Card>
      {(selectedAllergen !== null) && <AllergenDetailModal 
        allergen={selectedAllergen} 
        onClose={() => setSelectedAllergen(null)}
        onUpdate={onEdit} 
        onDelete={onDelete? handleDelete: undefined}
        allergens ={allergens}
      />}
    </>
  )
}