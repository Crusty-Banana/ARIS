"use client"

import { use, useEffect, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SymptomDetailModal, AllergenDetailModal, AllergyDetailModal } from "@/components/detail-modals"
import { SymptomList, AllergenList, AllergyList } from "@/components/item-lists"
import { DataTables } from "@/components/data-tables"
import { Allergen, Allergy, Symptom } from "@/modules/business-types"
import { httpGet$GetSymptoms } from "@/modules/commands/GetSymptoms/fetcher"
import { AddSymptom$Params } from "@/modules/commands/AddSymptom/typing"
import { httpPost$AddSymptom } from "@/modules/commands/AddSymptom/fetcher"
import { UpdateSymptom$Params } from "@/modules/commands/UpdateSymptom/typing"
import { httpPut$UpdateSymptom } from "@/modules/commands/UpdateSymptom/fetcher"
import { httpDelete$DeleteSymptom } from "@/modules/commands/DeleteSymptom/fetcher"
import { httpGet$GetAllergens } from "@/modules/commands/GetAllergens/fetcher"
import { AddAllergen$Params } from "@/modules/commands/AddAllergen/typing"
import { httpPost$AddAllergen } from "@/modules/commands/AddAllergen/fetcher"
import { UpdateAllergen$Params } from "@/modules/commands/UpdateAllergen/typing"
import { httpPut$UpdateAllergen } from "@/modules/commands/UpdateAllergen/fetcher"
import { httpDelete$DeleteAllergen } from "@/modules/commands/DeleteAllergen/fetcher"
import { httpGet$GetAllergies } from "@/modules/commands/GetAllergies/fetcher"
import { AddAllergy$Params } from "@/modules/commands/AddAllergy/typing"
import { httpPost$AddAllergy } from "@/modules/commands/AddAllergy/fetcher"
import { UpdateAllergy$Params } from "@/modules/commands/UpdateAllergy/typing"
import { httpPut$UpdateAllergy } from "@/modules/commands/UpdateAllergy/fetcher"
import { httpDelete$DeleteAllergy } from "@/modules/commands/DeleteAllergy/fetcher"
import { SymptomModal } from "@/components/symptom-modal"
import { AllergenModal } from "@/components/allergen-modal"
import { AllergyModal } from "@/components/allergy-modal"
import { useRouter } from "next/navigation"

