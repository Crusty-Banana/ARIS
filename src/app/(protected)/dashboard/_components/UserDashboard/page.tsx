"use client"

import { useCallback, useEffect, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DisplayPAP } from "@/modules/commands/GetPAPWithUserId/typing"
import { Allergen, Allergy, DiscoveryMethod, Language, Symptom } from "@/modules/business-types"
import { PersonalAllergyProfile } from "./_components/PersonalAllergyProfile/page"
import { httpGet$GetCrossAllergenFromUserID } from "@/modules/commands/GetCrossAllergenFromUserID/fetcher"
import { useLocale, useTranslations } from "next-intl"
import { httpGet$GetAllergens, httpGet$GetAllergies, httpGet$GetSymptoms } from "@/modules/commands/GetBusinessType/fetcher"
import { toast } from "sonner"
import { httpGet$GetPAPWithUserId } from "@/modules/commands/GetPAPWithUserId/fetcher"
import { PAPAllergen, UpdatePAPWithUserIdFetcher$Params } from "@/modules/commands/UpdatePAPWithUserId/typing"
import { httpPut$UpdatePAPWithUserId } from "@/modules/commands/UpdatePAPWithUserId/fetcher"
import { SymptomList } from "@/components/container/SymptomList/page"
import { AllergyList } from "@/components/container/AllergyList/page"
import { AllergenList } from "@/components/container/AllergenList/page"

export default function UserDashboard() {
  const t = useTranslations('userDashboard')
  const localLanguage = useLocale() as Language;

  const [pAP, setPAP] = useState<DisplayPAP>({
    id: "000000000000000000000000",
    userId: "000000000000000000000000",
    publicId: "000000000000000000000000",
    doB: null,
    gender: "",
    allowPublic: false,
    underlyingMedCon: [],
    allergens: [],
  })
  const [symptoms, setSymptoms] = useState<Symptom[]>([])
  const [allergens, setAllergens] = useState<Allergen[]>([])
  const [allergies, setAllergies] = useState<Allergy[]>([])
  const [potentialCrossAllergens, setPotentialCrossAllergens] = useState<Allergen[]>([])

  const availableAllergens = allergens.filter((allergen) => !pAP.allergens.some((pAPAllergen) => pAPAllergen.allergenId === allergen.id))

  const fetchPotentialCrossAllergens = async () => {
    const data = await httpGet$GetCrossAllergenFromUserID('/api/cross');
    if (data.success) {
      setPotentialCrossAllergens(data.result!);
    } else {
      toast.error(data.message);
    }
  }

  const fetchSymptoms = async () => {
    const data = await httpGet$GetSymptoms('/api/symptoms', {});
    if (data.success) {
      setSymptoms(data.result as Symptom[]);
    } else {
      toast.error(data.message);
    }
  }

  const fetchAllergens = async () => {
    const data = await httpGet$GetAllergens('/api/allergens', {});
    if (data.success) {
      setAllergens(data.result as Allergen[]);
    } else {
      toast.error(data.message);
    }
  }

  const fetchAllergies = async () => {
    const data = await httpGet$GetAllergies('/api/allergies', {});
    if (data.success) {
      setAllergies(data.result as Allergy[]);
    } else {
      toast.error(data.message);
    }
  }

  const fetchPAP = useCallback(async () => {
    const data = await httpGet$GetPAPWithUserId('api/user-pap');
    if (data.success) {
      setPAP(data.result!);
      fetchPotentialCrossAllergens();
    } else {
      toast.error(data.message);
    }
  }, [])

  const handlePAPUpdate = async (updateData: UpdatePAPWithUserIdFetcher$Params) => {
    const data = await httpPut$UpdatePAPWithUserId('/api/user-pap', updateData);
    if (data.success) {
      await fetchPAP();
    } else {
      toast.error(data.message);
    }
  }

  const handleQuickAddFromWiki = async (inputAllergen: Allergen) => {
    const allergens = [...pAP.allergens.map(allergen => (PAPAllergen.parse({
      ...allergen,
      symptomsId: allergen.symptoms.map(symptom => symptom.symptomId),
    }))), PAPAllergen.parse({
      allergenId: inputAllergen.id,
      discoveryDate: null,
      discoveryMethod: "" as DiscoveryMethod,
      symptomsId: [],
    })]

    await handlePAPUpdate({ allergens })

    toast.success(t('allergenAdded', { allergenName: inputAllergen.name[localLanguage] }))
  }

  useEffect(() => {
    fetchPAP();
    fetchSymptoms();
    fetchAllergies();
    fetchAllergens();
  }, [fetchPAP])


  return (
    <div className="flex-grow bg-gradient-to-br from-cyan-100 via-blue-50 to-blue-100">
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-800 mb-2 pb-1">
            {t('title')}
          </h1>
          <p className="text-gray-600">{t('description')}</p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 bg-white/50 backdrop-blur-sm">
            <TabsTrigger
              value="profile"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-blue-600 data-[state=active]:text-white"
            >
              {t('pap')}
            </TabsTrigger>
            <TabsTrigger
              value="wiki"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-blue-600 data-[state=active]:text-white"
            >
              {t('wiki')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <PersonalAllergyProfile pAP={pAP} availableSymptoms={symptoms} potentialCrossAllergens={potentialCrossAllergens} availableAllergens={availableAllergens} onUpdate={handlePAPUpdate} />
          </TabsContent>

          <TabsContent value="wiki" className="space-y-6">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-cyan-800 mb-2">{t('wikiInfo')}</h2>
              <p className="text-gray-600">{t('wikiDescription')}</p>
            </div>

            <Tabs defaultValue="wiki-allergies" className="space-y-4">
              <TabsList className="bg-white/30">
                <TabsTrigger value="wiki-allergies">{t('allergies')}</TabsTrigger>
                <TabsTrigger value="wiki-allergens">{t('allergens')}</TabsTrigger>
                <TabsTrigger value="wiki-symptoms">{t('symptoms')}</TabsTrigger>
              </TabsList>

              <TabsContent value="wiki-symptoms">
                <SymptomList symptoms={symptoms} />
              </TabsContent>

              <TabsContent value="wiki-allergens">
                <AllergenList
                  allergens={allergens}
                  symptoms={symptoms}
                  onQuickAdd={handleQuickAddFromWiki}
                  userAllergenIds={pAP.allergens.map((allergen) => allergen.allergenId)}
                />
              </TabsContent>

              <TabsContent value="wiki-allergies">
                <AllergyList allergies={allergies} allergens={allergens} />
              </TabsContent>
            </Tabs>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
