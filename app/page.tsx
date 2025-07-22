"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Brain, TrendingUp, Sparkles, Zap, Target, Mail } from "lucide-react"
import AdBanner from "@/components/ad-banner"

// Statistikalarni hisoblash funksiyasi
const calculateStats = () => {
  // 2025 yil 1-yanvar boshlanish nuqtasi
  const startDate = new Date("2025-01-01")
  const currentDate = new Date()

  // Haftalar sonini hisoblash
  const timeDiff = currentDate.getTime() - startDate.getTime()
  const weeksPassed = Math.floor(timeDiff / (1000 * 3600 * 24 * 7))

  // Boshlang'ich qiymatlar
  const baseUsers = 127
  const baseTests = 2847
  const baseAccuracy = 78

  // Har hafta oshish
  const currentUsers = baseUsers + weeksPassed * 10
  const currentTests = baseTests + weeksPassed * 100

  return {
    users: currentUsers,
    tests: currentTests.toLocaleString(),
    accuracy: baseAccuracy,
  }
}

export default function LandingPage() {
  const [stats, setStats] = useState({ users: 127, tests: "2,847", accuracy: 78 })

  useEffect(() => {
    setStats(calculateStats())
  }, [])

  return (
    <div className="min-h-screen">
      {/* Ad Banner */}
      <AdBanner />

      {/* Header */}
      <header className="container mx-auto px-4 py-6 animate-fade-in">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-3 group">
            <div className="p-2 rounded-xl glass-effect group-hover:glow-effect transition-all duration-300">
              <BookOpen className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
            </div>
            <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary to-emerald-400 bg-clip-text text-transparent">
              QUIZ'X
            </span>
          </div>
          <Link href="/login">
            <Button
              variant="outline"
              className="glass-effect hover:glow-effect transition-all duration-300 text-sm sm:text-base px-4 sm:px-6 border-primary/30 hover:border-primary/60 bg-transparent"
            >
              Hisobga kirish
            </Button>
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12 sm:py-20 text-center animate-slide-up">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-effect mb-6 animate-glow">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm text-primary font-medium">AI-Powered Learning</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-primary to-emerald-400 bg-clip-text text-transparent leading-tight">
            Ingliz tilini samarali va tez o'rganing
          </h1>

          <p className="text-lg sm:text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            O'zbekcha so'zlarni ko'rib, inglizcha tarjimasini topish orqali lug'at boyligingizni oshiring. Interaktiv
            diagrammalar bilan o'z natijalaringizni kuzatib boring.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/login">
              <Button
                size="lg"
                className="text-base sm:text-lg px-8 py-4 bg-primary hover:bg-primary/90 glow-effect hover:scale-105 transition-all duration-300 group"
              >
                <Zap className="h-5 w-5 mr-2 group-hover:rotate-12 transition-transform" />
                Bepul boshlash
              </Button>
            </Link>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <div className="flex -space-x-2">
                <img
                  src="images/uzbek-user1.jpg"
                  alt="O'zbek foydalanuvchi 1"
                  className="w-8 h-8 rounded-full border-2 border-primary object-cover"
                />
                <img
                  src="images/uzbek-user2.jpg"
                  alt="O'zbek foydalanuvchi 2"
                  className="w-8 h-8 rounded-full border-2 border-blue-500 object-cover"
                />
                <img
                  src="images/uzbek-user3.jpg"
                  alt="O'zbek foydalanuvchi 3"
                  className="w-8 h-8 rounded-full border-2 border-pink-500 object-cover"
                />
              </div>
              <span>{stats.users}+ faol foydalanuvchi</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16 sm:py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 bg-gradient-to-r from-white to-primary bg-clip-text text-transparent">
            Qanday ishlaydi?
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Uch oddiy qadamda ingliz tilini o'rganishni boshlang
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              icon: BookOpen,
              title: "1. So'zlarni qo'shing",
              description: "Inglizcha so'z va uning o'zbekcha tarjimasini kiritib, shaxsiy lug'atingizni yarating",
              color: "from-blue-500 to-cyan-500",
            },
            {
              icon: Brain,
              title: "2. Mashq qiling",
              description: "O'zbekcha so'zlar tasodifiy tartibda ko'rsatiladi, siz inglizcha tarjimasini yozing",
              color: "from-primary to-emerald-400",
            },
            {
              icon: TrendingUp,
              title: "3. Natijalarni ko'ring",
              description: "Interaktiv diagrammalar orqali to'g'ri va noto'g'ri javoblaringizni tahlil qiling",
              color: "from-purple-500 to-pink-500",
            },
          ].map((feature, index) => (
            <Card
              key={index}
              className="glass-effect hover:glow-effect transition-all duration-500 hover:scale-105 group animate-slide-up border-white/10"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <CardHeader className="text-center pb-4">
                <div
                  className={`mx-auto w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.color} p-4 mb-4 group-hover:rotate-6 transition-transform duration-300`}
                >
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl text-white group-hover:text-primary transition-colors">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-300 text-center leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Example Section */}
      <section className="container mx-auto px-4 py-16 sm:py-24">
        <div className="glass-effect rounded-3xl p-8 sm:p-12 glow-effect">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 bg-gradient-to-r from-white to-primary bg-clip-text text-transparent">
            Misol
          </h2>

          <div className="max-w-4xl mx-auto space-y-8">
            {/* Step 1 */}
            <div className="glass-effect rounded-2xl p-6 sm:p-8 hover:glow-effect transition-all duration-300">
              <h3 className="text-xl sm:text-2xl font-semibold mb-6 text-primary flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary text-black flex items-center justify-center font-bold">
                  1
                </div>
                So'z qo'shish:
              </h3>
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="glass-effect p-4 sm:p-6 rounded-xl border border-primary/20">
                  <label className="block text-sm font-medium text-gray-300 mb-3">Inglizcha so'z</label>
                  <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-lg px-4 py-3 text-white font-medium">
                    apple
                  </div>
                </div>
                <div className="glass-effect p-4 sm:p-6 rounded-xl border border-primary/20">
                  <label className="block text-sm font-medium text-gray-300 mb-3">O'zbekcha tarjima</label>
                  <div className="bg-gradient-to-r from-primary/20 to-emerald-400/20 rounded-lg px-4 py-3 text-white font-medium">
                    olma
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="glass-effect rounded-2xl p-6 sm:p-8 hover:glow-effect transition-all duration-300">
              <h3 className="text-xl sm:text-2xl font-semibold mb-6 text-primary flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary text-black flex items-center justify-center font-bold">
                  2
                </div>
                Test jarayoni:
              </h3>
              <div className="glass-effect p-6 sm:p-8 rounded-xl text-center border border-primary/20">
                <p className="text-lg mb-4 text-gray-300">O'zbekcha so'z:</p>
                <p className="text-4xl sm:text-5xl font-bold text-primary mb-6 animate-glow">olma</p>
                <p className="text-sm text-gray-400 mb-4">Inglizcha tarjimasini yozing:</p>
                <div className="max-w-xs mx-auto">
                  <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-lg px-4 py-3 text-white font-medium">
                    apple
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="glass-effect rounded-2xl p-6 sm:p-8 hover:glow-effect transition-all duration-300">
              <h3 className="text-xl sm:text-2xl font-semibold mb-6 text-primary flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary text-black flex items-center justify-center font-bold">
                  3
                </div>
                Natija:
              </h3>
              <div className="glass-effect p-6 sm:p-8 rounded-xl text-center border border-primary/20">
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 p-6 rounded-xl border border-green-500/30">
                    <p className="text-3xl sm:text-4xl font-bold text-green-400 mb-2">8</p>
                    <p className="text-sm text-green-300">To'g'ri javob</p>
                  </div>
                  <div className="bg-gradient-to-r from-red-500/20 to-pink-500/20 p-6 rounded-xl border border-red-500/30">
                    <p className="text-3xl sm:text-4xl font-bold text-red-400 mb-2">2</p>
                    <p className="text-sm text-red-300">Noto'g'ri javob</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="container mx-auto px-4 py-16 sm:py-24">
        <div className="grid sm:grid-cols-3 gap-8 text-center">
          {[
            { number: stats.users.toString(), label: "Faol foydalanuvchi", color: "from-blue-500 to-cyan-500" },
            { number: stats.tests, label: "Bajarilgan test", color: "from-primary to-emerald-400" },
            { number: `${stats.accuracy}%`, label: "O'rtacha aniqlik", color: "from-purple-500 to-pink-500" },
          ].map((stat, index) => (
            <div
              key={index}
              className="glass-effect p-8 rounded-2xl hover:glow-effect transition-all duration-300 hover:scale-105 group"
            >
              <div
                className={`text-4xl sm:text-5xl font-bold mb-3 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent group-hover:scale-110 transition-transform`}
              >
                {stat.number}
              </div>
              <div className="text-gray-300 group-hover:text-white transition-colors">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-16 sm:py-24 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6 bg-gradient-to-r from-white to-primary bg-clip-text text-transparent">
            Bugun o'rganishni boshlang!
          </h2>
          <p className="text-lg sm:text-xl text-gray-300 mb-8 leading-relaxed">
            Bepul ro'yxatdan o'ting va ingliz tilini samarali o'rganishni boshlang
          </p>
          <Link href="/login">
            <Button
              size="lg"
              className="text-lg px-10 py-5 bg-primary hover:bg-primary/90 glow-effect hover:scale-105 transition-all duration-300 group"
            >
              <Target className="h-5 w-5 mr-2 group-hover:rotate-12 transition-transform" />
              Hoziroq boshlash
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-3 mb-6 group">
              <div className="p-2 rounded-xl glass-effect group-hover:glow-effect transition-all duration-300">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-emerald-400 bg-clip-text text-transparent">
                QUIZ'X
              </span>
            </div>

            {/* Contact buttons */}
            <div className="flex justify-center gap-4 mb-6">
              <a
                href="https://t.me/sardorxonvvaliyev"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 glass-effect border border-white/20 rounded-lg hover:border-primary/50 text-white hover:text-primary transition-all duration-300"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-.8 5.42-.25 1.21-.93 1.21-.93 1.21s-.67 0-1.07-.4c-.4-.4-.67-1.21-.67-1.21s-1.87-1.21-2.67-2.01c-.8-.8-.27-1.34.27-1.87.53-.53 3.47-2.56 3.47-2.56s.4-.27.4-.67c0-.4-.13-.53-.4-.4 0 0-4.14 2.4-5.07 2.93-.93.53-.93.13-.93.13s-.27-.13-.8-.4c-.53-.27-1.07-.53-1.07-.53s-.4-.27 0-.53c.4-.27 8.55-3.6 8.55-3.6s1.07-.4 1.07.27z" />
                </svg>
                <span className="text-sm">Telegram</span>
              </a>
              <a
                href="mailto:sardorxonvvaliyev006@gmail.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 glass-effect border border-white/20 rounded-lg hover:border-primary/50 text-white hover:text-primary transition-all duration-300"
              >
                <Mail className="w-5 h-5" />
                <span className="text-sm">Email</span>
              </a>
            </div>

            <p className="text-gray-400">© 2025 QUIZ'X. Barcha huquqlar himoyalangan.</p>
            <p className="text-gray-500 text-sm mt-2">Reklama berish uchun yuqoridagi kontaktlar orqali bog'laning</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
