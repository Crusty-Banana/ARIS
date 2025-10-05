"use client";

import { useTranslations } from "next-intl";

// MUI component imports
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Info, X } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { useSymptomDetail } from "@/app/context/symptom-detail-context";
import { Symptom } from "@/modules/business-types";

interface GroupedSymptomSelectProps<T> {
  items: T[];
  selectedItems: string[];
  onSelectionChange: (selected: string[]) => void;
  getItemId: (item: T) => string;
  getItemLabel: (item: T) => string;
  label: string;
}

const groupOrder = ["localized", "respiratory", "digestive", "systemic"];

export function GroupedSymptomSelect<T extends { organ: string }>({
  items,
  selectedItems,
  onSelectionChange,
  getItemId,
  getItemLabel,
  label,
}: GroupedSymptomSelectProps<T>) {
  const t = useTranslations("common");

  const symptomGroups = items.reduce(
    (groups, item) => {
      const organ = item.organ;
      if (!groups[organ]) {
        groups[organ] = [];
      }
      groups[organ].push(item);
      return groups;
    },
    {} as Record<string, T[]>
  );

  const toggleItem = (itemId: string) => {
    onSelectionChange(
      selectedItems.includes(itemId)
        ? selectedItems.filter((id) => id !== itemId)
        : [...selectedItems, itemId]
    );
  };

  const removeItem = (itemId: string) => {
    onSelectionChange(selectedItems.filter((id) => id !== itemId));
  };

  const { showSymptomDetail } = useSymptomDetail();

  return (
    <div className="flex flex-col gap-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      {/* Selected items */}
      {selectedItems.length > 0 && (
        <div className="flex flex-wrap gap-2 p-2 border border-cyan-200 rounded-md bg-cyan-50">
          {selectedItems.map((itemId) => {
            const item = items.find((i) => getItemId(i) === itemId);
            return item ? (
              <Badge
                key={itemId}
                variant="secondary"
                className="flex items-center gap-1"
              >
                {getItemLabel(item)}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 hover:bg-red-100"
                  onClick={() => removeItem(itemId)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ) : null;
          })}
        </div>
      )}

      {/* Accordion for grouped symptoms */}
      {Object.entries(symptomGroups)
        .sort(([a], [b]) => groupOrder.indexOf(a) - groupOrder.indexOf(b))
        .map(([groupName, groupItems]) => (
          <Accordion
            type="single"
            collapsible
            key={groupName}
            className="w-full"
          >
            <AccordionItem value={groupName} className="border rounded-md">
              <AccordionTrigger className="px-4 py-2 text-sm font-medium text-gray-700">
                {t(groupName)}
              </AccordionTrigger>
              <AccordionContent className="p-1">
                <div className="max-h-[200px] overflow-y-auto">
                  {groupItems.length > 0 ? (
                    groupItems.map((item) => {
                      const itemId = getItemId(item);
                      const isSelected = selectedItems.includes(itemId);
                      return (
                        <div
                          key={itemId}
                          className="flex items-center space-x-2 p-2 hover:bg-cyan-50 rounded"
                        >
                          <Checkbox
                            id={itemId}
                            checked={isSelected}
                            onCheckedChange={() => toggleItem(itemId)}
                          />
                          <label
                            htmlFor={itemId}
                            className="text-sm cursor-pointer flex-1"
                          >
                            {getItemLabel(item)}
                          </label>
                          <Info
                            id={itemId}
                            className="h-4 w-4 cursor-pointer text-muted-foreground hover:text-foreground"
                            onClick={() =>
                              showSymptomDetail(item as unknown as Symptom)
                            }
                          />
                        </div>
                      );
                    })
                  ) : (
                    <p className="p-2 text-center text-sm text-muted-foreground">
                      {t("noSymptomsFound")}
                    </p>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        ))}
    </div>
  );
}
