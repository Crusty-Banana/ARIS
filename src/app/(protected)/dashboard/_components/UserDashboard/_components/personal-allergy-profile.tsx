"use client"

import {  useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Edit, Calendar, User, Shield, AlertTriangle, Plus } from "lucide-react"
import { ScrollableSelect } from "@/components/scrollable-select"
import { AddAllergenModal } from "./add-allergen-modal"
import { PotentialCrossAllergens } from "./potential-cross-allergens"
import { Trash2 } from "lucide-react"
import { DisplayPAP, DisplayPAPAllergen } from "@/modules/commands/GetPAP/typing"
import { Allergen, DiscoveryMethod, Gender, ObjectIdAsHexString, Symptom } from "@/modules/business-types"
import { UpdatePAPAllergen$Params, UpdatePAPFetcher$Params } from "@/modules/commands/UpdatePAP/typing"

interface PersonalAllergyProfileProps {
  pAP: DisplayPAP
  availableSymptoms: Symptom[]
  availableAllergens: Allergen[]
  potentialCrossAllergens: Allergen[]
  onUpdate: (params: UpdatePAPFetcher$Params) => void
}

export function PersonalAllergyProfile({ pAP, availableSymptoms, potentialCrossAllergens, availableAllergens, onUpdate }: PersonalAllergyProfileProps) {
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [editingAllergen, setEditingAllergen] = useState<string | null>(null)
  const [showAddAllergen, setShowAddAllergen] = useState(false)

  const [profileData, setProfileData] = useState({
    gender: pAP.gender,
    doB: pAP.doB,
    allowPublic: pAP.allowPublic,
  })

  const formatDate = (timestamp: number | null) => {
    if (!timestamp) return "Not specified"
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
    const allergensUpdate = pAP.allergens.map((allergen) => {
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
      discoveryMethod: "" as DiscoveryMethod,
      symptomsId: [],
    })
  }

  const handleDeleteAllergen = (allergenId: string) => {
    if (confirm("Are you sure you want to remove this allergen from your profile?")) {
      const updatedAllergens = pAP.allergens.filter((allergen) => allergen.allergenId !== allergenId)
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
              Personal Information
            </div>
            <Button variant="outline" size="sm" onClick={() => setIsEditingProfile(true)} className="bg-transparent">
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Gender</label>
            <div className="mt-1 p-2 bg-white rounded border">
              {pAP.gender ? (
                <Badge variant="secondary" className="capitalize">
                  {pAP.gender}
                </Badge>
              ) : (
                <span className="text-gray-500">Not specified</span>
              )}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Date of Birth</label>
            <div className="mt-1 p-2 bg-white rounded border flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-400" />
              <span>{formatDate(pAP.doB)}</span>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Public Profile</label>
            <div className="mt-1 p-2 bg-white rounded border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-gray-400" />
                <Badge variant={pAP.allowPublic ? "default" : "secondary"}>
                  {pAP.allowPublic ? "Public" : "Private"}
                </Badge>
              </div>
              {pAP.allowPublic && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(`/publicPAP/${pAP.publicId}`, "_blank")}
                  className="ml-2 h-7 text-xs bg-transparent border-cyan-300 hover:bg-cyan-50"
                >
                  View Public Profile
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* My Allergens */}
        <div className="lg:col-span-2">
          <Card className="bg-gradient-to-br from-cyan-50 to-blue-50 border-cyan-200">
            <CardHeader>
              <CardTitle className="text-cyan-800 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                My Allergens ({pAP.allergens.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pAP.allergens.map((allergen) => (
                  <div
                    key={allergen.allergenId}
                    className="bg-white/70 backdrop-blur-sm p-4 rounded-lg border border-cyan-200"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-cyan-800">{allergen.name}</h3>
                          <Badge className={`${getTypeColor(allergen.type)} text-white text-xs capitalize`}>
                            {allergen.type}
                          </Badge>
                          <Badge className={`${getSeverityColor(allergen.severity)} text-white text-xs`}>
                            Severity: {allergen.severity}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                          <div>
                            <span className="text-sm font-medium text-gray-700">Discovery Date:</span>
                            <span className="ml-2 text-sm">{formatDate(allergen.discoveryDate)}</span>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-700">Discovery Method:</span>
                            <span className="ml-2 text-sm">{allergen.discoveryMethod}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2 ml-4">
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

                    {/* Enhanced Symptom Display */}
                    <div>
                      <span className="text-sm font-medium text-gray-700 block mb-3">Associated Symptoms:</span>
                      <div className="space-y-3">
                        {allergen.symptoms.map((symptom) => (
                          <div
                            key={symptom.symptomId}
                            className="bg-gradient-to-r from-blue-50 to-indigo-50 p-3 rounded-lg border border-blue-200"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium text-blue-800">{symptom.name}</h4>
                              <div className="flex gap-1">
                                <Badge className={`${getSeverityColor(symptom.severity)} text-white text-xs`}>
                                  S: {symptom.severity}
                                </Badge>
                                <Badge className={`${getSeverityColor(symptom.prevalence)} text-white text-xs`}>
                                  P: {symptom.prevalence}
                                </Badge>
                              </div>
                            </div>
                            <div className="text-sm text-gray-700">
                              <span className="font-medium">Treatment:</span>
                              <p className="mt-1 text-gray-600">{symptom.treatment}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}

                {pAP.allergens.length === 0 && (
                  <div className="text-center text-gray-500 py-8">
                    <AlertTriangle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No allergens recorded in your profile</p>
                    <p className="text-sm text-gray-400 mt-1">Click &quot;Add Allergen&quot; to get started</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Add Allergen Box */}
          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
            <CardHeader>
              <CardTitle className="text-green-800 text-lg">Add New Allergen</CardTitle>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => setShowAddAllergen(true)}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Allergen
              </Button>
            </CardContent>
          </Card>

          {/* Potential Cross-Allergens */}
          <PotentialCrossAllergens
            potentialAllergens={potentialCrossAllergens}
            userAllergenIds={pAP.allergens.map((a) => a.allergenId)}
            onQuickAdd={handleQuickAddAllergen}
          />
        </div>
      </div>

      {/* Modals */}
      <AddAllergenModal
        open={showAddAllergen}
        onClose={() => setShowAddAllergen(false)}
        availableAllergens={availableAllergens}
        availableSymptoms={availableSymptoms}
        onAddAllergen={handleAddAllergen}
      />

      {/* Edit Profile Modal */}
      <Dialog open={isEditingProfile} onOpenChange={setIsEditingProfile}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-cyan-800">Edit Personal Information</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
              <Select
                value={profileData.gender || ""}
                onValueChange={(value) => setProfileData({ ...profileData, gender: value as Gender })}
              >
                <SelectTrigger className="border-cyan-300 focus:border-cyan-500">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
              <Input
                type="date"
                value={formatDateForInput(profileData.doB)}
                onChange={(e) => setProfileData({ ...profileData, doB: parseInputDate(e.target.value) })}
                className="border-cyan-300 focus:border-cyan-500"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">Allow Public Profile</label>
              <Switch
                checked={profileData.allowPublic}
                onCheckedChange={(checked) => setProfileData({ ...profileData, allowPublic: checked })}
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                onClick={handleProfileUpdate}
                className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
              >
                Save Changes
              </Button>
              <Button variant="outline" onClick={() => setIsEditingProfile(false)} className="flex-1">
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Allergen Modal */}
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

interface AllergenEditModalProps {
  allergen: DisplayPAPAllergen
  availableSymptoms: Symptom[]
  onUpdate: (updates: Omit<UpdatePAPAllergen$Params, "allergenId">) => void
  onClose: () => void
}

function AllergenEditModal({ allergen, availableSymptoms, onUpdate, onClose }: AllergenEditModalProps) {
  const [discoveryDate, setDiscoveryDate] = useState(allergen.discoveryDate)
  const [discoveryMethod, setDiscoveryMethod] = useState(allergen.discoveryMethod)
  const [selectedSymptoms, setSelectedSymptoms] = useState(allergen.symptoms.map((symptom) => symptom.symptomId))

  const formatDateForInput = (timestamp: number | null) => {
    if (!timestamp) return ""
    return new Date(timestamp * 1000).toISOString().split("T")[0]
  }

  const parseInputDate = (dateString: string) => {
    if (!dateString) return null
    return Math.floor(new Date(dateString).getTime() / 1000)
  }

  const handleSave = () => {
    onUpdate({
      discoveryDate,
      discoveryMethod,
      symptomsId: selectedSymptoms,
    })
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-cyan-800">Edit {allergen.name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Discovery Date</label>
            <Input
              type="date"
              value={formatDateForInput(discoveryDate)}
              onChange={(e) => setDiscoveryDate(parseInputDate(e.target.value))}
              className="border-cyan-300 focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Discovery Method</label>
            <Select value={discoveryMethod} onValueChange={value => setDiscoveryMethod(value as DiscoveryMethod)}>
              <SelectTrigger className="border-cyan-300 focus:border-cyan-500">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Clinical symptoms">Clinical symptoms</SelectItem>
                <SelectItem value="Paraclinical tests">Paraclinical tests</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <ScrollableSelect
            items={availableSymptoms.sort((a, b) => a.name.localeCompare(b.name))}
            selectedItems={selectedSymptoms}
            onSelectionChange={setSelectedSymptoms}
            getItemId={(symptom) => symptom.id}
            getItemLabel={(symptom) => symptom.name}
            label="Associated Symptoms"
            maxHeight="max-h-48"
          />

          <div className="flex gap-2 pt-4">
            <Button
              onClick={handleSave}
              className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
            >
              Save Changes
            </Button>
            <Button variant="outline" onClick={onClose} className="flex-1 bg-transparent">
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