export default function AdminDashboard() {

  const [symptoms, setSymptoms] = useState<Symptom[]>([])

  const [allergens, setAllergens] = useState<Allergen[]>([])

  const [allergies, setAllergies] = useState<Allergy[]>([])

  // Detail modal states
  const [selectedSymptom, setSelectedSymptom] = useState<Symptom | null>(null)
  const [selectedAllergen, setSelectedAllergen] = useState<Allergen | null>(null)
  const [selectedAllergy, setSelectedAllergy] = useState<Allergy | null>(null)

  const fetchSymptoms = async () => {
    const data = await httpGet$GetSymptoms('/api/symptoms', {});
    if (data.success) {
      setSymptoms(data.symptoms!);
    } else {
      console.error(data.message);
    }
  }

  const fetchAllergens = async () => {
    const data = await httpGet$GetAllergens('/api/allergens', {});
    if (data.success) {
      setAllergens(data.allergens!);
    } else {
      console.error(data.message);
    }
  }

  const fetchAllergies = async () => {
    const data = await httpGet$GetAllergies('/api/allergies', {});
    if (data.success) {
      setAllergies(data.allergies!);
    } else {
      console.error(data.message);
    }
  }

  const addSymptom = async (symptom: AddSymptom$Params) => {
    const data = await httpPost$AddSymptom('/api/symptoms', symptom);
    if (data.success) {
      await fetchSymptoms();
    } else {
      console.error(data.message);
    }
  }

  const updateSymptom = async (symptomData: UpdateSymptom$Params) => {
    const { id, ...rest } = symptomData;
    const data = await httpPut$UpdateSymptom(`/api/symptoms/${id}`, rest);
    if (data.success) {
      await fetchSymptoms();
    } else {
      console.error(data.message);
    }
  }

  const deleteSymptom = async (id: string) => {
    const data = await httpDelete$DeleteSymptom(`/api/symptoms/${id}`);
    if (data.success) {
      await fetchSymptoms();
    } else {
      console.error(data.message);
    }
  }

  const addAllergen = async (allergen: AddAllergen$Params) => {
    const data = await httpPost$AddAllergen('/api/allergens', allergen);
    if (data.success) {
      await fetchAllergens();
    } else {
      console.error(data.message);
    }
  }

  const updateAllergen = async (allergenData: UpdateAllergen$Params) => {
    const { id, ...rest } = allergenData;
    const data = await httpPut$UpdateAllergen(`/api/allergens/${id}`, rest);
    if (data.success) {
      await fetchAllergens();
    } else {
      console.error(data.message);
    }
  }

  const deleteAllergen = async (id: string) => {
    const data = await httpDelete$DeleteAllergen(`/api/allergens/${id}`);
    if (data.success) {
      await fetchAllergens();
    } else {
      console.error(data.message);
    }
  }

  const addAllergy = async (allergy: AddAllergy$Params) => {
    const data = await httpPost$AddAllergy('/api/allergies', allergy);
    if (data.success) {
      await fetchAllergies();
    } else {
      console.error(data.message);
    }
  }

  const updateAllergy = async (allergyData: UpdateAllergy$Params) => {
    const { id, ...rest } = allergyData;
    const data = await httpPut$UpdateAllergy(`/api/allergies/${id}`, rest);
    if (data.success) {
      await fetchAllergies();
    } else {
      console.error(data.message);
    }
  }

  const deleteAllergy = async (id: string) => {
    const data = await httpDelete$DeleteAllergy(`/api/allergies/${id}`);
    if (data.success) {
      await fetchAllergies();
    } else {
      console.error(data.message);
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
            Admin Dashboard
          </h1>
          <p className="text-gray-600">Manage symptoms, allergens, and allergies</p>
        </div>

        <Tabs defaultValue="symptoms" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-white/50 backdrop-blur-sm">
            <TabsTrigger
              value="symptoms"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-blue-600 data-[state=active]:text-white"
            >
              Symptoms
            </TabsTrigger>
            <TabsTrigger
              value="allergens"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-blue-600 data-[state=active]:text-white"
            >
              Allergens
            </TabsTrigger>
            <TabsTrigger
              value="allergies"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-blue-600 data-[state=active]:text-white"
            >
              Allergies
            </TabsTrigger>
          </TabsList>

          <TabsContent value="symptoms" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-cyan-800">Symptom Management</h2>
              <SymptomModal onAddSymptom={addSymptom} />
            </div>
            <SymptomList
              symptoms={symptoms}
              onItemClick={setSelectedSymptom}
              onEdit={setSelectedSymptom}
              onDelete={deleteSymptom}
            />
          </TabsContent>

          <TabsContent value="allergens" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-cyan-800">Allergen Management</h2>
              <AllergenModal symptoms={symptoms} onAddAllergen={addAllergen} />
            </div>
            <AllergenList
              allergens={allergens}
              symptoms={symptoms}
              onItemClick={setSelectedAllergen}
              onEdit={setSelectedAllergen}
              onDelete={deleteAllergen}
            />
          </TabsContent>

          <TabsContent value="allergies" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-cyan-800">Allergy Management</h2>
              <AllergyModal allergens={allergens} onAddAllergy={addAllergy} />
            </div>
            <AllergyList
              allergies={allergies}
              allergens={allergens}
              onItemClick={setSelectedAllergy}
              onEdit={setSelectedAllergy}
              onDelete={deleteAllergy}
            />
          </TabsContent>

        </Tabs>

        {/* Detail Modals */}
        <SymptomDetailModal
          symptom={selectedSymptom}
          open={!!selectedSymptom}
          onClose={() => setSelectedSymptom(null)}
          onUpdate={updateSymptom}
          onDelete={deleteSymptom}
        />

        <AllergenDetailModal
          allergen={selectedAllergen}
          symptoms={symptoms}
          open={!!selectedAllergen}
          onClose={() => setSelectedAllergen(null)}
          onUpdate={updateAllergen}
          onDelete={deleteAllergen}
        />

        <AllergyDetailModal
          allergy={selectedAllergy}
          allergens={allergens}
          open={!!selectedAllergy}
          onClose={() => setSelectedAllergy(null)}
          onUpdate={updateAllergy}
          onDelete={deleteAllergy}
        />
      </div>
    </div>
  )
}
