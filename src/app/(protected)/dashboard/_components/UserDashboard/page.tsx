"use client"

import { useCallback, useEffect, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { WikiSymptomList, WikiAllergenList, WikiAllergyList } from "./_components/wiki-lists"
import { DisplayPAP } from "@/modules/commands/GetPAP/typing"
import { httpGet$GetPAP } from "@/modules/commands/GetPAP/fetcher"
import { UpdatePAPFetcher$Params } from "@/modules/commands/UpdatePAP/typing"
import { httpPut$UpdatePAP } from "@/modules/commands/UpdatePAP/fetcher"
import { Allergen, Allergy, DiscoveryMethod, Symptom } from "@/modules/business-types"
import { PersonalAllergyProfile } from "./_components/personal-allergy-profile"
import { httpGet$GetSymptoms } from "@/modules/commands/GetSymptoms/fetcher"
import { httpGet$GetAllergens } from "@/modules/commands/GetAllergens/fetcher"
import { httpGet$GetAllergies } from "@/modules/commands/GetAllergies/fetcher"
import { httpGet$GetCrossAllergenFromUserID } from "@/modules/commands/GetCrossAllergenFromUserID/fetcher"

export default function UserDashboard() {
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
      setPotentialCrossAllergens(data.crossAllergens!);
    } else {
      console.error(data.message);
    }
  }

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
    
  const fetchPAP = useCallback(async () => {
    const data = await httpGet$GetPAP('api/pap');
    if (data.success) {
      setPAP(data.PAP!);
      fetchPotentialCrossAllergens();
    } else {
      console.error(data.message);
    }
  }, [])
  const handleProfileUpdate = async (updateData: UpdatePAPFetcher$Params) => {
    const data = await httpPut$UpdatePAP('/api/pap', updateData);
    if (data.success) {
      await fetchPAP();
    } else {
      console.error(data.message);
    }
  }

  const handleQuickAddFromWiki = async (inputAllergen: Allergen) => {
    const allergens = [...pAP.allergens.map(allergen => ({
      allergenId: allergen.allergenId,
      discoveryDate: allergen.discoveryDate,
      discoveryMethod: allergen.discoveryMethod,
      symptomsId: allergen.symptoms.map(symptom => symptom.symptomId),
     })), {
      allergenId: inputAllergen.id,
      discoveryMethod: "" as DiscoveryMethod,
      symptomsId: [],
     }]

    await handleProfileUpdate({ allergens })

    alert(`${inputAllergen.name} has been added to your allergens!`)
  }

  useEffect(() => {
    fetchPAP();
    fetchSymptoms();
    fetchAllergies();
    fetchAllergens();
  }, [fetchPAP])


  return (
    <div className="flex-grow bg-gradient-to-br from-cyan-100 via-blue-50 to-blue-100">
      {/* RESPONSIVE CHANGE: Page padding smaller on mobile (p-4)*/}
      <div className="container mx-auto p-4 md:p-6">
        <div className="mb-8">
          {/* RESPONSIVE CHANGE: Heading font size smaller on mobile*/}
          <h1 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-800 mb-2 pb-1">
            User Dashboard
          </h1>
          <p className="text-gray-600">Manage your personal allergy profile and explore the allergy wiki</p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 bg-white/50 backdrop-blur-sm p-1 rounded-lg min-h-[56px] md:min-h-0">
            <TabsTrigger
              value="profile"
              className="py-3 md:py-0 data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-blue-600 data-[state=active]:text-white rounded-md"
            >
              Personal Allergy Profile
            </TabsTrigger>
            <TabsTrigger
              value="wiki"
              className="py-3 md:py-0 data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-blue-600 data-[state=active]:text-white rounded-md"
            >
              Allergy Wiki
            </TabsTrigger>
          </TabsList>


          <TabsContent value="profile">
            <PersonalAllergyProfile pAP={pAP} availableSymptoms={symptoms} potentialCrossAllergens={potentialCrossAllergens} availableAllergens={availableAllergens} onUpdate={handleProfileUpdate} />
          </TabsContent>

          <TabsContent value="wiki" className="space-y-6">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-cyan-800 mb-2">Allergy Information Wiki</h2>
              <p className="text-gray-600">Browse comprehensive information about symptoms, allergens, and allergies</p>
            </div>

            <Tabs defaultValue="wiki-symptoms" className="space-y-4">
              {/* RESPONSIVE CHANGE: TabsList will wrap onto the next line on small screens */}
              <TabsList className="h-auto flex flex-wrap justify-start bg-white/30 rounded-lg">
                <TabsTrigger value="wiki-symptoms">Symptoms</TabsTrigger>
                <TabsTrigger value="wiki-allergens">Allergens</TabsTrigger>
                <TabsTrigger value="wiki-allergies">Allergies</TabsTrigger>
              </TabsList>

              <TabsContent value="wiki-symptoms">
                <WikiSymptomList symptoms={symptoms} />
              </TabsContent>

              <TabsContent value="wiki-allergens">
                <WikiAllergenList
                  allergens={allergens}
                  symptoms={symptoms}
                  onQuickAdd={handleQuickAddFromWiki}
                  userAllergenIds={pAP.allergens.map((allergen) => allergen.allergenId)}
                />
              </TabsContent>

              <TabsContent value="wiki-allergies">
                <WikiAllergyList allergies={allergies} allergens={allergens} />
              </TabsContent>
            </Tabs>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}