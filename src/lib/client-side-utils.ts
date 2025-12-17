import {
  Allergen,
  Language,
  Symptom,
  TimeFromContactToSymptom,
} from "@/modules/business-types";
import {
  LocalizedAllergen,
  LocalizedSymptom,
} from "@/modules/commands/GetBusinessType/typing";
import { useTranslations } from "next-intl";

export const getTypeColor = (type: string) => {
  switch (type) {
    case "food":
      return "bg-blue-500";
    case "drug":
      return "bg-red-500";
    case "respiratory":
      return "bg-green-500";
    case "venom":
      return "bg-purple-500";
    case "miscellaneous":
      return "bg-yellow-500";
    default:
      return "bg-gray-500";
  }
};

// export const getPrevalenceColor = (prevalence: number) => {
//   switch (prevalence) {
//     case 1:
//       return "bg-green-500"
//     case 2:
//       return "bg-green-500"
//     case 3:
//       return "bg-yellow-500"
//     case 4:
//       return "bg-red-500"
//     case 5:
//       return "bg-red-500"
//     default:
//       return "bg-gray-500"
//   }
// }

export const getSeverityColor = (severity: number) => {
  switch (severity) {
    case 1:
      return "bg-green-500";
    case 2:
      return "bg-red-400";
    default:
      return "bg-gray-500";
  }
};

export const localizeAllergen = (allergen: Allergen, language: Language) => {
  return LocalizedAllergen.parse({
    ...allergen,
    name: allergen.name[language],
    description: allergen.description[language],
  });
};

export const localizeSymptom = (symptom: Symptom, language: Language) => {
  return LocalizedSymptom.parse({
    ...symptom,
    name: symptom.name[language],
    description: symptom.description[language],
  });
};

export const formatTimeFromContactToSymptom = (
  value: TimeFromContactToSymptom,
  t: ReturnType<typeof useTranslations>
) => {
  switch (value) {
    case "<2":
      return t("timeToSymptom.lessThan2");
    case "2-6":
      return t("timeToSymptom.twoToSix");
    case "6-12":
      return t("timeToSymptom.sixToTwelve");
    case "12-24":
      return t("timeToSymptom.twelveToTwentyFour");
    case ">24":
      return t("timeToSymptom.moreThan24");
    default:
      return "";
  }
};
