"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { BookOpen, ArrowRight, Home } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import AdBanner from "@/components/ad-banner"

interface Word {
  id: string
  english: string
  uzbek: string
}

interface QuizResult {
  word: Word
  userAnswer: string
  isCorrect: boolean
}

// Circular Progress Component
const CircularProgress = ({ percentage, size = 120, strokeWidth = 8, color = "#22c55e" }) => {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const strokeDasharray = `${circumference} ${circumference}`
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg
        className="transform -rotate-90 animate-spin-slow"
        width={size}
        height={size}
        style={{ animation: "spin 2s linear" }}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255,255,255,0.1)"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
          style={{
            animation: "draw 1.5s ease-out forwards",
            strokeDashoffset: circumference,
          }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-2xl font-bold text-white">{percentage}%</span>
      </div>
    </div>
  )
}

export default function QuizPage() {
  const [words, setWords] = useState<Word[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [userAnswer, setUserAnswer] = useState("")
  const [results, setResults] = useState<QuizResult[]>([])
  const [isFinished, setIsFinished] = useState(false)
  const [shuffledWords, setShuffledWords] = useState<Word[]>([])
  const [showResults, setShowResults] = useState(false)
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
      const parsedWords = JSON.parse(savedWords)
      setWords(parsedWords)

      // Shuffle words for random order
      const shuffled = [...parsedWords].sort(() => Math.random() - 0.5)
      setShuffledWords(shuffled)
    } else {
      router.push("/dashboard")
    }
  }, [router])

  const handleSubmitAnswer = () => {
    if (!userAnswer.trim()) return

    const currentWord = shuffledWords[currentIndex]
    const isCorrect = userAnswer.trim().toLowerCase() === currentWord.english.toLowerCase()

    const result: QuizResult = {
      word: currentWord,
      userAnswer: userAnswer.trim(),
      isCorrect,
    }

    const newResults = [...results, result]
    setResults(newResults)

    if (currentIndex + 1 >= shuffledWords.length) {
      setIsFinished(true)
      // Store results for visualization
      localStorage.setItem("quizResults", JSON.stringify(newResults))

      // Save to test history
      const correctCount = newResults.filter((r) => r.isCorrect).length
      const testHistory = JSON.parse(localStorage.getItem("testHistory") || "[]")
      const newTest = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        totalWords: newResults.length,
        correctAnswers: correctCount,
        incorrectAnswers: newResults.length - correctCount,
        percentage: Math.round((correctCount / newResults.length) * 100),
        results: newResults,
      }
      testHistory.unshift(newTest)
      localStorage.setItem("testHistory", JSON.stringify(testHistory))

      // Show results after a short delay
      setTimeout(() => setShowResults(true), 500)
    } else {
      setCurrentIndex(currentIndex + 1)
      setUserAnswer("")
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmitAnswer()
    }
  }

  if (shuffledWords.length === 0) {
    return (
      <div className="min-h-screen">
        <AdBanner />
        <div className="flex items-center justify-center min-h-[calc(100vh-60px)]">
          <Card className="w-full max-w-md mx-4 glass-effect border-white/10">
            <CardContent className="text-center py-8">
              <BookOpen className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="text-sm sm:text-base text-white">So'zlar yuklanmoqda...</p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (isFinished) {
    const correctCount = results.filter((r) => r.isCorrect).length
    const totalCount = results.length
    const percentage = Math.round((correctCount / totalCount) * 100)
    const incorrectResults = results.filter((r) => !r.isCorrect)

    return (
      <div className="min-h-screen">
        <AdBanner />

        {/* Header */}
        <header className="glass-effect border-b border-white/10">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Link href="/dashboard" className="flex items-center space-x-3 group">
                <div className="p-2 rounded-xl glass-effect group-hover:glow-effect transition-all duration-300">
                  <BookOpen className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                </div>
                <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary to-emerald-400 bg-clip-text text-transparent">
                  QUIZ'X
                </span>
              </Link>
              <Link href="/dashboard">
                <Button variant="outline" className="glass-effect border-white/20 text-white bg-transparent">
                  Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-4 sm:py-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-6 sm:mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Mashq yakunlandi!</h1>
              <p className="text-gray-300 text-sm sm:text-base">Sizning natijalaringiz</p>
            </div>

            <div className="grid lg:grid-cols-2 gap-6 sm:gap-8">
              {/* Circular Chart */}
              <Card className="glass-effect border-white/10 hover:glow-effect transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl text-white">Vizual natija</CardTitle>
                  <CardDescription className="text-sm sm:text-base text-gray-300">
                    Interaktiv diagrammada natijalaringizni ko'ring
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center justify-center py-8">
                    {showResults && <CircularProgress percentage={percentage} size={150} />}
                    <div className="mt-6 grid grid-cols-2 gap-6 w-full max-w-xs">
                      <div className="text-center">
                        <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
                          <span className="text-xl font-bold text-white">{correctCount}</span>
                        </div>
                        <p className="text-sm text-green-400">To'g'ri</p>
                      </div>
                      <div className="text-center">
                        <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-gradient-to-r from-red-500 to-pink-500 flex items-center justify-center">
                          <span className="text-xl font-bold text-white">{totalCount - correctCount}</span>
                        </div>
                        <p className="text-sm text-red-400">Noto'g'ri</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Statistics and Wrong Answers */}
              <div className="space-y-4 sm:space-y-6">
                <Card className="glass-effect border-white/10 hover:glow-effect transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="text-lg sm:text-xl text-white">Umumiy natija</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center mb-4 sm:mb-6">
                      <div className="text-3xl sm:text-4xl font-bold text-primary mb-2">{percentage}%</div>
                      <p className="text-gray-300 text-sm sm:text-base">
                        {correctCount} ta to'g'ri javob {totalCount} tadan
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Link href="/dashboard" className="block">
                        <Button className="w-full text-sm sm:text-base bg-primary hover:bg-primary/90 glow-effect hover:scale-105 transition-all duration-300">
                          <Home className="h-4 w-4 mr-2" />
                          Boshqaruv paneliga qaytish
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>

                {/* Wrong Answers */}
                {incorrectResults.length > 0 && (
                  <Card className="glass-effect border-white/10 hover:glow-effect transition-all duration-300">
                    <CardHeader>
                      <CardTitle className="text-lg sm:text-xl text-white">Xato javoblar</CardTitle>
                      <CardDescription className="text-sm sm:text-base text-gray-300">
                        To'g'ri javoblarni ko'rib chiqing
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3 max-h-48 sm:max-h-64 overflow-y-auto">
                        {incorrectResults.map((result, index) => (
                          <div
                            key={index}
                            className="glass-effect p-3 rounded-lg border border-red-500/20 bg-red-500/5"
                          >
                            <div className="grid grid-cols-1 gap-2 text-xs">
                              <div className="font-bold text-white">{result.word.uzbek}</div>
                              <div className="text-red-400">Sizning javobingiz: {result.userAnswer}</div>
                              <div className="text-green-400">To'g'ri javob: {result.word.english}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const currentWord = shuffledWords[currentIndex]
  const progress = ((currentIndex + 1) / shuffledWords.length) * 100

  return (
    <div className="min-h-screen">
      <AdBanner />

      {/* Header */}
      <header className="glass-effect border-b border-white/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/dashboard" className="flex items-center space-x-3 group">
              <div className="p-2 rounded-xl glass-effect group-hover:glow-effect transition-all duration-300">
                <BookOpen className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
              </div>
              <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary to-emerald-400 bg-clip-text text-transparent">
                QUIZ'X
              </span>
            </Link>
            <div className="text-sm text-gray-300">
              Savol {currentIndex + 1} / {shuffledWords.length}
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-4 sm:py-8">
        {/* Progress */}
        <div className="mb-4 sm:mb-6">
          <div className="flex justify-between text-xs sm:text-sm text-gray-300 mb-2">
            <span>
              Savol {currentIndex + 1} / {shuffledWords.length}
            </span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Quiz Card */}
        <Card className="glass-effect border-white/10 hover:glow-effect transition-all duration-300">
          <CardHeader className="text-center">
            <CardTitle className="text-lg sm:text-xl text-white">O'zbekcha so'zni tarjima qiling</CardTitle>
            <CardDescription className="text-sm sm:text-base text-gray-300">
              Quyidagi o'zbekcha so'zning inglizcha tarjimasini yozing
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-primary mb-4">{currentWord.uzbek}</div>
              <p className="text-gray-300 text-sm sm:text-base">Inglizcha tarjimasi:</p>
            </div>

            <div className="space-y-4">
              <Input
                type="text"
                placeholder="Javobingizni yozing..."
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                onKeyPress={handleKeyPress}
                className="text-center text-base sm:text-lg glass-effect border-white/20 focus:border-primary/50 text-white placeholder:text-gray-400"
                autoFocus
              />
              <Button
                onClick={handleSubmitAnswer}
                className="w-full text-sm sm:text-base bg-primary hover:bg-primary/90 glow-effect hover:scale-105 transition-all duration-300"
                size="lg"
                disabled={!userAnswer.trim()}
              >
                {currentIndex + 1 === shuffledWords.length ? "Yakunlash" : "Keyingi savol"}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>

            <div className="text-center text-xs sm:text-sm text-gray-400">
              Enter tugmasini bosib ham javob berishingiz mumkin
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
