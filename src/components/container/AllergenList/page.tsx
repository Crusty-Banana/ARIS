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
import {
  Allergen,
  AllergenType,
  Language,
  ObjectIdAsHexString,
} from "@/modules/business-types";
import {
  ArrowDown,
  ArrowUp,
  ChevronFirst,
  ChevronLast,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Search,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useCallback, useEffect, useState } from "react";
import { AllergenItem } from "./_components/item";
import { AllergenDetailModal } from "./_components/allergen-detail-modal";
import { localizeAllergen } from "@/lib/client-side-utils";
import { AddAllergen$Params } from "@/modules/commands/AddBusinessType/typing";
import { httpPost$AddAllergen } from "@/modules/commands/AddBusinessType/fetcher";
import { toast } from "sonner";
import { UpdateAllergen$Params } from "@/modules/commands/UpdateBusinessType/typing";
import { httpPut$UpdateAllergen } from "@/modules/commands/UpdateBusinessType/fetcher";
import { httpDelete$DeleteAllergen } from "@/modules/commands/DeleteBusinessType/fetcher";
import { httpGet$GetBriefAllergens } from "@/modules/commands/GetBriefAllergens/fetcher";
import { BriefAllergen } from "@/modules/commands/GetBriefAllergens/typing";

const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
};

interface AllergenListProps {
  // onQuickAdd?: (allergen: BriefAllergen) => void;
  // userAllergenIds?: ObjectIdAsHexString[];
}

type SortDirection = "asc" | "desc";

export function AllergenList(
  {
    // onQuickAdd,
    // userAllergenIds,
  }: AllergenListProps
) {
  const t = useTranslations("common");

  const [allergens, setAllergens] = useState<BriefAllergen[]>([]);
  const [total, setTotal] = useState(0);

  const localLanguage = useLocale() as Language;

  const [page, setPage] = useState(1);
  const [inputPage, setInputPage] = useState("1");
  const [name, setName] = useState("");
  const [type, setType] = useState<AllergenType>("");
  const [sort, setSort] = useState<"asc" | "desc">("asc");

  const debouncedName = useDebounce(name, 300); // 300ms

  const fetchAllergens = useCallback(async () => {
    const params = {
      page,
      sort,
      lang: localLanguage,
      ...(debouncedName && { name: debouncedName }),
      ...(type !== "" && { type }),
    };

    try {
      const data = await httpGet$GetBriefAllergens(
        "/api/allergens/brief",
        params
      );
      if (data.success) {
        setAllergens(data.result as BriefAllergen[]);
        setTotal(data.total as number);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Failed to fetch allergens.");
    }
  }, [page, debouncedName, type, sort]);

  useEffect(() => {
    fetchAllergens();
  }, [fetchAllergens]);

  const addAllergen = async (allergen: AddAllergen$Params) => {
    const data = await httpPost$AddAllergen("/api/allergens", allergen);
    if (data.success) {
      await fetchAllergens();
      // TODO: add toast.success
    } else {
      toast.message(data.message);
    }
  };

  const updateAllergen = async (allergenData: UpdateAllergen$Params) => {
    const { id, ...rest } = allergenData;
    const data = await httpPut$UpdateAllergen(`/api/allergens/${id}`, rest);
    if (data.success) {
      await fetchAllergens();
      // TODO: add toast.success
    } else {
      toast.message(data.message);
    }
  };

  const deleteAllergen = async (id: string) => {
    const data = await httpDelete$DeleteAllergen(`/api/allergens/${id}`);
    if (data.success) {
      await fetchAllergens();
    } else {
      toast.error(data.message);
    }
  };

  const [selectedAllergen, setSelectedAllergen] =
    useState<BriefAllergen | null>(null);

  const handleDelete = (id: string) => {
    if (confirm(t("areYouSureDeleteAllergen"))) {
      if (deleteAllergen) deleteAllergen(id);
    }
  };

  return (
    <>
      <Card className="bg-gradient-to-br from-cyan-50 to-blue-50 border-cyan-200">
        <CardHeader>
          <CardTitle className="text-cyan-800 flex items-center justify-between">
            {t("allergens")}
          </CardTitle>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t("searchAllergens")}
                className="pl-10 border-cyan-300 focus:border-cyan-500"
              />
            </div>
            <Select
              value={type}
              onValueChange={(v) =>
                setType((v === "all" ? "" : v) as AllergenType)
              }
            >
              <SelectTrigger className="w-32 border-cyan-300 focus:border-cyan-500">
                <SelectValue placeholder={t("allTypes")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("allTypes")}</SelectItem>
                <SelectItem value="food">{t("food")}</SelectItem>
                <SelectItem value="drug">{t("drug")}</SelectItem>
                <SelectItem value="respiratory">{t("respiratory")}</SelectItem>
                <SelectItem value="venom">{t("venom")}</SelectItem>
                <SelectItem value="miscellaneous">
                  {t("miscellaneous")}
                </SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSort(sort === "asc" ? "desc" : "asc")}
              className="px-3 bg-transparent"
            >
              {sort === "asc" ? (
                <ArrowUp className="h-4 w-4" />
              ) : (
                <ArrowDown className="h-4 w-4" />
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {allergens.map((allergen) => (
              <AllergenItem
                allergen={localizeAllergen(
                  {
                    // TODO: Minh: I'm just parsing dummy fields, not sure if we should have a BriefLocalizedAllergen?
                    ...allergen,
                    description: { en: "", vi: "" },
                    crossSensitivityId: [],
                  },
                  localLanguage
                )}
                // TODO:
                // handleQuickAdd={
                //   onQuickAdd ? () => onQuickAdd(allergen) : undefined
                // }
                // userAllergenIds={userAllergenIds}
                onClick={() => setSelectedAllergen(allergen)}
                key={allergen.id}
              />
            ))}
            {allergens.length === 0 && (
              <div className="text-center text-gray-500 py-4">
                {t("noAllergensFound")}
              </div>
            )}
          </div>
        </CardContent>
        <div className="flex">
          <div>
            Showing {(page - 1) * 100 + 1}-{Math.min(total, page * 100)} from{" "}
            {total}
          </div>
          <div className="flex">
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
        </div>
      </Card>
      {/* TODO: {selectedAllergen !== null && (
        <AllergenDetailModal
          allergen={selectedAllergen}
          onClose={() => setSelectedAllergen(null)}
          onUpdate={onEdit}
          onDelete={onDelete ? handleDelete : undefined}
          allergens={allergens}
        />
      )} */}
    </>
  );
}
