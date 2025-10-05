"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertTriangle, User, Shield, Heart } from "lucide-react";
import { PublicPAP } from "@/modules/commands/GetPublicPAP/typing";
import { httpGet$GetPublicPAP } from "@/modules/commands/GetPublicPAP/fetcher";
import { useLocale, useTranslations } from "next-intl";
import { Language, } from "@/modules/business-types";
import { formatTimeFromContactToSymptom, getSeverityColor, getTypeColor } from "@/lib/client-side-utils";
import LocaleDropdown from "@/app/(protected)/dashboard/_components/Header/_components/locale-change";

interface PublicPAPViewProps {
  publicId: string;
}

export default function PublicPAPView({ publicId }: PublicPAPViewProps) {
  const t = useTranslations("publicPAPView");
  const localLanguage = useLocale() as Language;

  const [profile, setProfile] = useState<PublicPAP | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);

        const data = await httpGet$GetPublicPAP(
          `/api/user-pap/public/${publicId}`
        );
        if (data.success) {
          setProfile(data.result!);
        } else {
          setError(data.message);
        }
      } catch (err) {
        console.log(err);
        setError(t("failedToLoadProfile"));
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [publicId, t]);

  const getSeverityLabel = (severity: number) => {
    if (severity === 1) return t("mild");
    if (severity === 2) return t("moderate");
    return t("severe");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-100 via-blue-50 to-blue-100">
        <div className="container mx-auto p-6">
          <div className="mb-8">
            <Skeleton className="h-10 w-80 mb-2" />
            <Skeleton className="h-6 w-96" />
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-48" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="p-4 border rounded-lg">
                      <Skeleton className="h-5 w-32 mb-2" />
                      <div className="flex gap-2 mb-2">
                        <Skeleton className="h-5 w-16" />
                        <Skeleton className="h-5 w-20" />
                      </div>
                      <Skeleton className="h-4 w-full" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-100 via-blue-50 to-blue-100">
        <div className="container mx-auto p-6">
          <Card className="max-w-md mx-auto mt-20">
            <CardContent className="text-center p-8">
              <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                {t("profileNotFound")}
              </h2>
              <p className="text-gray-600">{error}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-100 via-blue-50 to-blue-100">
        <div className="container mx-auto p-6">
          <Card className="max-w-md mx-auto mt-20">
            <CardContent className="text-center p-8">
              <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                {t("profileNotAvailable")}
              </h2>
              <p className="text-gray-600">{t("profilePrivateOrNotExist")}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Sort allergens by severity (highest first)
  const sortedAllergens = [...profile.allergens];

  // Get all unique symptoms and sort by severity (highest first)
  const allSymptoms = profile.allergens
    .flatMap((allergen) => allergen.symptoms)
    .reduce(
      (unique, symptom) => {
        // Remove duplicates based on symptomId
        if (!unique.find((s) => s.symptomId === symptom.symptomId)) {
          unique.push(symptom);
        }
        return unique;
      },
      [] as PublicPAP["allergens"][0]["symptoms"]
    )
    .sort((a, b) => b.severity - a.severity);

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-100 via-blue-50 to-blue-100">
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <div className="flex justify-between">
            <div className="flex items-center gap-3">
              <User className="h-8 w-8 text-cyan-600 mb-4" />
              <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-800 pb-4">
                {t("publicAllergyProfile")}
              </h1>
            </div>
            <LocaleDropdown className="bg-white" />
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Shield className="h-4 w-4" />
            <p>{t("profileId", { publicId })}</p>
          </div>
          <p>
            <i>{t("notePublicProfile")}</i>
          </p>
        </div>

        <div className="space-y-8">
          {/* Allergens Section */}
          <Card className="bg-gradient-to-br from-cyan-50 to-blue-50 border-cyan-200">
            <CardHeader>
              <CardTitle className="text-cyan-800 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                {t("allergens")} ({profile.allergens.length})
                <Badge variant="secondary" className="ml-2">
                  {t("sortedBySeverity")}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sortedAllergens.map((allergen) => (
                  <div
                    key={allergen.allergenId}
                    className="bg-white/70 backdrop-blur-sm p-4 rounded-lg border border-cyan-200"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-semibold text-cyan-800">
                        {allergen.name[localLanguage]}
                      </h3>
                      <div className="flex items-center gap-2">
                        <Badge
                          className={`${getTypeColor(allergen.type)} text-white capitalize`}
                        >
                          {allergen.type}
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-700 block mb-2">
                        {t("associatedSymptoms")} ({allergen.symptoms.length}):
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {allergen.symptoms
                          .sort((a, b) => b.severity - a.severity)
                          .map((symptom) => (
                            <Badge
                              key={symptom.symptomId}
                              variant="outline"
                              className="text-xs border-cyan-300"
                            >
                              {symptom.name[localLanguage]} ({symptom.severity})
                            </Badge>
                          ))}
                      </div>
                    </div>
                    {(allergen.timeFromContactToSymptom) && (
                        <div className="mb-3 mt-3">
                          <span className="text-sm font-medium text-gray-700 block mb-1">
                            {t("timeFromContactToSymptom")}
                          </span>
                          <Badge variant="outline" className="text-xs border-cyan-300">
                            {formatTimeFromContactToSymptom(allergen.timeFromContactToSymptom, t)}
                          </Badge>
                        </div>
                      )}
                  </div>
                ))}

                {profile.allergens.length === 0 && (
                  <div className="text-center text-gray-500 py-8">
                    <Heart className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>{t("noAllergensRecorded")}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Symptoms Section */}
          <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
            <CardHeader>
              <CardTitle className="text-orange-800 flex items-center gap-2">
                <Heart className="h-5 w-5" />
                {t("allSymptomsAndTreatments")} ({allSymptoms.length})
                <Badge variant="secondary" className="ml-2">
                  {t("sortedBySeverity")}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {allSymptoms.map((symptom) => (
                  <div
                    key={symptom.symptomId}
                    className="bg-white/70 backdrop-blur-sm p-4 rounded-lg border border-orange-200"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-semibold text-orange-800">
                        {symptom.name[localLanguage]}
                      </h3>
                      <Badge
                        className={`${getSeverityColor(symptom.severity)} text-white`}
                      >
                        {getSeverityLabel(symptom.severity)} ({symptom.severity}
                        )
                      </Badge>
                    </div>

                    <div>
                      <span className="text-sm font-medium text-gray-700 block mb-2">
                        {t("description")}:
                      </span>
                      <div className="bg-gradient-to-r from-orange-50 to-yellow-50 p-3 rounded-md border border-orange-100">
                        <p className="text-gray-700 text-sm leading-relaxed" dangerouslySetInnerHTML={{
                              __html: symptom.description[localLanguage],}}>
                        </p>
                      </div>
                    </div>
                  </div>
                ))}

                {allSymptoms.length === 0 && (
                  <div className="text-center text-gray-500 py-8">
                    <Heart className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>{t("noSymptomsRecorded")}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-gray-500 text-sm">
          <p>{t("footerNote1")}</p>
          <p className="mt-1">{t("footerNote2")}</p>
        </div>
      </div>
    </div>
  );
}
