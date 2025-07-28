"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Plus, AlertTriangle } from "lucide-react"
import { Allergen } from "@/modules/business-types"

interface PotentialCrossAllergensProps {
  potentialAllergens: Allergen[]
  userAllergenIds: string[]
  onQuickAdd: (allergen: Allergen) => void
}

export function PotentialCrossAllergens({
  potentialAllergens,
  userAllergenIds,
  onQuickAdd,
}: PotentialCrossAllergensProps) {
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

  // Filter out allergens the user already has
  const availableAllergens = potentialAllergens.filter((allergen) => !userAllergenIds.includes(allergen.id))

  return (
    <Card className="bg-gradient-to-br from-orange-50 to-yellow-50 border-orange-200">
      <CardHeader>
        <CardTitle className="text-orange-800 flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          Potential Cross-Allergens ({availableAllergens.length})
        </CardTitle>
        <p className="text-sm text-orange-700">
          Based on your current allergens, you may also be sensitive to these items
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 max-h-80 overflow-y-auto">
          {availableAllergens.map((allergen) => (
            <div
              key={allergen.id}
              className="bg-white/70 backdrop-blur-sm p-3 rounded-lg border border-orange-200 flex items-center justify-between"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-orange-800">{allergen.name}</span>
                  <Badge className={`${getTypeColor(allergen.type)} text-white text-xs capitalize`}>
                    {allergen.type}
                  </Badge>
                </div>
                <div className="text-sm text-gray-600 line-clamp-2">{allergen.description}</div>
                <div className="text-xs text-gray-500 mt-1">{allergen.symptomsId.length} associated symptoms</div>
              </div>
              <Button
                size="sm"
                onClick={() => onQuickAdd(allergen)}
                className="ml-3 h-8 w-8 p-0 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          ))}
          {availableAllergens.length === 0 && (
            <div className="text-center text-orange-600 py-8">
              <AlertTriangle className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No potential cross-allergens found</p>
              <p className="text-sm text-orange-500 mt-1">This is based on your current allergen profile</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
