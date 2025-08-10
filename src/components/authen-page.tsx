"use client"

import type React from "react"

import {
  Button
} from "@/components/ui/button"
import {
  Input
} from "@/components/ui/input"
import {
  Label
} from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  User
} from "lucide-react"
import {
  useState
} from "react"
import Link from "next/link"
import {
  signIn
} from "next-auth/react"
import {
  useRouter
} from "next/navigation"
import {
  httpPost$Register
} from "@/modules/commands/Authenticate/fetcher"
import {
  useTranslations
} from "next-intl"


export default function AuthPage() {
  const t = useTranslations('authPage')
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLoginSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })
      

      if (result?.ok) {
        router.push("/dashboard")
      } else {
        if (result?.error === "EmailNotVerified") {
          alert(t('pleaseVerifyEmail')); 
        } else alert(t('loginFailed'))
      }
    } catch (error) {
      console.error("Login error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegisterSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const firstName = formData.get("firstName") as string
    const lastName = formData.get("lastName") as string
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const confirmPassword = formData.get("confirmPassword") as string

    if (password !== confirmPassword) {
      alert(t('passwordsDoNotMatch'))
      setIsLoading(false)
      return
    }

    try {
      const res = await httpPost$Register("/api/auth/register", {
        firstName,
        lastName,
        email,
        password
      })

      if (res.success) {
        setIsLogin(true)
        alert(t('accountCreated'))
      } else {
        alert(res.message || t('registrationFailed'))
      }
    } catch (error) {
      console.error("Registration error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const toggleAuthMode = () => {
    setIsLogin(!isLogin)
    setShowPassword(false)
    setShowConfirmPassword(false)
  }

  return (
    <div className="flex-grow bg-gradient-to-br from-cyan-400 via-cyan-500 to-blue-600 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-sm sm:max-w-md">
        <Card className="backdrop-blur-sm bg-white/95 shadow-2xl border-0">
          <CardHeader className="space-y-1 text-center">
            <div className="mx-auto w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full flex items-center justify-center mb-4">
              {isLogin ? <Lock className="w-6 h-6 text-white" /> : <User className="w-6 h-6 text-white" />}
            </div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
              {isLogin ? t('welcomeBack') : t('createAccount')}
            </CardTitle>
            <CardDescription className="text-gray-600">
              {isLogin ? t('signInPrompt') : t('signUpPrompt')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLogin ? (
              <form key="login-form" onSubmit={handleLoginSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                    {t('email')}
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder={t('enterYourEmail')}
                      className="pl-10 border-gray-200 focus:border-cyan-500 focus:ring-cyan-500"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                    {t('password')}
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder={t('enterYourPassword')}
                      className="pl-10 pr-10 border-gray-200 focus:border-cyan-500 focus:ring-cyan-500"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    id="remember"
                    type="checkbox"
                    className="w-4 h-4 text-cyan-600 bg-gray-100 border-gray-300 rounded focus:ring-cyan-500"
                  />
                  <Label htmlFor="remember" className="text-sm text-gray-600">
                    {t('rememberMe')}
                  </Label>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-medium py-2.5 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50"
                >
                  {isLoading ? t('signingIn') : t('signIn')}
                </Button>
              </form>
            ) : (
              <form key="register-form" onSubmit={handleRegisterSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                      {t('firstName')}
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="firstName"
                        name="firstName"
                        type="text"
                        placeholder={t('firstNamePlaceholder')}
                        className="pl-10 border-gray-200 focus:border-cyan-500 focus:ring-cyan-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">
                      {t('lastName')}
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="lastName"
                        name="lastName"
                        type="text"
                        placeholder={t('lastNamePlaceholder')}
                        className="pl-10 border-gray-200 focus:border-cyan-500 focus:ring-cyan-500"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="registerEmail" className="text-sm font-medium text-gray-700">
                    {t('email')}
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="registerEmail"
                      name="email"
                      type="email"
                      placeholder={t('enterYourEmail')}
                      className="pl-10 border-gray-200 focus:border-cyan-500 focus:ring-cyan-500"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="registerPassword" className="text-sm font-medium text-gray-700">
                    {t('password')}
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="registerPassword"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder={t('createAPassword')}
                      className="pl-10 pr-10 border-gray-200 focus:border-cyan-500 focus:ring-cyan-500"
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                    {t('confirmPassword')}
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder={t('confirmYourPassword')}
                      className="pl-10 pr-10 border-gray-200 focus:border-cyan-500 focus:ring-cyan-500"
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-start space-x-2">
                  <input
                    id="terms"
                    type="checkbox"
                    className="w-4 h-4 text-cyan-600 bg-gray-100 border-gray-300 rounded focus:ring-cyan-500 mt-0.5"
                    required
                  />
                  <Label htmlFor="terms" className="text-sm text-gray-600">
                    {t.rich('termsAgreement', {
                      termsOfService: (chunks) => <Link href="/terms" className="text-cyan-600 hover:text-blue-700 font-medium">{chunks}</Link>,
                      privacyPolicy: (chunks) => <Link href="/privacy" className="text-cyan-600 hover:text-blue-700 font-medium">{chunks}</Link>,
                    })}
                  </Label>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-medium py-2.5 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50"
                >
                  {isLoading ? t('creatingAccount') : t('createAccountButton')}
                </Button>
              </form>
            )}

            <p className="text-center text-sm text-gray-600">
              {isLogin ? t('noAccount') : t('haveAccount')}
              <button
                type="button"
                onClick={toggleAuthMode}
                className="text-cyan-600 hover:text-blue-700 font-medium focus:outline-none"
              >
                {isLogin ? t('signUp') : t('signInLink')}
              </button>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}