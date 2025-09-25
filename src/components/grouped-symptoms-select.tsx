"use client"

import { useTranslations } from "next-intl"

// MUI component imports
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import { Checkbox } from "@/components/ui/checkbox"
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { ChevronDown, Info, X } from "lucide-react"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { useSymptomDetail } from "@/app/context/symptom-detail-context"
import { Symptom } from "@/modules/business-types"

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

  const symptomGroups = {
    "All Symptoms": items,
    "Oral": items.slice(5,9),
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

  const { showSymptomDetail } = useSymptomDetail();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
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
      
      {/* Accordion for grouped symptoms */}
      {Object.entries(symptomGroups).map(([groupName, groupItems]) => (
        <Accordion defaultExpanded={false} key={groupName} variant="outlined">
          <AccordionSummary
            expandIcon={<ChevronDown />}
            aria-controls={`${groupName}-content`}
            id={`${groupName}-header`}
          >
            <label className="block text-sm font-medium text-gray-700 mb-1">{groupName}</label>
          </AccordionSummary>
          <AccordionDetails sx={{ p: 1 }}>
            <Box sx={{ maxHeight: '200px', overflowY: 'auto' }}>
              {groupItems.length > 0 ? (
                groupItems.map((item) => {
                  const itemId = getItemId(item);
                  const isSelected = selectedItems.includes(itemId);
                  return (
                    <div key={itemId} className="flex items-center space-x-2 p-2 hover:bg-cyan-50 rounded">
                        <Checkbox id={itemId} checked={isSelected} onCheckedChange={(checked) => {
                          toggleItem(itemId);
                        }} />
                        <label htmlFor={itemId} className="text-sm cursor-pointer flex-1">
                          {getItemLabel(item)}
                        </label>
                        <Info
                          id={itemId} 
                          opacity={0.5} 
                          className="cursor-pointer hover:opacity-70"
                          onClick={() => showSymptomDetail(item as unknown as Symptom)}
                        >
                        </Info>
                      </div>
                  );
                })
              ) : (
                <Typography variant="body2" align="center" color="text.secondary" sx={{ p: 2 }}>
                  {t('noSymptomsFound')}
                </Typography>
              )}
            </Box>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
}