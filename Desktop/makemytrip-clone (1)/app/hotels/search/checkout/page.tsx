"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Image from "next/image"
import { Header } from "@/app/components/header"
import { Footer } from "@/app/components/footer"
import { MapPin, Star, Check, Info, Utensils, Map } from "lucide-react"
import Link from "next/link"

// Razorpay types
declare global {
  interface Window {
    Razorpay: any
  }
}

interface Traveller {
  firstName: string
  lastName: string
  gender: string
}

interface TravellerDetails {
  travellers: Traveller[]
  email: string
  phone: string
  specialRequests?: string
}

export default function HotelCheckoutPage() {
  const [activeTab, setActiveTab] = useState("food")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [travellerDetails, setTravellerDetails] = useState<TravellerDetails>({
    travellers: [{ firstName: "", lastName: "", gender: "" }],
    email: "",
    phone: "",
    specialRequests: "",
  })

  useEffect(() => {
    const script = document.createElement("script")
    script.src = "https://checkout.razorpay.com/v1/checkout.js"
    script.async = true
    document.body.appendChild(script)
  }, [])

  const handlePayment = () => {
    const options = {
      key: "rzp_test_H6ucy17am6kIdB",
      amount: 1416000, // ₹14,160 (₹12,000 + ₹2,160 taxes) in paise
      currency: "INR",
      name: "Hilton Goa Resort",
      description: "Queen Superior Room Booking",
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-01-22%20at%2012.43.30%E2%80%AFPM-CVIcmj0ZUCBlXFMQzQkjUi3e24ix1G.png",
      handler: (response: any) => {
        alert("Payment successful! Payment ID: " + response.razorpay_payment_id)
        setIsDialogOpen(false)
      },
      prefill: {
        name: `${travellerDetails.travellers[0].firstName} ${travellerDetails.travellers[0].lastName}`,
        email: travellerDetails.email,
        contact: travellerDetails.phone,
      },
      theme: {
        color: "#ef4444",
      },
    }

    const razorpayInstance = new window.Razorpay(options)
    razorpayInstance.open()
  }

  const handleProceedToPayment = () => {
    // Basic validation
    if (
      !travellerDetails.travellers.every((t) => t.firstName && t.lastName && t.gender) ||
      !travellerDetails.email ||
      !travellerDetails.phone
    ) {
      alert("Please fill in all required fields for all travellers")
      return
    }
    handlePayment()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-1">
            <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
              Hilton Goa Resort, Candolim
              <div className="flex">
                {"★★★★★".split("").map((star, i) => (
                  <span key={i} className="text-yellow-400">
                    {star}
                  </span>
                ))}
              </div>
            </h1>

            {/* Image Gallery */}
            <div className="relative grid grid-cols-4 gap-4 mb-8">
              <div className="col-span-3 relative h-[400px] rounded-lg overflow-hidden">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-01-22%20at%2012.43.30%E2%80%AFPM-CVIcmj0ZUCBlXFMQzQkjUi3e24ix1G.png"
                  alt="Hilton Goa Resort"
                  fill
                  className="object-cover"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-white/90 px-3 py-1 rounded-full text-xs font-medium">MMT Luxe</span>
                </div>
                <div className="absolute bottom-4 left-4">
                  <span className="bg-black/50 text-white px-3 py-1 rounded-full text-sm">+182 Property Photos</span>
                </div>
              </div>
              <div className="relative h-[400px]">
                <div className="h-full relative rounded-lg overflow-hidden">
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-01-22%20at%2012.43.30%E2%80%AFPM-CVIcmj0ZUCBlXFMQzQkjUi3e24ix1G.png"
                    alt="Guest Photos"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute bottom-4 left-4">
                    <span className="bg-black/50 text-white px-3 py-1 rounded-full text-sm">+651 Guest Photos</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-2">Beautiful River-view Hilltop Resort Near Candolim Beach</h2>
              <p className="text-gray-600 mb-2">
                Witness the scenic beauty at Hilton Goa, a hilltop resort overlooking lush greenery and the Nerul River.{" "}
                <Button variant="link" className="text-blue-600 p-0 h-auto">
                  More
                </Button>
              </p>
            </div>

            {/* Navigation Tabs */}
            <Tabs defaultValue="food" className="mb-8">
              <TabsList>
                <TabsTrigger value="food" className="flex items-center gap-2">
                  <Utensils className="w-4 h-4" />
                  Food and Dining
                </TabsTrigger>
                <TabsTrigger value="location" className="flex items-center gap-2">
                  <Map className="w-4 h-4" />
                  Location & Surroundings
                </TabsTrigger>
              </TabsList>
            </Tabs>

            {/* Amenities */}
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4">Amenities</h2>
              <div className="flex gap-6 mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6">🏋️</span>
                  <span>Gym</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6">🏊</span>
                  <span>Swimming Pool</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6">🛁</span>
                  <span>Jacuzzi</span>
                </div>
                <Button variant="link" className="text-blue-600 p-0 h-auto">
                  + 108 Amenities
                </Button>
              </div>
            </div>

            {/* Luxury Features */}
            <div>
              <h2 className="text-xl font-bold mb-4">Discover the Best of Luxury</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  {
                    title: "Suites with Plunge Pool",
                    image:
                      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-01-22%20at%2012.43.30%E2%80%AFPM-CVIcmj0ZUCBlXFMQzQkjUi3e24ix1G.png",
                  },
                  {
                    title: "Multiple Outdoor Pools",
                    image:
                      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-01-22%20at%2012.43.30%E2%80%AFPM-CVIcmj0ZUCBlXFMQzQkjUi3e24ix1G.png",
                  },
                  {
                    title: "Dine with Views",
                    image:
                      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-01-22%20at%2012.43.30%E2%80%AFPM-CVIcmj0ZUCBlXFMQzQkjUi3e24ix1G.png",
                  },
                ].map((feature, index) => (
                  <Card key={index} className="p-4">
                    <div className="relative h-32 rounded-lg overflow-hidden mb-3">
                      <Image
                        src={feature.image || "/placeholder.svg"}
                        alt={feature.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <h3 className="font-medium text-center">{feature.title}</h3>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Booking Sidebar */}
          <div className="w-full lg:w-[400px]">
            <Card className="p-6">
              <div className="space-y-4">
                <h2 className="text-xl font-bold">Queen Superior Room Tropical view with Balcony</h2>
                <div className="space-y-2">
                  <p className="text-gray-600">Fits 2 Adults</p>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-red-600" />
                    <span>Free Breakfast</span>
                  </div>
                  <p className="text-red-600">Non-Refundable</p>
                </div>

                <div className="border-t pt-4">
                  <div className="text-gray-600 mb-2">Per Night:</div>
                  <div className="text-3xl font-bold">₹ 12,000</div>
                  <div className="text-gray-600">+ ₹ 2,160 taxes & fees</div>
                </div>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="w-full bg-red-500 hover:bg-red-600 text-lg py-6">BOOK THIS NOW</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Enter Traveller Details</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      {travellerDetails.travellers.map((traveller, index) => (
                        <Card key={index} className="p-4 space-y-4">
                          <div className="flex justify-between items-center">
                            <h3 className="font-semibold text-lg">Traveller {index + 1}</h3>
                            {index > 0 && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  const newTravellers = travellerDetails.travellers.filter((_, i) => i !== index)
                                  setTravellerDetails({ ...travellerDetails, travellers: newTravellers })
                                }}
                              >
                                Remove
                              </Button>
                            )}
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor={`firstName-${index}`}>First Name</Label>
                              <Input
                                id={`firstName-${index}`}
                                value={traveller.firstName}
                                onChange={(e) => {
                                  const newTravellers = [...travellerDetails.travellers]
                                  newTravellers[index].firstName = e.target.value
                                  setTravellerDetails({ ...travellerDetails, travellers: newTravellers })
                                }}
                              />
                            </div>
                            <div>
                              <Label htmlFor={`lastName-${index}`}>Last Name</Label>
                              <Input
                                id={`lastName-${index}`}
                                value={traveller.lastName}
                                onChange={(e) => {
                                  const newTravellers = [...travellerDetails.travellers]
                                  newTravellers[index].lastName = e.target.value
                                  setTravellerDetails({ ...travellerDetails, travellers: newTravellers })
                                }}
                              />
                            </div>
                          </div>
                          <div>
                            <Label htmlFor={`gender-${index}`}>Gender</Label>
                            <Select
                              value={traveller.gender}
                              onValueChange={(value) => {
                                const newTravellers = [...travellerDetails.travellers]
                                newTravellers[index].gender = value
                                setTravellerDetails({ ...travellerDetails, travellers: newTravellers })
                              }}
                            >
                              <SelectTrigger id={`gender-${index}`}>
                                <SelectValue placeholder="Select gender" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="male">Male</SelectItem>
                                <SelectItem value="female">Female</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </Card>
                      ))}
                      <Button
                        variant="outline"
                        onClick={() => {
                          setTravellerDetails({
                            ...travellerDetails,
                            travellers: [...travellerDetails.travellers, { firstName: "", lastName: "", gender: "" }],
                          })
                        }}
                      >
                        Add Traveller
                      </Button>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            value={travellerDetails.email}
                            onChange={(e) => setTravellerDetails({ ...travellerDetails, email: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input
                            id="phone"
                            type="tel"
                            value={travellerDetails.phone}
                            onChange={(e) => setTravellerDetails({ ...travellerDetails, phone: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="specialRequests">Special Requests (Optional)</Label>
                          <Input
                            id="specialRequests"
                            value={travellerDetails.specialRequests}
                            onChange={(e) =>
                              setTravellerDetails({ ...travellerDetails, specialRequests: e.target.value })
                            }
                          />
                        </div>
                      </div>
                    </div>
                    <Button className="w-full bg-red-500 hover:bg-red-600" onClick={handleProceedToPayment}>
                      Proceed to Payment
                    </Button>
                  </DialogContent>
                </Dialog>

                <Button variant="link" className="w-full text-red-600">
                  13 More Options
                </Button>

                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="bg-red-600 text-white text-2xl font-bold px-4 py-2 rounded">4.2</div>
                  <div>
                    <div className="font-bold">Very Good</div>
                    <div className="text-sm text-gray-600">
                      (935 ratings){" "}
                      <Link href="#" className="text-red-600">
                        All Reviews
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="relative w-20 h-20">
                    <Image
                      src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-01-22%20at%2012.43.30%E2%80%AFPM-CVIcmj0ZUCBlXFMQzQkjUi3e24ix1G.png"
                      alt="Map"
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>
                  <div>
                    <div className="font-bold">Candolim</div>
                    <Link href="#" className="text-red-600 text-sm">
                      See on Map
                    </Link>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

