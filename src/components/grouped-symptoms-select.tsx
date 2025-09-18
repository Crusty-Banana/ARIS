"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"

// MUI component imports
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import Checkbox from '@mui/material/Checkbox'
import Box from '@mui/material/Box'
import FormLabel from '@mui/material/FormLabel'
import FormControlLabel from '@mui/material/FormControlLabel'
import Typography from '@mui/material/Typography'
import { ChevronDown, X } from "lucide-react"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"

interface GroupedSymptomSelectProps<T> {
  items: T[]
  selectedItems: string[]
  onSelectionChange: (selected: string[]) => void
  getItemId: (item: T) => string
  getItemLabel: (item: T) => string
  label: string
}

export function GroupedSymptomSelect<T>({
  items,
  selectedItems,
  onSelectionChange,
  getItemId,
  getItemLabel,
  label,
}: GroupedSymptomSelectProps<T>) {
  const t = useTranslations('common');

  // Grouping logic: All items are placed into a single group.
  const symptomGroups = {
    // You can dynamically create group names if needed
    "All Symptoms": items,
  };

  const toggleItem = (itemId: string) => {
    onSelectionChange(
      selectedItems.includes(itemId)
        ? selectedItems.filter((id) => id !== itemId)
        : [...selectedItems, itemId]
    )
  }

  const removeItem = (itemId: string) => {
    onSelectionChange(selectedItems.filter((id) => id !== itemId))
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      <FormLabel>{label}</FormLabel>
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
      
      {/* Accordion for grouped symptoms */}
      {Object.entries(symptomGroups).map(([groupName, groupItems]) => (
        <Accordion defaultExpanded key={groupName} variant="outlined">
          <AccordionSummary
            expandIcon={<ChevronDown />}
            aria-controls={`${groupName}-content`}
            id={`${groupName}-header`}
          >
            <Typography>{groupName}</Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ p: 1 }}>
            <Box sx={{ maxHeight: '200px', overflowY: 'auto' }}>
              {groupItems.length > 0 ? (
                groupItems.map((item) => {
                  const itemId = getItemId(item);
                  const isSelected = selectedItems.includes(itemId);
                  return (
                    <FormControlLabel
                      key={itemId}
                      control={
                        <Checkbox
                          checked={isSelected}
                          onChange={() => toggleItem(itemId)}
                          id={itemId}
                        />
                      }
                      label={getItemLabel(item)}
                      sx={{ width: '100%', m: 0 }}
                    />
                  );
                })
              ) : (
                <Typography variant="body2" align="center" color="text.secondary" sx={{ p: 2 }}>
                  {t('no_items_found')}
                </Typography>
              )}
            </Box>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
}