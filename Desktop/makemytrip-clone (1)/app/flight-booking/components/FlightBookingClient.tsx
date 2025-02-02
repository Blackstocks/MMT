// app/flight-booking/components/FlightBookingClient.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Header } from "../../components/header";
import { Footer } from "../../components/footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { flightService } from "@/services/flightService";
import { toast } from "@/components/ui/use-toast";

// Import components
import { FlightSummary } from "./FlightSummary";
import { SeatSelection } from "./SeatSelection";
import { MealSelection } from "./MealSelection";
import { PassengerDetails } from "./PassengerDetails";
import { AddOnServices } from "./AddOnServices";
import { FareSummary } from "./FareSummary";

export default function FlightBookingClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isInitialized, setIsInitialized] = useState(false);

  // States
  const [activeTab, setActiveTab] = useState("seats");
  const [flightDetails, setFlightDetails] = useState<any>(null);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [fareRules, setFareRules] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addOns, setAddOns] = useState<string[]>([]);
  const travelClass = searchParams.get('class') || 'Economy';
  const [formData, setFormData] = useState({
    passengers: [
      {
        title: "Mr",
        firstName: "",
        lastName: "",
        email: "",
        countryCode: "+91",
        mobile: "",
      },
    ],
    state: "delhi",
    saveTraveller: false,
    gstNumber: "",
  });

  // Calculate seat price function
  const calculateSeatPrice = (seat: string) => {
    const row = parseInt(seat.replace(/[A-F]/g, ""));
    const col = seat.slice(-1).charCodeAt(0) - 65; // Convert A-F to 0-5
    const isPremium = row <= 4 || (row >= 12 && row <= 13);
    const isFree = row >= 16 && row <= 19 && (col === 1 || col === 4); // B and E seats

    if (isFree) return 0;
    if (isPremium) return 450;
    return 200;
  };

  // Initialize booking data
  useEffect(() => {
    const initializeBooking = async () => {
      if (!isInitialized) {
        try {
          setLoading(true);
          if (typeof window === 'undefined') return;

          const selectedFlightStr = localStorage.getItem("selectedFlight");
          if (!selectedFlightStr) {
            throw new Error("No flight selected");
          }

          const selectedFlight = JSON.parse(selectedFlightStr);
          setFlightDetails(selectedFlight);

          if (selectedFlight.traceId && selectedFlight.resultIndex) {
            const rules = await flightService.getFareRules(
              selectedFlight.traceId,
              selectedFlight.resultIndex
            );
            setFareRules(rules);
          }
        } catch (err) {
          console.error("Error initializing booking:", err);
          setError(
            err instanceof Error ? err.message : "Failed to load booking details"
          );
        } finally {
          setLoading(false);
          setIsInitialized(true);
        }
      }
    };

    initializeBooking();
  }, [isInitialized]);

  // Handlers
  const handleSeatSelect = (seatNumber: string) => {
    const passengerCount = parseInt(searchParams.get("passengers") || "1");

    setSelectedSeats((prev) => {
      if (prev.includes(seatNumber)) {
        return prev.filter((s) => s !== seatNumber);
      }

      if (prev.length < passengerCount) {
        return [...prev, seatNumber];
      }

      return [...prev.slice(1), seatNumber];
    });
  };

  const handleAddOnToggle = (service: string) => {
    setAddOns((prev) => {
      if (prev.includes(service)) {
        return prev.filter((s) => s !== service);
      }
      return [...prev, service];
    });
  };

  const handleFormChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = (): boolean => {
    const isValid = formData.passengers.every((passenger) => {
      if (!passenger.firstName || !passenger.lastName) {
        toast({
          title: "Error",
          description: "Please enter passenger name for all passengers",
          variant: "destructive",
        });
        return false;
      }
      if (!passenger.mobile || !passenger.email) {
        toast({
          title: "Error",
          description: "Please enter contact details for all passengers",
          variant: "destructive",
        });
        return false;
      }
      return true;
    });

    return isValid;
  };

  const handleBooking = async () => {
    try {
      if (!validateForm()) return;
      if (!flightDetails) throw new Error("No flight selected");

      setLoading(true);
      const bookingRequest = {
        traceId: flightDetails.traceId,
        resultIndex: flightDetails.resultIndex,
        passengers: formData.passengers.map((passenger, index) => ({
          Title: passenger.title,
          FirstName: passenger.firstName,
          LastName: passenger.lastName,
          PaxType: 1,
          DateOfBirth: "1990-01-01T00:00:00",
          Gender: passenger.title === "Mr" ? 1 : 2,
          PassportNo: "",
          PassportExpiry: "",
          AddressLine1: "",
          AddressLine2: "",
          Fare: flightDetails.Fare,
          City: formData.city,
          CountryCode: "IN",
          CellCountryCode: passenger.countryCode.replace("+", ""),
          ContactNo: passenger.mobile,
          Nationality: "IN",
          Email: passenger.email,
          IsLeadPax: index === 0,
          FFAirlineCode: null,
          FFNumber: "",
          GSTCompanyAddress: "",
          GSTCompanyContactNumber: "",
          GSTCompanyName: "",
          GSTNumber: index === 0 ? formData.gstNumber : "",
          GSTCompanyEmail: "",
        })),
      };

      const response = await flightService.bookFlight(bookingRequest);
      
      if (typeof window !== 'undefined') {
        localStorage.setItem("bookingConfirmation", JSON.stringify(response));
      }

      toast({
        title: "Success",
        description: "Flight booked successfully!",
      });

      router.push("/booking-confirmation");
    } catch (err) {
      toast({
        title: "Booking Failed",
        description:
          err instanceof Error ? err.message : "Failed to book flight",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isInitialized || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-red-500"></div>
      </div>
    );
  }

  if (error || !flightDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Alert variant="destructive" className="max-w-lg">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error || "Failed to load flight details. Please try again."}
          </AlertDescription>
          <Button
            variant="outline"
            onClick={() => router.push("/flight-search")}
            className="mt-4"
          >
            Back to Search
          </Button>
        </Alert>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Flight Summary */}
        <FlightSummary flight={flightDetails} />

        <div className="grid grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="col-span-2 space-y-6">
            {/* Passenger Details */}
            <PassengerDetails
              maxPassengers={parseInt(searchParams.get("passengers") || "1")}
              formData={formData}
              onFormChange={handleFormChange}
            />

            {/* Add-on Services */}
            <AddOnServices onAddService={handleAddOnToggle} />

            {/* Services Tabs */}
            <Tabs defaultValue="seats" onValueChange={setActiveTab}>
              <TabsList className="w-full border-b">
                <TabsTrigger value="seats" className="flex gap-2">
                  <span className="w-5 h-5">🪑</span>
                  Seats
                </TabsTrigger>
                <TabsTrigger value="meals" className="flex gap-2">
                  <span className="w-5 h-5">🍱</span>
                  Meals
                </TabsTrigger>
              </TabsList>

              <TabsContent value="seats">
                <SeatSelection
                  maxSeats={parseInt(searchParams.get("passengers") || "1")}
                  selectedSeats={selectedSeats}
                  onSeatSelect={handleSeatSelect}
                  calculateSeatPrice={calculateSeatPrice}
                />
              </TabsContent>

              <TabsContent value="meals">
                <MealSelection />
              </TabsContent>
            </Tabs>
          </div>

          {/* Price Summary Sidebar */}
          <div className="col-span-1">
            <FareSummary
              flight={flightDetails}
              selectedSeats={selectedSeats}
              addOns={addOns}
              calculateSeatPrice={calculateSeatPrice}
              onBook={handleBooking}
              loading={loading}
              passengerCount={parseInt(searchParams.get("passengers") || "1")}
            />
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}