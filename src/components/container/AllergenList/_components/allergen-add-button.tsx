"use client";

import type React from "react";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  AllergenType,
  DisplayString,
  Language,
} from "@/modules/business-types";
import { useLocale, useTranslations } from "next-intl";
import { AddAllergen$Params } from "@/modules/commands/AddBusinessType/typing";
import { AllergenForm } from "./allergen-form";
import { useSWRConfig } from "swr";
import { httpPost$AddAllergen } from "@/modules/commands/AddBusinessType/fetcher";
import { toast } from "sonner";

export function AddAllergenButton() {
  const t = useTranslations("allergenModal");
  const localLanguage = useLocale() as Language;

  const [open, setOpen] = useState(false);
  const [type, setType] = useState<AllergenType>("");
  const [name, setName] = useState<DisplayString>({ en: "", vi: "" });
  const [selectedCrossSentitivity, setSelectedCrossSentitivity] = useState<
    string[]
  >([]);
  const [description, setDescription] = useState<DisplayString>({
    en: "",
    vi: "",
  });
  const [selectedLanguage, setSelectedLanguage] =
    useState<Language>(localLanguage);

  const { mutate } = useSWRConfig();

  const addAllergen = async (allergen: AddAllergen$Params) => {
    const data = await httpPost$AddAllergen("/api/allergens", allergen);
    if (data.success) {
      mutate(
        (key) => Array.isArray(key) && key.includes("/api/allergens/brief")
      );
      toast.success(data.message);
    } else {
      toast.error(data.message);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (type && name && description) {
      addAllergen({
        type: type as AllergenType,
        name,
        crossSensitivityId: selectedCrossSentitivity,
        description,
      });
      setType("");
      setName({ en: "", vi: "" });
      setDescription({ en: "", vi: "" });
      setOpen(false);
      setSelectedCrossSentitivity([]);
    }
  };
  const handleNameChange = (value: string) => {
    setName((prev) => ({
      ...prev,
      [selectedLanguage]: value,
    }));
  };

  const handleDescriptionChange = (value: string) => {
    setDescription((prev) => ({
      ...prev,
      [selectedLanguage]: value,
    }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          {t("addAllergen")}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-cyan-800">
            {t("addNewAllergen")}
          </DialogTitle>
          <DialogDescription />
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 max-h-[70vh] overflow-y-auto">
          <form onSubmit={handleSubmit} className="space-y-4 col-span-2">
            <AllergenForm
              type={type}
              setType={setType}
              selectedLanguage={selectedLanguage}
              setSelectedLanguage={setSelectedLanguage}
              name={name}
              handleNameChange={handleNameChange}
              description={description}
              handleDescriptionChange={handleDescriptionChange}
              selectedCrossSensitivity={selectedCrossSentitivity}
              setSelectedCrossSensitivity={setSelectedCrossSentitivity}
            />
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
            >
              {t("addAllergen")}
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
