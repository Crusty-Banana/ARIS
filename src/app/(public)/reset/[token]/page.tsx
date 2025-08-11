"use client"

import { useEffect, useState } from "react";
import type React from "react";
import { useParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, KeyRound, Lock } from "lucide-react";
import { httpPost$ResetPassword, httpGet$ResetPasswordToken } from "@/modules/commands/RecoverAccount/fetcher";

export default function ResetPasswordPage() {
    const t = useTranslations('authPage');
    const router = useRouter();
    const params = useParams();
    const token = params.token as string;

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [notification, setNotification] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

    useEffect(() => {
    const fetchToken = async () => {
        try {
        const result = await httpGet$ResetPasswordToken(`/api/auth/reset/${token}`);
        if (!result.success){
            setNotification({ message: 'Invalid or expired reset token.', type: 'error' });
            setTimeout(() => {
                router.push('/');
            }, 2000);
        }
        } catch (err) {
            console.error("Error fetching token:", err);
            setNotification({ message: 'Invalid or expired reset token.', type: 'error' });
            setTimeout(() => {
                router.push('/');
            }, 2000);
        }
    };

    if (token) {
        fetchToken();
    }
    });

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setNotification(null);
        

        if (password !== confirmPassword) {
            setNotification({ message: t('passwordsDoNotMatch'), type: 'error' });
            return;
        }

        if (!token) {
            setNotification({ message: t('invalidToken'), type: 'error' });
            return;
        }
        setIsLoading(true);
        const result = await httpPost$ResetPassword('/api/auth/reset', { token, password });

        if (result.success) {
            setNotification({ message: result.message, type: 'success' });
            // Redirect to login after a short delay
            setTimeout(() => {
                router.push('/?reset=success');
            }, 2000);
        } else {
            setNotification({ message: result.message, type: 'error' });
        }
        setIsLoading(false);
    }

    return (
        <div className="flex-grow bg-gradient-to-br from-cyan-400 via-cyan-500 to-blue-600 flex items-center justify-center p-4 sm:p-6 lg:p-8">
            <div className="w-full max-w-sm sm:max-w-md">
                <Card className="backdrop-blur-sm bg-white/95 shadow-2xl border-0">
                    <CardHeader className="space-y-1 text-center">
                        <div className="mx-auto w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full flex items-center justify-center mb-4">
                            <KeyRound className="w-6 h-6 text-white" />
                        </div>
                        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                            {t('resetPasswordTitle')}
                        </CardTitle>
                        <CardDescription className="text-gray-600">
                            {t('resetPasswordPrompt')}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {notification && (
                            <div className={`p-3 rounded-md text-sm ${notification.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                {notification.message}
                                {notification.type === 'success' && (
                                    <>
                                        {' '}{t('redirectingToLogin')}
                                    </>
                                )}
                            </div>
                        )}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="password">{t('newPassword')}</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                    <Input
                                        id="password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder={t('createAPassword')}
                                        className="pl-10 pr-10"
                                        required
                                        minLength={6}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        disabled={isLoading || notification?.type === 'success'}
                                    />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-gray-400 hover:text-gray-600">
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">{t('confirmNewPassword')}</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                    <Input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type={showConfirmPassword ? "text" : "password"}
                                        placeholder={t('confirmYourPassword')}
                                        className="pl-10 pr-10"
                                        required
                                        minLength={6}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        disabled={isLoading || notification?.type === 'success'}
                                    />
                                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-3 text-gray-400 hover:text-gray-600">
                                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                            </div>
                            <Button type="submit" disabled={isLoading || notification?.type === 'success'} className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-medium py-2.5">
                                {isLoading ? t('resettingPassword') : t('resetPasswordButton')}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}