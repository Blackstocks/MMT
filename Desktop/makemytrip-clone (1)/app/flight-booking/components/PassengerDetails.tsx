// app/flight-booking/components/PassengerDetails.tsx
"use client";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PassengerDetail {
  title: string;
  firstName: string;
  lastName: string;
  email: string;
  countryCode: string;
  mobile: string;
}

interface PassengerDetailsProps {
  maxPassengers: number; // Get from URL params
  formData: {
    passengers: PassengerDetail[];
    state: string;
    saveTraveller: boolean;
    gstNumber: string;
  };
  onFormChange: (field: string, value: any) => void;
}

export function PassengerDetails({ maxPassengers, formData, onFormChange }: PassengerDetailsProps) {
  const handlePassengerChange = (index: number, field: keyof PassengerDetail, value: string) => {
    const updatedPassengers = [...formData.passengers];
    updatedPassengers[index] = {
      ...updatedPassengers[index],
      [field]: value
    };
    onFormChange("passengers", updatedPassengers);
  };

  const addPassenger = () => {
    if (formData.passengers.length >= maxPassengers) return;
    
    const newPassenger: PassengerDetail = {
      title: "Mr",
      firstName: "",
      lastName: "",
      email: "",
      countryCode: "+91",
      mobile: ""
    };
    
    onFormChange("passengers", [...formData.passengers, newPassenger]);
  };

  const removePassenger = (index: number) => {
    const updatedPassengers = formData.passengers.filter((_, i) => i !== index);
    onFormChange("passengers", updatedPassengers);
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold">ADULT (12 yrs+)</h3>
            <p className="text-sm text-gray-500">{formData.passengers.length}/{maxPassengers} added</p>
          </div>
          {formData.passengers.length < maxPassengers && (
            <Button 
              variant="ghost" 
              className="text-blue-600"
              onClick={addPassenger}
            >
              + ADD NEW ADULT
            </Button>
          )}
        </div>

        {formData.passengers.map((passenger, index) => (
          <div key={index} className="mb-8 border-b pb-6 last:border-b-0">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-medium">Passenger {index + 1}</h4>
              {index > 0 && (
                <Button 
                  variant="ghost" 
                  className="text-red-600 text-sm"
                  onClick={() => removePassenger(index)}
                >
                  Remove
                </Button>
              )}
            </div>

            <div className="grid gap-6">
              <div className="flex gap-4">
                <Select
                  value={passenger.title}
                  onValueChange={(value) => handlePassengerChange(index, "title", value)}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Title" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Mr">Mr</SelectItem>
                    <SelectItem value="Mrs">Mrs</SelectItem>
                    <SelectItem value="Ms">Ms</SelectItem>
                  </SelectContent>
                </Select>

                <Input
                  placeholder="First Name"
                  value={passenger.firstName}
                  onChange={(e) => handlePassengerChange(index, "firstName", e.target.value)}
                  className="flex-1"
                />

                <Input
                  placeholder="Last Name"
                  value={passenger.lastName}
                  onChange={(e) => handlePassengerChange(index, "lastName", e.target.value)}
                  className="flex-1"
                />
              </div>

              <div className="flex gap-4">
                <Select
                  value={passenger.countryCode}
                  onValueChange={(value) => handlePassengerChange(index, "countryCode", value)}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Code" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="+91">+91 (IN)</SelectItem>
                    <SelectItem value="+1">+1 (US)</SelectItem>
                    <SelectItem value="+44">+44 (UK)</SelectItem>
                  </SelectContent>
                </Select>

                <Input
                  placeholder="Mobile Number"
                  value={passenger.mobile}
                  onChange={(e) => handlePassengerChange(index, "mobile", e.target.value)}
                  className="flex-1"
                  type="tel"
                />

                <Input
                  placeholder="Email"
                  value={passenger.email}
                  onChange={(e) => handlePassengerChange(index, "email", e.target.value)}
                  className="flex-1"
                  type="email"
                />
              </div>
            </div>
          </div>
        ))}

        <div className="flex items-center gap-2">
          <Checkbox
            id="saveTraveller"
            checked={formData.saveTraveller}
            onCheckedChange={(checked) => 
              onFormChange("saveTraveller", checked === true)
            }
          />
          <Label htmlFor="saveTraveller" className="text-sm text-gray-600">
            Add these travellers to My Traveller List. You won't have to fill traveller info on your next visit.
          </Label>
        </div>
      </Card>

      {/* State Selection */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Your State</h3>
        <p className="text-sm text-gray-500 mb-4">
          Required for GST purpose on your tax invoice. You can edit this anytime later in your profile section.
        </p>
        <Select
          value={formData.state}
          onValueChange={(value) => onFormChange("state", value)}
        >
          <SelectTrigger className="w-full max-w-xs">
            <SelectValue placeholder="Select State" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="delhi">Delhi</SelectItem>
            <SelectItem value="maharashtra">Maharashtra</SelectItem>
            <SelectItem value="karnataka">Karnataka</SelectItem>
            {/* Add more states as needed */}
          </SelectContent>
        </Select>
      </Card>

      {/* GST Details */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Checkbox
            id="hasGST"
            checked={!!formData.gstNumber}
            onCheckedChange={(checked) => 
              onFormChange("gstNumber", checked ? "" : "")
            }
          />
          <Label htmlFor="hasGST">I have a GST number (Optional)</Label>
        </div>
        {formData.gstNumber !== "" && (
          <Input
            placeholder="Enter GST Number"
            value={formData.gstNumber}
            onChange={(e) => onFormChange("gstNumber", e.target.value)}
            className="max-w-md"
          />
        )}
      </Card>
    </div>
  );
}