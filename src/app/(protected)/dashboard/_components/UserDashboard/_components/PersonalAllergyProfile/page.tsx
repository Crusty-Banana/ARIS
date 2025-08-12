"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Edit, Calendar, User, Shield, AlertTriangle, Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react"
import { AddAllergenModal } from "./_components/add-allergen-modal"
import { PotentialCrossAllergens } from "./_components/potential-cross-allergens"
import { DisplayPAP } from "@/modules/commands/GetPAP/typing"
import { Allergen, DiscoveryMethod, Gender, ObjectIdAsHexString, Symptom } from "@/modules/business-types"
import { UpdatePAPAllergen$Params, UpdatePAPFetcher$Params } from "@/modules/commands/UpdatePAP/typing"
import { useTranslations } from "next-intl"
import { SymptomDetailModal } from "@/components/symptom-detail-modal"
import { AllergenEditModal } from "./_components/allergen-edit-modal"
import { UnderlyingMedicalConditionsCard } from "./_components/underlying-medical-condition"
import { AddAllergenButton } from "./_components/add-allergen-button"

interface PersonalAllergyProfileProps {
  pAP: DisplayPAP
  availableSymptoms: Symptom[]
  availableAllergens: Allergen[]
  potentialCrossAllergens: Allergen[]
  onUpdate: (params: UpdatePAPFetcher$Params) => void
}

