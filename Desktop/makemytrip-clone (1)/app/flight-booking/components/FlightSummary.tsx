// app/flight-booking/components/FlightSummary.tsx
"use client";

import { format } from "date-fns";
import { Plane } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Flight } from "@/types/flight";

interface FlightSummaryProps {
  flight: Flight;
}

const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
};

export function FlightSummary({ flight }: FlightSummaryProps) {
  const segment = flight.Segments[0][0];
  const lastSegment = flight.Segments[0][flight.Segments[0].length - 1];

  return (
    <Card className="mb-6">
      <div className="p-6">
        <div className="flex justify-between">
          <div>
            <div className="text-xl font-bold">
              {segment.Origin.Airport.CityName} → {lastSegment.Destination.Airport.CityName}
            </div>
            <div className="text-sm text-gray-600">
              <span>{format(new Date(segment.Origin.DepTime), "EEEE, MMM d")}</span>
              <span className="mx-2">•</span>
              <span>
                {flight.Segments[0].length === 1 ? "Non Stop" : `${flight.Segments[0].length - 1} Stop(s)`} • 
                {formatDuration(segment.Duration)}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8">
              <img 
                src={`/airlines/${segment.Airline.AirlineCode.toLowerCase()}.png`}
                alt={segment.Airline.AirlineName}
                className="w-full"
                onError={(e) => {
                  e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='none' stroke='currentColor' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M15 12h5l-4 4m4-4l-4-4'/%3E%3C/svg%3E";
                }}
              />
            </div>
            <div>
              <div className="font-medium">{segment.Airline.AirlineName}</div>
              <div className="text-sm text-gray-500">
                {segment.Airline.AirlineCode} {segment.Airline.FlightNumber}
                <span className="ml-2 text-xs px-2 py-0.5 bg-gray-100 rounded">
                  Airbus A320
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Flight Times */}
        <div className="mt-4 flex justify-between items-center">
          <div>
            <div className="text-2xl font-semibold">
              {format(new Date(segment.Origin.DepTime), "HH:mm")}
            </div>
            <div>{segment.Origin.Airport.AirportName}</div>
            <div className="text-sm text-gray-500">
              Terminal {segment.Origin.Airport.Terminal || "-"}
            </div>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="text-sm text-gray-500">{formatDuration(segment.Duration)}</div>
            <div className="w-32 h-px bg-gray-300 my-2 relative">
              <Plane className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 text-gray-400" />
            </div>
            <div className="text-xs text-gray-500">
              {flight.Segments[0].length === 1 ? "Non Stop" : `${flight.Segments[0].length - 1} Stop(s)`}
            </div>
          </div>

          <div>
            <div className="text-2xl font-semibold">
              {format(new Date(lastSegment.Destination.ArrTime), "HH:mm")}
            </div>
            <div>{lastSegment.Destination.Airport.AirportName}</div>
            <div className="text-sm text-gray-500">
              Terminal {lastSegment.Destination.Airport.Terminal || "-"}
            </div>
          </div>
        </div>

        {/* Baggage Information */}
        <div className="mt-4 pt-4 border-t flex gap-8">
          <div>
            <div className="text-sm text-gray-500">Cabin Baggage</div>
            <div className="font-medium">{segment.CabinBaggage}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Check-in Baggage</div>
            <div className="font-medium">{segment.Baggage}</div>
          </div>
        </div>

        {/* Cancellation Info */}
        <div className="mt-4 pt-4 border-t flex justify-between items-center">
          <div className="text-sm text-green-600 font-medium">
            CANCELLATION FEES APPLY
          </div>
          <Button variant="link" className="text-blue-600 p-0 h-auto">
            View Fare Rules
          </Button>
        </div>
      </div>
    </Card>
  );
}