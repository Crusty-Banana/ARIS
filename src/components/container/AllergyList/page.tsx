import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Allergen, Allergy, Language } from "@/modules/business-types"
import { Search } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { useState } from "react"
import { AllergyItem } from "./_components/item"
import { localizeAllergen, localizeAllergy } from "@/lib/client-side-utils"
import { AllergyDetailModal } from "./_components/allergy-detail-modal"

interface AllergyListProps {
  allergies: Allergy[]
  allergens: Allergen[]
  onEdit?: (allergy: Allergy) => void
  onDelete?: (id: string) => void
}

export function AllergyList({ allergies, allergens, onEdit, onDelete }: AllergyListProps) {
  const t = useTranslations('common');
  const localLanguage = useLocale() as Language;
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedAllergy, setSelectedAllergy] = useState<Allergy | null>(null)

  const filteredAllergies = allergies
    .filter((allergy) => allergy.name[localLanguage].toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => a.name[localLanguage].localeCompare(b.name[localLanguage]))

  const handleDelete = (id: string) => {
    if (confirm(t('detailModals.areYouSureAllergy'))) {
      if (onDelete) onDelete(id)
    }
  }

  const handleEdit = (allergy: Allergy) => {
    if (onEdit) onEdit(allergy)
  }

  const localizedAllergens = allergens.map((allergen) => localizeAllergen(allergen, localLanguage))

  return (
    <>
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
              <AllergyItem
                key={allergy.id}
                allergy={localizeAllergy(allergy, localLanguage)}
                allergens={localizedAllergens}
                onClick={() => setSelectedAllergy(allergy)}
              />
            ))}
            {filteredAllergies.length === 0 && <div className="text-center text-gray-500 py-4">{t('noAllergiesFound')}</div>}
          </div>
        </CardContent>
      </Card>
      {(selectedAllergy !== null) && <AllergyDetailModal 
        allergy={selectedAllergy} 
        allergens={allergens} 
        onClose={() => setSelectedAllergy(null)}
        onUpdate={onEdit? handleEdit: undefined} 
        onDelete={onDelete? handleDelete: undefined}
      />}
    </>
  )
}