export function PersonalAllergyProfile({ pAP, availableSymptoms, potentialCrossAllergens, availableAllergens, onUpdate }: PersonalAllergyProfileProps) {
  const t = useTranslations('personalAllergyProfile');
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [editingAllergen, setEditingAllergen] = useState<string | null>(null)
  const [showAddAllergen, setShowAddAllergen] = useState(false)
  const [isProfileCardExpanded, setIsProfileCardExpanded] = useState(false);
  const [selectedSymptom, setSelectedSymptom] = useState<Symptom | null>(null)

  const [profileData, setProfileData] = useState({
    gender: pAP.gender,
    doB: pAP.doB,
    allowPublic: pAP.allowPublic,
  })

  useEffect(() => {
    setProfileData({
      gender: pAP.gender,
      doB: pAP.doB,
      allowPublic: pAP.allowPublic,
    });
  }, [pAP]);

  const formatDate = (timestamp: number | null) => {
    if (!timestamp) return t('notSpecified')
    return new Date(timestamp * 1000).toLocaleDateString()
  }

  const formatDateForInput = (timestamp: number | null) => {
    if (!timestamp) return ""
    return new Date(timestamp * 1000).toISOString().split("T")[0]
  }

  const parseInputDate = (dateString: string) => {
    if (!dateString) return null
    return Math.floor(new Date(dateString).getTime() / 1000)
  }

  const getSeverityColor = (severity: number) => {
    if (severity === 1) return "bg-green-500"
    if (severity === 2) return "bg-yellow-500"
    return "bg-red-500"
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

  const handleProfileUpdate = () => {
    onUpdate({
      ...profileData,
    })
    setIsEditingProfile(false)
  }

  const handleAllergenUpdate = (allergenId: ObjectIdAsHexString, updates: Omit<UpdatePAPAllergen$Params, "allergenId">) => {
    const pAPAllergens = pAP.allergens.map((allergen) => ({
      allergenId: allergen.allergenId,
      discoveryMethod: allergen.discoveryMethod,
      discoveryDate: allergen.discoveryDate,
      symptomsId: allergen.symptoms.map((symptom) => symptom.symptomId),
    }))
    const allergensUpdate = pAPAllergens.map((allergen) => {
      if (allergen.allergenId === allergenId) {
        return {
          ...allergen,
          ...updates,
        }
      }
      return allergen
    })

    onUpdate({
      allergens: allergensUpdate,
    })
    setEditingAllergen(null)
  }

  const handleAddAllergen = (allergenData: UpdatePAPAllergen$Params) => {
      const allergens = [...pAP.allergens.map(allergen => ({
        allergenId: allergen.allergenId,
        discoveryDate: allergen.discoveryDate,
        discoveryMethod: allergen.discoveryMethod,
        symptomsId: allergen.symptoms.map(symptom => symptom.symptomId),
        })), allergenData]
  
    onUpdate({ allergens })
  }

  const handleQuickAddAllergen = (allergen: Allergen) => {
    handleAddAllergen({
      allergenId: allergen.id,
      discoveryMethod: "Potential" as DiscoveryMethod,
      symptomsId: [],
    })
  }

  const handleDeleteAllergen = (allergenId: string) => {
    if (confirm(t('areYouSureRemoveAllergen'))) {
      const pAPAllergens = pAP.allergens.map((allergen) => ({
        allergenId: allergen.allergenId,
        discoveryMethod: allergen.discoveryMethod,
        discoveryDate: allergen.discoveryDate,
        symptomsId: allergen.symptoms.map((symptom) => symptom.symptomId),
      }))
      const updatedAllergens = pAPAllergens.filter((allergen) => allergen.allergenId !== allergenId)
      onUpdate({ allergens: updatedAllergens })
    }
  }

  return (
    <div className="space-y-6">
      {/* Profile Information */}
      <Card className="bg-gradient-to-br from-cyan-50 to-blue-50 border-cyan-200">
        <CardHeader>
            <CardTitle className="text-cyan-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
                <User className="h-5 w-5" />
                {t('personalInformation')}
            </div>
            <div className="flex flex-wrap items-center gap-x-2 gap-y-2 justify-end">
                <Button
                variant="outline"
                size="sm"
                onClick={() => setIsProfileCardExpanded(!isProfileCardExpanded)}
                className="bg-transparent flex items-center"
                >
                {isProfileCardExpanded ? (
                    <>
                    <ChevronUp className="h-4 w-4 mr-1" />
                    {t('showLess')}
                    </>
                ) : (
                    <>
                    <ChevronDown className="h-4 w-4 mr-1" />
                    {t('showMore')}
                    </>
                )}
                </Button>
                <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditingProfile(true)}
                className="bg-transparent flex items-center"
                >
                <Edit className="h-4 w-4 mr-1" />
                {t('edit')}
                </Button>
            </div>
            </CardTitle>
        </CardHeader>

        {isProfileCardExpanded && (
            <CardContent className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div>
                <label className="text-sm font-medium text-gray-700">{t('gender')}</label>
                <div className="mt-1 p-2 bg-white rounded border">
                {pAP.gender ? (
                    <Badge variant="secondary" className="capitalize">
                    {pAP.gender}
                    </Badge>
                ) : (
                    <span className="text-gray-500">{t('notSpecified')}</span>
                )}
                </div>
            </div>

            <div>
                <label className="text-sm font-medium text-gray-700">{t('dateOfBirth')}</label>
                <div className="mt-1 p-2 bg-white rounded border flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span>{formatDate(pAP.doB)}</span>
                </div>
            </div>

            <div>
                <label className="text-sm font-medium text-gray-700">{t('publicProfile')}</label>
                <div className="mt-1 p-2 bg-white rounded border flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-gray-400" />
                    <Badge variant={pAP.allowPublic ? "default" : "secondary"}>
                    {pAP.allowPublic ? t('public') : t('private')}
                    </Badge>
                </div>
                {pAP.allowPublic && (
                    <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(`/publicPAP/${pAP.publicId}`, "_blank")}
                    className="ml-2 h-7 text-xs bg-transparent border-cyan-300 hover:bg-cyan-50"
                    >
                    {t('viewPublicProfile')}
                    </Button>
                )}
                </div>
            </div>
            </CardContent>
        )}
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* My Allergens */}
        <div className="lg:col-span-2">
          <Card className="bg-gradient-to-br from-cyan-50 to-blue-50 border-cyan-200">
            <CardHeader className="flex justify-between items-start">
              <CardTitle className="text-cyan-800 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                {t('myAllergens')} ({pAP.allergens.length})
              </CardTitle>

              <Button
                onClick={() => setShowAddAllergen(true)}
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 h-9 px-3 text-sm lg:hidden"
              >
                <Plus className="h-4 w-4 mr-2" />
                {t('addAllergenButton')}
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pAP.allergens.map((allergen) => (
                  <div
                    key={allergen.allergenId}
                    className="bg-white/70 backdrop-blur-sm p-4 rounded-lg border border-cyan-200"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-3 gap-3">
                      <div className="flex-1">
                        <div className="flex items-center flex-wrap gap-2 mb-2">
                          <h3 className="font-semibold text-cyan-800">{allergen.name}</h3>
                          <Badge className={`${getTypeColor(allergen.type)} text-white text-xs capitalize`}>
                            {t(allergen.type)}
                          </Badge>
                          <Badge className={`${getSeverityColor(allergen.severity)} text-white text-xs`}>
                            {t('detailModals.severity')}: {allergen.severity}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 mb-3">
                          <div>
                            <span className="text-sm font-medium text-gray-700">{t('discoveryDate')}:</span>
                            <span className="ml-2 text-sm">{formatDate(allergen.discoveryDate)}</span>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-700">{t('discoveryMethod')}:</span>
                            <span className="ml-2 text-sm">{allergen.discoveryMethod === "Clinical symptoms" ? t('clinicalSymptoms') : allergen.discoveryMethod === "Paraclinical tests" ? t('paraclinicalTests') : allergen.discoveryMethod === "Potential" ? t('potential') : ""}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2 sm:ml-4 flex-shrink-0">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingAllergen(allergen.allergenId)}
                          className="bg-transparent"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteAllergen(allergen.allergenId)}
                          className="bg-transparent text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="flex gap-[1vw]">
                      <span className="text-sm font-medium text-gray-700 block">{t('associatedSymptoms')}:</span>
                      <div className="flex gap-[0.5vw]">
                        {allergen.symptoms.map((symptom) => (
                          <Badge 
                            key={symptom.symptomId} 
                            variant="outline" 
                            className="text-xs hover:bg-cyan-100 hover:cursor-pointer"
                            onClick={() => setSelectedSymptom(Symptom.parse({id: symptom.symptomId, ...symptom}))}
                          >
                            {symptom.name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}

                {pAP.allergens.length === 0 && (
                  <div className="text-center text-gray-500 py-8">
                    <AlertTriangle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>{t('noAllergensRecorded')}</p>
                    <p className="text-sm text-gray-400 mt-1">{t('clickAddAllergen')}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <AddAllergenButton onClick={() => setShowAddAllergen(true)} />

          <PotentialCrossAllergens
            potentialAllergens={potentialCrossAllergens}
            userAllergenIds={pAP.allergens.map((a) => a.allergenId)}
            onQuickAdd={handleQuickAddAllergen}
          />
          
          <UnderlyingMedicalConditionsCard 
            conditions={pAP.underlyingMedCon}
            onUpdate={(updatedConditions) => onUpdate({ underlyingMedCon: updatedConditions })}
          />

        </div>
      </div>

      <AddAllergenModal
        open={showAddAllergen}
        onClose={() => setShowAddAllergen(false)}
        availableAllergens={availableAllergens}
        availableSymptoms={availableSymptoms}
        onAddAllergen={handleAddAllergen}
      />

      <Dialog open={isEditingProfile} onOpenChange={setIsEditingProfile}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-cyan-800">{t('editPersonalInfo')}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('gender')}</label>
              <Select
                value={profileData.gender || ""}
                onValueChange={(value: Gender) => setProfileData({ ...profileData, gender: value as Gender })}
              >
                <SelectTrigger className="border-cyan-300 focus:border-cyan-500">
                  <SelectValue placeholder={t('selectGender')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">{t('male')}</SelectItem>
                  <SelectItem value="female">{t('female')}</SelectItem>
                  <SelectItem value="other">{t('other')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('dateOfBirth')}</label>
              <Input
                type="date"
                value={formatDateForInput(profileData.doB)}
                onChange={(e) => setProfileData({ ...profileData, doB: parseInputDate(e.target.value) })}
                className="border-cyan-300 focus:border-cyan-500"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">{t('allowPublicProfile')}</label>
              <Switch
                checked={profileData.allowPublic}
                onCheckedChange={(checked: boolean) => setProfileData({ ...profileData, allowPublic: checked })}
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                onClick={handleProfileUpdate}
                className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
              >
                {t('saveChanges')}
              </Button>
              <Button variant="outline" onClick={() => setIsEditingProfile(false)} className="flex-1">
                {t('cancel')}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <SymptomDetailModal
        symptom={selectedSymptom}
        onOpenChange={() => setSelectedSymptom(null)}
      />

      {editingAllergen && (
        <AllergenEditModal
          allergen={pAP.allergens.find((allergen) => allergen.allergenId === editingAllergen)!}
          availableSymptoms={availableSymptoms}
          onUpdate={(updates) => handleAllergenUpdate(editingAllergen, updates)}
          onClose={() => setEditingAllergen(null)}
        />
      )}
    </div>
  )
}