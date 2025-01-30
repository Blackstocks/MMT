// app/flight-search/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Header } from "../components/header";
import { Footer } from "../components/footer";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import FlightSearchForm from "./components/FlightSearchForm";
import FlightFilters from "./components/FlightFilters";
import FlightResults from "./components/FlightResults";
import { format, addDays } from "date-fns";
import type { Flight } from "@/types/flight";
import { flightService } from "@/services/flightService";

export default function FlightSearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [flights, setFlights] = useState<Flight[]>([]);
  
  // Search parameters
  const [selectedTripType, setSelectedTripType] = useState(
    searchParams.get("tripType") || "one-way"
  );
  
  const [selectedFrom, setSelectedFrom] = useState(
    searchParams.get("from") || ""
  );
  const [selectedTo, setSelectedTo] = useState(
    searchParams.get("to") || ""
  );
  const [departureDate, setDepartureDate] = useState<Date>(
    searchParams.get("departureDate")
      ? new Date(searchParams.get("departureDate")!)
      : new Date()
  );
  const [returnDate, setReturnDate] = useState<Date | undefined>(
    searchParams.get("returnDate")
      ? new Date(searchParams.get("returnDate")!)
      : undefined
  );
  const [passengers, setPassengers] = useState({
    adults: Number(searchParams.get("adults")) || 1,
    children: Number(searchParams.get("children")) || 0,
    infants: Number(searchParams.get("infants")) || 0,
  });
  const [travelClass, setTravelClass] = useState(() => {
    const classParam = searchParams.get("class");
    // Handle cases where class might be "Economy/Premium Economy"
    return classParam?.split('/')[0] || "Economy";
  });

  // Filters
  const [filters, setFilters] = useState({
    priceRange: [0, 20000] as [number, number],
    stops: [] as string[],
    airlines: [] as string[],
    departureTime: [] as string[],
    arrivalTime: [] as string[],
    sortBy: "cheapest",
  });

  // Search for flights when URL parameters change
  useEffect(() => {
    const searchFlights = async () => {
      if (!selectedFrom || !selectedTo || !departureDate) return;

      try {
        setLoading(true);
        setError(null);

        const searchParams = {
          adultCount: passengers.adults,
          childCount: passengers.children,
          infantCount: passengers.infants,
          directFlight: false,
          oneStopFlight: false,
          journeyType: selectedTripType === "one-way" ? 1 : 2,
          preferredAirlines: null,
          segments: [
            {
              Origin: selectedFrom,
              Destination: selectedTo,
              FlightCabinClass: "1",
              PreferredDepartureTime: `${format(departureDate, "yyyy-MM-dd")}T00:00:00`,
              PreferredArrivalTime: `${format(departureDate, "yyyy-MM-dd")}T00:00:00`,
            },
          ],
          sources: null,
        };

        const results = await flightService.searchFlights(searchParams);
        if (results?.Response?.Results?.[0]) {
          setFlights(results.Response.Results[0]);

          // Update price range based on actual prices
          const prices = results.Response.Results[0].map((f: Flight) => f.Fare.PublishedFare);
          setFilters(prev => ({
            ...prev,
            priceRange: [Math.min(...prices), Math.max(...prices)] as [number, number]
          }));
        } else {
          setFlights([]);
        }
      } catch (err) {
        console.error('Error searching flights:', err);
        setError(err instanceof Error ? err.message : "Failed to search flights");
      } finally {
        setLoading(false);
      }
    };

    searchFlights();
  }, [selectedFrom, selectedTo, departureDate, passengers, selectedTripType]);

  // Generate dates array for flexible dates display
  const dates = Array.from({ length: 7 }, (_, i) => {
    const date = i === 3 ? departureDate : addDays(departureDate, i - 3);
    return {
      date: format(date, "EEE, MMM dd"),
      price: flights.length > 0
        ? `₹ ${Math.min(...flights.map(f => f.Fare.PublishedFare)).toLocaleString('en-IN')}`
        : "---",
      active: i === 3,
    };
  });

  const handleBookFlight = (flight: Flight) => {
    // Store selected flight in localStorage
    localStorage.setItem("selectedFlight", JSON.stringify(flight));
    
    // Navigate to booking page
    router.push(`/flight-booking?from=${selectedFrom}&to=${selectedTo}&date=${format(departureDate, "yyyy-MM-dd")}`);
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="sticky top-0 z-50 bg-white shadow-md">
        <Header />
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <Card className="bg-white rounded-xl overflow-hidden shadow-lg mb-6">
          <div className="p-6">
            <FlightSearchForm
              selectedTripType={selectedTripType}
              setSelectedTripType={setSelectedTripType}
              selectedFrom={selectedFrom}
              setSelectedFrom={setSelectedFrom}
              selectedTo={selectedTo}
              setSelectedTo={setSelectedTo}
              departureDate={departureDate}
              setDepartureDate={setDepartureDate}
              returnDate={returnDate}
              setReturnDate={setReturnDate}
              passengers={passengers}
              setPassengers={setPassengers}
              travelClass={travelClass}
              setTravelClass={setTravelClass}
            />
          </div>
        </Card>

        {error ? (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : (
          <div className="flex gap-6">
            <FlightFilters
              filters={filters}
              setFilters={setFilters}
              flights={flights}
            />
            <FlightResults
              selectedFrom={selectedFrom}
              selectedTo={selectedTo}
              dates={dates}
              filters={filters}
              setFilters={setFilters}
              flights={flights}
              loading={loading}
              onBookFlight={handleBookFlight}
            />
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}