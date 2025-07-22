"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { BookOpen, Mail, Shield, Sparkles, RefreshCw, User, Lock, AlertTriangle, Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import emailjs from "@emailjs/browser"
import AdBanner from "@/components/ad-banner"

// EmailJS sozlamalari - rasmdan ko'ringan haqiqiy ma'lumotlar
const EMAILJS_CONFIG = {
  serviceId: "quiz'x", // Service ID to'g'ri
  templateId: "template_xfk98tr", // Haqiqiy template ID (rasmdan)
  publicKey: "ICxBDUEh2APa8imB2", // Public key
}

// QUIZ'X Loader komponenti
const QuizXLoader = ({ text = "Yuklanmoqda..." }: { text?: string }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="flex gap-1">
        {["Q", "U", "I", "Z", "X"].map((letter, index) => (
          <div
            key={letter}
            className="w-8 h-8 rounded-lg bg-gradient-to-r from-primary to-emerald-400 flex items-center justify-center text-black font-bold text-sm animate-bounce"
            style={{
              animationDelay: `${index * 0.1}s`,
              animationDuration: "1s",
            }}
          >
            {letter}
          </div>
        ))}
      </div>
      <span className="text-white text-sm">{text}</span>
    </div>
  )
}

export default function LoginPage() {
  const [mode, setMode] = useState<"signin" | "signup">("signin")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [verificationCode, setVerificationCode] = useState("")
  const [step, setStep] = useState<"form" | "verification">("form")
  const [loading, setLoading] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [timeLeft, setTimeLeft] = useState(0)
  const [canResend, setCanResend] = useState(false)
  const [sentToEmail, setSentToEmail] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const router = useRouter()

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  // Email validatsiya funksiyasi - yangilangan
  const validateEmail = (email: string) => {
    // Asosiy email format tekshiruvi
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError("Email manzil noto'g'ri formatda. Masalan: example@gmail.com")
      return false
    }

    const lowerEmail = email.toLowerCase()

    // Aniq Gmail xatolarini tekshirish - faqat oxirida bo'lgan xatolar
    if (lowerEmail.endsWith("@gmial.com")) {
      setError("Email manzilida xato: @gmial.com o'rniga @gmail.com yozing")
      return false
    }
    if (lowerEmail.endsWith("@gmai.com")) {
      setError("Email manzilida xato: @gmai.com o'rniga @gmail.com yozing")
      return false
    }
    if (lowerEmail.endsWith("@gmail.co")) {
      setError("Email manzilida xato: @gmail.co o'rniga @gmail.com yozing")
      return false
    }
    if (lowerEmail.endsWith("@gmail.cm")) {
      setError("Email manzilida xato: @gmail.cm o'rniga @gmail.com yozing")
      return false
    }
    if (lowerEmail.endsWith("@gmaill.com")) {
      setError("Email manzilida xato: @gmaill.com o'rniga @gmail.com yozing")
      return false
    }
    if (lowerEmail.endsWith("@gmail.comm")) {
      setError("Email manzilida xato: @gmail.comm o'rniga @gmail.com yozing")
      return false
    }

    // Boshqa keng tarqalgan xatolar
    if (lowerEmail.endsWith("@yahooo.com")) {
      setError("Email manzilida xato: @yahooo.com o'rniga @yahoo.com yozing")
      return false
    }
    if (lowerEmail.endsWith("@hotmial.com")) {
      setError("Email manzilida xato: @hotmial.com o'rniga @hotmail.com yozing")
      return false
    }
    if (lowerEmail.endsWith("@outlok.com")) {
      setError("Email manzilida xato: @outlok.com o'rniga @outlook.com yozing")
      return false
    }

    return true
  }

  const validateForm = () => {
    if (mode === "signup") {
      if (!formData.name.trim()) {
        setError("Ismingizni kiriting")
        return false
      }
      if (!formData.email.trim()) {
        setError("Email manzilini kiriting")
        return false
      }
      if (!validateEmail(formData.email)) {
        return false
      }

      // Foydalanuvchi allaqachon ro'yxatdan o'tganligini tekshirish
      const users = JSON.parse(localStorage.getItem("registeredUsers") || "[]")
      const existingUser = users.find((u: any) => u.email.toLowerCase() === formData.email.toLowerCase())
      if (existingUser) {
        setError("Bu email bilan allaqachon ro'yxatdan o'tilgan. Kirish bo'limidan foydalaning.")
        return false
      }

      if (!formData.password.trim()) {
        setError("Parolni kiriting")
        return false
      }
      if (formData.password.length < 6) {
        setError("Parol kamida 6 ta belgidan iborat bo'lishi kerak")
        return false
      }
      if (formData.password !== formData.confirmPassword) {
        setError("Parollar mos kelmaydi")
        return false
      }
    } else {
      if (!formData.email.trim()) {
        setError("Email manzilini kiriting")
        return false
      }
      if (!validateEmail(formData.email)) {
        return false
      }

      // Foydalanuvchi ro'yxatdan o'tganligini tekshirish
      const users = JSON.parse(localStorage.getItem("registeredUsers") || "[]")
      const user = users.find((u: any) => u.email.toLowerCase() === formData.email.toLowerCase())
      if (!user && formData.email !== "sardorxonvvaliyev006@gmail.com") {
        setError("Bu email bilan ro'yxatdan o'tilmagan. Avval ro'yxatdan o'ting.")
        return false
      }

      if (!formData.password.trim()) {
        setError("Parolni kiriting")
        return false
      }
    }
    return true
  }

  const handleSignIn = async () => {
    if (!validateForm()) return

    setLoading(true)
    setError("")

    try {
      // ADMIN TEKSHIRUVI - BIRINCHI NAVBATDA
      if (formData.email === "sardorxonvvaliyev006@gmail.com" && formData.password === "xanadmin") {
        localStorage.setItem("isAuthenticated", "true")
        localStorage.setItem("userRole", "admin")
        localStorage.setItem("userEmail", formData.email)

        setSuccess("Admin sifatida kirildi!")
        setTimeout(() => {
          router.push("/admin")
        }, 1000)
        return
      }

      // Oddiy foydalanuvchi uchun tekshirish
      const users = JSON.parse(localStorage.getItem("registeredUsers") || "[]")
      const user = users.find((u: any) => u.email.toLowerCase() === formData.email.toLowerCase())

      if (!user) {
        setError("Bu email bilan ro'yxatdan o'tilmagan. Avval ro'yxatdan o'ting.")
        return
      }

      if (user.password !== formData.password) {
        setError("Noto'g'ri parol")
        return
      }

      // Successful login
      localStorage.setItem("isAuthenticated", "true")
      localStorage.setItem("userEmail", formData.email)
      localStorage.setItem("userRole", "user")

      // Track user activity
      const allUsers = JSON.parse(localStorage.getItem("allUsers") || "[]")
      const existingUser = allUsers.find((u: any) => u.email === formData.email)

      if (existingUser) {
        existingUser.lastActive = new Date().toISOString()
        existingUser.loginCount = (existingUser.loginCount || 0) + 1
      } else {
        allUsers.push({
          email: formData.email,
          joinDate: user.joinDate || new Date().toISOString(),
          lastActive: new Date().toISOString(),
          loginCount: 1,
        })
      }

      localStorage.setItem("allUsers", JSON.stringify(allUsers))

      setSuccess("Muvaffaqiyatli kirildi!")
      setTimeout(() => {
        router.push("/dashboard")
      }, 1000)
    } catch (err) {
      setError("Kirishda xatolik yuz berdi")
    } finally {
      setLoading(false)
    }
  }

  const handleSignUp = async () => {
    if (!validateForm()) return

    setLoading(true)
    setError("")
    setCanResend(false)

    try {
      // Admin email bilan ro'yxatdan o'tishni taqiqlash
      if (formData.email === "sardorxonvvaliyev006@gmail.com") {
        setError("Bu email admin uchun ajratilgan")
        return
      }

      const code = Math.floor(100000 + Math.random() * 900000).toString()
      const expirationTime = Date.now() + 5 * 60 * 1000 // 5 daqiqa

      localStorage.setItem("verificationCode", code)
      localStorage.setItem("codeExpiration", expirationTime.toString())
      localStorage.setItem("pendingUser", JSON.stringify(formData))

      // Email manzilini saqlash
      setSentToEmail(formData.email)

      // EmailJS template variables - template'dagi {{parol}} va {{to_email}} uchun
      const templateParams = {
        to_email: formData.email.trim().toLowerCase(), // Email'ni tozalash va kichik harfga o'tkazish
        parol: code,
        from_name: "QUIZ'X",
        reply_to: "sardorxonvvaliyev006@gmail.com",
      }

      console.log("Sending email with params:", templateParams)
      console.log("Using template ID:", EMAILJS_CONFIG.templateId)
      console.log("Using service ID:", EMAILJS_CONFIG.serviceId)

      const result = await emailjs.send(
        EMAILJS_CONFIG.serviceId,
        EMAILJS_CONFIG.templateId,
        templateParams,
        EMAILJS_CONFIG.publicKey,
      )

      console.log("EmailJS result:", result)

      setSuccess(`Tasdiqlash kodi ${formData.email} manziliga yuborildi`)
      setStep("verification")

      // 5 daqiqalik timer
      setTimeLeft(300)
      const countdown = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(countdown)
            setCanResend(true)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } catch (err: any) {
      console.error("EmailJS error:", err)
      if (err.status === 422) {
        setError("Email manzil noto'g'ri formatda")
      } else if (err.status === 400) {
        setError("EmailJS xizmati topilmadi. Sozlamalarni tekshiring")
      } else if (err.status === 404) {
        setError("EmailJS hisob yoki template topilmadi")
      } else if (err.text) {
        setError(`EmailJS xatolik: ${err.text}`)
      } else {
        setError("Kod yuborishda xatolik yuz berdi. Qaytadan urinib ko'ring.")
      }
    } finally {
      setLoading(false)
    }
  }

  const verifyCode = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      setError("6 raqamli tasdiqlash kodini kiriting")
      return
    }

    setVerifying(true)
    setError("")

    try {
      const storedCode = localStorage.getItem("verificationCode")
      const expirationTime = localStorage.getItem("codeExpiration")
      const pendingUser = JSON.parse(localStorage.getItem("pendingUser") || "{}")

      if (!storedCode || !expirationTime) {
        setError("Kod muddati tugagan. Qaytadan urinib ko'ring")
        return
      }

      if (Date.now() > Number.parseInt(expirationTime)) {
        setError("Kod muddati tugagan. Yangi kod so'rang")
        setCanResend(true)
        setTimeLeft(0)
        return
      }

      if (verificationCode === storedCode) {
        // Save user to registered users
        const users = JSON.parse(localStorage.getItem("registeredUsers") || "[]")
        const newUser = {
          name: pendingUser.name,
          email: pendingUser.email,
          password: pendingUser.password,
          joinDate: new Date().toISOString(),
        }
        users.push(newUser)
        localStorage.setItem("registeredUsers", JSON.stringify(users))

        // Set user as authenticated
        localStorage.setItem("isAuthenticated", "true")
        localStorage.setItem("userEmail", pendingUser.email)
        localStorage.setItem("userRole", "user")

        // Track user activity
        const allUsers = JSON.parse(localStorage.getItem("allUsers") || "[]")
        allUsers.push({
          email: pendingUser.email,
          joinDate: new Date().toISOString(),
          lastActive: new Date().toISOString(),
          loginCount: 1,
        })
        localStorage.setItem("allUsers", JSON.stringify(allUsers))

        // Clean up
        localStorage.removeItem("verificationCode")
        localStorage.removeItem("codeExpiration")
        localStorage.removeItem("pendingUser")

        setSuccess("Muvaffaqiyatli ro'yxatdan o'tdingiz!")
        setTimeout(() => {
          router.push("/dashboard")
        }, 1000)
      } else {
        setError("Noto'g'ri tasdiqlash kodi")
      }
    } catch (err) {
      setError("Tasdiqlashda xatolik yuz berdi")
    } finally {
      setVerifying(false)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const resendCode = () => {
    const pendingUser = JSON.parse(localStorage.getItem("pendingUser") || "{}")
    setFormData(pendingUser)
    setVerificationCode("")
    handleSignUp()
  }

  return (
    <div className="min-h-screen">
      <AdBanner />

      <div className="flex items-center justify-center p-4 min-h-[calc(100vh-60px)]">
        <div className="w-full max-w-md animate-slide-up">
          {/* Header */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center space-x-3 group">
              <div className="p-2 rounded-xl glass-effect group-hover:glow-effect transition-all duration-300">
                <BookOpen className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
              </div>
              <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary to-emerald-400 bg-clip-text text-transparent">
                QUIZ'X
              </span>
            </Link>
          </div>

          <Card className="glass-effect border-white/10 glow-effect">
            <CardHeader className="text-center">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Sparkles className="h-5 w-5 text-primary animate-pulse" />
                <CardTitle className="text-xl sm:text-2xl text-white">
                  {step === "form" ? (mode === "signin" ? "Hisobga kirish" : "Ro'yxatdan o'tish") : "Tasdiqlash kodi"}
                </CardTitle>
              </div>
              <CardDescription className="text-sm sm:text-base text-gray-300">
                {step === "form"
                  ? mode === "signin"
                    ? "Email va parolingizni kiriting"
                    : "Ma'lumotlaringizni kiriting va emailga yuborilgan kodni tasdiqlang"
                  : "6 raqamli tasdiqlash kodini kiriting"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {error && (
                <Alert variant="destructive" className="glass-effect border-red-500/30 bg-red-500/10">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription className="text-sm text-red-300">{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="glass-effect border-primary/30 bg-primary/10">
                  <Shield className="h-4 w-4 text-primary" />
                  <AlertDescription className="text-primary text-sm">{success}</AlertDescription>
                </Alert>
              )}

              {(loading || verifying) && (
                <div className="flex justify-center py-8">
                  <QuizXLoader
                    text={
                      loading ? (mode === "signup" ? "Kod yuborilmoqda..." : "Tekshirilmoqda...") : "Tasdiqlashmoqda..."
                    }
                  />
                </div>
              )}

              {!loading && !verifying && step === "form" && (
                <div className="space-y-6">
                  {/* Mode Toggle */}
                  <div className="flex rounded-lg glass-effect p-1">
                    <button
                      onClick={() => setMode("signin")}
                      className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                        mode === "signin" ? "bg-primary text-black" : "text-gray-300 hover:text-white"
                      }`}
                    >
                      Kirish
                    </button>
                    <button
                      onClick={() => setMode("signup")}
                      className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                        mode === "signup" ? "bg-primary text-black" : "text-gray-300 hover:text-white"
                      }`}
                    >
                      Ro'yxatdan o'tish
                    </button>
                  </div>

                  {/* Sign Up Form */}
                  {mode === "signup" && (
                    <>
                      <div className="space-y-3">
                        <Label htmlFor="name" className="text-sm sm:text-base text-gray-300">
                          Ism
                        </Label>
                        <div className="relative">
                          <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="name"
                            type="text"
                            placeholder="Ismingizni kiriting"
                            value={formData.name}
                            onChange={(e) => handleInputChange("name", e.target.value)}
                            className="pl-10 text-sm sm:text-base glass-effect border-white/20 focus:border-primary/50 text-white placeholder:text-gray-400"
                          />
                        </div>
                      </div>

                      <div className="space-y-3">
                        <Label htmlFor="email" className="text-sm sm:text-base text-gray-300">
                          Email manzil
                        </Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="email"
                            type="email"
                            placeholder="example@gmail.com"
                            value={formData.email}
                            onChange={(e) => handleInputChange("email", e.target.value)}
                            className="pl-10 text-sm sm:text-base glass-effect border-white/20 focus:border-primary/50 text-white placeholder:text-gray-400"
                          />
                        </div>
                      </div>

                      <div className="space-y-3">
                        <Label htmlFor="password" className="text-sm sm:text-base text-gray-300">
                          Parol
                        </Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Kamida 6 ta belgi"
                            value={formData.password}
                            onChange={(e) => handleInputChange("password", e.target.value)}
                            className="pl-10 pr-10 text-sm sm:text-base glass-effect border-white/20 focus:border-primary/50 text-white placeholder:text-gray-400"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-3 text-gray-400 hover:text-white transition-colors"
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <Label htmlFor="confirmPassword" className="text-sm sm:text-base text-gray-300">
                          Parolni tasdiqlang
                        </Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Parolni qayta kiriting"
                            value={formData.confirmPassword}
                            onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                            className="pl-10 pr-10 text-sm sm:text-base glass-effect border-white/20 focus:border-primary/50 text-white placeholder:text-gray-400"
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-3 text-gray-400 hover:text-white transition-colors"
                          >
                            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>

                      <Button
                        onClick={handleSignUp}
                        className="w-full text-sm sm:text-base bg-primary hover:bg-primary/90 glow-effect hover:scale-105 transition-all duration-300"
                      >
                        Ro'yxatdan o'tish
                      </Button>
                    </>
                  )}

                  {/* Sign In Form */}
                  {mode === "signin" && (
                    <>
                      <div className="space-y-3">
                        <Label htmlFor="email" className="text-sm sm:text-base text-gray-300">
                          Email manzil
                        </Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="email"
                            type="email"
                            placeholder="example@gmail.com"
                            value={formData.email}
                            onChange={(e) => handleInputChange("email", e.target.value)}
                            className="pl-10 text-sm sm:text-base glass-effect border-white/20 focus:border-primary/50 text-white placeholder:text-gray-400"
                          />
                        </div>
                      </div>

                      <div className="space-y-3">
                        <Label htmlFor="password" className="text-sm sm:text-base text-gray-300">
                          Parol
                        </Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Parolingizni kiriting"
                            value={formData.password}
                            onChange={(e) => handleInputChange("password", e.target.value)}
                            className="pl-10 pr-10 text-sm sm:text-base glass-effect border-white/20 focus:border-primary/50 text-white placeholder:text-gray-400"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-3 text-gray-400 hover:text-white transition-colors"
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>

                      <Button
                        onClick={handleSignIn}
                        className="w-full text-sm sm:text-base bg-primary hover:bg-primary/90 glow-effect hover:scale-105 transition-all duration-300"
                      >
                        Kirish
                      </Button>
                    </>
                  )}
                </div>
              )}

              {!loading && !verifying && step === "verification" && (
                <div className="space-y-6">
                  {/* Email manzilini ko'rsatish */}
                  {sentToEmail && (
                    <Alert className="glass-effect border-blue-500/30 bg-blue-500/10">
                      <Mail className="h-4 w-4 text-blue-400" />
                      <AlertDescription className="text-blue-300 text-sm">
                        Kod yuborilgan email: <strong>{sentToEmail}</strong>
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-3">
                    <Label className="text-sm sm:text-base text-gray-300">Tasdiqlash kodi</Label>
                    {timeLeft > 0 ? (
                      <p className="text-sm text-orange-400 flex items-center gap-2">
                        <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
                        Kod {formatTime(timeLeft)} da tugaydi
                      </p>
                    ) : (
                      <p className="text-sm text-red-400 flex items-center gap-2">
                        <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                        Kod muddati tugadi
                      </p>
                    )}

                    {/* Oddiy input - 6 raqamli kod uchun */}
                    <Input
                      type="text"
                      placeholder="123456"
                      value={verificationCode}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, "").slice(0, 6)
                        setVerificationCode(value)
                      }}
                      maxLength={6}
                      className="text-center text-lg font-mono tracking-widest glass-effect border-white/20 focus:border-primary/50 text-white placeholder:text-gray-400"
                      disabled={timeLeft === 0}
                    />

                    {timeLeft > 0 ? (
                      <p className="text-center text-xs text-gray-400 mt-2">6 raqamli kodni kiriting</p>
                    ) : (
                      <p className="text-center text-xs text-red-400 mt-2">Kod muddati tugagan, yangi kod so'rang</p>
                    )}
                  </div>

                  <Button
                    onClick={verifyCode}
                    disabled={verificationCode.length !== 6 || timeLeft === 0}
                    className="w-full text-sm sm:text-base bg-primary hover:bg-primary/90 glow-effect hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Tasdiqlash
                  </Button>

                  {/* Resend button */}
                  {canResend && timeLeft === 0 && (
                    <Button
                      onClick={resendCode}
                      variant="outline"
                      className="w-full text-sm sm:text-base glass-effect border-primary/30 hover:border-primary/50 text-primary hover:text-white hover:bg-primary/10 transition-all duration-300 bg-transparent"
                      disabled={loading}
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Yangi kod olish
                    </Button>
                  )}

                  <Button
                    variant="outline"
                    onClick={() => setStep("form")}
                    className="w-full text-sm sm:text-base glass-effect border-white/20 hover:border-primary/50 text-white hover:text-primary transition-all duration-300"
                  >
                    Orqaga qaytish
                  </Button>
                </div>
              )}

              <div className="text-center text-xs sm:text-sm text-gray-400">
                <Link href="/" className="text-primary hover:text-primary/80 transition-colors">
                  Bosh sahifaga qaytish
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
