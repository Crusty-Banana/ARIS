import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { LocalizedSymptom } from "@/modules/commands/GetBusinessType/typing"
import { Info } from "lucide-react"
import { useTranslations } from "next-intl"

interface SymptomItemProps {
  symptom: LocalizedSymptom,
  onClick: () => void
}

export function SymptomItem({symptom, onClick}: SymptomItemProps) {
  const t = useTranslations('wikiLists');
  return (
  <div
    key={symptom.id}
    className="bg-white/70 backdrop-blur-sm p-3 rounded-lg border border-cyan-200 cursor-pointer hover:bg-white/90 transition-colors"
    onClick={onClick}
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
  </div>)
}
