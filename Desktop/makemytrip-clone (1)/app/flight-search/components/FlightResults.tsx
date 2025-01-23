import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { ChevronLeft, ChevronRight, Clock, Plane, Users } from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"

// Dummy data for flights
const dummyFlights = Array(25)
  .fill(null)
  .map((_, index) => ({
    id: index + 1,
    airline: ["IndiGo", "Air India", "SpiceJet", "Vistara", "GoAir"][Math.floor(Math.random() * 5)],
    flightNumber: `${["6E", "AI", "SG", "UK", "G8"][Math.floor(Math.random() * 5)]} ${1000 + index}`,
    departureTime: `${String(Math.floor(Math.random() * 24)).padStart(2, "0")}:${String(Math.floor(Math.random() * 60)).padStart(2, "0")}`,
    arrivalTime: `${String(Math.floor(Math.random() * 24)).padStart(2, "0")}:${String(Math.floor(Math.random() * 60)).padStart(2, "0")}`,
    duration: `${Math.floor(Math.random() * 5) + 1}h ${Math.floor(Math.random() * 60)}m`,
    price: Math.floor(Math.random() * 10000) + 2000,
    type: Math.random() > 0.3 ? "Non stop" : "1 stop",
    onTime: `${90 + Math.floor(Math.random() * 10)}%`,
    meal: Math.random() > 0.5,
    logo: "/placeholder.svg",
    seats: Math.floor(Math.random() * 30) + 1,
    baggage: "15 kg",
    handBaggage: "7 kg",
    cancellationFee: `₹ ${3000 + Math.floor(Math.random() * 1500)}`,
    offers: [
      "Use code MMTSUPER for extra ₹ 200 off",
      "Get up to ₹ 500 cashback with MakeMyTrip wallet",
      "Get up to ₹ 1000 off with HDFC Bank credit card",
    ].slice(0, Math.floor(Math.random() * 3) + 1),
  }))

export default function FlightResults({ selectedFrom, selectedTo, dates, filters, setFilters }) {
  const router = useRouter()
  // Use the dummy data instead of filteredFlights
  const filteredFlights = dummyFlights

  return (
    <div className="flex-1">
      <h1 className="text-2xl font-bold mb-4">
        {filteredFlights.length} flights from {selectedFrom} to {selectedTo}
      </h1>

      {/* Date Navigation */}
      <div className="flex items-center gap-2 mb-6 bg-white p-4 rounded-lg overflow-x-auto">
        <Button variant="outline" size="icon" className="rounded-full flex-shrink-0">
          <ChevronLeft className="h-4 w-4" />
        </Button>
        {dates.map((date, index) => (
          <div
            key={index}
            className={cn(
              "px-4 py-2 text-center cursor-pointer rounded-lg flex-shrink-0",
              date.active && "bg-red-50 text-red-600",
            )}
          >
            <div className="text-sm whitespace-nowrap">{date.date}</div>
            <div className="font-semibold">{date.price}</div>
          </div>
        ))}
        <Button variant="outline" size="icon" className="rounded-full flex-shrink-0">
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Sort Options */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { id: "cheapest", label: "CHEAPEST", desc: "₹ 8,375 • 01h 40m" },
          { id: "fastest", label: "FASTEST", desc: "₹ 8,375 • 01h 40m" },
          { id: "earliest", label: "EARLIEST", desc: "₹ 8,683 • 02h 10m" },
          { id: "recommended", label: "RECOMMENDED", desc: "Best flights for you" },
        ].map((option) => (
          <Card
            key={option.id}
            className={cn(
              "p-4 cursor-pointer hover:border-red-600",
              filters.sortBy === option.id && "border-red-600 bg-red-50",
            )}
            onClick={() => setFilters((prev) => ({ ...prev, sortBy: option.id }))}
          >
            <div className="font-semibold">{option.label}</div>
            <div className="text-sm text-gray-600">{option.desc}</div>
          </Card>
        ))}
      </div>

      {/* Flight Results */}
      <div className="space-y-4">
        {filteredFlights.map((flight) => (
          <Card key={flight.id} className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <Image
                  src={flight.logo || "/placeholder.svg"}
                  alt={flight.airline}
                  width={40}
                  height={40}
                  className="w-10 h-10"
                />
                <div>
                  <div className="font-semibold text-lg">{flight.airline}</div>
                  <div className="text-sm text-gray-600">{flight.flightNumber}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">₹ {flight.price.toLocaleString()}</div>
                <div className="text-sm text-gray-600">per adult</div>
              </div>
            </div>

            <div className="flex items-center justify-between mb-6">
              <div className="text-center">
                <div className="text-xl font-semibold">{flight.departureTime}</div>
                <div className="text-sm text-gray-600">{selectedFrom.split(",")[0]}</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-sm font-medium text-gray-600">{flight.duration}</div>
                <div className="w-32 h-px bg-gray-300 my-2"></div>
                <div className="text-xs text-gray-500">{flight.type}</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-semibold">{flight.arrivalTime}</div>
                <div className="text-sm text-gray-600">{selectedTo.split(",")[0]}</div>
              </div>
            </div>

            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center space-x-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="w-4 h-4 mr-1" />
                  {flight.onTime} on time
                </div>
                {flight.meal && (
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="mr-1">🍽️</span> Free Meal
                  </div>
                )}
              </div>
              <Button
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2"
                onClick={() => router.push(`/flight-search/checkout`)}
              >
                BOOK FLIGHT
              </Button>
            </div>

            <div className="grid grid-cols-4 gap-4 text-sm border-t pt-4">
              <div>
                <Label className="text-gray-600 mb-1 block">Baggage</Label>
                <div className="font-medium flex items-center">
                  <Plane className="w-4 h-4 mr-1" /> Check-in: {flight.baggage}
                </div>
                <div className="font-medium flex items-center">
                  <Users className="w-4 h-4 mr-1" /> Cabin: {flight.handBaggage}
                </div>
              </div>
              <div>
                <Label className="text-gray-600 mb-1 block">Cancellation</Label>
                <div className="font-medium">Starting {flight.cancellationFee}</div>
              </div>
              <div>
                <Label className="text-gray-600 mb-1 block">Available Seats</Label>
                <div className="font-medium">{flight.seats} seats left</div>
              </div>
              <div>
                <Label className="text-gray-600 mb-1 block">Offers</Label>
                {flight.offers.map((offer, index) => (
                  <div key={index} className="text-red-600 flex items-center">
                    <span className="w-2 h-2 bg-red-600 rounded-full mr-2"></span>
                    {offer}
                  </div>
                ))}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

