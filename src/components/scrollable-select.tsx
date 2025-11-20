"use client";

import { useEffect, useMemo, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X, Loader2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { SearchBar } from "./container/AllergenList/_components/search-bar";
import { Language } from "@/modules/business-types";
import useSWR from "swr";

interface ScrollableSelectProps<T> {
  selectedItemIDs: string[];
  onSelectionChange: (selected: string[]) => void;
  getItemId: (item: T) => string;
  getItemLabel: (item: T) => string;
  label: string;
  maxHeight?: string;
  swrURLKey: string;
  itemFetcher: (
    url: string,
    /* eslint-disable @typescript-eslint/no-explicit-any */
    params: any
  ) => Promise<{ result?: T[]; total?: number }>;
}

export function ScrollableSelect<T>({
  selectedItemIDs,
  onSelectionChange,
  getItemId,
  getItemLabel,
  label,
  maxHeight = "max-h-48",
  swrURLKey,
  itemFetcher,
}: ScrollableSelectProps<T>) {
  const t = useTranslations("common");
  const localLanguage = useLocale() as Language; // TODO: Should useLocale() here or pass as prop from parent?

  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const [displayedItems, setDisplayedItems] = useState<T[]>([]);
  const [hasMore, setHasMore] = useState(true);

  const [itemRegistry, setItemRegistry] = useState<Record<string, T>>({}); // Ensure items persist even when not in search result
  const updateRegistry = (newItems: T[]) => {
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
  };

  // Fetch selected IDs (once on mount)
  const [initialIDsToFetch] = useState<string[]>(() => {
    return selectedItemIDs.length > 0 ? selectedItemIDs : [];
  });

  const initialFetchParams = useMemo(
    () => ({
      ids: initialIDsToFetch,
      page: 1,
      limit: 100,
      lang: localLanguage,
    }),
    [localLanguage, initialIDsToFetch]
  );

  const { data: initialData } = useSWR(
    initialIDsToFetch.length > 0 ? [swrURLKey, initialFetchParams] : null,
    ([url, params]) => itemFetcher(url, params),
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
    }
  );

  // Fetch searched data (as user types)
  useEffect(() => {
    setPage(1);
    setDisplayedItems([]);
    setHasMore(true);
  }, [searchTerm]);

  const searchParams = useMemo(() => {
    // use useMemo to prevent re-creating params on re-renders
    return {
      page,
      lang: localLanguage,
      ...(searchTerm && { name: searchTerm }),
    };
  }, [page, searchTerm, localLanguage]);

  const { data: searchData, isLoading: isSearchLoading } = useSWR(
    [swrURLKey, searchParams], // TODO: check if it overwrites Allergen List's cache!
    ([url, searchParams]) => itemFetcher(url, searchParams),
    { keepPreviousData: true }
  );

  // Sync registry
  useEffect(() => {
    if (initialData?.result) updateRegistry(initialData.result);
  }, [initialData]);

  useEffect(() => {
    if (searchData?.result) {
      updateRegistry(searchData.result);

      if (page === 1) {
        setDisplayedItems(searchData.result);
      } else {
        setDisplayedItems([...displayedItems, ...searchData.result]);
      }

      if (page * 100 >= searchData.total!) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }
    }
  }, [searchData, page]);

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
        setValue={setSearchTerm}
        searchPlaceholder={t("searchItems")}
        className="relative"
      ></SearchBar>

      {/* Scrollable list */}
      <div
        className={`border border-cyan-200 rounded-md ${maxHeight} overflow-y-auto bg-white`}
      >
        {searchData?.result && searchData.result.length > 0 ? (
          <div className="p-2 space-y-2">
            {searchData.result.map((item: T) => {
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
                  onClick={() => setPage((prev) => prev + 1)}
                  disabled={isSearchLoading}
                >
                  {isSearchLoading ? (
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
