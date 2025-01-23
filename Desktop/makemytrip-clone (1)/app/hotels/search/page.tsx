"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { NavigationMenu } from "../../components/navigation-menu"
import { Header } from "../../components/header"
import { Footer } from "../../components/footer"
import { ChevronDown, Search, Star, MapPin } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { format, addDays } from "date-fns"
import { useRouter } from "next/navigation"

// Generate 20 sample hotels
const generateHotels = () => {
  const baseHotels = [
    {
      id: 1,
      name: "Hilton Goa Resort",
      location: "Candolim",
      distance: "Candolim",
      rating: 4.2,
      reviews: 937,
      amenities: ["Gym", "Swimming Pool", "Jacuzzi"],
      tags: ["Couple Friendly"],
      price: 12000,
      taxes: 2160,
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-01-22%20at%208.01.27%E2%80%AFAM-WkKam89dxG7B2RMKP9sTDV3oqo1qQ6.png",
      sponsored: true,
      breakfast: true,
      perks: ["Get 1 free beer bucket once during the stay at the in-house eatery"],
    },
    {
      id: 2,
      name: "The Tanisi",
      location: "Candolim",
      distance: "15 minutes walk to Candolim Beach",
      rating: 4.6,
      reviews: 119,
      amenities: ["Jacuzzi", "Swimming Pool"],
      tags: ["Couple Friendly"],
      price: 4063,
      taxes: 1893,
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-01-22%20at%208.01.43%E2%80%AFAM-vgCXg6y6kvXY2hYLd8NneBnFUOKiN0.png",
      breakfast: true,
      cancellation: "Free Cancellation till check-in",
    },
  ]

  return Array(20)
    .fill(null)
    .map((_, index) => ({
      ...baseHotels[index % 2],
      id: index + 1,
    }))
}

const hotels = generateHotels()

const filters = {
  suggested: [
    { label: "Last Minute Deals", count: null },
    { label: "5 Star", count: 163 },
    { label: "Resorts", count: 362 },
    { label: "Beachfront Properties", count: 183 },
    { label: "Free Cancellation", count: 805 },
    { label: "Villas", count: 563 },
  ],
  priceRanges: [
    { label: "₹0 - ₹2000", count: 640 },
    { label: "₹2000 - ₹4000", count: 858 },
    { label: "₹4000 - ₹7000", count: 420 },
    { label: "₹7000 - ₹10000", count: 184 },
    { label: "₹10000 - ₹12500", count: 98 },
    { label: "₹12500 - ₹15000", count: 98 },
    { label: "₹15000 - ₹30000", count: 241 },
    { label: "₹30000+", count: 169 },
  ],
}

