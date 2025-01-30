"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plane, Clock, AlertCircle } from "lucide-react";
import type { Flight, FlightFilters, FlightSearchResponse } from "@/types/flight";
import { format } from "date-fns";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useRouter } from 'next/navigation';

interface FlightResultsProps {
  selectedFrom: string;
  selectedTo: string;
  dates: Array<{ date: string; price: string; active: boolean }>;
  filters: FlightFilters;
  setFilters: (filters: FlightFilters) => void;
  onErrorChange?: (error: string | null) => void;
}

const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
};

const getTimeOfDay = (dateString: string): string => {
  const hour = new Date(dateString).getHours();
  if (hour >= 6 && hour < 12) return "morning";
  if (hour >= 12 && hour < 18) return "afternoon";
  if (hour >= 18 && hour < 24) return "evening";
  return "night";
};

export default function FlightResults({
  selectedFrom,
  selectedTo,
  dates,
  filters,
  setFilters,
  onErrorChange,
}: FlightResultsProps) {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Handle booking function at component scope
  const handleBookNow = (flight: Flight) => {
    try {
      // Store all necessary details
      localStorage.setItem("selectedFlight", JSON.stringify(flight));
      localStorage.setItem(
        "bookingDetails",
        JSON.stringify({
          from: selectedFrom,
          to: selectedTo,
          travellerCount: 1, // Update based on your requirements
          class: flight.Segments[0][0].CabinClass,
        })
      );

      // Navigate to booking page
      router.push("/flight-booking");
    } catch (error) {
      console.error("Error handling booking:", error);
      if (onErrorChange) {
        onErrorChange("Failed to proceed with booking. Please try again.");
      }
    }
  };

  useEffect(() => {
    try {
      const results = localStorage.getItem("flightSearchResults");
      if (results) {
        const parsedResults = JSON.parse(results) as FlightSearchResponse;
        if (parsedResults?.Response?.Results?.[0]) {
          // Initialize price range based on actual prices
          const prices = parsedResults.Response.Results[0].map(
            (f) => f.Fare.PublishedFare
          );
          const minPrice = Math.min(...prices);
          const maxPrice = Math.max(...prices);
          setFilters({
            ...filters,
            priceRange: [minPrice, maxPrice],
          });

          // Sort by price initially
          const sortedFlights = parsedResults.Response.Results[0].sort(
            (a, b) => a.Fare.PublishedFare - b.Fare.PublishedFare
          );
          setFlights(sortedFlights);
        }
      }
    } catch (err) {
      setError("Failed to load flight results");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const filteredFlights = flights.filter((flight) => {
    // Price filter
    const price = flight.Fare.PublishedFare;
    if (price < filters.priceRange[0] || price > filters.priceRange[1]) {
      return false;
    }

    // Stops filter
    if (filters.stops.length > 0) {
      const stopCount = flight.Segments[0].length - 1;
      const stopType = stopCount === 0 ? "non-stop" : "one-stop";
      if (!filters.stops.includes(stopType)) {
        return false;
      }
    }

    // Airline filter
    if (filters.airlines.length > 0) {
      const airline = flight.Segments[0][0].Airline.AirlineName;
      if (!filters.airlines.includes(airline)) {
        return false;
      }
    }

    // Departure time filter
    if (filters.departureTime.length > 0) {
      const timeOfDay = getTimeOfDay(flight.Segments[0][0].Origin.DepTime);
      if (!filters.departureTime.includes(timeOfDay)) {
        return false;
      }
    }

    return true;
  });

  const sortedFlights = [...filteredFlights].sort((a, b) => {
    switch (filters.sortBy) {
      case "cheapest":
        return a.Fare.PublishedFare - b.Fare.PublishedFare;
      case "duration":
        const aDuration = a.Segments[0].reduce(
          (acc, seg) => acc + seg.Duration + (seg.GroundTime || 0),
          0
        );
        const bDuration = b.Segments[0].reduce(
          (acc, seg) => acc + seg.Duration + (seg.GroundTime || 0),
          0
        );
        return aDuration - bDuration;
      default:
        return 0;
    }
  });

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-red-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="flex-1">
      {/* Flight Count and Sort Options */}
      <Card className="p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            {sortedFlights.length} flights found
          </div>
          <div className="flex gap-4">
            {[
              { label: "Cheapest", value: "cheapest" },
              { label: "Shortest", value: "duration" },
            ].map((option) => (
              <Button
                key={option.value}
                variant={filters.sortBy === option.value ? "default" : "outline"}
                onClick={() => setFilters({ ...filters, sortBy: option.value })}
                className={
                  filters.sortBy === option.value
                    ? "bg-red-500 hover:bg-red-600"
                    : ""
                }
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>
      </Card>

      {/* Flight Results */}
      <div className="space-y-4">
        {sortedFlights.map((flight) => (
          <Card key={flight.ResultIndex} className="p-6">
            <div className="flex items-center justify-between">
              {/* Airline Info */}
              <div className="flex items-center gap-6">
                <div className="w-16">
                  {flight.Segments[0][0].Airline.AirlineCode ? (
                    <img
                      src={`/airlines/${flight.Segments[0][0].Airline.AirlineCode.toLowerCase()}.png`}
                      alt={flight.Segments[0][0].Airline.AirlineName}
                      className="w-full"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src =
                          "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M22 2L2 22'/%3E%3Cpath d='M5.45 5.11L2 22l10-10'/%3E%3Cpath d='M2 2l20 20'/%3E%3Cpath d='M18.55 5.11L22 22l-10-10'/%3E%3C/svg%3E";
                        e.currentTarget.className = "w-full p-2 text-gray-400";
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-8 h-8 text-gray-400"
                      >
                        <path d="M22 2L2 22" />
                        <path d="M5.45 5.11L2 22l10-10" />
                        <path d="M2 2l20 20" />
                        <path d="M18.55 5.11L22 22l-10-10" />
                      </svg>
                    </div>
                  )}
                </div>
                <div>
                  <div className="font-semibold">
                    {flight.Segments[0][0].Airline.AirlineName}
                  </div>
                  <div className="text-sm text-gray-500">
                    {flight.Segments[0][0].Airline.AirlineCode}{" "}
                    {flight.Segments[0][0].Airline.FlightNumber}
                  </div>
                </div>
              </div>

              {/* Flight Times */}
              <div className="flex items-center gap-16">
                {/* Departure */}
                <div className="text-center">
                  <div className="font-semibold">
                    {format(
                      new Date(flight.Segments[0][0].Origin.DepTime),
                      "HH:mm"
                    )}
                  </div>
                  <div className="text-sm text-gray-500">
                    {flight.Segments[0][0].Origin.Airport.CityName}
                    <div className="text-xs">
                      Terminal {flight.Segments[0][0].Origin.Airport.Terminal || "-"}
                    </div>
                  </div>
                </div>

                {/* Duration */}
                <div className="flex flex-col items-center">
                  <div className="text-sm text-gray-500">
                    {formatDuration(
                      flight.Segments[0].reduce(
                        (acc, seg) => acc + seg.Duration + (seg.GroundTime || 0),
                        0
                      )
                    )}
                  </div>
                  <div className="relative w-32 h-px bg-gray-300 my-2">
                    <div className="absolute -top-2 left-0 right-0 flex justify-center">
                      <Plane className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">
                    {flight.Segments[0].length === 1
                      ? "Non stop"
                      : `${flight.Segments[0].length - 1} ${
                          flight.Segments[0].length - 1 === 1 ? "stop" : "stops"
                        }`}
                  </div>
                </div>

                {/* Arrival */}
                <div className="text-center">
                  <div className="font-semibold">
                    {format(
                      new Date(
                        flight.Segments[0][
                          flight.Segments[0].length - 1
                        ].Destination.ArrTime
                      ),
                      "HH:mm"
                    )}
                  </div>
                  <div className="text-sm text-gray-500">
                    {
                      flight.Segments[0][flight.Segments[0].length - 1]
                        .Destination.Airport.CityName
                    }
                    <div className="text-xs">
                      Terminal{" "}
                      {flight.Segments[0][flight.Segments[0].length - 1]
                        .Destination.Airport.Terminal || "-"}
                    </div>
                  </div>
                </div>
              </div>

              {/* Price and Book */}
              <div className="text-right">
                <div className="font-semibold text-xl">
                  ₹{flight.Fare.PublishedFare.toLocaleString("en-IN")}
                </div>
                <div className="text-sm text-gray-500">per traveller</div>
                <Button
                  className="mt-2 bg-red-500 hover:bg-red-600 text-white"
                  onClick={() => {
                    console.log("Book Now clicked for flight:", flight);
                    handleBookNow(flight);
                  }}
                >
                  Book Now
                </Button>
              </div>
            </div>

            {/* Flight Details */}
            <div className="mt-4 pt-4 border-t">
              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  Total Duration:{" "}
                  {formatDuration(
                    flight.Segments[0].reduce(
                      (acc, seg) => acc + seg.Duration + (seg.GroundTime || 0),
                      0
                    )
                  )}
                </div>
                <div>Cabin Bag: {flight.Segments[0][0].CabinBaggage}</div>
                <div>Check-in: {flight.Segments[0][0].Baggage}</div>
                <div
                  className={
                    flight.IsRefundable ? "text-green-600" : "text-red-600"
                  }
                >
                  {flight.IsRefundable ? "Refundable" : "Non-Refundable"}
                </div>
                {flight.AirlineRemark && (
                  <div className="text-blue-600">{flight.AirlineRemark}</div>
                )}
              </div>

              {/* Multiple Segments Info */}
              {/* Multiple Segments Info */}
              {flight.Segments[0].length > 1 && (
                <div className="mt-2 text-sm text-gray-500">
                  <div className="font-medium mb-1">Layovers:</div>
                  {flight.Segments[0].slice(0, -1).map((segment, index) => (
                    <div key={index} className="ml-4">
                      {segment.Destination.Airport.CityName} -{" "}
                      {formatDuration(flight.Segments[0][index + 1].GroundTime)}{" "}
                      layover
                    </div>
                  ))}
                </div>
              )}

              {/* Fare Rules Summary */}
              {flight.MiniFareRules && flight.MiniFareRules[0] && (
                <div className="mt-2 text-sm">
                  <div className="font-medium mb-1 text-gray-700">
                    Fare Rules:
                  </div>
                  <div className="grid grid-cols-2 gap-4 ml-4">
                    {flight.MiniFareRules[0]
                      .filter(
                        (rule) =>
                          rule.Type === "Cancellation" ||
                          rule.Type === "Reissue"
                      )
                      .map((rule, index) => (
                        <div key={index} className="text-gray-600">
                          <span className="font-medium">{rule.Type}:</span>{" "}
                          {rule.From !== "44" ? (
                            <>
                              {rule.Details}
                              {rule.From && rule.To
                                ? ` (${rule.From}-${
                                    rule.To
                                  } ${rule.Unit.toLowerCase()})`
                                : ""}
                            </>
                          ) : (
                            "Non-changeable"
                          )}
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </Card>
        ))}

        {sortedFlights.length === 0 && (
          <Card className="p-6 text-center">
            <div className="text-xl font-semibold text-gray-600 mb-2">
              No flights found
            </div>
            <div className="text-gray-500">
              Try adjusting your filters or search for different dates
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}