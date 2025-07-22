"use client"

import { useState, useEffect, Suspense } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Text, Environment } from "@react-three/drei"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen } from "lucide-react"
import { useRouter } from "next/navigation"
import AdBanner from "@/components/ad-banner"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface QuizResult {
  word: {
    id: string
    english: string
    uzbek: string
  }
  userAnswer: string
  isCorrect: boolean
}

function ResultsChart({ correctCount, incorrectCount }: { correctCount: number; incorrectCount: number }) {
  const total = correctCount + incorrectCount
  const correctHeight = (correctCount / total) * 3
  const incorrectHeight = (incorrectCount / total) * 3

  return (
    <group>
      {/* Correct answers bar */}
      <mesh position={[-1.5, correctHeight / 2, 0]}>
        <boxGeometry args={[1, correctHeight, 1]} />
        <meshStandardMaterial color="#10b981" />
      </mesh>

      {/* Incorrect answers bar */}
      <mesh position={[1.5, incorrectHeight / 2, 0]}>
        <boxGeometry args={[1, incorrectHeight, 1]} />
        <meshStandardMaterial color="#ef4444" />
      </mesh>

      {/* Labels */}
      <Text position={[-1.5, -0.5, 0]} fontSize={0.3} color="#10b981" anchorX="center" anchorY="middle">
        To'g'ri: {correctCount}
      </Text>

      <Text position={[1.5, -0.5, 0]} fontSize={0.3} color="#ef4444" anchorX="center" anchorY="middle">
        Noto'g'ri: {incorrectCount}
      </Text>

      {/* Title */}
      <Text position={[0, 4, 0]} fontSize={0.4} color="#4f46e5" anchorX="center" anchorY="middle">
        Sizning natijangiz
      </Text>
    </group>
  )
}

export default function ResultsPage() {
  const [results, setResults] = useState<QuizResult[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check authentication
    const isAuthenticated = localStorage.getItem("isAuthenticated")
    if (!isAuthenticated) {
      router.push("/login")
      return
    }

    // Load quiz results
    const savedResults = localStorage.getItem("quizResults")
    if (savedResults) {
      setResults(JSON.parse(savedResults))
    } else {
      router.push("/dashboard")
    }
    setLoading(false)
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <AdBanner />
        <div className="flex items-center justify-center min-h-[calc(100vh-60px)]">
          <Card className="w-full max-w-md mx-4">
            <CardContent className="text-center py-8">
              <BookOpen className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="text-sm sm:text-base">Natijalar yuklanmoqda...</p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const correctCount = results.filter((r) => r.isCorrect).length
  const incorrectCount = results.length - correctCount
  const percentage = Math.round((correctCount / results.length) * 100)
  const incorrectResults = results.filter((r) => !r.isCorrect)

  return (
    <div className="min-h-screen">
      <AdBanner />

      {/* Header qo'shish */}
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
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">3D Natijalar</h1>
            <p className="text-gray-600 text-sm sm:text-base">Sizning mashq natijalaringiz</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-6 sm:gap-8">
            {/* 3D Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Vizual natija</CardTitle>
                <CardDescription className="text-sm sm:text-base">
                  3D diagrammada natijalaringizni ko'ring
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 sm:h-96 w-full">
                  <Canvas camera={{ position: [0, 2, 8], fov: 50 }}>
                    <Suspense fallback={null}>
                      <Environment preset="studio" />
                      <ambientLight intensity={0.5} />
                      <pointLight position={[10, 10, 10]} />
                      <ResultsChart correctCount={correctCount} incorrectCount={incorrectCount} />
                      <OrbitControls enablePan={false} enableZoom={false} />
                    </Suspense>
                  </Canvas>
                </div>
              </CardContent>
            </Card>

            {/* Statistics */}
            <div className="space-y-4 sm:space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl">Umumiy natija</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center mb-4 sm:mb-6">
                    <div className="text-3xl sm:text-4xl font-bold text-indigo-600 mb-2">{percentage}%</div>
                    <p className="text-gray-600 text-sm sm:text-base">
                      {correctCount} ta to'g'ri javob {results.length} tadan
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4 sm:mb-6">
                    <div className="bg-green-100 p-3 sm:p-4 rounded-lg text-center">
                      <div className="text-xl sm:text-2xl font-bold text-green-600">{correctCount}</div>
                      <div className="text-xs sm:text-sm text-green-700">To'g'ri javoblar</div>
                    </div>
                    <div className="bg-red-100 p-3 sm:p-4 rounded-lg text-center">
                      <div className="text-xl sm:text-2xl font-bold text-red-600">{incorrectCount}</div>
                      <div className="text-xs sm:text-sm text-red-700">Noto'g'ri javoblar</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Wrong Answers */}
              {incorrectResults.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg sm:text-xl">Xato javoblar</CardTitle>
                    <CardDescription className="text-sm sm:text-base">
                      To'g'ri javoblarni ko'rib chiqing
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 max-h-48 sm:max-h-64 overflow-y-auto">
                      {incorrectResults.map((result, index) => (
                        <div key={index} className="bg-red-50 p-3 rounded-lg border border-red-200">
                          <div className="grid grid-cols-1 gap-2 text-xs">
                            <div className="font-bold">{result.word.english}</div>
                            <div className="text-red-600">{result.userAnswer}</div>
                            <div className="text-green-600">To'g'ri javob: {result.word.uzbek}</div>
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
