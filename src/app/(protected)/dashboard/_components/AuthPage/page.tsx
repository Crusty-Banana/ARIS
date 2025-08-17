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
  User,
  KeyRound, // Import new icon
  ArrowLeft // Import new icon
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
import {
  httpPost$RequestReset
} from "@/modules/commands/RecoverAccount/fetcher" // Import new fetcher

export default function AuthPage() {
  const t = useTranslations('authPage')
  // New state to manage which form is shown
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'forgotPassword'>('login');
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  const router = useRouter()

  const handleLoginSubmit = async (e: React.FormEvent < HTMLFormElement > ) => {
    e.preventDefault()
    setIsLoading(true)
    setNotification(null); // Clear previous notifications

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
          setNotification({ message: t('pleaseVerifyEmail'), type: 'error' });
        } else {
          setNotification({ message: t('loginFailed'), type: 'error' });
        }
      }
    } catch (error) {
      console.error("Login error:", error)
      setNotification({ message: t('loginFailed'), type: 'error' });
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegisterSubmit = async (e: React.FormEvent < HTMLFormElement > ) => {
    e.preventDefault()
    setIsLoading(true)
    setNotification(null);

    const formData = new FormData(e.currentTarget)
    const firstName = formData.get("firstName") as string
    const lastName = formData.get("lastName") as string
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const confirmPassword = formData.get("confirmPassword") as string

    if (password !== confirmPassword) {
      setNotification({ message: t('passwordsDoNotMatch'), type: 'error' });
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
        setAuthMode('login'); // Switch to login view
        setNotification({ message: t('accountCreated'), type: 'success' });
      } else {
        setNotification({ message: t('registrationFailed'), type: 'error' });
      }
    } catch (error) {
      console.error("Registration error:", error)
      setNotification({ message: t('registrationFailed'), type: 'error' });
    } finally {
      setIsLoading(false)
    }
  }

  // --- NEW: Handler for Forgot Password form ---
  const handleForgotPasswordSubmit = async (e: React.FormEvent < HTMLFormElement > ) => {
    e.preventDefault();
    setIsLoading(true);
    setNotification(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;

    await httpPost$RequestReset('/api/auth/recover', { email });
    
    // Always show a positive message to prevent email enumeration
    setNotification({ message: t('forgotPasswordRequestSent'), type: 'success'});
    setIsLoading(false);
  }

  const getTitle = () => {
    if (authMode === 'login') return t('welcomeBack');
    if (authMode === 'register') return t('createAccount');
    return t('forgotPasswordTitle');
  }

  const getDescription = () => {
    if (authMode === 'login') return t('signInPrompt');
    if (authMode === 'register') return t('signUpPrompt');
    return t('forgotPasswordPrompt');
  }
  
  const getIcon = () => {
    if (authMode === 'login') return <Lock className="w-6 h-6 text-white" />;
    if (authMode === 'register') return <User className="w-6 h-6 text-white" />;
    return <KeyRound className="w-6 h-6 text-white" />
  }

  return ( 
    <div className="flex-grow bg-gradient-to-br from-cyan-400 via-cyan-500 to-blue-600 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-sm sm:max-w-md">
        <Card className="backdrop-blur-sm bg-white/95 shadow-2xl border-0">
          <CardHeader className="space-y-1 text-center">
            <div className="mx-auto w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full flex items-center justify-center mb-4">
              {getIcon()}
            </div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
              {getTitle()}
            </CardTitle>
            <CardDescription className="text-gray-600">
              {getDescription()}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* --- NEW: Notification Area --- */}
            {notification && (
              <div className={`p-3 rounded-md text-sm ${notification.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {notification.message}
              </div>
            )}
            
            {/* --- Conditional Rendering Based on authMode --- */}
            {authMode === 'login' && (
              <form key="login-form" onSubmit={handleLoginSubmit} className="space-y-4">
                {/* Email Input */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">{t('email')}</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input id="email" name="email" type="email" placeholder={t('enterYourEmail')} className="pl-10" required />
                  </div>
                </div>

                {/* Password Input */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-gray-700">{t('password')}</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input id="password" name="password" type={showPassword ? "text" : "password"} placeholder={t('enterYourPassword')} className="pl-10 pr-10" required />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-gray-400 hover:text-gray-600">
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <input id="remember" type="checkbox" className="w-4 h-4 text-cyan-600 bg-gray-100 border-gray-300 rounded focus:ring-cyan-500"/>
                    <Label htmlFor="remember" className="text-sm text-gray-600">{t('rememberMe')}</Label>
                  </div>
                  <button type="button" onClick={() => { setAuthMode('forgotPassword'); setNotification(null); }} className="text-sm text-cyan-600 hover:text-blue-700 font-medium focus:outline-none">
                    {t('forgotPasswordLink')}
                  </button>
                </div>
                
                <Button type="submit" disabled={isLoading} className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-medium py-2.5">
                  {isLoading ? t('signingIn') : t('signIn')}
                </Button>
                
                <p className="text-center text-sm text-gray-600">
                  {t('noAccount')}
                  <button type="button" onClick={() => { setAuthMode('register'); setNotification(null); }} className="text-cyan-600 hover:text-blue-700 font-medium focus:outline-none ml-1">
                    {t('signUp')}
                  </button>
                </p>
              </form>
            )}

            {authMode === 'register' && (
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

            {/* --- NEW: Forgot Password Form --- */}
            {authMode === 'forgotPassword' && (
              <form key="forgot-form" onSubmit={handleForgotPasswordSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">{t('email')}</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input id="email" name="email" type="email" placeholder={t('enterYourEmail')} className="pl-10" required />
                  </div>
                </div>

                <Button type="submit" disabled={isLoading} className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-medium py-2.5">
                  {isLoading ? t('sendingLink') : t('sendResetLink')}
                </Button>

                <div className="text-center">
                  <button type="button" onClick={() => { setAuthMode('login'); setNotification(null); }} className="text-sm text-cyan-600 hover:text-blue-700 font-medium focus:outline-none inline-flex items-center">
                    <ArrowLeft className="w-4 h-4 mr-1"/>
                    {t('backToLogin')}
                  </button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}