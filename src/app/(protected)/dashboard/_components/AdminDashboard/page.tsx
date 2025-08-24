"use client"

import { useEffect, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useTranslations } from "next-intl"
import { httpGet$GetAllergens, httpGet$GetAllergies, httpGet$GetSymptoms } from "@/modules/commands/GetBusinessType/fetcher"
import { AddAllergen$Params, AddAllergy$Params, AddSymptom$Params } from "@/modules/commands/AddBusinessType/typing"
import { httpPost$AddAllergen, httpPost$AddAllergy, httpPost$AddSymptom } from "@/modules/commands/AddBusinessType/fetcher"
import { UpdateAllergen$Params, UpdateAllergy$Params, UpdateSymptom$Params } from "@/modules/commands/UpdateBusinessType/typing"
import { httpPut$UpdateAllergen, httpPut$UpdateAllergy, httpPut$UpdateSymptom } from "@/modules/commands/UpdateBusinessType/fetcher"
import { httpDelete$DeleteAllergen, httpDelete$DeleteAllergy, httpDelete$DeleteSymptom } from "@/modules/commands/DeleteBusinessType/fetcher"
import { AddSymptomButton } from "@/components/container/SymptomList/_components/symptom-add-button"
import { SymptomList } from "@/components/container/SymptomList/page"
import { Allergen, Allergy, Symptom } from "@/modules/business-types"
import { AddAllergenButton } from "@/components/container/AllergenList/_components/allergen-add-button"
import { AllergenList } from "@/components/container/AllergenList/page"
import { AddAllergyButton } from "@/components/container/AllergyList/_components/allergy-add-button"
import { AllergyList } from "@/components/container/AllergyList/page"
import { toast } from "sonner"

export default function AdminDashboard() {
  const t = useTranslations('adminDashboard');
  const [symptoms, setSymptoms] = useState<Symptom[]>([])

  const [allergens, setAllergens] = useState<Allergen[]>([])

  const [allergies, setAllergies] = useState<Allergy[]>([])

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

  const addSymptom = async (symptom: AddSymptom$Params) => {
    const data = await httpPost$AddSymptom('/api/symptoms', symptom);
    if (data.success) {
      await fetchSymptoms();
    } else {
      toast.error(data.message);
    }
  }

  const updateSymptom = async (symptomData: UpdateSymptom$Params) => {
    const { id, ...rest } = symptomData;
    const data = await httpPut$UpdateSymptom(`/api/symptoms/${id}`, rest);
    if (data.success) {
      await fetchSymptoms();
    } else {
      toast.error(data.message);
    }
  }

  const deleteSymptom = async (id: string) => {
    const data = await httpDelete$DeleteSymptom(`/api/symptoms/${id}`);
    if (data.success) {
      await fetchSymptoms();
    } else {
      toast.error(data.message);
    }
  }

  const addAllergen = async (allergen: AddAllergen$Params) => {
    const data = await httpPost$AddAllergen('/api/allergens', allergen);
    if (data.success) {
      await fetchAllergens();
    } else {
      toast.error(data.message);
    }
  }

  const updateAllergen = async (allergenData: UpdateAllergen$Params) => {
    const { id, ...rest } = allergenData;
    const data = await httpPut$UpdateAllergen(`/api/allergens/${id}`, rest);
    if (data.success) {
      await fetchAllergens();
    } else {
      toast.error(data.message);
    }
  }

  const deleteAllergen = async (id: string) => {
    const data = await httpDelete$DeleteAllergen(`/api/allergens/${id}`);
    if (data.success) {
      await fetchAllergens();
    } else {
      toast.error(data.message);
    }
  }

  const addAllergy = async (allergy: AddAllergy$Params) => {
    const data = await httpPost$AddAllergy('/api/allergies', allergy);
    if (data.success) {
      await fetchAllergies();
    } else {
      toast.error(data.message);
    }
  }

  const updateAllergy = async (allergyData: UpdateAllergy$Params) => {
    const { id, ...rest } = allergyData;
    const data = await httpPut$UpdateAllergy(`/api/allergies/${id}`, rest);
    if (data.success) {
      await fetchAllergies();
    } else {
      toast.error(data.message);
    }
  }

  const deleteAllergy = async (id: string) => {
    const data = await httpDelete$DeleteAllergy(`/api/allergies/${id}`);
    if (data.success) {
      await fetchAllergies();
    } else {
      toast.error(data.message);
    }
  }

  useEffect(() => {
    fetchSymptoms();
    fetchAllergens();
    fetchAllergies();
  }, [])

  return (
    <div className="flex-grow bg-gradient-to-br from-cyan-100 via-blue-50 to-blue-100">
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-800 mb-2">
            {t('title')}
          </h1>
          <p className="text-gray-600">{t('description')}</p>
        </div>

        <Tabs defaultValue="symptoms" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-white/50 backdrop-blur-sm">
            <TabsTrigger
              value="symptoms"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-blue-600 data-[state=active]:text-white"
            >
              {t('symptoms')}
            </TabsTrigger>
            <TabsTrigger
              value="allergens"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-blue-600 data-[state=active]:text-white"
            >
              {t('allergens')}
            </TabsTrigger>
            <TabsTrigger
              value="allergies"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-blue-600 data-[state=active]:text-white"
            >
              {t('allergies')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="symptoms" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-cyan-800">{t('symptom management')}</h2>
              <AddSymptomButton onAddSymptom={addSymptom} />
            </div>
            <SymptomList
              symptoms={symptoms}
              onUpdate={updateSymptom}
              onDelete={deleteSymptom}
            />
          </TabsContent>

          <TabsContent value="allergens" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-cyan-800">{t('allergen management')}</h2>
              <AddAllergenButton symptoms={symptoms} onAddAllergen={addAllergen} allergens={allergens} />
            </div>
            <AllergenList
              allergens={allergens}
              symptoms={symptoms}
              onEdit={updateAllergen}
              onDelete={deleteAllergen}
            />
          </TabsContent>

          <TabsContent value="allergies" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-cyan-800">{t('allergy management')}</h2>
              <AddAllergyButton allergens={allergens} onAddAllergy={addAllergy} />
            </div>
            <AllergyList
              allergies={allergies}
              allergens={allergens}
              onEdit={updateAllergy}
              onDelete={deleteAllergy}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
