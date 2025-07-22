"use client"

import { useState, useEffect } from "react"

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

export default function AdBanner() {
  const [ads, setAds] = useState<AdBanner[]>([])
  const [currentAdIndex, setCurrentAdIndex] = useState(0)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // Check if mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  useEffect(() => {
    // Load ads from localStorage
    const loadAds = () => {
      try {
        const savedAds = localStorage.getItem("adBanners")
        console.log("Loading ads from localStorage:", savedAds) // Debug
        if (savedAds) {
          const allAds = JSON.parse(savedAds)
          const activeAds = allAds.filter((ad: AdBanner) => ad.isActive)
          console.log("Active ads:", activeAds) // Debug
          setAds(activeAds)

          // Reset index if current index is out of bounds
          if (activeAds.length > 0) {
            setCurrentAdIndex(0)
          }
        }
      } catch (error) {
        console.error("Error loading ads:", error)
        setAds([])
      }
    }

    loadAds()

    // Listen for storage changes (when ads are updated in admin panel)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "adBanners") {
        loadAds()
      }
    }

    window.addEventListener("storage", handleStorageChange)

    // Also listen for custom events (for same-tab updates)
    const handleAdUpdate = () => {
      loadAds()
    }

    window.addEventListener("adBannersUpdated", handleAdUpdate)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener("adBannersUpdated", handleAdUpdate)
    }
  }, [])

  useEffect(() => {
    // Auto-rotate ads if more than 2
    let interval: NodeJS.Timeout | null = null

    if (ads.length > 2) {
      console.log(`Starting rotation for ${ads.length} ads`) // Debug
      interval = setInterval(() => {
        setCurrentAdIndex((prev) => {
          const nextIndex = (prev + 1) % ads.length
          console.log(`Rotating from ${prev} to ${nextIndex}`) // Debug
          return nextIndex
        })
      }, 20000) // 20 seconds
    }

    return () => {
      if (interval) {
        clearInterval(interval)
      }
    }
  }, [ads.length])

  if (ads.length === 0) {
    return null
  }

  // Ensure currentAdIndex is within bounds
  const safeIndex = Math.min(currentAdIndex, ads.length - 1)
  const currentAd = ads[safeIndex]

  if (!currentAd) {
    return null
  }

  const backgroundImage = isMobile ? currentAd.mobileImage : currentAd.desktopImage

  return (
    <div className="w-full h-[60px] bg-gradient-to-r from-primary/20 via-emerald-500/20 to-cyan-500/20 backdrop-blur-xl border-b border-white/10 flex items-center justify-center text-white overflow-hidden relative group">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

      {/* Background image - mobile va desktop uchun alohida */}
      {backgroundImage && (
        <div className="absolute inset-0 opacity-20">
          <img src={backgroundImage || "/placeholder.svg"} alt="Ad background" className="w-full h-full object-cover" />
        </div>
      )}

      <div className="container mx-auto px-4 flex items-center justify-center relative z-10">
        {currentAd.link ? (
          <a
            href={currentAd.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-center hover:scale-105 transition-transform duration-300 group"
          >
            <div className="font-semibold text-sm sm:text-base truncate text-white group-hover:text-primary transition-colors">
              {currentAd.title}
            </div>
            <div className="text-xs sm:text-sm opacity-80 truncate text-gray-200">{currentAd.content}</div>
          </a>
        ) : (
          <div className="text-center">
            <div className="font-semibold text-sm sm:text-base truncate text-white">{currentAd.title}</div>
            <div className="text-xs sm:text-sm opacity-80 truncate text-gray-200">{currentAd.content}</div>
          </div>
        )}
      </div>

      {/* Show indicators for all ads, not just when > 2 */}
      {ads.length > 1 && (
        <div className="absolute right-4 flex space-x-2">
          {ads.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 cursor-pointer ${
                index === safeIndex ? "bg-primary shadow-lg shadow-primary/50" : "bg-white/30 hover:bg-white/50"
              }`}
              onClick={() => setCurrentAdIndex(index)}
            />
          ))}
        </div>
      )}

      {/* Debug info - remove in production */}
      {process.env.NODE_ENV === "development" && (
        <div className="absolute left-4 text-xs text-white/50">
          {safeIndex + 1}/{ads.length}
        </div>
      )}
    </div>
  )
}
