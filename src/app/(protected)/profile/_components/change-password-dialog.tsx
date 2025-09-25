"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { httpPut$PasswordChange } from "@/modules/commands/PasswordChange/fetcher";
import { Eye, EyeOff, Lock } from "lucide-react";
import { signOut } from "next-auth/react";
import { useState } from "react";
import { useTranslations } from "next-intl";
interface ChangePasswordDialogProps {
    trigger?: React.ReactNode;
}

export function ChangePasswordDialog({ trigger }: ChangePasswordDialogProps) {
    const [showPasswordDialog, setShowPasswordDialog] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [errors, setErrors] = useState({
        currentPassword: "",
        passwordMatch: "",
    });
    const t = useTranslations("changePassword");
    const handlePasswordChange = (field: string, value: string) => {
        setPasswordData((prev) => ({ ...prev, [field]: value }));
        if (field === "currentPassword") {
            setErrors((prev) => ({ ...prev, currentPassword: "" }));
        }
        if (field === "newPassword" || field === "confirmPassword") {
            setErrors((prev) => ({ ...prev, passwordMatch: "" }));
        }
    };

    const handlePasswordSave = async () => {
        setErrors({ currentPassword: "", passwordMatch: "" });

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setErrors((prev) => ({
                ...prev,
                passwordMatch: "New passwords don't match",
            }));
            return;
        }
        // Here you would typically validate current password and save new one
        const result = await httpPut$PasswordChange("/api/auth/change", {
            password: passwordData.currentPassword,
            newPassword: passwordData.newPassword,
        });

        if (!result.result) {
            setErrors((prev) => ({ ...prev, currentPassword: result.message }));
            return;
        }

        // Reset form and close dialog
        setPasswordData({
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        });
        setErrors({ currentPassword: "", passwordMatch: "" });
        setShowPasswordDialog(false);
        signOut();
    };

    const handleCancel = () => {
        setPasswordData({
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        });
        setErrors({ currentPassword: "", passwordMatch: "" });
        setShowPasswordDialog(false);
    };

    const defaultTrigger = (
        <Button
            variant="outline"
            className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white border-none hover:from-cyan-600 hover:to-blue-700"
        >
            <Lock className="w-4 h-4 mr-2" />
            Change Password
        </Button>
    );

    return (
        <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
            <DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-cyan-800">
                        {t("title")}
                    </DialogTitle>
                    <DialogDescription>{t("description")}</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="currentPassword">
                            {t("currentPassword")}
                        </Label>
                        <div className="relative">
                            <Input
                                id="currentPassword"
                                type={showCurrentPassword ? "text" : "password"}
                                value={passwordData.currentPassword}
                                onChange={(e) =>
                                    handlePasswordChange(
                                        "currentPassword",
                                        e.target.value
                                    )
                                }
                                placeholder={t("enterCurrentPassword")}
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                onClick={() =>
                                    setShowCurrentPassword(!showCurrentPassword)
                                }
                            >
                                {showCurrentPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                ) : (
                                    <Eye className="h-4 w-4" />
                                )}
                            </Button>
                        </div>
                        {errors.currentPassword && (
                            <p className="text-red-600 text-sm">
                                {errors.currentPassword}
                            </p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="newPassword">{t("newPassword")}</Label>
                        <div className="relative">
                            <Input
                                id="newPassword"
                                type={showNewPassword ? "text" : "password"}
                                value={passwordData.newPassword}
                                onChange={(e) =>
                                    handlePasswordChange(
                                        "newPassword",
                                        e.target.value
                                    )
                                }
                                placeholder={t("enterNewPassword")}
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                onClick={() =>
                                    setShowNewPassword(!showNewPassword)
                                }
                            >
                                {showNewPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                ) : (
                                    <Eye className="h-4 w-4" />
                                )}
                            </Button>
                        </div>
                        {errors.passwordMatch && (
                            <p className="text-red-600 text-sm">
                                {errors.passwordMatch}
                            </p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="confirmPassword">
                            {t("confirmPassword")}
                        </Label>
                        <div className="relative">
                            <Input
                                id="confirmPassword"
                                type={showConfirmPassword ? "text" : "password"}
                                value={passwordData.confirmPassword}
                                onChange={(e) =>
                                    handlePasswordChange(
                                        "confirmPassword",
                                        e.target.value
                                    )
                                }
                                placeholder={t("confirmNewPassword")}
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                onClick={() =>
                                    setShowConfirmPassword(!showConfirmPassword)
                                }
                            >
                                {showConfirmPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                ) : (
                                    <Eye className="h-4 w-4" />
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleCancel}
                    >
                        {t("cancel")}
                    </Button>
                    <Button
                        type="button"
                        onClick={handlePasswordSave}
                        className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
                    >
                        {t("save")}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
