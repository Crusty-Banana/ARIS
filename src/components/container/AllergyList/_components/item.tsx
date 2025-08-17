import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { LocalizedAllergen, LocalizedAllergy } from "@/modules/commands/GetBusinessType/typing"
import { Info } from "lucide-react"
import { useTranslations } from "next-intl"

interface AllergyItemProps {
  allergy: LocalizedAllergy,
  allergens: LocalizedAllergen[],
  onClick: () => void
}

export function AllergyItem({allergy, allergens, onClick}: AllergyItemProps) {
  const t = useTranslations('wikiLists');
  return (
    <div
      key={allergy.id}
      className="bg-white/70 backdrop-blur-sm p-3 rounded-lg border border-cyan-200 cursor-pointer hover:bg-white/90 transition-colors"
      onClick={onClick}
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
  )
}