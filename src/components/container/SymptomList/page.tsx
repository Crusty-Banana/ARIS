import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Language, Symptom } from "@/modules/business-types";
import { ArrowDown, ArrowUp, Search } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { SymptomItem } from "./_components/item";
import { localizeSymptom } from "@/lib/client-side-utils";
import { SymptomDetailModal } from "./_components/symptom-detail-modal";

interface SymptomListProps {
  symptoms: Symptom[];
  onUpdate?: (symptom: Symptom) => void;
  onDelete?: (id: string) => void;
}

type SymptomSortOption = "name" | "severity";
type SortDirection = "asc" | "desc";

export function SymptomList({
  symptoms,
  onUpdate,
  onDelete,
}: SymptomListProps) {
  const t = useTranslations("common");
  const localLanguage = useLocale() as Language;
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<SymptomSortOption>("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [selectedSymptom, setSelectedSymptom] = useState<Symptom | null>(null);

  const toggleSortDirection = () => {
    setSortDirection(sortDirection === "asc" ? "desc" : "asc");
  };

  const filteredAndSortedSymptoms = symptoms
    .filter((symptom) =>
      symptom.name[localLanguage]
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case "name":
          comparison = a.name[localLanguage].localeCompare(
            b.name[localLanguage]
          );
          break;
        case "severity":
          comparison = a.severity - b.severity;
          break;
      }
      return sortDirection === "asc" ? comparison : -comparison;
    });

  const handleDelete = onDelete
    ? (id: string) => {
        if (confirm(t("detailModals.areYouSureSymptomDelete"))) {
          onDelete(id);
        }
      }
    : undefined;

  const handleEdit = onUpdate
    ? (symptom: Symptom) => {
        onUpdate(symptom);
      }
    : undefined;

  return (
    <>
      <Card className="bg-gradient-to-br from-cyan-50 to-blue-50 border-cyan-200">
        <CardHeader>
          <CardTitle className="text-cyan-800 flex items-center justify-between">
            {t("symptoms")}
          </CardTitle>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={t("searchSymptoms")}
                className="pl-10 border-cyan-300 focus:border-cyan-500"
              />
            </div>
            <Select
              value={sortBy}
              onValueChange={(value) => setSortBy(value as SymptomSortOption)}
            >
              <SelectTrigger className="w-40 border-cyan-300 focus:border-cyan-500">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">{t("sortByName")}</SelectItem>
                <SelectItem value="severity">{t("sortBySeverity")}</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="sm"
              onClick={toggleSortDirection}
              className="px-3 bg-transparent"
            >
              {sortDirection === "asc" ? (
                <ArrowUp className="h-4 w-4" />
              ) : (
                <ArrowDown className="h-4 w-4" />
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {filteredAndSortedSymptoms.map((symptom) => (
              <SymptomItem
                key={symptom.id}
                symptom={localizeSymptom(symptom, localLanguage)}
                onClick={() => setSelectedSymptom(symptom)}
              />
            ))}
            {filteredAndSortedSymptoms.length === 0 && (
              <div className="text-center text-gray-500 py-4">
                {t("noSymptomsFound")}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      {selectedSymptom !== null && (
        <SymptomDetailModal
          symptom={selectedSymptom}
          onClose={() => setSelectedSymptom(null)}
          onUpdate={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </>
  );
}
