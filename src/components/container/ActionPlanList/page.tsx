"use client";

import { useState } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ActionPlan, Language } from "@/modules/business-types";
import { useTranslations } from "next-intl";
import { Edit, Save, X } from "lucide-react";
import { toast } from "sonner";
import { RichTextEditor } from "@/components/rich-text-editor";
import { LanguageDropdown } from "@/components/language-dropdown";

interface ActionPlanListProps {
  actionPlans: ActionPlan[];
  onUpdate?: (plan: ActionPlan) => Promise<void> | void;
}

export function ActionPlanList({ actionPlans, onUpdate }: ActionPlanListProps) {
  const t = useTranslations("common");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<Language>("en");
  const [editingPlans, setEditingPlans] = useState<Record<string, ActionPlan>>(
    Object.fromEntries(actionPlans.map((p) => [p.id, p]))
  );

  const handleChange = (id: string, lang: Language, value: string) => {
    setEditingPlans((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        text: { ...prev[id].text, [lang]: value },
      },
    }));
  };

  const handleEdit = (id: string) => setEditingId(id);
  const handleCancel = () => setEditingId(null);

  const handleSave = async (id: string) => {
    if (!onUpdate) return;
    try {
      await onUpdate(editingPlans[id]);
      toast.success(t("updatedSuccessfully"));
      setEditingId(null);
    } catch {
      toast.error(t("updateFailed"));
    }
  };

  return (
    <div className="grid grid-cols-1 gap-6">
      {Object.values(editingPlans)
        .sort((a, b) => a.severity - b.severity)
        .map((plan) => {
          const isEditing = editingId === plan.id;

          return (
            <Card
              key={plan.id}
              className="bg-gradient-to-br from-cyan-50 to-blue-50 border-cyan-200 shadow-md"
            >
              <CardHeader>
                <CardTitle className="text-cyan-800 flex justify-between items-center">
                  <span>
                    {plan.severity === 1
                      ? t("mildActionPlan")
                      : t("severeActionPlan")}
                  </span>
                  <div className="flex items-center gap-2">
                    <LanguageDropdown
                      selectedLanguage={selectedLanguage}
                      setSelectedLanguage={setSelectedLanguage}
                    />
                    {isEditing ? (
                      <>
                        <Button
                          size="sm"
                          onClick={() => handleSave(plan.id)}
                          className="bg-green-600 text-white hover:bg-green-700"
                        >
                          <Save className="h-4 w-4 mr-1" /> {t("save")}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handleCancel}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(plan.id)}
                      >
                        <Edit className="h-4 w-4 mr-1" /> {t("edit")}
                      </Button>
                    )}
                  </div>
                </CardTitle>
              </CardHeader>

              <CardContent>
                {isEditing ? (
                  <div className="space-y-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {selectedLanguage === "en" ? "English" : "Tiếng Việt"}
                    </label>
                    <div className="border border-cyan-300 rounded-md p-2 bg-white">
                      <RichTextEditor
                        content={plan.text[selectedLanguage]}
                        onChange={(value) =>
                          handleChange(plan.id, selectedLanguage, value)
                        }
                      />
                    </div>
                  </div>
                ) : (
                  <div
                    className="p-2 bg-white border border-cyan-200 rounded-md prose prose-sm max-w-none min-h-[80px]"
                    dangerouslySetInnerHTML={{
                      __html: plan.text[selectedLanguage],
                    }}
                  />
                )}
              </CardContent>
            </Card>
          );
        })}
    </div>
  );
}
