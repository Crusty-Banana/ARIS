"use client";

import { useState, useEffect, useCallback } from "react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Edit3, Save, X, Loader2, Trash2, Plus } from "lucide-react";
import { z } from "zod";
import { useSession } from "next-auth/react";
import { useLocale, useTranslations } from "next-intl";
import { httpGet$GetProfileWithUserId } from "@/modules/commands/GetProfileWithUserId/fetcher";
import { httpPut$UpdateProfileWithUserId } from "@/modules/commands/UpdateProfileWithUserId/fetcher";
import { DatePicker } from "@/components/ui/custom-date-picker";
import { Language } from "@/modules/business-types";
const personalInfoSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  doB: z
    .number()
    .refine(
      (dob) => {
        const date = new Date(dob);
        return !isNaN(date.getTime());
      },
      { message: "Invalid date" }
    )
    .nullable(),
  gender: z.enum(["male", "female", "other", ""]),
  underlyingMedCon: z.array(z.string()),
  allowPublic: z.boolean().default(false),
});

type PersonalInfoData = z.infer<typeof personalInfoSchema>;
const optionalPersonalInfoSchema = personalInfoSchema.partial();

export function PersonalInfoSection() {
  const [personalData, setPersonalData] = useState<PersonalInfoData>({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    doB: Date.parse("1990-05-15"),
    gender: "male",
    underlyingMedCon: ["Asthma (moderate persistent)", "Seasonal allergies"],
    allowPublic: false,
  });
  const t = useTranslations("personalInfo");
  const localLanguage = useLocale() as Language;
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<PersonalInfoData>(personalData);
  const [savedData, setSavedData] = useState<PersonalInfoData>(personalData);

  const getUserData = useCallback(async () => {
    if (session?.user?.id) {
      setIsLoading(true);
      const data = await httpGet$GetProfileWithUserId("api/user-profile");
      if (data.success && data.result) {
        const cleanedPayload = optionalPersonalInfoSchema.parse(data.result);

        setSavedData((prevData) => ({
          ...prevData,
          ...(cleanedPayload ?? {}),
        }));
        setFormData((prevData) => ({
          ...prevData,
          ...(cleanedPayload ?? {}),
        }));
      } else {
        console.error(data.message);
      }
      setIsLoading(false);
      console.log("Form data is: ", formData);
    }
  }, [session]);

  useEffect(() => {
    getUserData();
  }, [session, getUserData]);

  const handleInputChange = (
    field: string,
    value: string | boolean | Date | undefined
  ) => {
    if (field === "doB" && value instanceof Date) {
      const timestamp = value.getTime();
      setFormData((prev) => ({ ...prev, doB: timestamp }));
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }
  };
  const addMedicalCondition = () => {
    setFormData((prev) => ({
      ...prev,
      underlyingMedCon: [...prev.underlyingMedCon, ""],
    }));
  };

  const updateMedicalCondition = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      underlyingMedCon: prev.underlyingMedCon.map((condition, i) =>
        i === index ? value : condition
      ),
    }));
  };

  const removeMedicalCondition = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      underlyingMedCon: prev.underlyingMedCon.filter((_, i) => i !== index),
    }));
  };
  const updateUser = async (data: PersonalInfoData) => {
    const updateResponse = await httpPut$UpdateProfileWithUserId(
      "api/user-profile",
      data
    );
    if (!updateResponse.success) {
      console.error(updateResponse.message);
    }
  };
  const handleSave = async () => {
    setIsSaving(true);
    await updateUser(formData);
    setPersonalData(formData);
    setSavedData(formData);
    setIsSaving(false);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData(savedData);
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
        {/* Personal Information Section */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold text-cyan-800">
              {t("title")}
            </h2>
            <Skeleton className="h-10 w-32" />
          </div>
          <Card className="bg-white/70 backdrop-blur-sm border-white/20">
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Medical Conditions Section */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-cyan-800">
            {t("medicalConditionsTitle")}
          </h2>
          <Card className="bg-white/70 backdrop-blur-sm border-white/20">
            <CardContent className="p-6 space-y-6">
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-[120px] w-full" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!formData || !savedData) {
    return null;
  }
  return (
    <div className="space-y-8">
      {/* Personal Information Section */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-cyan-800">{t("title")}</h2>
          {!isEditing ? (
            <Button
              onClick={() => setIsEditing(true)}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white"
              disabled={isSaving}
            >
              <Edit3 className="w-4 h-4 mr-2" />
              {t("edit")}
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button
                onClick={handleSave}
                className="bg-green-500 hover:bg-green-600"
                disabled={isSaving}
              >
                {isSaving ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                {isSaving ? t("saving") : t("save")}
              </Button>
              <Button
                onClick={handleCancel}
                variant="outline"
                disabled={isSaving}
              >
                <X className="w-4 h-4 mr-2" />
                {t("cancel")}
              </Button>
            </div>
          )}
        </div>

        <Card className="bg-white/70 backdrop-blur-sm border-white/20">
          <CardContent className="p-6 space-y-4">
            <div
              className={`relative ${
                isSaving ? "opacity-60 pointer-events-none" : ""
              }`}
            >
              {isSaving && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/20 backdrop-blur-sm rounded-lg z-10">
                  <div className="flex items-center space-x-2 text-cyan-700">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span className="text-sm font-medium">
                      {t("savingChanges")}
                    </span>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">{t("firstName")}</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) =>
                      handleInputChange("firstName", e.target.value)
                    }
                    disabled={!isEditing}
                    className={!isEditing ? "bg-gray-50" : ""}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">{t("lastName")}</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) =>
                      handleInputChange("lastName", e.target.value)
                    }
                    disabled={!isEditing}
                    className={!isEditing ? "bg-gray-50" : ""}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">{t("email")}</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    disabled={true}
                    className={!isEditing ? "bg-gray-50" : ""}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">{t("dateOfBirth")}</Label>
                  <DatePicker
                    value={formData.doB ? new Date(formData.doB) : undefined}
                    onChange={(value) => handleInputChange("doB", value)}
                    placeholder={t("selectDate")}
                    localLanguage={localLanguage}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">{t("gender")}</Label>
                  <Select
                    value={formData.gender}
                    onValueChange={(value) =>
                      handleInputChange("gender", value)
                    }
                    disabled={!isEditing}
                  >
                    <SelectTrigger className={!isEditing ? "bg-gray-50" : ""}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">{t("male")}</SelectItem>
                      <SelectItem value="female">{t("female")}</SelectItem>
                      <SelectItem value="other">{t("other")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="allowPublic">{t("profileVisibility")}</Label>
                  <div className="flex items-center space-x-2 pt-2">
                    <Switch
                      id="allowPublic"
                      checked={formData.allowPublic}
                      onCheckedChange={(checked) =>
                        handleInputChange("allowPublic", checked)
                      }
                      disabled={!isEditing}
                      className="data-[state=checked]:bg-blue-600"
                    />
                    <span className="text-sm text-gray-600">
                      {t("profileVisibilityDescription")}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Medical Conditions Section */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-cyan-800">
          {t("medicalConditionsTitle")}
        </h2>

        <Card className="bg-white/70 backdrop-blur-sm border-white/20">
          <CardContent className="p-6 space-y-6">
            <div
              className={`relative ${
                isSaving ? "opacity-60 pointer-events-none" : ""
              }`}
            >
              {isSaving && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/20 backdrop-blur-sm rounded-lg z-10">
                  <div className="flex items-center space-x-2 text-cyan-700">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span className="text-sm font-medium">
                      {t("savingChanges")}
                    </span>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label>{t("medicalConditions")}</Label>
                  {isEditing && (
                    <Button
                      type="button"
                      onClick={addMedicalCondition}
                      size="sm"
                      className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      {t("addCondition")}
                    </Button>
                  )}
                </div>

                <div className="space-y-3">
                  {formData.underlyingMedCon.length === 0 ? (
                    <p className="text-gray-500 italic">{t("noCondition")}</p>
                  ) : (
                    formData.underlyingMedCon.map((condition, index) => (
                      <div key={index} className="flex gap-2 items-center">
                        <Input
                          value={condition}
                          onChange={(e) =>
                            updateMedicalCondition(index, e.target.value)
                          }
                          disabled={!isEditing}
                          placeholder="Enter medical condition..."
                          className={`flex-1 ${!isEditing ? "bg-gray-50" : ""}`}
                        />
                        {isEditing && (
                          <Button
                            type="button"
                            onClick={() => removeMedicalCondition(index)}
                            size="sm"
                            variant="outline"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
