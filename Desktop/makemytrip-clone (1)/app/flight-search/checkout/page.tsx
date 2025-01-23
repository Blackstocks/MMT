"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronDown, ChevronUp, CreditCard, Lock, Plane, Plus, Trash2 } from "lucide-react"
import Image from "next/image"

// Razorpay types
declare global {
  interface Window {
    Razorpay: any
  }
}

export default function CheckoutPage() {
  const [selectedFare, setSelectedFare] = useState("basic")
  const [travellers, setTravellers] = useState([{ type: "ADULT", isOpen: true }])
  const [totalAmount, setTotalAmount] = useState(8375) // Example amount in paise

  const addTraveller = () => {
    setTravellers([...travellers, { type: "ADULT", isOpen: true }])
  }

  const toggleTraveller = (index: number) => {
    setTravellers(travellers.map((t, i) => (i === index ? { ...t, isOpen: !t.isOpen } : t)))
  }

  useEffect(() => {
    const script = document.createElement("script")
    script.src = "https://checkout.razorpay.com/v1/checkout.js"
    script.async = true
    document.body.appendChild(script)
  }, [])

  const handlePayment = () => {
    const options = {
      key: "rzp_test_H6ucy17am6kIdB", // Updated Razorpay test API key
      amount: totalAmount,
      currency: "INR",
      name: "MakeMyTrip Clone",
      description: "Flight Booking Payment",
      image: "/logo.png", // Replace with your logo
      handler: (response: any) => {
        alert("Payment successful. Payment ID: " + response.razorpay_payment_id)
        // Handle successful payment here (e.g., update order status, redirect to confirmation page)
      },
      prefill: {
        name: "John Doe",
        email: "john@example.com",
        contact: "9876543210",
      },
      theme: {
        color: "#F37254",
      },
    }

    const razorpayInstance = new window.Razorpay(options)
    razorpayInstance.open()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#041628] text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            <h1 className="text-2xl font-bold">Complete your booking</h1>
            <div className="flex items-center gap-8 text-sm">
              <span>Flights Summary</span>
              <span>Travel Insurance</span>
              <span className="text-red-500">Traveller Details</span>
              <span>Seats & Meals</span>
              <span>Add-ons</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Main Content */}
          <div className="flex-1 space-y-6">
            {/* Flight Summary Card */}
            <Card className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-4 mb-2">
                    <h2 className="text-xl font-bold">Jaipur → Mumbai</h2>
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                      CANCELLATION FEES APPLY
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">Thursday, Jan 23 | Non Stop · 1h 40m</div>
                </div>
                <Button variant="link" className="text-blue-600">
                  View Fare Rules
                </Button>
              </div>

              <div className="flex items-center gap-4 mb-4">
                <Image src="/placeholder.svg" alt="IndiGo" width={40} height={40} className="w-10 h-10" />
                <div>
                  <div className="font-semibold">IndiGo 6E 5282</div>
                  <span className="text-sm text-gray-600">Airbus A320</span>
                </div>
                <div className="ml-auto">
                  <span className="text-sm font-medium">Economy {">"} SAVER</span>
                </div>
              </div>

              <div className="flex items-center gap-16 mb-6">
                <div>
                  <div className="text-2xl font-bold">06:10</div>
                  <div className="text-sm text-gray-600">Jaipur Airport, Terminal T2</div>
                </div>
                <div className="flex-1 border-t border-dashed relative">
                  <span className="absolute top-0 left-1/2 -translate-y-1/2 bg-white text-sm text-gray-600">
                    1h 40m
                  </span>
                </div>
                <div>
                  <div className="text-2xl font-bold">07:50</div>
                  <div className="text-sm text-gray-600">Chhatrapati Shivaji International Airport, Terminal T1</div>
                </div>
              </div>

              <div className="flex gap-8 text-sm text-gray-600">
                <div>
                  <Label>Cabin Baggage:</Label>
                  <div>7 Kgs (1 piece only) / Adult</div>
                </div>
                <div>
                  <Label>Check-In Baggage:</Label>
                  <div>15 Kgs (1 piece only) / Adult</div>
                </div>
              </div>
            </Card>

            {/* Traveller Details */}
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-6">Traveller Details</h2>

              {travellers.map((traveller, index) => (
                <div key={index} className="mb-6 border-b pb-6">
                  <div
                    className="flex items-center justify-between mb-4 cursor-pointer"
                    onClick={() => toggleTraveller(index)}
                  >
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => toggleTraveller(index)}>
                      <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                        {index + 1}
                      </span>
                      <span className="font-medium">
                        {traveller.type} {index + 1}
                      </span>
                      <span className="text-gray-600">{traveller.isOpen ? <ChevronUp /> : <ChevronDown />}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        setTravellers(travellers.filter((_, i) => i !== index))
                      }}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Remove
                    </Button>
                  </div>

                  {traveller.isOpen && (
                    <>
                      <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg mb-4">
                        <p className="text-sm">
                          Important: Enter name as mentioned on your passport or Government approved IDs.
                        </p>
                      </div>

                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor={`firstName-${index}`}>First Name & Middle Name (if any)</Label>
                            <Input id={`firstName-${index}`} placeholder="Enter first name" />
                          </div>
                          <div>
                            <Label htmlFor={`lastName-${index}`}>Last Name</Label>
                            <Input id={`lastName-${index}`} placeholder="Enter last name" />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor={`gender-${index}`}>Gender</Label>
                            <Select>
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
                          <div>
                            <Label htmlFor={`dob-${index}`}>Date of Birth</Label>
                            <Input id={`dob-${index}`} type="date" />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor={`nationality-${index}`}>Nationality</Label>
                          <Input id={`nationality-${index}`} placeholder="Enter nationality" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor={`passportNumber-${index}`}>
                              Passport Number (for international flights)
                            </Label>
                            <Input id={`passportNumber-${index}`} placeholder="Enter passport number" />
                          </div>
                          <div>
                            <Label htmlFor={`passportExpiry-${index}`}>Passport Expiry Date</Label>
                            <Input id={`passportExpiry-${index}`} type="date" />
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ))}

              <Button
                variant="outline"
                className="w-full flex items-center justify-center gap-2"
                onClick={addTraveller}
              >
                <Plus className="w-4 h-4" /> Add Traveller
              </Button>

              <div className="mt-6">
                <Checkbox id="save-travellers" className="mb-2" />
                <label htmlFor="save-travellers" className="text-sm ml-2">
                  Add this traveller to My Traveller List. You won't have to fill traveller info on your next visit.
                </label>
              </div>
            </Card>

            {/* Ticket Details */}
            <Card className="p-6 mt-6">
              <h2 className="text-xl font-bold mb-6">Ticket Details</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="countryCode">Country Code</Label>
                    <Select defaultValue="91">
                      <SelectTrigger id="countryCode">
                        <SelectValue placeholder="Select country code" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="91">India (+91)</SelectItem>
                        <SelectItem value="1">USA (+1)</SelectItem>
                        <SelectItem value="44">UK (+44)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                    <Input id="phoneNumber" type="tel" placeholder="Enter phone number" />
                  </div>
                  <div>
                    <Label htmlFor="email">Email ID</Label>
                    <Input id="email" type="email" placeholder="Enter email address" />
                  </div>
                </div>
              </div>
            </Card>

            {/* Fare Selection */}
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-6">Get more benefits by upgrading your fare</h2>
              <div className="grid grid-cols-3 gap-4">
                {[
                  {
                    type: "Your Selection",
                    price: "₹ 8,375",
                    features: [
                      { text: "Date Change fee starts at ₹ 2,999 up to 4 hrs before departure", included: false },
                      { text: "Seats Chargeable", included: false },
                      { text: "Priority Check-in not included", included: false },
                      { text: "Cabin bag 7 Kgs + Check-in 15 Kgs", included: true },
                    ],
                  },
                  {
                    type: "MMT Regular",
                    price: "₹ 8,674",
                    features: [
                      { text: "Free date change upto 4 hours before departure", included: true },
                      { text: "Seats worth ₹ 200 included", included: true },
                      { text: "Priority Check-in not included", included: false },
                      { text: "Cabin bag 7 Kgs + Check-in 15 Kgs", included: true },
                    ],
                    tag: "HSBCFREESEAT COUPON APPLICABLE",
                  },
                  {
                    type: "MMT Premium",
                    price: "₹ 9,099",
                    features: [
                      { text: "Free date change upto 4 hours before departure", included: true },
                      { text: "Seats worth ₹ 200 included", included: true },
                      { text: "Priority Check-in worth ₹ 425 included", included: true },
                      { text: "Cabin bag 7 Kgs + Check-in 15 Kgs", included: true },
                    ],
                    tag: "HSBCFREESEAT COUPON APPLICABLE",
                  },
                ].map((fare, index) => (
                  <div
                    key={index}
                    className={`border rounded-lg p-4 cursor-pointer ${
                      selectedFare === fare.type.toLowerCase().replace(" ", "-")
                        ? "border-blue-600 bg-blue-50"
                        : "hover:border-blue-600"
                    }`}
                    onClick={() => setSelectedFare(fare.type.toLowerCase().replace(" ", "-"))}
                  >
                    <RadioGroup value={selectedFare} className="mb-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <RadioGroupItem
                            value={fare.type.toLowerCase().replace(" ", "-")}
                            id={fare.type.toLowerCase().replace(" ", "-")}
                          />
                          <Label htmlFor={fare.type.toLowerCase().replace(" ", "-")}>{fare.type}</Label>
                        </div>
                        <span className="font-bold">{fare.price}</span>
                      </div>
                    </RadioGroup>

                    <div className="space-y-2">
                      {fare.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-start gap-2">
                          {feature.included ? (
                            <span className="text-green-600">✓</span>
                          ) : (
                            <span className="text-gray-400">−</span>
                          )}
                          <span className="text-sm">{feature.text}</span>
                        </div>
                      ))}
                    </div>

                    {fare.tag && <div className="mt-4 text-xs text-green-600 bg-green-50 p-2 rounded">{fare.tag}</div>}
                  </div>
                ))}
              </div>
            </Card>

            {/* Checkout Summary */}
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-6">Checkout Summary</h2>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Base Fare</span>
                  <span>₹ 6,747</span>
                </div>
                <div className="flex justify-between">
                  <span>Taxes and Surcharges</span>
                  <span>₹ 1,628</span>
                </div>
                <div className="border-t pt-4 flex justify-between font-bold">
                  <span>Total Amount</span>
                  <span>₹ {totalAmount / 100}</span>
                </div>
              </div>
              <Button className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white" onClick={handlePayment}>
                Proceed to Payment
              </Button>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="w-80">
            <Card className="p-6 sticky top-6">
              <h2 className="text-xl font-bold mb-6">Fare Summary</h2>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Base Fare</span>
                  <span>₹ 6,747</span>
                </div>
                <div className="flex justify-between">
                  <span>Taxes and Surcharges</span>
                  <span>₹ 1,628</span>
                </div>
                <div className="border-t pt-4 flex justify-between font-bold">
                  <span>Total Amount</span>
                  <span>₹ {totalAmount / 100}</span>
                </div>
              </div>

              <div className="mt-6">
                <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white p-4 rounded-t-lg flex items-center justify-between">
                  <span className="font-bold">PROMO CODES</span>
                  <Image src="/placeholder.svg" alt="Gift" width={24} height={24} className="w-6 h-6" />
                </div>
                <div className="border border-t-0 rounded-b-lg p-4">
                  <Input placeholder="Enter promo code here" className="mb-4" />
                  {[
                    {
                      code: "MMTSECURE",
                      description:
                        "Get an instant discount of ₹ 244 on your flight booking and Trip Secure with this coupon!",
                    },
                    {
                      code: "SPECIALUPI",
                      description: "Use this code and get ₹ 290 instant discount on payments via UPI only.",
                    },
                    {
                      code: "MMTAXISEMI",
                      description: "Use this coupon and get ₹ 837 instant discount on your flight booking.",
                    },
                  ].map((promo, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 border rounded-lg mb-2">
                      <RadioGroup value="selected-promo">
                        <RadioGroupItem value={promo.code} id={promo.code} />
                      </RadioGroup>
                      <div>
                        <div className="font-medium">{promo.code}</div>
                        <p className="text-sm text-gray-600">{promo.description}</p>
                        <Button variant="link" className="text-blue-600 p-0 h-auto text-sm">
                          Terms & Conditions
                        </Button>
                      </div>
                      <CreditCard className="w-5 h-5 ml-auto flex-shrink-0" />
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

