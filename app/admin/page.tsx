"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { BookOpen, Users, BarChart3, ImageIcon, LogOut, Trash2, Zap } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import AdBannerComponent from "@/components/ad-banner"

interface User {
  email: string
  joinDate: string
  lastActive: string
  loginCount: number
}

interface AdBanner {
  id: string
  title: string
  content: string
  link?: string
  isActive: boolean
  createdAt: string
  desktopImage?: string
  mobileImage?: string
}

// Custom event to notify banner about updates
const notifyAdUpdate = () => {
  window.dispatchEvent(new CustomEvent("adBannersUpdated"))
}

export default function AdminPanel() {
  const [users, setUsers] = useState<User[]>([])
  const [ads, setAds] = useState<AdBanner[]>([])
  const [newAd, setNewAd] = useState({
    title: "",
    content: "",
    link: "",
    desktopImage: "",
    mobileImage: "",
  })
  const router = useRouter()

  useEffect(() => {
    // Check admin authentication
    const isAuthenticated = localStorage.getItem("isAuthenticated")
    const userRole = localStorage.getItem("userRole")

    if (!isAuthenticated || userRole !== "admin") {
      router.push("/login")
      return
    }

    // Load users
    const savedUsers = localStorage.getItem("allUsers")
    if (savedUsers) {
      setUsers(JSON.parse(savedUsers))
    }

    // Load ads
    loadAds()
  }, [router])

  const loadAds = () => {
    try {
      const savedAds = localStorage.getItem("adBanners")
      console.log("Admin loading ads:", savedAds) // Debug
      if (savedAds) {
        const parsedAds = JSON.parse(savedAds)
        setAds(parsedAds)
        console.log("Admin loaded ads:", parsedAds) // Debug
      } else {
        setAds([])
      }
    } catch (error) {
      console.error("Error loading ads in admin:", error)
      setAds([])
    }
  }

  const saveAds = (updatedAds: AdBanner[]) => {
    try {
      console.log("Saving ads:", updatedAds) // Debug
      localStorage.setItem("adBanners", JSON.stringify(updatedAds))
      setAds(updatedAds)
      notifyAdUpdate() // Notify banner component
    } catch (error) {
      console.error("Error saving ads:", error)
      alert("Reklamalarni saqlashda xatolik yuz berdi")
    }
  }

  const logout = () => {
    localStorage.removeItem("isAuthenticated")
    localStorage.removeItem("userEmail")
    localStorage.removeItem("userRole")
    router.push("/")
  }

  const isActiveUser = (lastActive: string) => {
    const lastActiveDate = new Date(lastActive)
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    return lastActiveDate > weekAgo
  }

  const createAd = () => {
    if (!newAd.title.trim() || !newAd.content.trim()) {
      alert("Sarlavha va matn to'ldirilishi shart!")
      return
    }

    const ad: AdBanner = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9), // More unique ID
      title: newAd.title.trim(),
      content: newAd.content.trim(),
      link: newAd.link.trim() || undefined,
      isActive: true,
      createdAt: new Date().toISOString(),
      desktopImage: newAd.desktopImage || undefined,
      mobileImage: newAd.mobileImage || undefined,
    }

    const updatedAds = [...ads, ad]
    saveAds(updatedAds)

    // Show success message
    alert(`"${newAd.title}" reklamasi muvaffaqiyatli yaratildi! Jami reklamalar: ${updatedAds.length}`)

    // Reset form for next ad
    setNewAd({
      title: "",
      content: "",
      link: "",
      desktopImage: "",
      mobileImage: "",
    })
  }

  const toggleAdStatus = (id: string) => {
    const updatedAds = ads.map((ad) => (ad.id === id ? { ...ad, isActive: !ad.isActive } : ad))
    saveAds(updatedAds)
  }

  const deleteAd = (id: string) => {
    const adToDelete = ads.find((ad) => ad.id === id)
    if (confirm(`"${adToDelete?.title}" reklamasini o'chirishni xohlaysizmi?`)) {
      const updatedAds = ads.filter((ad) => ad.id !== id)
      saveAds(updatedAds)
      alert(`Reklama o'chirildi. Qolgan reklamalar: ${updatedAds.length}`)
    }
  }

  const handleFileUpload = (type: "desktop" | "mobile", event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("Fayl hajmi 5MB dan kichik bo'lishi kerak")
        return
      }

      // Check file type
      if (!file.type.startsWith("image/")) {
        alert("Faqat rasm fayllari qabul qilinadi")
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setNewAd((prev) => ({
          ...prev,
          [type === "desktop" ? "desktopImage" : "mobileImage"]: result,
        }))
      }
      reader.onerror = () => {
        alert("Fayl yuklashda xatolik yuz berdi")
      }
      reader.readAsDataURL(file)
    }
  }

  const activeUsers = users.filter((user) => isActiveUser(user.lastActive))
  const totalTests = users.reduce((sum, user) => sum + (user.loginCount || 0), 0)

  return (
    <div className="min-h-screen">
      <AdBannerComponent />

      {/* Header */}
      <header className="glass-effect border-b border-white/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="p-2 rounded-xl glass-effect group-hover:glow-effect transition-all duration-300">
                <BookOpen className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
              </div>
              <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary to-emerald-400 bg-clip-text text-transparent">
                QUIZ'X Admin
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
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-white to-primary bg-clip-text text-transparent mb-2">
            Admin Panel
          </h1>
          <p className="text-gray-300 text-sm sm:text-base">Foydalanuvchilar va reklamalarni boshqaring</p>
        </div>

        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 glass-effect border-white/10">
            <TabsTrigger
              value="users"
              className="text-xs sm:text-sm data-[state=active]:bg-primary data-[state=active]:text-black"
            >
              <Users className="h-4 w-4 mr-2" />
              Foydalanuvchilar
            </TabsTrigger>
            <TabsTrigger
              value="stats"
              className="text-xs sm:text-sm data-[state=active]:bg-primary data-[state=active]:text-black"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Statistika
            </TabsTrigger>
            <TabsTrigger
              value="ads"
              className="text-xs sm:text-sm data-[state=active]:bg-primary data-[state=active]:text-black"
            >
              <ImageIcon className="h-4 w-4 mr-2" />
              Reklamalar ({ads.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-6 animate-slide-up">
            <Card className="glass-effect border-white/10 hover:glow-effect transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl text-white flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Foydalanuvchilar ro'yxati
                </CardTitle>
                <CardDescription className="text-sm sm:text-base text-gray-300">
                  Saytdan foydalangan barcha foydalanuvchilar va ularning faollik holati
                </CardDescription>
              </CardHeader>
              <CardContent>
                {users.length === 0 ? (
                  <div className="text-center py-12 text-gray-400">
                    <Users className="h-12 w-12 mx-auto mb-4 text-gray-500" />
                    <p className="text-sm sm:text-base">Hali foydalanuvchilar yo'q</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {users.map((user, index) => (
                      <div
                        key={user.email}
                        className="glass-effect p-4 rounded-xl border border-white/10 hover:border-primary/30 transition-all duration-300 group"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                          <div className="flex-1">
                            <p className="font-medium text-white group-hover:text-primary transition-colors">
                              {user.email}
                            </p>
                            <p className="text-xs text-gray-400">
                              Qo'shilgan: {new Date(user.joinDate).toLocaleDateString("uz-UZ")}
                            </p>
                            <p className="text-xs text-gray-400">Kirish soni: {user.loginCount || 0}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <div
                              className={`px-3 py-1 rounded-full text-xs font-medium ${
                                isActiveUser(user.lastActive)
                                  ? "bg-green-500/20 text-green-400 border border-green-500/30"
                                  : "bg-red-500/20 text-red-400 border border-red-500/30"
                              }`}
                            >
                              {isActiveUser(user.lastActive) ? "Faol" : "Nofaol"}
                            </div>
                            <p className="text-xs text-gray-400">
                              {new Date(user.lastActive).toLocaleDateString("uz-UZ")}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="stats" className="space-y-6 animate-slide-up">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="glass-effect border-white/10 hover:glow-effect transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-primary mb-2">{users.length}</div>
                  <div className="text-sm text-gray-300">Jami foydalanuvchilar</div>
                </CardContent>
              </Card>
              <Card className="glass-effect border-white/10 hover:glow-effect transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-green-400 mb-2">{activeUsers.length}</div>
                  <div className="text-sm text-gray-300">Faol foydalanuvchilar</div>
                </CardContent>
              </Card>
              <Card className="glass-effect border-white/10 hover:glow-effect transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-blue-400 mb-2">{totalTests}</div>
                  <div className="text-sm text-gray-300">Jami testlar</div>
                </CardContent>
              </Card>
              <Card className="glass-effect border-white/10 hover:glow-effect transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-purple-400 mb-2">
                    {ads.filter((ad) => ad.isActive).length}
                  </div>
                  <div className="text-sm text-gray-300">Faol reklamalar</div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="ads" className="space-y-6 animate-slide-up">
            {/* Create Ad */}
            <Card className="glass-effect border-white/10 hover:glow-effect transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl text-white flex items-center gap-2">
                  <ImageIcon className="h-5 w-5 text-primary" />
                  Yangi reklama yaratish
                </CardTitle>
                <CardDescription className="text-sm sm:text-base text-gray-300">
                  Reklama banner yaratish va boshqarish. Jami reklamalar: {ads.length}
                </CardDescription>
                {/* Quick Add Section */}
                <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mb-6">
                  <h4 className="text-primary font-medium mb-3 flex items-center gap-2">
                    <Zap className="h-4 w-4" />
                    Tezkor qo'shish
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <Button
                      onClick={() => {
                        setNewAd({
                          title: "Yangi kurs!",
                          content: "Ingliz tili kursi 50% chegirma bilan",
                          link: "https://example.com/course",
                          desktopImage: "",
                          mobileImage: "",
                        })
                      }}
                      variant="outline"
                      size="sm"
                      className="text-xs glass-effect border-primary/30 text-primary"
                    >
                      Kurs reklamasi
                    </Button>
                    <Button
                      onClick={() => {
                        setNewAd({
                          title: "Bepul test!",
                          content: "Ingliz tili darajangizni tekshiring",
                          link: "https://example.com/test",
                          desktopImage: "",
                          mobileImage: "",
                        })
                      }}
                      variant="outline"
                      size="sm"
                      className="text-xs glass-effect border-primary/30 text-primary"
                    >
                      Test reklamasi
                    </Button>
                    <Button
                      onClick={() => {
                        setNewAd({
                          title: "Mobil ilova",
                          content: "QUIZ'X ilovasini yuklab oling",
                          link: "https://example.com/app",
                          desktopImage: "",
                          mobileImage: "",
                        })
                      }}
                      variant="outline"
                      size="sm"
                      className="text-xs glass-effect border-primary/30 text-primary"
                    >
                      Ilova reklamasi
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="title" className="text-gray-300">
                      Sarlavha
                    </Label>
                    <Input
                      id="title"
                      placeholder="Reklama sarlavhasi"
                      value={newAd.title}
                      onChange={(e) => setNewAd((prev) => ({ ...prev, title: e.target.value }))}
                      className="glass-effect border-white/20 focus:border-primary/50 text-white placeholder:text-gray-400"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="content" className="text-gray-300">
                      Matn
                    </Label>
                    <Input
                      id="content"
                      placeholder="Reklama matni"
                      value={newAd.content}
                      onChange={(e) => setNewAd((prev) => ({ ...prev, content: e.target.value }))}
                      className="glass-effect border-white/20 focus:border-primary/50 text-white placeholder:text-gray-400"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="link" className="text-gray-300">
                    Havola (ixtiyoriy)
                  </Label>
                  <Input
                    id="link"
                    placeholder="https://example.com"
                    value={newAd.link}
                    onChange={(e) => setNewAd((prev) => ({ ...prev, link: e.target.value }))}
                    className="glass-effect border-white/20 focus:border-primary/50 text-white placeholder:text-gray-400"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label className="text-gray-300">Desktop rasm</Label>
                    <div className="glass-effect border-white/20 border-2 border-dashed rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload("desktop", e)}
                        className="w-full text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary file:text-black hover:file:bg-primary/90 file:cursor-pointer"
                        id="desktop-upload"
                      />
                      {newAd.desktopImage && (
                        <div className="mt-3">
                          <img
                            src={newAd.desktopImage || "/placeholder.svg"}
                            alt="Desktop preview"
                            className="max-h-20 mx-auto rounded"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="space-y-3">
                    <Label className="text-gray-300">Mobile rasm</Label>
                    <div className="glass-effect border-white/20 border-2 border-dashed rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload("mobile", e)}
                        className="w-full text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary file:text-black hover:file:bg-primary/90 file:cursor-pointer"
                        id="mobile-upload"
                      />
                      {newAd.mobileImage && (
                        <div className="mt-3">
                          <img
                            src={newAd.mobileImage || "/placeholder.svg"}
                            alt="Mobile preview"
                            className="max-h-20 mx-auto rounded"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={createAd}
                    className="flex-1 bg-primary hover:bg-primary/90 glow-effect hover:scale-105 transition-all duration-300"
                    disabled={!newAd.title.trim() || !newAd.content.trim()}
                  >
                    Reklama yaratish
                  </Button>
                  <Button
                    onClick={() => {
                      // Create current ad and prepare for next
                      createAd()
                      // Keep form open for next ad
                    }}
                    variant="outline"
                    className="glass-effect border-primary/30 text-primary hover:bg-primary/10"
                    disabled={!newAd.title.trim() || !newAd.content.trim()}
                  >
                    Yaratib, keyingisini qo'shish
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Ads List */}
            <Card className="glass-effect border-white/10 hover:glow-effect transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl text-white">Barcha reklamalar ({ads.length})</CardTitle>
                <CardDescription className="text-gray-300">
                  Yaratilgan reklamalarni boshqaring. Faol: {ads.filter((ad) => ad.isActive).length}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {ads.length === 0 ? (
                  <div className="text-center py-12 text-gray-400">
                    <ImageIcon className="h-12 w-12 mx-auto mb-4 text-gray-500" />
                    <p className="text-sm sm:text-base">Hali reklamalar yaratilmagan</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {ads.map((ad, index) => (
                      <div
                        key={ad.id}
                        className="glass-effect p-4 rounded-xl border border-white/10 hover:border-primary/30 transition-all duration-300 group"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                          <div className="flex-1">
                            <h3 className="font-medium text-white group-hover:text-primary transition-colors">
                              {ad.title}
                            </h3>
                            <p className="text-sm text-gray-400 mt-1">{ad.content}</p>
                            {ad.link && <p className="text-xs text-blue-400 mt-1">{ad.link}</p>}
                            <p className="text-xs text-gray-500 mt-2">
                              ID: {ad.id} | {new Date(ad.createdAt).toLocaleDateString("uz-UZ")}
                            </p>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2">
                              <Switch checked={ad.isActive} onCheckedChange={() => toggleAdStatus(ad.id)} />
                              <span className="text-sm text-gray-300">{ad.isActive ? "Faol" : "Nofaol"}</span>
                            </div>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => deleteAd(ad.id)}
                              className="hover:scale-110 transition-all duration-300"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
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
