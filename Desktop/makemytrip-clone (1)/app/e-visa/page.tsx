"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { DatePicker } from "@/components/ui/date-picker"
import { Header } from "../components/header"
import { Footer } from "../components/footer"

const countries = [
  { name: "India", code: "IN" },
  { name: "United States", code: "US" },
  { name: "Australia", code: "AU" },
  { name: "United Arab Emirates", code: "AE" },
  { name: "Thailand", code: "TH" },
  { name: "Singapore", code: "SG" },
  { name: "Malaysia", code: "MY" },
  { name: "Sri Lanka", code: "LK" },
  { name: "Vietnam", code: "VN" },
  { name: "Turkey", code: "TR" },
]

export default function EVisa() {
  const [selectedCountry, setSelectedCountry] = useState("")
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    passportNumber: "",
    passportExpiryDate: "",
    email: "",
    phone: "",
    address: "",
    purpose: "",
    arrivalDate: "",
    departureDate: "",
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  const handleDateChange = (date, field) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: date,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("Form submitted:", { selectedCountry, ...formData })
    // Here you would typically send this data to your backend or API
    alert("E-visa application submitted successfully!")
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="container mx-auto py-10 px-4">
        <h1 className="text-3xl font-bold text-center mb-8">E-Visa Application</h1>
        <Card className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div>
              <Label htmlFor="country">Select Country for E-Visa</Label>
              <Select value={selectedCountry} onValueChange={(value) => setSelectedCountry(value)}>
                <SelectTrigger id="country">
                  <SelectValue placeholder="Select a country" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((country) => (
                    <SelectItem key={country.code} value={country.code}>
                      {country.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedCountry && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <DatePicker
                    id="dateOfBirth"
                    selected={formData.dateOfBirth}
                    onSelect={(date) => handleDateChange(date, "dateOfBirth")}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="passportNumber">Passport Number</Label>
                    <Input
                      id="passportNumber"
                      name="passportNumber"
                      value={formData.passportNumber}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="passportExpiryDate">Passport Expiry Date</Label>
                    <DatePicker
                      id="passportExpiryDate"
                      selected={formData.passportExpiryDate}
                      onSelect={(date) => handleDateChange(date, "passportExpiryDate")}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="purpose">Purpose of Visit</Label>
                  <Select
                    value={formData.purpose}
                    onValueChange={(value) => handleInputChange({ target: { name: "purpose", value } })}
                  >
                    <SelectTrigger id="purpose">
                      <SelectValue placeholder="Select purpose of visit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tourism">Tourism</SelectItem>
                      <SelectItem value="business">Business</SelectItem>
                      <SelectItem value="education">Education</SelectItem>
                      <SelectItem value="medical">Medical</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="arrivalDate">Arrival Date</Label>
                    <DatePicker
                      id="arrivalDate"
                      selected={formData.arrivalDate}
                      onSelect={(date) => handleDateChange(date, "arrivalDate")}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="departureDate">Departure Date</Label>
                    <DatePicker
                      id="departureDate"
                      selected={formData.departureDate}
                      onSelect={(date) => handleDateChange(date, "departureDate")}
                      required
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full">
                  Submit E-Visa Application
                </Button>
              </>
            )}
          </form>
        </Card>
      </main>
      <Footer />
    </div>
  )
}

