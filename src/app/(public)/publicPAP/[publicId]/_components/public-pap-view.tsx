"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertTriangle, User, Shield, Heart } from "lucide-react"
import { PublicPAP } from "@/modules/commands/GetPublicPAP/typing"
import { httpGet$GetPublicPAP } from "@/modules/commands/GetPublicPAP/fetcher"

interface PublicPAPViewProps {
  publicId: string
}

export default function PublicPAPView({ publicId }: PublicPAPViewProps) {
  const [profile, setProfile] = useState<PublicPAP | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true)

        const data = await httpGet$GetPublicPAP(`/api/pap/public/${publicId}`)
        if (data.success) {
            setProfile(data.publicPAP!)
        } else {
            setError(data.message)
        }

      } catch (err) {
        console.log(err)
        setError("Failed to load public profile")
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [publicId])

  const getSeverityColor = (severity: number) => {
    if (severity === 1) return "bg-green-500"
    if (severity === 2) return "bg-yellow-500"
    return "bg-red-500"
  }

  const getSeverityLabel = (severity: number) => {
    if (severity === 1) return "Mild"
    if (severity === 2) return "Moderate"
    return "Severe"
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "food":
        return "bg-blue-500"
      case "drug":
        return "bg-purple-500"
      case "respiratory":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

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
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-100 via-blue-50 to-blue-100">
        <div className="container mx-auto p-6">
          <Card className="max-w-md mx-auto mt-20">
            <CardContent className="text-center p-8">
              <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Profile Not Found</h2>
              <p className="text-gray-600">{error}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-100 via-blue-50 to-blue-100">
        <div className="container mx-auto p-6">
          <Card className="max-w-md mx-auto mt-20">
            <CardContent className="text-center p-8">
              <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Profile Not Available</h2>
              <p className="text-gray-600">This profile may be private or does not exist.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Sort allergens by severity (highest first)
  const sortedAllergens = [...profile.allergens].sort((a, b) => b.severity - a.severity)

  // Get all unique symptoms and sort by severity (highest first)
  const allSymptoms = profile.allergens
    .flatMap((allergen) => allergen.symptoms)
    .reduce(
      (unique, symptom) => {
        // Remove duplicates based on symptomId
        if (!unique.find((s) => s.symptomId === symptom.symptomId)) {
          unique.push(symptom)
        }
        return unique
      },
      [] as PublicPAP["allergens"][0]["symptoms"],
    )
    .sort((a, b) => b.severity - a.severity)

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-100 via-blue-50 to-blue-100">
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <User className="h-8 w-8 text-cyan-600" />
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-800">
              Public Allergy Profile
            </h1>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Shield className="h-4 w-4" />
            <p>Profile ID: {publicId}</p>
          </div>
        </div>

        <div className="space-y-8">
          {/* Allergens Section */}
          <Card className="bg-gradient-to-br from-cyan-50 to-blue-50 border-cyan-200">
            <CardHeader>
              <CardTitle className="text-cyan-800 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Allergens ({profile.allergens.length})
                <Badge variant="secondary" className="ml-2">
                  Sorted by Severity
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
                      <h3 className="text-lg font-semibold text-cyan-800">{allergen.name}</h3>
                      <div className="flex items-center gap-2">
                        <Badge className={`${getTypeColor(allergen.type)} text-white capitalize`}>
                          {allergen.type}
                        </Badge>
                        <Badge className={`${getSeverityColor(allergen.severity)} text-white`}>
                          {getSeverityLabel(allergen.severity)} ({allergen.severity})
                        </Badge>
                      </div>
                    </div>

                    <div>
                      <span className="text-sm font-medium text-gray-700 block mb-2">
                        Associated Symptoms ({allergen.symptoms.length}):
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {allergen.symptoms
                          .sort((a, b) => b.severity - a.severity)
                          .map((symptom) => (
                            <Badge key={symptom.symptomId} variant="outline" className="text-xs border-cyan-300">
                              {symptom.name} ({symptom.severity})
                            </Badge>
                          ))}
                      </div>
                    </div>
                  </div>
                ))}

                {profile.allergens.length === 0 && (
                  <div className="text-center text-gray-500 py-8">
                    <Heart className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No allergens recorded in this profile</p>
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
                All Symptoms & Treatments ({allSymptoms.length})
                <Badge variant="secondary" className="ml-2">
                  Sorted by Severity
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
                      <h3 className="text-lg font-semibold text-orange-800">{symptom.name}</h3>
                      <Badge className={`${getSeverityColor(symptom.severity)} text-white`}>
                        {getSeverityLabel(symptom.severity)} ({symptom.severity})
                      </Badge>
                    </div>

                    <div>
                      <span className="text-sm font-medium text-gray-700 block mb-2">Treatment:</span>
                      <div className="bg-gradient-to-r from-orange-50 to-yellow-50 p-3 rounded-md border border-orange-100">
                        <p className="text-gray-700 text-sm leading-relaxed">{symptom.treatment}</p>
                      </div>
                    </div>
                  </div>
                ))}

                {allSymptoms.length === 0 && (
                  <div className="text-center text-gray-500 py-8">
                    <Heart className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No symptoms recorded in this profile</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-gray-500 text-sm">
          <p>This is a public allergy profile. Information is provided for awareness and emergency purposes.</p>
          <p className="mt-1">Always consult healthcare professionals for medical advice.</p>
        </div>
      </div>
    </div>
  )
}
