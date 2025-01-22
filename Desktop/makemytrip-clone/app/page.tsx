"use client"

import { useState } from "react"
import { CalendarIcon, ChevronDown, FlipHorizontalIcon as SwapHorizontal, ChevronUp } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { NavigationMenu } from "./components/navigation-menu"
import { Header } from "./components/header"
import { ExploreMore } from "./components/explore-more"
import { Offers } from "./components/offers"
import { FeaturedTours } from "./components/featured-tours"
import { FlightOfferDeals } from "./components/flight-offer-deals"
import { TopRatedHotels } from "./components/top-rated-hotels"
import { Footer } from "./components/footer"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const travelClasses = ["Economy/Premium Economy", "Premium Economy", "Business", "First Class"] as const

type TravelClass = (typeof travelClasses)[number]

export default function Home() {
  const router = useRouter()
  const [tripType, setTripType] = useState("one-way")
  const [from, setFrom] = useState("Jaipur")
  const [to, setTo] = useState("Mumbai")
  const [departureDate, setDepartureDate] = useState<Date>(new Date())
  const [returnDate, setReturnDate] = useState<Date>()
  const [travelers, setTravelers] = useState({ adults: 1, children: 0, infants: 0 })
  const [travelClass, setTravelClass] = useState<TravelClass>("Economy/Premium Economy")
  const [specialFare, setSpecialFare] = useState("regular")
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false)
  const [isReturnDatePickerOpen, setIsReturnDatePickerOpen] = useState(false)

  const handleSwapLocations = () => {
    const temp = from
    setFrom(to)
    setTo(temp)
  }

  const handleDateSelect = (date: Date | undefined, isReturn = false) => {
    if (date) {
      if (isReturn) {
        setReturnDate(date)
        setIsReturnDatePickerOpen(false)
      } else {
        setDepartureDate(date)
        setIsDatePickerOpen(false)
      }
    }
  }

  const handleApply = () => {
    // Here you can add any logic you want to execute when applying
    // For now, we'll just close the popover
    const popoverTrigger = document.querySelector('[data-state="open"]') as HTMLElement
    if (popoverTrigger) {
      popoverTrigger.click()
    }
  }

  const handleSearch = () => {
    const searchParams = new URLSearchParams({
      tripType,
      from,
      to,
      departureDate: departureDate.toISOString(),
      returnDate: returnDate ? returnDate.toISOString() : "",
      adults: travelers.adults.toString(),
      children: travelers.children.toString(),
      infants: travelers.infants.toString(),
      travelClass,
      specialFare,
    })
    router.push(`/flight-search?${searchParams.toString()}`)
  }

  return (
    <main className="min-h-screen bg-white">
      <Header />

      <div className="max-w-[1200px] mx-auto px-6">
        <NavigationMenu />

        <Card className="mt-6 bg-white rounded-xl overflow-hidden shadow-lg">
          <div className="p-8 bg-[url('/flight-in-air.jpg')] bg-cover bg-center bg-opacity-10 relative">
            <div className="relative z-10">
              {/* Trip Type Selection */}
              <div className="flex items-center justify-between mb-6">
                <RadioGroup defaultValue={tripType} onValueChange={setTripType} className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="one-way" id="one-way" className="text-red-600" />
                    <Label htmlFor="one-way" className="text-sm">
                      One Way
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="round-trip" id="round-trip" className="text-red-600" />
                    <Label htmlFor="round-trip" className="text-sm">
                      Round Trip
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="multi-city" id="multi-city" className="text-red-600" />
                    <Label htmlFor="multi-city" className="text-sm">
                      Multi City
                    </Label>
                  </div>
                </RadioGroup>
                <span className="text-sm text-gray-600">Book International and Domestic Flights</span>
              </div>

              {/* Flight Search Form */}
              <div className="flex items-center justify-between w-full gap-1 mb-8">
                {/* From */}
                <div className="flex-1 border rounded-lg p-2 cursor-pointer hover:border-red-500">
                  <Label className="text-xs text-gray-500">From</Label>
                  <div className="text-lg font-bold">{from}</div>
                  <div className="text-xs text-gray-500">JAI, Jaipur Airport India</div>
                </div>
                {/* Swap Button */}
                <div className="flex items-center justify-center flex-shrink-0">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full w-10 h-10 text-red-500 hover:bg-red-50"
                    onClick={handleSwapLocations}
                  >
                    <SwapHorizontal className="w-6 h-6" />
                  </Button>
                </div>
                {/* To */}
                <div className="flex-1 border rounded-lg p-2 cursor-pointer hover:border-red-500">
                  <Label className="text-xs text-gray-500">To</Label>
                  <div className="text-lg font-bold">{to}</div>
                  <div className="text-xs text-gray-500 truncate">BOM, Chhatrapati Shivaji International Airport</div>
                </div>
                {/* Departure */}
                <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
                  <PopoverTrigger asChild>
                    <div className="flex-1 border rounded-lg p-2 cursor-pointer hover:border-red-500">
                      <Label className="text-xs text-gray-500">Departure</Label>
                      <div className="text-lg font-bold">{format(departureDate, "dd/MM/yyyy")}</div>
                      <div className="text-xs text-gray-500">{format(departureDate, "EEEE")}</div>
                    </div>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={departureDate}
                      onSelect={(date) => handleDateSelect(date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                {/* Return (only for round trip) */}
                <Popover open={isReturnDatePickerOpen} onOpenChange={setIsReturnDatePickerOpen}>
                  <PopoverTrigger asChild>
                    <div
                      className={cn(
                        "flex-1 border rounded-lg p-2 cursor-pointer hover:border-red-500",
                        tripType === "round-trip" ? "" : "opacity-50 pointer-events-none",
                      )}
                    >
                      <Label className="text-xs text-gray-500">Return</Label>
                      <div className="text-lg font-bold">
                        {returnDate ? format(returnDate, "dd/MM/yyyy") : "Select"}
                      </div>
                      <div className="text-xs text-gray-500">{returnDate ? format(returnDate, "EEEE") : "Date"}</div>
                    </div>
                  </PopoverTrigger>
                  {tripType === "round-trip" && (
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={returnDate}
                        onSelect={(date) => handleDateSelect(date, true)}
                        initialFocus
                      />
                    </PopoverContent>
                  )}
                </Popover>
                {/* Travelers & Class */}
                <Popover>
                  <PopoverTrigger asChild>
                    <div className="flex-1 border rounded-lg p-2 cursor-pointer hover:border-red-500">
                      <Label className="text-xs text-gray-500">Travellers & Class</Label>
                      <div className="text-lg font-bold">
                        {travelers.adults + travelers.children + travelers.infants}
                      </div>
                      <div className="text-xs text-gray-500">{travelClass}</div>
                    </div>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-[500px] p-3 max-h-[80vh] overflow-y-auto"
                    align="start"
                    side="bottom"
                    alignOffset={-150}
                  >
                    <div className="space-y-3 text-xs">
                      {/* Adults */}
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <div>
                            <h3 className="font-semibold text-sm mb-1">ADULTS (12y +)</h3>
                            <p className="text-[10px] text-gray-500">on the day of travel</p>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9, ">9"].map((num) => (
                            <Button
                              key={num}
                              variant="outline"
                              className={cn(
                                "h-6 w-6 text-[10px]",
                                travelers.adults === (num === ">9" ? 10 : Number(num))
                                  ? "bg-red-600 text-white hover:bg-red-600 hover:text-white"
                                  : "",
                              )}
                              onClick={() =>
                                setTravelers((prev) => ({ ...prev, adults: num === ">9" ? 10 : Number(num) }))
                              }
                            >
                              {num}
                            </Button>
                          ))}
                        </div>
                      </div>

                      {/* Children and Infants */}
                      <div className="flex gap-4">
                        <div className="flex-1">
                          <div className="flex justify-between items-center mb-2">
                            <div>
                              <h3 className="font-semibold text-sm mb-1">CHILDREN (2y - 12y)</h3>
                              <p className="text-[10px] text-gray-500">on the day of travel</p>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {[0, 1, 2, 3, 4, 5, 6, ">6"].map((num) => (
                              <Button
                                key={num}
                                variant="outline"
                                className={cn(
                                  "h-6 w-6 text-[10px]",
                                  travelers.children === (num === ">6" ? 7 : Number(num))
                                    ? "bg-red-600 text-white hover:bg-red-600 hover:text-white"
                                    : "",
                                )}
                                onClick={() =>
                                  setTravelers((prev) => ({ ...prev, children: num === ">6" ? 7 : Number(num) }))
                                }
                              >
                                {num}
                              </Button>
                            ))}
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-center mb-2">
                            <div>
                              <h3 className="font-semibold text-sm mb-1">INFANTS (below 2y)</h3>
                              <p className="text-[10px] text-gray-500">on the day of travel</p>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {[0, 1, 2, 3, 4, 5, 6, ">6"].map((num) => (
                              <Button
                                key={num}
                                variant="outline"
                                className={cn(
                                  "h-6 w-6 text-[10px]",
                                  travelers.infants === (num === ">6" ? 7 : Number(num))
                                    ? "bg-red-600 text-white hover:bg-red-600 hover:text-white"
                                    : "",
                                )}
                                onClick={() =>
                                  setTravelers((prev) => ({ ...prev, infants: num === ">6" ? 7 : Number(num) }))
                                }
                              >
                                {num}
                              </Button>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Travel Class */}
                      <div>
                        <h3 className="font-semibold text-sm mb-1">CHOOSE TRAVEL CLASS</h3>
                        <div className="flex gap-2 flex-wrap">
                          {travelClasses.map((className) => (
                            <Button
                              key={className}
                              variant="outline"
                              className={cn(
                                "h-8 text-[10px]",
                                travelClass === className
                                  ? "bg-red-600 text-white hover:bg-red-600 hover:text-white"
                                  : "",
                              )}
                              onClick={() => setTravelClass(className)}
                            >
                              {className}
                            </Button>
                          ))}
                        </div>
                      </div>

                      {/* Apply Button */}
                      <Button
                        className="w-full bg-red-600 hover:bg-red-700 text-white text-xs py-1"
                        onClick={handleApply}
                      >
                        APPLY
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>

              {/* Special Fares */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-sm font-medium">Select a special fare</span>
                  <span className="bg-red-100 text-red-700 text-[10px] font-medium px-2 py-0.5 rounded">
                    EXTRA SAVINGS
                  </span>
                </div>
                <RadioGroup value={specialFare} onValueChange={setSpecialFare} className="grid grid-cols-5 gap-3">
                  {[
                    { value: "regular", label: "Regular", desc: "Regular fares" },
                    { value: "student", label: "Student", desc: "Extra discounts/baggage" },
                    { value: "senior", label: "Senior Citizen", desc: "Up to ₹ 600 off" },
                    { value: "armed", label: "Armed Forces", desc: "Up to ₹ 600 off" },
                    { value: "doctor", label: "Doctor and Nurses", desc: "Up to ₹ 600 off" },
                  ].map((fare) => (
                    <div key={fare.value} className="relative">
                      <RadioGroupItem value={fare.value} id={fare.value} className="peer hidden" />
                      <Label
                        htmlFor={fare.value}
                        className="flex flex-col border rounded-lg p-3 peer-checked:border-red-500 peer-checked:bg-red-50 cursor-pointer hover:border-red-500"
                      >
                        <span className="font-medium text-sm">{fare.label}</span>
                        <span className="text-xs text-gray-500">{fare.desc}</span>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              {/* Search Button */}
              <div className="flex justify-center">
                <Button
                  className="bg-red-600 hover:bg-red-700 text-white px-16 py-6 text-xl font-semibold rounded-full"
                  onClick={handleSearch}
                >
                  SEARCH
                </Button>
              </div>
            </div>
          </div>
        </Card>

        <ExploreMore />
        <Offers />
        <FeaturedTours />
        <TopRatedHotels />
        <FlightOfferDeals />
      </div>
      <Footer />
    </main>
  )
}

