"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { NavigationMenu } from "../components/navigation-menu"
import { Header } from "../components/header"
import { Footer } from "../components/footer"
import { ChevronDown, Search, MapPin, CalendarIcon, Users } from "lucide-react"
import Link from "next/link"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

export default function HotelsPage() {
  const [checkIn, setCheckIn] = useState<Date>()
  const [checkOut, setCheckOut] = useState<Date>()
  const [guests, setGuests] = useState({ rooms: 1, adults: 2, children: 0 })
  const [isCheckInOpen, setIsCheckInOpen] = useState(false)
  const [isCheckOutOpen, setIsCheckOutOpen] = useState(false)
  const [isGuestsOpen, setIsGuestsOpen] = useState(false)

  return (
    <main className="min-h-screen bg-white">
      <Header />
      <div className="max-w-[1200px] mx-auto px-6">
        <NavigationMenu />

        <Card className="my-12 bg-white rounded-xl overflow-hidden shadow-lg">
          <div className="p-8 bg-[url('/hotel-background.jpg')] bg-cover bg-center bg-opacity-10 relative">
            <div className="relative z-10">
              {/* Room Type Selection */}
              <div className="flex items-center justify-between mb-6">
                <RadioGroup defaultValue="rooms" className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="rooms" id="rooms" className="text-red-600" />
                    <Label htmlFor="rooms" className="text-sm whitespace-nowrap">
                      Upto 4 Rooms
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="group" id="group" className="text-red-600" />
                    <Label htmlFor="group" className="text-sm flex items-center gap-1">
                      Group Deals
                      <span className="bg-pink-100 text-pink-600 text-[10px] px-1 rounded">new</span>
                    </Label>
                  </div>
                </RadioGroup>
                <span className="text-sm text-blue-600 hover:underline cursor-pointer">
                  Book Domestic and International Hotels Online
                </span>
              </div>

              {/* Hotel Search Form */}
              <div className="grid grid-cols-[2fr,1fr,1fr,1fr] gap-2 mb-8">
                {/* City/Hotel */}
                <div className="border rounded-lg p-3 cursor-pointer hover:border-red-500 bg-white">
                  <Label className="text-xs text-gray-500">CITY, PROPERTY NAME OR LOCATION</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <MapPin className="w-5 h-5 text-red-500" />
                    <Input className="border-0 p-0 text-lg font-semibold focus-visible:ring-0" placeholder="Goa" />
                  </div>
                </div>

                {/* Check-in */}
                <Popover open={isCheckInOpen} onOpenChange={setIsCheckInOpen}>
                  <PopoverTrigger asChild>
                    <div className="border rounded-lg p-3 cursor-pointer hover:border-red-500 bg-white">
                      <Label className="text-xs text-gray-500">CHECK-IN</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <CalendarIcon className="w-5 h-5 text-red-500" />
                        <div className="text-lg font-semibold">
                          {checkIn ? format(checkIn, "dd MMM yy") : "Select Date"}
                        </div>
                      </div>
                    </div>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={checkIn}
                      onSelect={(date) => {
                        setCheckIn(date)
                        setIsCheckInOpen(false)
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>

                {/* Check-out */}
                <Popover open={isCheckOutOpen} onOpenChange={setIsCheckOutOpen}>
                  <PopoverTrigger asChild>
                    <div className="border rounded-lg p-3 cursor-pointer hover:border-red-500 bg-white">
                      <Label className="text-xs text-gray-500">CHECK-OUT</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <CalendarIcon className="w-5 h-5 text-red-500" />
                        <div className="text-lg font-semibold">
                          {checkOut ? format(checkOut, "dd MMM yy") : "Select Date"}
                        </div>
                      </div>
                    </div>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={checkOut}
                      onSelect={(date) => {
                        setCheckOut(date)
                        setIsCheckOutOpen(false)
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>

                {/* Rooms & Guests */}
                <Popover open={isGuestsOpen} onOpenChange={setIsGuestsOpen}>
                  <PopoverTrigger asChild>
                    <div className="border rounded-lg p-3 cursor-pointer hover:border-red-500 bg-white">
                      <Label className="text-xs text-gray-500">ROOMS & GUESTS</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Users className="w-5 h-5 text-red-500" />
                        <div className="text-lg font-semibold">
                          {guests.rooms} Room, {guests.adults + guests.children} Guests
                        </div>
                      </div>
                    </div>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 p-4" align="start">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span>Rooms</span>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setGuests((prev) => ({ ...prev, rooms: Math.max(1, prev.rooms - 1) }))}
                          >
                            -
                          </Button>
                          <span>{guests.rooms}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setGuests((prev) => ({ ...prev, rooms: prev.rooms + 1 }))}
                          >
                            +
                          </Button>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Adults</span>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setGuests((prev) => ({ ...prev, adults: Math.max(1, prev.adults - 1) }))}
                          >
                            -
                          </Button>
                          <span>{guests.adults}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setGuests((prev) => ({ ...prev, adults: prev.adults + 1 }))}
                          >
                            +
                          </Button>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Children</span>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setGuests((prev) => ({ ...prev, children: Math.max(0, prev.children - 1) }))}
                          >
                            -
                          </Button>
                          <span>{guests.children}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setGuests((prev) => ({ ...prev, children: prev.children + 1 }))}
                          >
                            +
                          </Button>
                        </div>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>

              {/* Price Range */}
              <div className="mb-8">
                <Label className="text-sm font-medium mb-2 block">Price Per Night</Label>
                <div className="flex items-center gap-2">
                  <Button variant="outline" className="text-sm bg-white">
                    ₹0-₹1500
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                  <Button variant="outline" className="text-sm bg-white">
                    ₹1500-₹2500
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                  <Button variant="outline" className="text-sm bg-white">
                    ₹2500+
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Search Button */}
              <div className="flex justify-center">
                <Link href="/hotels/search">
                  <Button className="bg-red-600 hover:bg-red-700 text-white px-16 py-6 text-xl font-semibold rounded-full">
                    SEARCH
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </Card>
      </div>
      <Footer />
    </main>
  )
}