export default function HotelSearchPage() {
  const router = useRouter()
  const [sortBy, setSortBy] = useState("Popular")

  return (
    <main className="min-h-screen bg-white">
      <Header />
      <div className="bg-[#041628] text-white">
        <div className="max-w-[1200px] mx-auto px-6">
          <NavigationMenu />
          <div className="py-4">
            <div className="grid grid-cols-[2fr,1fr,1fr,1fr,auto] gap-4 items-center">
              <div className="flex flex-col">
                <span className="text-sm text-gray-300">CITY, AREA OR PROPERTY</span>
                <Button variant="ghost" className="justify-between text-lg hover:bg-white/10">
                  Goa <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-gray-300">CHECK-IN</span>
                <Button variant="ghost" className="justify-between text-lg hover:bg-white/10">
                  {format(new Date(), "EEE, dd MMM yyyy")} <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-gray-300">CHECK-OUT</span>
                <Button variant="ghost" className="justify-between text-lg hover:bg-white/10">
                  {format(addDays(new Date(), 1), "EEE, dd MMM yyyy")} <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-gray-300">ROOMS & GUESTS</span>
                <Button variant="ghost" className="justify-between text-lg hover:bg-white/10">
                  1 Room, 2 Adults <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </div>
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                SEARCH
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-blue-50/50">
        <div className="max-w-[1200px] mx-auto px-6 py-4">
          <div className="flex items-center gap-2 text-sm">
            <Button variant="link" className="text-blue-600 p-0 h-auto">
              Home
            </Button>
            <span className="text-gray-400">›</span>
            <span>Hotels and more in Goa</span>
          </div>
          <h1 className="text-2xl font-bold mt-2">2773 Properties in Goa</h1>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-6">
            <span className="font-medium">SORT BY:</span>
            {["Popular", "User Rating (Highest First)", "Price (Highest First)", "Price (Lowest First)"].map(
              (option) => (
                <Button
                  key={option}
                  variant="ghost"
                  className={option === sortBy ? "text-blue-600" : "text-gray-600"}
                  onClick={() => setSortBy(option)}
                >
                  {option}
                </Button>
              ),
            )}
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input type="search" placeholder="Search for locality / hotel name" className="pl-10 w-64" />
          </div>
        </div>

        <div className="flex gap-6">
          {/* Filters Sidebar */}
          <div className="w-64 flex-shrink-0">
            <Card className="p-4">
              <h2 className="font-bold mb-4">Select Filters</h2>

              <div className="mb-6">
                <h3 className="font-bold mb-3">Suggested For You</h3>
                {filters.suggested.map((filter, index) => (
                  <div key={index} className="flex items-center mb-2">
                    <Checkbox id={`suggested-${index}`} />
                    <label htmlFor={`suggested-${index}`} className="ml-2 text-sm flex justify-between w-full">
                      <span>{filter.label}</span>
                      {filter.count && <span className="text-gray-500">({filter.count})</span>}
                    </label>
                  </div>
                ))}
              </div>

              <div className="mb-6">
                <h3 className="font-bold mb-3">Price per night</h3>
                {filters.priceRanges.map((range, index) => (
                  <div key={index} className="flex items-center mb-2">
                    <Checkbox id={`price-${index}`} />
                    <label htmlFor={`price-${index}`} className="ml-2 text-sm flex justify-between w-full">
                      <span>{range.label}</span>
                      <span className="text-gray-500">({range.count})</span>
                    </label>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Hotel Listings */}
          <div className="flex-1">
            <div className="grid gap-6">
              {hotels.map((hotel) => (
                <Card key={hotel.id} className="p-4">
                  <div className="flex gap-6">
                    <div className="relative w-72 h-48">
                      <Image
                        src={hotel.image || "/placeholder.svg"}
                        alt={hotel.name}
                        fill
                        className="object-cover rounded-lg"
                      />
                      {hotel.sponsored && (
                        <div className="absolute top-2 left-2 bg-gray-900/80 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                          <Star className="h-3 w-3" fill="currentColor" />
                          SPONSORED
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-xl font-bold flex items-center gap-2">
                            {hotel.name}
                            <span className="text-yellow-500">{"★".repeat(5)}</span>
                          </h3>
                          <Link href="#" className="text-blue-600 hover:underline">
                            {hotel.location}
                          </Link>
                          <p className="text-sm text-gray-600">{hotel.distance}</p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-2 mb-1">
                            <div className="bg-green-700 text-white text-sm px-2 py-1 rounded">{hotel.rating}</div>
                            <span className="font-medium">Very Good</span>
                          </div>
                          <p className="text-sm text-gray-600">({hotel.reviews} Ratings)</p>
                        </div>
                      </div>
                      <div className="flex gap-4 my-4">
                        {hotel.tags.map((tag) => (
                          <span key={tag} className="px-3 py-1 rounded-full border text-sm">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="flex gap-6 mb-4">
                        {hotel.amenities.map((amenity) => (
                          <span key={amenity} className="text-sm text-gray-600">
                            {amenity}
                          </span>
                        ))}
                      </div>
                      {hotel.breakfast && (
                        <div className="flex items-center gap-2 text-green-600 text-sm">
                          <span className="w-2 h-2 bg-green-600 rounded-full" />
                          Breakfast Included
                        </div>
                      )}
                      {hotel.cancellation && (
                        <div className="flex items-center gap-2 text-green-600 text-sm">
                          <span className="w-2 h-2 bg-green-600 rounded-full" />
                          {hotel.cancellation}
                        </div>
                      )}
                      {hotel.perks?.map((perk) => (
                        <div key={perk} className="flex items-center gap-2 text-orange-700 text-sm mt-1">
                          <span className="w-2 h-2 bg-orange-500 rounded-full" />
                          {perk}
                        </div>
                      ))}
                    </div>
                    <div className="w-48 flex flex-col items-end">
                      <div className="text-2xl font-bold">₹ {hotel.price.toLocaleString()}</div>
                      <div className="text-sm text-gray-600">+ ₹ {hotel.taxes} taxes & fees</div>
                      <div className="text-sm text-gray-600">Per Night</div>
                      <Button
                        className="mt-4 w-full bg-blue-600 hover:bg-blue-700"
                        onClick={() => router.push(`/hotels/search/checkout?hotelId=${hotel.id}`)}
                      >
                        Book Now
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}

