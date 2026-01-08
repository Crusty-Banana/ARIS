"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslations } from "next-intl";
import { httpGet$GetActionPlans } from "@/modules/commands/GetBusinessType/fetcher";
import { AddSymptomButton } from "@/components/container/SymptomList/_components/symptom-add-button";
import { SymptomList } from "@/components/container/SymptomList/page";
import { ActionPlan } from "@/modules/business-types";
import { AddAllergenButton } from "@/components/container/AllergenList/_components/allergen-add-button";
import { AllergenList } from "@/components/container/AllergenList/page";
import { toast } from "sonner";
import { ActionPlanList } from "@/components/container/ActionPlanList/page";
import { useEffect, useState } from "react";
import { httpPut$UpdateActionPlan } from "@/modules/commands/UpdateBusinessType/fetcher";

export default function AdminDashboard() {
  const t = useTranslations("adminDashboard");
  const [actionPlans, setActionPlans] = useState<ActionPlan[]>([]);

  const fetchActionPlans = async () => {
    const data = await httpGet$GetActionPlans("/api/action-plans", {});
    if (data.success) {
      setActionPlans(data.result as ActionPlan[]);
    } else {
      toast.error(data.message);
    }
  };

  const updateActionPlan = async (plan: ActionPlan) => {
    const data = await httpPut$UpdateActionPlan(
      `/api/action-plans/${plan.id}`,
      plan
    );
    if (data.success) {
      await fetchActionPlans();
    } else {
      toast.error(data.message);
    }
  };

  useEffect(() => {
    fetchActionPlans();
  }, []);

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
            <TabsTrigger
              value="action-plans"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-blue-600 data-[state=active]:text-white"
            >
              {t("action-plans")}
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
          <TabsContent value="action-plans" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-cyan-800">
                {t("action-plan management")}
              </h2>
            </div>
            <ActionPlanList
              actionPlans={actionPlans}
              onUpdate={updateActionPlan}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
