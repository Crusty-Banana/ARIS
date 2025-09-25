"use client"

import { createContext, useContext, useState, ReactNode } from "react";
import { Symptom } from "@/modules/business-types";
import { SymptomDetailModal } from "@/components/container/SymptomList/_components/symptom-detail-modal";

// Define the shape of the context data
interface SymptomDetailContextType {
  showSymptomDetail: (symptom: Symptom) => void;
}

// Create the context with a default value
const SymptomDetailContext = createContext<SymptomDetailContextType | undefined>(undefined);

// Create the Provider component
export function SymptomDetailProvider({ children }: { children: ReactNode }) {
  const [selectedSymptom, setSelectedSymptom] = useState<Symptom | null>(null);

  const showSymptomDetail = (symptom: Symptom) => {
    setSelectedSymptom(symptom);
  };

  const handleClose = () => {
    setSelectedSymptom(null);
  };

  return (
    <SymptomDetailContext.Provider value={{ showSymptomDetail }}>
      {children}

      {/* The Modal is now rendered here, controlled by this provider */}
      {selectedSymptom && (
        <SymptomDetailModal symptom={selectedSymptom} onClose={handleClose} />
      )}
    </SymptomDetailContext.Provider>
  );
}

// Create a custom hook for easy access to the context
export function useSymptomDetail() {
  const context = useContext(SymptomDetailContext);
  if (context === undefined) {
    throw new Error("useSymptomDetail must be used within a SymptomDetailProvider");
  }
  return context;
}