"use client"

import Image from "next/image"
import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"
import { Building2, Briefcase, User, ClipboardList, UserCircle } from "lucide-react"
import { useRouter, usePathname } from "next/navigation"

const navItems = [
  {
    icon: "✈️",
    label: "Flights",
    path: "/",
    active: false,
  },
  {
    icon: "🏨",
    label: "Hotels",
    path: "/hotels",
    active: false,
  },
  {
    icon: "🏠",
    label: "Homestays & Villas",
    path: "/homestays",
    active: false,
  },
  {
    icon: "🌴",
    label: "Holiday Packages",
    path: "/holidays",
    active: false,
  },
  {
    icon: "🚕",
    label: "Cabs",
    path: "/cabs",
    active: false,
  },
  {
    icon: "📄",
    label: "e-Visa",
    path: "/visa",
    active: false,
  },
  {
    icon: "🛡️",
    label: "Travel Insurance",
    path: "/insurance",
    active: false,
  },
  {
    icon: "📝",
    label: "Blog",
    path: "/blog",
    active: false,
  },
]

export function NavigationMenu() {
  const router = useRouter()
  const pathname = usePathname()
  const [isSticky, setIsSticky] = useState(false)
  const isHotelSearch = pathname === "/hotels/search"

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY
      setIsSticky(scrollPosition > 100)

      const existingNavbar = document.querySelector(".existing-navbar")
      if (existingNavbar) {
        if (scrollPosition > 100) {
          existingNavbar.classList.add("hidden")
        } else {
          existingNavbar.classList.remove("hidden")
        }
      }
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div
      className={cn(
        "transition-all duration-300 shadow-lg text-black",
        isSticky
          ? "fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md"
          : "w-[600px] mx-auto rounded-full bg-transparent",
      )}
    >
      {!isHotelSearch && (
        <div className="flex justify-center items-center w-full">
          {navItems.map((item, index) => (
            <div
              key={index}
              onClick={() => router.push(item.path)}
              className={cn(
                "flex flex-col items-center gap-1 px-2 py-1 rounded-lg cursor-pointer transition-colors",
                item.active ? "text-red-600" : "text-gray-700 hover:text-red-600",
              )}
            >
              <span className="text-xl font-bold">{item.icon}</span>
              <span className="text-[10px] font-medium whitespace-nowrap">{item.label}</span>
              {item.active && <div className="h-0.5 w-full bg-red-600 absolute bottom-0 left-0" />}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

