"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, Trash2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function AccountManagementSection() {
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-cyan-800">Account Management</h2>

            <Card className="bg-white/70 backdrop-blur-sm border-red-200">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-red-600">
                        <AlertTriangle className="w-5 h-5" />
                        Danger Zone
                    </CardTitle>
                    <CardDescription>Irreversible actions that will permanently affect your account</CardDescription>
                </CardHeader>
                <CardContent>
                    {!showDeleteConfirm ? (
                        <Button variant="destructive" onClick={() => setShowDeleteConfirm(true)} className="w-full sm:w-auto">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete Account
                        </Button>
                    ) : (
                        <div className="space-y-4">
                            <Alert className="border-red-200 bg-red-50">
                                <AlertTriangle className="h-4 w-4 text-red-600" />
                                <AlertDescription className="text-red-800">
                                    <strong>Warning:</strong> This action cannot be undone. This will permanently delete your account and
                                    remove all your data from our servers.
                                </AlertDescription>
                            </Alert>
                            <div className="flex gap-2">
                                <Button variant="destructive">
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Yes, Delete My Account
                                </Button>
                                <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}