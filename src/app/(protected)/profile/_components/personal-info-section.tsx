"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Edit3, Save, X, Loader2, Trash2, Plus } from "lucide-react"
import { httpGet$GetUsers } from "@/modules/commands/GetBusinessType/fetcher"
import { z } from "zod"
import { useSession } from "next-auth/react"
import { httpGet$GetPAPWithUserId } from "@/modules/commands/GetPAPWithUserId/fetcher"
import { httpPut$UpdateUser } from "@/modules/commands/UpdateBusinessType/fetcher"
import { httpPut$UpdatePAPWithUserId } from "@/modules/commands/UpdatePAPWithUserId/fetcher"
// import { useTranslations } from "next-intl"

const personalInfoSchema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email address"),
    doB: z.number()
        .min(0)
        .refine(
            (dob) => {
                const date = new Date(dob);
                return !isNaN(date.getTime());
            },
            { message: "Invalid date" }
        ),
    gender: z.enum(["male", "female", "other"]),
    underlyingMedCon: z.array(z.string())
})

type PersonalInfoData = z.infer<typeof personalInfoSchema>
const optionalPersonalInfoSchema = personalInfoSchema.partial()

export function PersonalInfoSection() {
    const [personalData, setPersonalData] = useState<PersonalInfoData>({
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        doB: Date.parse("1990-05-15"),
        gender: "male",
        underlyingMedCon: ["Asthma (moderate persistent)", "Seasonal allergies"]
    })
    // const t = useTranslations("personalInfo")
    const { data: session } = useSession()
    const [isLoading, setIsLoading] = useState(true)
    const [isEditing, setIsEditing] = useState(false)
    const [formData, setFormData] = useState<PersonalInfoData>(personalData)
    const [savedData, setSavedData] = useState<PersonalInfoData>(personalData)

    // const getUserData = useCallback(async () => {
    //     const data = await httpGet$GetUsers(`/api/users/${session?.user.id}`, {});
    //     console.log(data.result)
    //     if (data.success) {
    //         setPersonalData(prevData => ({
    //             ...prevData,
    //             ...data.result
    //         }));
    //         setFormData(prevData => ({
    //             ...prevData,
    //             ...data.result
    //         }));
    //     } else {
    //         console.error(data.message);
    //     }
    // }, [session])
    const getUserData = useCallback(async () => {
        if (session?.user?.id) {
            setIsLoading(true)
            const data = await httpGet$GetUsers(`/api/users/${session.user.id}`, {});
            const PAPdata = await httpGet$GetPAPWithUserId(`/api/user-pap`);
            // console.log(data.result)
            // console.log(data.success)
            if (data.success && data.result) {
                const payload =
                    Array.isArray(data.result) ? data.result[0] : data.result;
                const cleanedPayload = optionalPersonalInfoSchema.parse(payload)
                setSavedData(prevData => ({
                    ...prevData,
                    ...(cleanedPayload ?? {})
                }));
                setFormData(prevData => ({
                    ...prevData,
                    ...(cleanedPayload ?? {})
                }));
            } else {
                console.error(data.message);
            }

            if (PAPdata.success && PAPdata.result) {
                console.log(PAPdata.result)
                const cleanedPAPPayload = optionalPersonalInfoSchema.parse(PAPdata.result)
                setSavedData(prevData => ({
                    ...prevData,
                    ...cleanedPAPPayload
                }));
                setFormData(prevData => ({
                    ...prevData,
                    ...cleanedPAPPayload
                }));
            } else {
                console.log("Error here")
                console.error(data.message);
            }
            setIsLoading(false)
        }
    }, [session])

    useEffect(() => {
        getUserData()
    }, [session, getUserData])

    // useEffect(() => {
    //     console.log('Current formData:', formData);
    //     console.log('Current savedData:', savedData);
    // }, [formData, savedData]);
    //



    const handleInputChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
    }
    const addMedicalCondition = () => {
        setFormData((prev) => ({
            ...prev,
            underlyingMedCon: [...prev.underlyingMedCon, ""],
        }))
    }

    const updateMedicalCondition = (index: number, value: string) => {
        setFormData((prev) => ({
            ...prev,
            underlyingMedCon: prev.underlyingMedCon.map((condition, i) => (i === index ? value : condition)),
        }))
    }

    const removeMedicalCondition = (index: number) => {
        setFormData((prev) => ({
            ...prev,
            underlyingMedCon: prev.underlyingMedCon.filter((_, i) => i !== index),
        }))
    }
    const updateUser = async () => {
        const userResponse = await httpPut$UpdateUser(`/api/users`, { ...formData })
        if (!userResponse.success) {
            console.error(userResponse.message)
        }
        const PAPResponse = await httpPut$UpdatePAPWithUserId(`/api/user-pap`, { ...formData })
        if (!PAPResponse.success) {
            console.error(PAPResponse.message)
        }
    }
    const handleSave = () => {
        setIsEditing(false)
        updateUser()
        setPersonalData(formData)
        setSavedData(formData)
        // Here you would typically save to your backend
    }

    const handleCancel = () => {
        setIsEditing(false)
        setFormData(savedData)
    }

    if (isLoading) {
        // ...existing code...
        return (
            <div className="space-y-8">
                {/* Personal Information Section */}
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-semibold text-cyan-800">Personal Information</h2>
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
                    <h2 className="text-2xl font-semibold text-cyan-800">Underlying Medical Conditions</h2>
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
        )
    }

    if (!formData || !savedData) {
        return null
    }
    return (
        <div className="space-y-8">
            {/* Personal Information Section */}
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-semibold text-cyan-800">Personal Information</h2>
                    {!isEditing ? (
                        <Button
                            onClick={() => setIsEditing(true)}
                            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white"
                            disabled={isLoading}
                        >
                            <Edit3 className="w-4 h-4 mr-2" />
                            Edit Profile
                        </Button>
                    ) : (
                        <div className="flex gap-2">
                            <Button onClick={handleSave} className="bg-green-500 hover:bg-green-600" disabled={isLoading}>
                                {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                                {isLoading ? "Saving..." : "Save"}
                            </Button>
                            <Button onClick={handleCancel} variant="outline" disabled={isLoading}>
                                <X className="w-4 h-4 mr-2" />
                                Cancel
                            </Button>
                        </div>
                    )}
                </div>

                <Card className="bg-white/70 backdrop-blur-sm border-white/20">
                    <CardContent className="p-6 space-y-4">
                        <div className={`relative ${isLoading ? "opacity-60 pointer-events-none" : ""}`}>
                            {isLoading && (
                                <div className="absolute inset-0 flex items-center justify-center bg-white/20 backdrop-blur-sm rounded-lg z-10">
                                    <div className="flex items-center space-x-2 text-cyan-700">
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        <span className="text-sm font-medium">Saving changes...</span>
                                    </div>
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="firstName">First Name</Label>
                                    <Input
                                        id="firstName"
                                        value={formData.firstName}
                                        onChange={(e) => handleInputChange("firstName", e.target.value)}
                                        disabled={!isEditing}
                                        className={!isEditing ? "bg-gray-50" : ""}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="lastName">Last Name</Label>
                                    <Input
                                        id="lastName"
                                        value={formData.lastName}
                                        onChange={(e) => handleInputChange("lastName", e.target.value)}
                                        disabled={!isEditing}
                                        className={!isEditing ? "bg-gray-50" : ""}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => handleInputChange("email", e.target.value)}
                                        disabled={!isEditing}
                                        className={!isEditing ? "bg-gray-50" : ""}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="dateOfBirth">Date of Birth</Label>
                                    <Input
                                        id="dateOfBirth"
                                        type="date"
                                        value={new Date(formData.doB).toISOString().split("T")[0]}
                                        onChange={(e) => handleInputChange("doB", e.target.value)}
                                        disabled={!isEditing}
                                        className={!isEditing ? "bg-gray-50" : ""}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="gender">Gender</Label>
                                    <Select
                                        value={formData.gender}
                                        onValueChange={(value) => handleInputChange("gender", value)}
                                        disabled={!isEditing}
                                    >
                                        <SelectTrigger className={!isEditing ? "bg-gray-50" : ""}>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="male">Male</SelectItem>
                                            <SelectItem value="female">Female</SelectItem>
                                            <SelectItem value="other">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Medical Conditions Section */}
            <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-cyan-800">Underlying Medical Conditions</h2>

                <Card className="bg-white/70 backdrop-blur-sm border-white/20">
                    <CardContent className="p-6 space-y-6">
                        <div className={`relative ${isLoading ? "opacity-60 pointer-events-none" : ""}`}>
                            {isLoading && (
                                <div className="absolute inset-0 flex items-center justify-center bg-white/20 backdrop-blur-sm rounded-lg z-10">
                                    <div className="flex items-center space-x-2 text-cyan-700">
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        <span className="text-sm font-medium">Saving changes...</span>
                                    </div>
                                </div>
                            )}

                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <Label>Medical Conditions</Label>
                                    {isEditing && (
                                        <Button
                                            type="button"
                                            onClick={addMedicalCondition}
                                            size="sm"
                                            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white"
                                        >
                                            <Plus className="w-4 h-4 mr-1" />
                                            Add Condition
                                        </Button>
                                    )}
                                </div>

                                <div className="space-y-3">
                                    {formData.underlyingMedCon.length === 0 ? (
                                        <p className="text-gray-500 italic">No medical conditions listed</p>
                                    ) : (
                                        formData.underlyingMedCon.map((condition, index) => (
                                            <div key={index} className="flex gap-2 items-center">
                                                <Input
                                                    value={condition}
                                                    onChange={(e) => updateMedicalCondition(index, e.target.value)}
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
    )
}
