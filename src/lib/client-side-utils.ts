import { Allergen, Allergy, Language, Symptom } from "@/modules/business-types"
import { LocalizedAllergen, LocalizedAllergy, LocalizedSymptom } from "@/modules/commands/GetBusinessType/typing"

export const getTypeColor = (type: string) => {
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

export const getPrevalenceColor = (prevalence: number) => {
  switch (prevalence) {
    case 1:
      return "bg-green-500"
    case 2:
      return "bg-green-500"
    case 3:
      return "bg-yellow-500"
    case 4:
      return "bg-red-500"
    case 5:
      return "bg-red-500"
    default:
      return "bg-gray-500"
  }
}

export const getSeverityColor = (severity: number) => {
  switch (severity) {
    case 1:
      return "bg-green-500"
    case 2:
      return "bg-yellow-500"
    case 3:
      return "bg-red-500"
    default:
      return "bg-gray-500"
  }
}

export const localizeAllergen = (allergen: Allergen, language: Language) => {
  return LocalizedAllergen.parse({
    ...allergen,
    name: allergen.name[language],
    description: allergen.description[language],
    treatment: {
      lvl1: allergen.treatment.lvl1[language],
      lvl2: allergen.treatment.lvl2[language],
      lvl3: allergen.treatment.lvl3[language],
    },
  })
}

export const localizeSymptom = (symptom: Symptom, language: Language) => {
  return LocalizedSymptom.parse({
    ...symptom,
    name: symptom.name[language],
    description: symptom.description[language],
  })
}

export const localizeAllergy = (allergy: Allergy, language: Language) => {
  return LocalizedAllergy.parse({
    ...allergy,
    name: allergy.name[language],
  })
}