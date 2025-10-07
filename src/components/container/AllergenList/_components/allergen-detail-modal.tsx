import { LanguageDropdown } from "@/components/language-dropdown";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getTypeColor } from "@/lib/client-side-utils";
import { Allergen, Language } from "@/modules/business-types";
import { AlertTriangle, Edit, Save, Trash2, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { AllergenForm } from "./allergen-form";

interface AllergenDetailModalProps {
  allergen: Allergen;
  onClose: () => void;
  onUpdate?: (allergen: Allergen) => void;
  onDelete?: (id: string) => void;
  allergens: Allergen[];
  actionPlan?: string;
  hideCrossAllergen?: boolean
}

export function AllergenDetailModal({
  allergen,
  onClose,
  onUpdate,
  onDelete,
  allergens,
  actionPlan,
  hideCrossAllergen
}: AllergenDetailModalProps) {
  const t = useTranslations("detailModals");
  const localLanguage = useLocale() as Language;
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Allergen>(allergen);
  const [selectedLanguage, setSelectedLanguage] =
    useState<Language>(localLanguage);

  const startEdit = () => {
    setIsEditing(true);
  };

  const cancelEdit = () => {
    setIsEditing(false);
  };

  const saveEdit = () => {
    if (onUpdate) onUpdate(editData);
    setIsEditing(false);
    onClose();
  };

  const handleDelete = () => {
    if (confirm(t("areYouSureAllergenDelete"))) {
      if (onDelete) onDelete(allergen.id);
      onClose();
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-cyan-800 flex items-center justify-between pr-8">
            {t("allergenDetails")}
            <div className="flex gap-3">
              {onUpdate &&
                onDelete &&
                (!isEditing ? (
                  <>
                    <Button variant="outline" size="sm" onClick={startEdit}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleDelete}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 bg-transparent"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={saveEdit}
                      className="text-green-600 hover:bg-green-50 bg-transparent"
                    >
                      <Save className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={cancelEdit}>
                      <X className="h-4 w-4" />
                    </Button>
                  </>
                ))}
            </div>
          </DialogTitle>
          <DialogDescription />
        </DialogHeader>
        {isEditing ? (
          <AllergenForm
            type={editData.type}
            setType={(type) => {
              setEditData({ ...editData!, type });
            }}
            selectedLanguage={selectedLanguage}
            setSelectedLanguage={setSelectedLanguage}
            name={editData.name}
            handleNameChange={(value) => {
              setEditData({
                ...editData!,
                name: { ...editData!.name, [selectedLanguage]: value },
              });
            }}
            description={editData.description}
            handleDescriptionChange={(value) => {
              setEditData({
                ...editData!,
                description: {
                  ...editData!.description,
                  [selectedLanguage]: value,
                },
              });
            }}
            allergens={allergens}
            selectedCrossSensitivity={editData.crossSensitivityId}
            setSelectedCrossSensitivity={(value) =>
              setEditData({ ...editData!, crossSensitivityId: value })
            }
            isWholeAllergen={editData.isWholeAllergen}
            setIsWholeAllergen={(value) =>
              setEditData({ ...editData!, isWholeAllergen: value })
            }
          />
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("type")}
                </label>
                <Badge
                  className={`${getTypeColor(
                    allergen.type
                  )} text-white capitalize`}
                >
                  {t(allergen.type)}
                </Badge>
              </div>
              {onUpdate && onDelete && (
                <LanguageDropdown
                  selectedLanguage={selectedLanguage}
                  setSelectedLanguage={setSelectedLanguage}
                />
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("name")}
                </label>
                <div className="p-2 bg-gray-50 rounded">
                  {allergen.name[selectedLanguage]}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("isWholeAllergen")}
                </label>
                <div className="p-2 bg-gray-50 rounded">
                  {allergen.isWholeAllergen
                    ? t("wholeAllergen")
                    : t("componentAllergen")}
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("description")} 
              </label>
              <div
                className="p-2 bg-gray-50 rounded min-h-[100px] prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{
                  __html: allergen.description[selectedLanguage],
                }}
              />
            </div>

            {actionPlan && (
              <div>
                  <label className="text-orange-700 flex items-center gap-2 text-sm font-medium mb-1">
                    <AlertTriangle className="h-4 w-4" />
                    {t("actionPlans")}
                  </label>
                <div
                  className="p-2 bg-orange-50 rounded min-h-[100px] prose prose-sm max-w-none border-orange-600 border"
                  dangerouslySetInnerHTML={{ __html: actionPlan }}
                />
              </div>
            )}
            {!hideCrossAllergen && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("crossSensitivity")}
              </label>
              <div className="flex flex-wrap gap-1">
                {allergen.crossSensitivityId.map((allergenId) => {
                  const allergen = allergens.find((s) => s.id === allergenId);
                  return allergen ? (
                    <Badge
                      key={allergenId}
                      variant="outline"
                      className="text-xs"
                    >
                      {allergen.name[localLanguage]}
                    </Badge>
                  ) : null;
                })}
              </div>
            </div>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
