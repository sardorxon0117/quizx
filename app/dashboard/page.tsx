"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, Plus, Play, LogOut, Trash2, X, Sparkles, Zap, Target, History } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import AdBanner from "@/components/ad-banner"

interface Word {
  id: string
  english: string
  uzbek: string
}

interface TestHistory {
  id: string
  date: string
  totalWords: number
  correctAnswers: number
  incorrectAnswers: number
  percentage: number
  results: Array<{
    word: Word
    userAnswer: string
    isCorrect: boolean
  }>
}

export default function Dashboard() {
  const [words, setWords] = useState<Word[]>([])
  const [englishWord, setEnglishWord] = useState("")
  const [uzbekWord, setUzbekWord] = useState("")
  const [testHistory, setTestHistory] = useState<TestHistory[]>([])
  const router = useRouter()

  useEffect(() => {
    // Check authentication
    const isAuthenticated = localStorage.getItem("isAuthenticated")
    if (!isAuthenticated) {
      router.push("/login")
      return
    }

    // Load words from localStorage
    const savedWords = localStorage.getItem("userWords")
    if (savedWords) {
      setWords(JSON.parse(savedWords))
    }

    // Load test history
    const savedHistory = localStorage.getItem("testHistory")
    if (savedHistory) {
      setTestHistory(JSON.parse(savedHistory))
    }
  }, [router])

  const addWord = () => {
    if (!englishWord.trim() || !uzbekWord.trim()) return

    const newWord: Word = {
      id: Date.now().toString(),
      english: englishWord.trim(),
      uzbek: uzbekWord.trim(),
    }

    const updatedWords = [...words, newWord]
    setWords(updatedWords)
    localStorage.setItem("userWords", JSON.stringify(updatedWords))

    setEnglishWord("")
    setUzbekWord("")
  }

  const removeWord = (id: string) => {
    const updatedWords = words.filter((word) => word.id !== id)
    setWords(updatedWords)
    localStorage.setItem("userWords", JSON.stringify(updatedWords))
  }

  const clearAllWords = () => {
    if (confirm("Barcha so'zlarni o'chirishni xohlaysizmi?")) {
      setWords([])
      localStorage.removeItem("userWords")
    }
  }

  const logout = () => {
    localStorage.removeItem("isAuthenticated")
    localStorage.removeItem("userEmail")
    localStorage.removeItem("userRole")
    router.push("/")
  }

  const startQuiz = () => {
    if (words.length === 0) {
      alert("Avval so'zlar qo'shing!")
      return
    }
    router.push("/quiz")
  }

  return (
    <div className="min-h-screen">
      <AdBanner />

      {/* Header */}
      <header className="glass-effect border-b border-white/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="p-2 rounded-xl glass-effect group-hover:glow-effect transition-all duration-300">
                <BookOpen className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
              </div>
              <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary to-emerald-400 bg-clip-text text-transparent">
                QUIZ'X
              </span>
            </Link>
            <Button
              variant="outline"
              onClick={logout}
              className="text-sm sm:text-base glass-effect border-white/20 hover:border-red-500/50 text-white hover:text-red-400 transition-all duration-300 bg-transparent"
            >
              <LogOut className="h-4 w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Chiqish</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 sm:py-8">
        <div className="mb-8 animate-slide-up">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-xl bg-gradient-to-r from-primary to-emerald-400">
              <Sparkles className="h-6 w-6 text-black" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-white to-primary bg-clip-text text-transparent">
              Boshqaruv paneli
            </h1>
          </div>
          <p className="text-gray-300 text-sm sm:text-base">So'zlaringizni boshqaring va mashq qiling</p>
        </div>

        <Tabs defaultValue="words" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 glass-effect border-white/10">
            <TabsTrigger
              value="words"
              className="text-xs sm:text-sm data-[state=active]:bg-primary data-[state=active]:text-black"
            >
              So'zlar ({words.length})
            </TabsTrigger>
            <TabsTrigger
              value="add"
              className="text-xs sm:text-sm data-[state=active]:bg-primary data-[state=active]:text-black"
            >
              Qo'shish
            </TabsTrigger>
            <TabsTrigger
              value="quiz"
              className="text-xs sm:text-sm data-[state=active]:bg-primary data-[state=active]:text-black"
            >
              Mashq
            </TabsTrigger>
            <TabsTrigger
              value="history"
              className="text-xs sm:text-sm data-[state=active]:bg-primary data-[state=active]:text-black"
            >
              Tarix
            </TabsTrigger>
          </TabsList>

          <TabsContent value="words" className="space-y-6 animate-slide-up">
            <Card className="glass-effect border-white/10 hover:glow-effect transition-all duration-300">
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <CardTitle className="text-lg sm:text-xl text-white flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-primary" />
                      Sizning so'zlaringiz
                    </CardTitle>
                    <CardDescription className="text-sm sm:text-base text-gray-300">
                      Qo'shgan so'zlaringizni ko'ring va boshqaring
                    </CardDescription>
                  </div>
                  {words.length > 0 && (
                    <Button
                      variant="destructive"
                      onClick={clearAllWords}
                      className="text-sm hover:scale-105 transition-all duration-300"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Barchasini tozalash
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {words.length === 0 ? (
                  <div className="text-center py-12 text-gray-400">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full glass-effect flex items-center justify-center">
                      <BookOpen className="h-10 w-10 text-gray-500" />
                    </div>
                    <p className="text-sm sm:text-base mb-2">Hali so'zlar qo'shilmagan</p>
                    <p className="text-xs sm:text-sm">So'z qo'shish bo'limiga o'ting</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {words.map((word, index) => (
                      <div
                        key={word.id}
                        className="glass-effect p-4 rounded-xl border border-white/10 hover:border-primary/30 transition-all duration-300 hover:scale-[1.02] group"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <span className="text-xs text-gray-400">Inglizcha:</span>
                              <p className="font-medium text-sm sm:text-base text-white group-hover:text-primary transition-colors">
                                {word.english}
                              </p>
                            </div>
                            <div>
                              <span className="text-xs text-gray-400">O'zbekcha:</span>
                              <p className="font-medium text-sm sm:text-base text-white group-hover:text-primary transition-colors">
                                {word.uzbek}
                              </p>
                            </div>
                          </div>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => removeWord(word.id)}
                            className="ml-3 hover:scale-110 transition-all duration-300"
                          >
                            <X className="h-3 w-3 sm:h-4 sm:w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="add" className="space-y-6 animate-slide-up">
            <Card className="glass-effect border-white/10 hover:glow-effect transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl text-white flex items-center gap-2">
                  <Plus className="h-5 w-5 text-primary" />
                  Yangi so'z qo'shish
                </CardTitle>
                <CardDescription className="text-sm sm:text-base text-gray-300">
                  Inglizcha so'z va uning o'zbekcha tarjimasini kiriting
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="english" className="text-sm sm:text-base text-gray-300">
                      Inglizcha so'z
                    </Label>
                    <Input
                      id="english"
                      placeholder="apple"
                      value={englishWord}
                      onChange={(e) => setEnglishWord(e.target.value)}
                      className="glass-effect border-white/20 focus:border-primary/50 text-white placeholder:text-gray-400"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="uzbek" className="text-sm sm:text-base text-gray-300">
                      O'zbekcha tarjima
                    </Label>
                    <Input
                      id="uzbek"
                      placeholder="olma"
                      value={uzbekWord}
                      onChange={(e) => setUzbekWord(e.target.value)}
                      className="glass-effect border-white/20 focus:border-primary/50 text-white placeholder:text-gray-400"
                    />
                  </div>
                </div>
                <Button
                  onClick={addWord}
                  className="w-full text-sm sm:text-base bg-primary hover:bg-primary/90 glow-effect hover:scale-105 transition-all duration-300"
                  disabled={!englishWord.trim() || !uzbekWord.trim()}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  So'z qo'shish
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="quiz" className="space-y-6 animate-slide-up">
            <Card className="glass-effect border-white/10 hover:glow-effect transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl text-white flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary" />
                  Mashq qilish
                </CardTitle>
                <CardDescription className="text-sm sm:text-base text-gray-300">
                  O'zbekcha so'zlarni ko'rib, inglizcha tarjimasini toping
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center py-12">
                  <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r from-primary to-emerald-400 flex items-center justify-center animate-float">
                    <Play className="h-12 w-12 text-black" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold mb-3 text-white">Mashqni boshlash</h3>
                  <p className="text-gray-300 mb-8 text-sm sm:text-base">
                    {words.length} ta so'z bilan mashq qilishga tayyormisiz?
                  </p>
                  <Button
                    onClick={startQuiz}
                    size="lg"
                    disabled={words.length === 0}
                    className="text-sm sm:text-base bg-primary hover:bg-primary/90 glow-effect hover:scale-105 transition-all duration-300"
                  >
                    <Target className="h-4 w-4 mr-2" />
                    Mashqni boshlash
                  </Button>
                  {words.length === 0 && (
                    <p className="text-xs sm:text-sm text-red-400 mt-4">Mashq qilish uchun avval so'zlar qo'shing</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-6 animate-slide-up">
            <Card className="glass-effect border-white/10 hover:glow-effect transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl text-white flex items-center gap-2">
                  <History className="h-5 w-5 text-primary" />
                  Test tarixi
                </CardTitle>
                <CardDescription className="text-sm sm:text-base text-gray-300">
                  Avval bajarilgan testlar natijalari
                </CardDescription>
              </CardHeader>
              <CardContent>
                {testHistory.length === 0 ? (
                  <div className="text-center py-12 text-gray-400">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full glass-effect flex items-center justify-center">
                      <History className="h-10 w-10 text-gray-500" />
                    </div>
                    <p className="text-sm sm:text-base mb-2">Hali testlar bajarilmagan</p>
                    <p className="text-xs sm:text-sm">Birinchi testni bajaring</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {testHistory.map((test, index) => (
                      <div
                        key={test.id}
                        className="glass-effect p-4 sm:p-6 rounded-xl border border-white/10 hover:border-primary/30 transition-all duration-300 hover:scale-[1.02] group"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                          <div>
                            <p className="font-medium text-sm sm:text-base text-white group-hover:text-primary transition-colors">
                              {new Date(test.date).toLocaleDateString("uz-UZ")}
                            </p>
                            <p className="text-xs sm:text-sm text-gray-400">{test.totalWords} ta so'z</p>
                          </div>
                          <div className="flex items-center gap-6">
                            <div className="text-center">
                              <p className="text-lg sm:text-xl font-bold text-green-400">{test.correctAnswers}</p>
                              <p className="text-xs text-green-300">To'g'ri</p>
                            </div>
                            <div className="text-center">
                              <p className="text-lg sm:text-xl font-bold text-red-400">{test.incorrectAnswers}</p>
                              <p className="text-xs text-red-300">Noto'g'ri</p>
                            </div>
                            <div className="text-center">
                              <p className="text-lg sm:text-xl font-bold text-primary">{test.percentage}%</p>
                              <p className="text-xs text-primary/80">Natija</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
