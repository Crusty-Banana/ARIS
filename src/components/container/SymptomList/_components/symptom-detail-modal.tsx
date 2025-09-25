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
import { getSeverityColor } from "@/lib/client-side-utils";
import { Language, Symptom } from "@/modules/business-types";
import { Edit, Save, Trash2, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { SymptomForm } from "./symptom-form";

interface SymptomDetailModalProps {
  symptom: Symptom;
  onClose: () => void;
  onUpdate?: (symptom: Symptom) => void;
  onDelete?: (id: string) => void;
}

export function SymptomDetailModal({
  symptom,
  onClose,
  onUpdate,
  onDelete,
}: SymptomDetailModalProps) {
  const t = useTranslations("detailModals");
  const localLanguage = useLocale() as Language;
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Symptom>(symptom);
  const [selectedLanguage, setSelectedLanguage] =
    useState<Language>(localLanguage);

  const startEdit = () => {
    setIsEditing(true);
  };

  const cancelEdit = () => {
    setIsEditing(false);
  };

  const saveEdit = onUpdate
    ? () => {
        onUpdate(editData);
        setIsEditing(false);
        onClose();
      }
    : undefined;

  const handleDelete = onDelete
    ? () => {
        if (confirm(t("areYouSureSymptomDelete"))) {
          onDelete(symptom.id);
          onClose();
        }
      }
    : undefined;

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-cyan-800 flex items-center justify-between pr-8">
            {t("symptomDetails")}
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
          <SymptomForm
            selectedLanguage={selectedLanguage}
            setSelectedLanguage={setSelectedLanguage}
            name={editData.name}
            handleNameChange={(value) => {
              setEditData({
                ...editData,
                name: { ...editData.name, [selectedLanguage]: value },
              });
            }}
            severity={editData.severity}
            setSeverity={(value) => {
              setEditData({ ...editData, severity: value });
            }}
            organ={editData.organ}
            setOrgan={(value) => {
              setEditData({ ...editData, organ: value });
            }}
            description={editData.description}
            handleDescriptionChange={(value) => {
              setEditData({
                ...editData,
                description: {
                  ...editData.description,
                  [selectedLanguage]: value,
                },
              });
            }}
          />
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("name")} (
                  {selectedLanguage === "en" ? "English" : "Tiếng Việt"})
                </label>
                <div className="p-2 bg-gray-50 rounded">
                  {symptom.name[selectedLanguage]}
                </div>
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
                  {t("severity")}
                </label>
                <Badge
                  className={`${getSeverityColor(symptom.severity)} text-white`}
                >
                  {t("severity")}: {symptom.severity}
                </Badge>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("organ")} (
                {selectedLanguage === "en" ? "English" : "Tiếng Việt"})
              </label>
              <div
                className="p-2 bg-gray-50 rounded min-h-[100px] prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: symptom.organ }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("description")} (
                {selectedLanguage === "en" ? "English" : "Tiếng Việt"})
              </label>
              <div
                className="p-2 bg-gray-50 rounded min-h-[100px] prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{
                  __html: symptom.description[selectedLanguage],
                }}
              />
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
