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
import {
  ArrowDown,
  ArrowUp,
  ChevronFirst,
  ChevronLast,
  ChevronLeft,
  ChevronRight,
  Search,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { SymptomItem } from "./_components/item";
import { SymptomDetailModal } from "./_components/symptom-detail-modal";
import { httpGet$GetBriefSymptoms } from "@/modules/commands/GetBriefSymptoms/fetcher";
import useSWR from "swr";
import { toast } from "sonner";
import { httpGet$GetDetailSymptom } from "@/modules/commands/GetDetailSymptom/fetcher";
import { UpdateSymptom$Params } from "@/modules/commands/UpdateBusinessType/typing";
import { httpPut$UpdateSymptom } from "@/modules/commands/UpdateBusinessType/fetcher";
import { httpDelete$DeleteSymptom } from "@/modules/commands/DeleteBusinessType/fetcher";
import { SearchBar } from "../AllergenList/_components/search-bar";

type SymptomSortOption = "name" | "severity";
type SortDirection = "asc" | "desc";

export function SymptomList() {
  const t = useTranslations("common");
  const localLanguage = useLocale() as Language;
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<SymptomSortOption>("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [page, setPage] = useState(1);

  const [selectedSymptom, setSelectedSymptom] = useState<Symptom | null>(null);

  const params = useMemo(() => {
    return {
      page: page,
      sort: sortDirection,
      lang: localLanguage,
      sortBy: sortBy,
      name: searchTerm,
    };
  }, [page, sortDirection, sortBy, searchTerm, localLanguage]);

  const key = [`/api/symptoms/brief`, params];

  const fetchSymptoms = async () => {
    const data = await httpGet$GetBriefSymptoms("/api/symptoms/brief", params);
    if (data.success) {
      return data;
    } else {
      throw new Error(data?.message);
    }
  };

  const { data, mutate } = useSWR(key, fetchSymptoms);

  const symptoms = data?.result || [];
  const total = data?.total || 0;

  const handleSelect = async (id: string) => {
    const params = { id };
    const data = await httpGet$GetDetailSymptom(
      `/api/symptoms/detail/${id}`,
      params
    );
    if (data.success) {
      setSelectedSymptom(data.result!);
    } else {
      toast.error(data.message);
    }
  };

  const updateSymptom = async (allergenData: UpdateSymptom$Params) => {
    const { id, ...rest } = allergenData;
    const data = await httpPut$UpdateSymptom(`/api/symptoms/${id}`, rest);
    if (data.success) {
      mutate();
      toast.success(data.message);
    } else {
      toast.error(data.message);
    }
  };

  const deleteSymptom = async (id: string) => {
    const data = await httpDelete$DeleteSymptom(`/api/symptoms/${id}`);
    if (data.success) {
      mutate();
      toast.success(data.message);
    } else {
      toast.error(data.message);
    }
  };

  const handleSearchChange = (newValue: string) => {
    setSearchTerm(newValue);
    setPage(1);
  };

  return (
    <>
      <Card className="bg-gradient-to-br from-cyan-50 to-blue-50 border-cyan-200">
        <CardHeader>
          <CardTitle className="text-cyan-800 flex items-center justify-between">
            {t("symptoms")}
          </CardTitle>
          <div className="flex gap-2">
            <SearchBar
              value={searchTerm}
              setValue={handleSearchChange}
              searchPlaceholder={t("searchAllergens")}
              className={"relative flex-1"}
            ></SearchBar>
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
              onClick={() =>
                setSortDirection(sortDirection === "asc" ? "desc" : "asc")
              }
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
            {symptoms.map((symptom) => (
              <SymptomItem
                key={symptom.id}
                symptom={symptom}
                onClick={() => handleSelect(symptom.id)}
              />
            ))}
            {symptoms.length === 0 && (
              <div className="text-center text-gray-500 py-4">
                {t("noSymptomsFound")}
              </div>
            )}
          </div>
        </CardContent>
        <div className="flex justify-center items-center pt-4 px-8">
          <div className="flex-1">
            <span>
              Showing {Math.min((page - 1) * 100 + 1, total)}-
              {Math.min(total, page * 100)} from {total}
            </span>
          </div>
          <div className="flex flex-1 items-center space-x-2">
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => setPage(1)}
              disabled={page <= 1}
            >
              <ChevronFirst className="h-4 w-4" />
            </Button>

            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => setPage(page - 1)}
              disabled={page <= 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <div>
              Page {Math.min(page, Math.ceil(total / 100))} of{" "}
              {Math.ceil(total / 100)}
            </div>

            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => setPage(page + 1)}
              disabled={page >= Math.ceil(total / 100)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>

            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => setPage(Math.ceil(total / 100))}
              disabled={page >= Math.ceil(total / 100)}
            >
              <ChevronLast className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex-1"></div>
        </div>
      </Card>
      {selectedSymptom !== null && (
        <SymptomDetailModal
          symptom={selectedSymptom}
          onClose={() => setSelectedSymptom(null)}
          onUpdate={updateSymptom}
          onDelete={deleteSymptom}
        />
      )}
    </>
  );
}
