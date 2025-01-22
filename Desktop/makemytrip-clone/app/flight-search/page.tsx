"use client"

import { useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Header } from "../components/header"
import { Footer } from "../components/footer"
import { NavigationMenu } from "../components/navigation-menu"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Slider } from "@/components/ui/slider"
import {
  ChevronLeft,
  ChevronRight,
  FlipHorizontalIcon as SwapHorizontal,
  Clock,
  Plane,
  Users,
  Calendar,
} from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { format } from "date-fns"
import { Checkbox } from "@/components/ui/checkbox"
import FlightSearchForm from "./components/FlightSearchForm"
import FlightFilters from "./components/FlightFilters"
import FlightResults from "./components/FlightResults"

export default function FlightSearchPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [selectedTripType, setSelectedTripType] = useState(searchParams.get("tripType") || "one-way")
  const [selectedFrom, setSelectedFrom] = useState(searchParams.get("from") || "Jaipur, India")
  const [selectedTo, setSelectedTo] = useState(searchParams.get("to") || "Mumbai, India")
  const [departureDate, setDepartureDate] = useState<Date>(
    searchParams.get("departureDate") ? new Date(searchParams.get("departureDate")!) : new Date(),
  )
  const [returnDate, setReturnDate] = useState<Date | undefined>(
    searchParams.get("returnDate") ? new Date(searchParams.get("returnDate")!) : undefined,
  )
  const [passengers, setPassengers] = useState({
    adults: Number(searchParams.get("adults")) || 1,
    children: Number(searchParams.get("children")) || 0,
    infants: Number(searchParams.get("infants")) || 0,
  })
  const [travelClass, setTravelClass] = useState(searchParams.get("travelClass") || "Economy")
  const [filters, setFilters] = useState({
    priceRange: [0, 20000] as [number, number],
    stops: ["non-stop"],
    airlines: [] as string[],
    departureTime: [] as string[],
    arrivalTime: [] as string[],
    sortBy: "cheapest",
  })
  const [specialFare, setSpecialFare] = useState(searchParams.get("specialFare") || "regular")

  const dates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() + i - 3)
    return {
      date: format(date, "EEE, MMM dd"),
      price: `₹ ${Math.floor(Math.random() * 3000 + 6000)}`,
      active: i === 3,
    }
  })

  const handleSearch = () => {
    const params = new URLSearchParams({
      tripType: selectedTripType,
      from: selectedFrom,
      to: selectedTo,
      departureDate: departureDate.toISOString(),
      ...(returnDate && { returnDate: returnDate.toISOString() }),
      adults: passengers.adults.toString(),
      children: passengers.children.toString(),
      infants: passengers.infants.toString(),
      class: travelClass,
      specialFare: specialFare,
    })
    router.push(`/flight-search?${params.toString()}`)
  }

  const filteredFlights = [] // We'll use dummy data directly in the FlightResults component

  return (
    <main className="min-h-screen">
      <div className="sticky top-0 z-50 bg-white shadow-md">
        <Header />
      </div>
      <div className="w-full bg-gray-100">
        <div className="max-w-[1300px] mx-auto px-4 py-6">
          <Card className="bg-white rounded-xl overflow-hidden shadow-lg w-full">
            <div className="p-6">
              <FlightSearchForm
                selectedTripType={selectedTripType}
                setSelectedTripType={setSelectedTripType}
                selectedFrom={selectedFrom}
                setSelectedFrom={setSelectedFrom}
                selectedTo={selectedTo}
                setSelectedTo={setSelectedTo}
                departureDate={departureDate}
                setDepartureDate={setDepartureDate}
                returnDate={returnDate}
                setReturnDate={setReturnDate}
                passengers={passengers}
                setPassengers={setPassengers}
                travelClass={travelClass}
                setTravelClass={setTravelClass}
                handleSearch={handleSearch}
              />
            </div>
          </Card>
        </div>
      </div>

      <div className="bg-gray-100 min-h-screen">
        <div className="px-6 py-6">
          <div className="flex gap-6">
            <FlightFilters filters={filters} setFilters={setFilters} />
            <FlightResults
              selectedFrom={selectedFrom}
              selectedTo={selectedTo}
              dates={dates}
              filters={filters}
              setFilters={setFilters}
            />
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}

