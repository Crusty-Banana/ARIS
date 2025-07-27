"use client"

import { useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X, Search } from "lucide-react"

interface ScrollableSelectProps<T> {
  items: T[]
  selectedItems: string[]
  onSelectionChange: (selected: string[]) => void
  getItemId: (item: T) => string
  getItemLabel: (item: T) => string
  label: string
  maxHeight?: string
}

export function ScrollableSelect<T>({
  items,
  selectedItems,
  onSelectionChange,
  getItemId,
  getItemLabel,
  label,
  maxHeight = "max-h-48",
}: ScrollableSelectProps<T>) {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredItems = items.filter((item) => getItemLabel(item).toLowerCase().includes(searchTerm.toLowerCase()))

  const toggleItem = (itemId: string) => {
    if (selectedItems.includes(itemId)) {
      onSelectionChange(selectedItems.filter((id) => id !== itemId))
    } else {
      onSelectionChange([...selectedItems, itemId])
    }
  }

  const removeItem = (itemId: string) => {
    onSelectionChange(selectedItems.filter((id) => id !== itemId))
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>

      {/* Selected items */}
      {selectedItems.length > 0 && (
        <div className="flex flex-wrap gap-2 p-2 border border-cyan-200 rounded-md bg-cyan-50">
          {selectedItems.map((itemId) => {
            const item = items.find((i) => getItemId(i) === itemId)
            return item ? (
              <Badge key={itemId} variant="secondary" className="flex items-center gap-1">
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
            ) : null
          })}
        </div>
      )}

      {/* Search bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search items..."
          className="pl-10 border-cyan-300 focus:border-cyan-500"
        />
      </div>

      {/* Scrollable list */}
      <div className={`border border-cyan-200 rounded-md ${maxHeight} overflow-y-auto bg-white`}>
        {filteredItems.length > 0 ? (
          <div className="p-2 space-y-2">
            {filteredItems.map((item) => {
              const itemId = getItemId(item)
              const isSelected = selectedItems.includes(itemId)
              return (
                <div key={itemId} className="flex items-center space-x-2 p-2 hover:bg-cyan-50 rounded">
                  <Checkbox id={itemId} checked={isSelected} onCheckedChange={(checked) => toggleItem(itemId)} />
                  <label htmlFor={itemId} className="text-sm cursor-pointer flex-1">
                    {getItemLabel(item)}
                  </label>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="p-4 text-center text-gray-500">No items found</div>
        )}
      </div>
    </div>
  )
}
