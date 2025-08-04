"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Allergen, Allergy, Symptom } from "@/modules/business-types"
import { useTranslations } from "next-intl"

interface DataTablesProps {
  symptoms: Symptom[]
  allergens: Allergen[]
  allergies: Allergy[]
}

export function DataTables({ symptoms, allergens, allergies }: DataTablesProps) {
  const t = useTranslations('dataTables');
  const getSeverityColor = (severity: number) => {
    if (severity === 1) return "bg-green-500"
    if (severity === 2) return "bg-yellow-500"
    return "bg-red-500"
  }

  const getPrevalenceColor = (prevalence: number) => {
    if (prevalence <= 2) return "bg-green-500"
    if (prevalence <= 3) return "bg-yellow-500"
    return "bg-red-500"
  }

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
    <div className="space-y-6">
      {/* Symptoms Table */}
      <Card className="bg-gradient-to-br from-cyan-50 to-blue-50 border-cyan-200">
        <CardHeader>
          <CardTitle className="text-cyan-800">{t('existingSymptoms')}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('name')}</TableHead>
                <TableHead>{t('severity')}</TableHead>
                <TableHead>{t('prevalence')}</TableHead>
                <TableHead>{t('treatment')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {symptoms.map((symptom) => (
                <TableRow key={symptom.id}>
                  <TableCell className="font-medium">{symptom.name}</TableCell>
                  <TableCell>
                    <Badge className={`${getSeverityColor(symptom.severity)} text-white`}>{symptom.severity}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={`${getPrevalenceColor(symptom.prevalence)} text-white`}>
                      {symptom.prevalence}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">{symptom.treatment}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Allergens Table */}
      <Card className="bg-gradient-to-br from-cyan-50 to-blue-50 border-cyan-200">
        <CardHeader>
          <CardTitle className="text-cyan-800">{t('existingAllergens')}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('name')}</TableHead>
                <TableHead>{t('type')}</TableHead>
                <TableHead>{t('symptoms')}</TableHead>
                <TableHead>{t('prevalence')}</TableHead>
                <TableHead>{t('description')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allergens.map((allergen) => (
                <TableRow key={allergen.id}>
                  <TableCell className="font-medium">{allergen.name}</TableCell>
                  <TableCell>
                    <Badge className={`${getTypeColor(allergen.type)} text-white capitalize`}>{allergen.type}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {allergen.symptomsId.map((symptomId) => {
                        const symptom = symptoms.find((s) => s.id === symptomId)
                        return symptom ? (
                          <Badge key={symptomId} variant="outline" className="text-xs">
                            {symptom.name}
                          </Badge>
                        ) : null
                      })}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={`${getPrevalenceColor(allergen.prevalence)} text-white`}>
                      {allergen.prevalence}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">{allergen.description}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Allergies Table */}
      <Card className="bg-gradient-to-br from-cyan-50 to-blue-50 border-cyan-200">
        <CardHeader>
          <CardTitle className="text-cyan-800">{t('existingAllergies')}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('name')}</TableHead>
                <TableHead>{t('allergens')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allergies.map((allergy) => (
                <TableRow key={allergy.id}>
                  <TableCell className="font-medium">{allergy.name}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {allergy.allergensId.map((allergenId) => {
                        const allergen = allergens.find((a) => a.id === allergenId)
                        return allergen ? (
                          <Badge key={allergenId} variant="outline" className="text-xs">
                            {allergen.name}
                          </Badge>
                        ) : null
                      })}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}