"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslations } from "next-intl";
import { AddSymptom$Params } from "@/modules/commands/AddBusinessType/typing";
import { httpPost$AddSymptom } from "@/modules/commands/AddBusinessType/fetcher";
import { AddSymptomButton } from "@/components/container/SymptomList/_components/symptom-add-button";
import { SymptomList } from "@/components/container/SymptomList/page";
import { AddAllergenButton } from "@/components/container/AllergenList/_components/allergen-add-button";
import { AllergenList } from "@/components/container/AllergenList/page";
import { toast } from "sonner";
import { useSWRConfig } from "swr";

export default function AdminDashboard() {
  const t = useTranslations("adminDashboard");

  return (
    <div className="flex-grow bg-gradient-to-br from-cyan-100 via-blue-50 to-blue-100">
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-800 mb-2">
            {t("title")}
          </h1>
          <p className="text-gray-600">{t("description")}</p>
        </div>

        <Tabs defaultValue="symptoms" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-white/50 backdrop-blur-sm">
            <TabsTrigger
              value="symptoms"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-blue-600 data-[state=active]:text-white"
            >
              {t("symptoms")}
            </TabsTrigger>
            <TabsTrigger
              value="allergens"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-blue-600 data-[state=active]:text-white"
            >
              {t("allergens")}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="symptoms" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-cyan-800">
                {t("symptom management")}
              </h2>
              <AddSymptomButton />
            </div>
            <SymptomList />
          </TabsContent>

          <TabsContent value="allergens" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-cyan-800">
                {t("allergen management")}
              </h2>
              <AddAllergenButton />
            </div>
            <AllergenList />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
