"use client";

import { useCallback, useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { SearchBar } from "./container/AllergenList/_components/search-bar";

interface ScrollableSelectProps<T> {
  items: T[];
  initialItems?: T[];
  total: number;
  isLoading: boolean;

  searchTerm: string;
  onSearchChange: (term: string) => void;
  onPageChange: () => void;

  selectedItemIDs: string[];
  onSelectionChange: (selected: string[]) => void;
  getItemId: (item: T) => string;
  getItemLabel: (item: T) => string;
  label: string;
  maxHeight?: string;
}

export function ScrollableSelect<T>({
  items,
  initialItems,
  total,
  isLoading,
  searchTerm,
  onSearchChange,
  onPageChange,
  selectedItemIDs,
  onSelectionChange,
  getItemId,
  getItemLabel,
  label,
  maxHeight = "max-h-48",
}: ScrollableSelectProps<T>) {
  const t = useTranslations("common");

  const hasMore = items.length < total;

  const [itemRegistry, setItemRegistry] = useState<Record<string, T>>({}); // Ensure items persist even when not in search result
  const updateRegistry = useCallback(
    (newItems: T[]) => {
      if (!newItems || newItems.length === 0) return;

      setItemRegistry((prev) => {
        const next = { ...prev };
        let hasChanged = false;

        newItems.forEach((item) => {
          const id = getItemId(item);
          if (!next[id]) {
            next[id] = item;
            hasChanged = true;
          }
        });

        return hasChanged ? next : prev;
      });
    },
    [getItemId] // getItemId is a dependency because it's used inside
  );

  // Sync registry
  useEffect(() => {
    updateRegistry(items);
  }, [items, updateRegistry]);

  useEffect(() => {
    if (initialItems) updateRegistry(initialItems);
  }, [initialItems, updateRegistry]);

  const toggleItem = (itemId: string) => {
    if (selectedItemIDs.includes(itemId)) {
      onSelectionChange(selectedItemIDs.filter((id) => id !== itemId));
    } else {
      onSelectionChange([...selectedItemIDs, itemId]);
    }
  };

  const removeItem = (itemId: string) => {
    onSelectionChange(selectedItemIDs.filter((id) => id !== itemId));
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>

      {/* Selected items */}
      {selectedItemIDs.length > 0 && (
        <div className="flex flex-wrap gap-2 p-2 border border-cyan-200 rounded-md bg-cyan-50">
          {selectedItemIDs.map((itemId: string) => {
            const item = itemRegistry[itemId];
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

      {/* Search bar */}
      <SearchBar
        value={searchTerm}
        setValue={onSearchChange}
        searchPlaceholder={t("searchItems")}
        className="relative"
      ></SearchBar>

      {/* Scrollable list */}
      <div
        className={`border border-cyan-200 rounded-md ${maxHeight} overflow-y-auto bg-white`}
      >
        {items && items.length > 0 ? (
          <div className="p-2 space-y-2">
            {items.map((item: T) => {
              const itemId = getItemId(item);
              const isSelected = selectedItemIDs.includes(itemId);
              return (
                <div
                  key={itemId}
                  className="flex items-center space-x-2 p-2 hover:bg-cyan-50 rounded"
                >
                  <Checkbox
                    id={itemId}
                    checked={isSelected}
                    onCheckedChange={(checked) => {
                      console.log(checked);
                      toggleItem(itemId);
                    }}
                  />
                  <label
                    htmlFor={itemId}
                    className="text-sm cursor-pointer flex-1"
                  >
                    {getItemLabel(item)}
                  </label>
                </div>
              );
            })}

            {hasMore && (
              <div className="pt-2 flex justify-center">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full text-xs text-muted-foreground hover:bg-cyan-100"
                  onClick={() => onPageChange()}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    t("loadMore") || "Load More"
                  )}
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="p-4 text-center text-gray-500">No items found</div>
        )}
      </div>
    </div>
  );
}
