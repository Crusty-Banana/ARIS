import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getTypeColor } from "@/lib/client-side-utils"
import { LocalizedAllergen, LocalizedSymptom } from "@/modules/commands/GetBusinessType/typing"
import { Check, Info, Plus } from "lucide-react"
import { useTranslations } from "next-intl"

interface AllergenItemProps {
  allergen: LocalizedAllergen,
  symptoms: LocalizedSymptom[],
  onClick: () => void,
  handleQuickAdd?: () => void,
  userAllergenIds?: string[]
}

export function AllergenItem({allergen, symptoms, onClick, handleQuickAdd, userAllergenIds}: AllergenItemProps) {
  const t = useTranslations('wikiLists');
  return (              
    <div
      key={allergen.id}
      className="bg-white/70 backdrop-blur-sm p-3 rounded-lg border border-cyan-200 cursor-pointer hover:bg-white/90 transition-colors"
      onClick={onClick}
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
          {handleQuickAdd && !userAllergenIds?.includes(allergen.id) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                handleQuickAdd()
              }}
              className="h-8 w-8 p-0 hover:bg-green-100 text-green-600 border border-green-200 hover:border-green-300"
              title={t('allergenAddButtonTitle')}
            >
              <Plus className="h-4 w-4" />
            </Button>
          )}
          {handleQuickAdd && userAllergenIds?.includes(allergen.id) && (
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
  )
}