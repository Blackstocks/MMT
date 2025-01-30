"use client";

import React, { useEffect, useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Plane, Luggage, User } from "lucide-react";
import { useRouter } from 'next/navigation';

// Step 1: Selected Flight Details Component
const FlightDetails = ({ flight }: { flight: any }) => (
  <Card className="mb-4">
    <div className="border-l-4 border-emerald-500 p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-xl font-semibold">
            {flight?.Segments[0][0].Origin.Airport.CityName} → {flight?.Segments[0][0].Destination.Airport.CityName}
          </h2>
          <div className="flex items-center gap-2 mt-1">
            <span>Saturday, Feb 1</span>
            <span>Non Stop • {flight?.Segments[0][0].Duration}m</span>
          </div>
        </div>
        <div className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded text-sm">
          CANCELLATION FEES APPLY
        </div>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-900 rounded-lg flex items-center justify-center">
            <img 
              src={`/airlines/${flight?.Segments[0][0].Airline.AirlineCode.toLowerCase()}.png`}
              alt={flight?.Segments[0][0].Airline.AirlineName}
              className="w-8 h-8"
            />
          </div>
          <div>
            <div className="font-semibold">{flight?.Segments[0][0].Airline.AirlineName}</div>
            <div className="text-gray-600">
              {flight?.Segments[0][0].Airline.AirlineCode} {flight?.Segments[0][0].Airline.FlightNumber} • 
              {flight?.Segments[0][0].Craft}
            </div>
          </div>
        </div>
        <div>
          <span className="text-gray-700">Economy</span>
          <span className="text-teal-600 ml-2">SAVER</span>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-4">
        <div className="flex gap-8">
          <div className="flex items-center gap-2">
            <Luggage className="w-5 h-5 text-gray-600" />
            <span>Cabin Baggage: </span>
            <span className="font-medium">{flight?.Segments[0][0].CabinBaggage}</span>
          </div>
          <div className="flex items-center gap-2">
            <Luggage className="w-5 h-5 text-gray-600" />
            <span>Check-In Baggage: </span>
            <span className="font-medium">{flight?.Segments[0][0].Baggage}</span>
          </div>
        </div>
      </div>
    </div>
  </Card>
);

// Step 2: Fast Forward Service Component
const FastForwardService = () => (
  <Card className="mb-4">
    <div className="p-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
            IndiGo Fast Forward
            <span className="text-green-600 text-sm">
              Apply code: PRIORITYCHECKIN to get 250 OFF on Fast Forward
            </span>
          </h2>
          <p className="text-gray-600">
            A service that provides you a hassle free and comfortable check-in experience at the airport with our priority check-in counter.
          </p>
          <div className="flex items-center gap-3 mt-4 text-gray-700">
            <div className="flex items-center gap-1">
              <User className="w-4 h-4" />
              <span>Priority Check-in</span>
            </div>
            <span>+</span>
            <div className="flex items-center gap-1">
              <Plane className="w-4 h-4" />
              <span>Any Time Boarding</span>
            </div>
            <span>=</span>
            <span className="font-semibold">₹ 500</span>
          </div>
        </div>
        <Button variant="outline" className="text-blue-500">+ADD</Button>
      </div>
    </div>
  </Card>
);

// Step 3: Traveller Details Component
const TravellerDetails = () => {
  const [adultsAdded, setAdultsAdded] = useState(0);

  return (
    <Card className="mb-4">
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-6">Traveller Details</h2>

        <div className="mb-6">
          <div className="flex justify-between mb-2">
            <div className="font-medium flex items-center gap-2">
              <User className="w-5 h-5" />
              ADULT (12 yrs+)
            </div>
            <div className="text-gray-500">{adultsAdded}/1 added</div>
          </div>

          {adultsAdded === 0 && (
            <div className="text-gray-600 mb-3">
              You have not added any adults to the list
            </div>
          )}

          <Button 
            variant="outline" 
            className="text-blue-500"
            onClick={() => setAdultsAdded(prev => prev + 1)}
          >
            + ADD NEW ADULT
          </Button>
        </div>

        <div className="border-t pt-6">
          <h3 className="font-semibold mb-4">Booking details will be sent to</h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Country Code</label>
              <Input defaultValue="India(91)" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Mobile No</label>
              <Input placeholder="Mobile No" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Email</label>
              <Input type="email" />
            </div>
          </div>
        </div>

        <div className="mt-4">
          <label className="flex items-center gap-2">
            <Checkbox />
            <span>
              I have a GST number <span className="text-gray-500">(Optional)</span>
            </span>
          </label>
        </div>
      </div>
    </Card>
  );
};

// Main Booking Page Component
export default function BookingPage() {
  const [selectedFlight, setSelectedFlight] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    // Load flight details from localStorage
    const flight = localStorage.getItem('selectedFlight');
    if (flight) {
      setSelectedFlight(JSON.parse(flight));
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Step 1: Flight Details */}
        {selectedFlight && <FlightDetails flight={selectedFlight} />}

        {/* Step 2: Fast Forward Service */}
        <FastForwardService />

        {/* Step 3: Traveller Details */}
        <TravellerDetails />

        {/* Additional sections like cancellation policy will follow */}
      </div>
    </div>
  );
}