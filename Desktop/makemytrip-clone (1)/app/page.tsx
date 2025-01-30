"use client";

// import { useState } from "react";
import {
  CalendarIcon,
  ChevronDown,
  FlipHorizontalIcon as SwapHorizontal,
  ChevronUp,
} from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { NavigationMenu } from "./components/navigation-menu";
import { Header } from "./components/header";
import { ExploreMore } from "./components/explore-more";
import { Offers } from "./components/offers";
import { FeaturedTours } from "./components/featured-tours";
import { FlightOfferDeals } from "./components/flight-offer-deals";
import { TopRatedHotels } from "./components/top-rated-hotels";
import { Footer } from "./components/footer";
import { useRouter } from "next/navigation";
import { flightService } from "@/services/flightService";
// import { useRouter } from 'next/navigation';  // Make sure it's next/navigation, not next/router
// import { format } from 'date-fns';
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
// import { flightService, type Airport } from "@/services/flightService";
import { useState, useCallback } from "react";
import debounce from "lodash/debounce";
// import { flightService, type Airport } from '@/services/flightService';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const travelClasses = [
  "Economy/Premium Economy",
  "Premium Economy",
  "Business",
  "First Class",
] as const;

type TravelClass = (typeof travelClasses)[number];

export default function Home() {
  const router = useRouter();
  const [tripType, setTripType] = useState("one-way");
  const [from, setFrom] = useState("Select");
  const [to, setTo] = useState("Select");
  const [departureDate, setDepartureDate] = useState<Date>(new Date());
  const [returnDate, setReturnDate] = useState<Date>();
  const [travelers, setTravelers] = useState({
    adults: 1,
    children: 0,
    infants: 0,
  });
  const [travelClass, setTravelClass] = useState<TravelClass>(
    "Economy/Premium Economy"
  );
  const [specialFare, setSpecialFare] = useState("regular");
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isReturnDatePickerOpen, setIsReturnDatePickerOpen] = useState(false);

  const [airports, setAirports] = useState<Airport[]>([]);
  const [isSearchingAirports, setIsSearchingAirports] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [departureAirports, setDepartureAirports] = useState<Airport[]>([]);
  const [arrivalAirports, setArrivalAirports] = useState<Airport[]>([]);
  const [isDepartureSearching, setIsDepartureSearching] = useState(false);
  const [isArrivalSearching, setIsArrivalSearching] = useState(false);
  const [departureSearchError, setDepartureSearchError] = useState<string | null>(null);
  const [arrivalSearchError, setArrivalSearchError] = useState<string | null>(null);
  // const [from, setFrom] = useState("DEL"); // Change from "Jaipur" to "DEL"
  // const [to, setTo] = useState("BOM"); // Change from "Mumbai" to "BOM"
  const [isLoading, setIsLoading] = useState(false);
  const debouncedSearch = useCallback(
    debounce((value: string, isDeparture: boolean) => {
      searchAirports(value, isDeparture);
    }, 300),
    []
  );

  const handleSwapLocations = () => {
    const temp = from;
    setFrom(to);
    setTo(temp);
  };

  const loadAllAirports = async (isDeparture: boolean) => {
    try {
      const results = await flightService.getAllAirports();
      if (isDeparture) {
        setDepartureAirports(results);
      } else {
        setArrivalAirports(results);
      }
    } catch (error) {
      console.error("Error loading airports:", error);
      if (isDeparture) {
        setDepartureSearchError("Failed to load airports");
      } else {
        setArrivalSearchError("Failed to load airports");
      }
    }
  };


  const searchAirports = async (keyword: string, isDeparture: boolean) => {
    if (!keyword || keyword.length < 2) {
      loadAllAirports(isDeparture);
      return;
    }

    if (isDeparture) {
      setIsDepartureSearching(true);
      setDepartureSearchError(null);
    } else {
      setIsArrivalSearching(true);
      setArrivalSearchError(null);
    }

    try {
      const results = await flightService.searchAirports(keyword);
      if (isDeparture) {
        setDepartureAirports(results);
      } else {
        setArrivalAirports(results);
      }
    } catch (error) {
      console.error("Search error:", error);
      if (isDeparture) {
        setDepartureSearchError("Failed to search airports");
      } else {
        setArrivalSearchError("Failed to search airports");
      }
    } finally {
      if (isDeparture) {
        setIsDepartureSearching(false);
      } else {
        setIsArrivalSearching(false);
      }
    }
  };

  const handleSearch = async () => {
    try {
      setIsLoading(true);
      // Validate required fields
      if (!from || !to || !departureDate) {
        alert("Please fill in all required fields");
        return;
      }

      // Log the actual airport codes being used
      console.log("Search parameters:", {
        fromAirport: from,
        toAirport: to,
        date: format(departureDate, "yyyy-MM-dd"),
        adults: travelers.adults,
        children: travelers.children,
        infants: travelers.infants,
      });

      const searchParams = {
        adultCount: travelers.adults,
        childCount: travelers.children,
        infantCount: travelers.infants,
        directFlight: false,
        oneStopFlight: false,
        journeyType: tripType === "one-way" ? 1 : 2,
        preferredAirlines: null,
        segments: [
          {
            Origin: from,
            Destination: to,
            FlightCabinClass: "1",
            PreferredDepartureTime: `${format(
              departureDate,
              "yyyy-MM-dd"
            )}T00:00:00`,
            PreferredArrivalTime: `${format(
              departureDate,
              "yyyy-MM-dd"
            )}T00:00:00`,
          },
        ],
        sources: null,
      };

      console.log(
        "API Request payload:",
        JSON.stringify(searchParams, null, 2)
      );

      const results = await flightService.searchFlights(searchParams);
      console.log("API Response:", JSON.stringify(results, null, 2));

      if (results?.Response?.Results?.length > 0) {
        // Store results in localStorage
        localStorage.setItem("flightSearchResults", JSON.stringify(results));

        // Navigate to results page
        const queryParams = new URLSearchParams({
          from,
          to,
          date: format(departureDate, "yyyy-MM-dd"),
          passengers: String(
            travelers.adults + travelers.children + travelers.infants
          ),
          class: travelClass,
        });

        router.push(`/flight-search?${queryParams.toString()}`);
      } else {
        throw new Error("No flights found for the selected route and date");
      }
    } catch (error) {
      console.error("Flight search error:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Failed to search flights. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };
  const handleDateSelect = (date: Date | undefined, isReturn = false) => {
    if (date) {
      if (isReturn) {
        setReturnDate(date);
        setIsReturnDatePickerOpen(false);
      } else {
        setDepartureDate(date);
        setIsDatePickerOpen(false);
      }
    }
  };
  const handleAirportSearch = useCallback(
    debounce((value: string) => {
      searchAirports(value);
    }, 300),
    []
  );
  const handleAirportSelect = (airportCode: string, isOrigin: boolean) => {
    if (isOrigin) {
      if (airportCode === to) {
        alert("Origin and destination cannot be the same");
        return;
      }
      setFrom(airportCode);
    } else {
      if (airportCode === from) {
        alert("Origin and destination cannot be the same");
        return;
      }
      setTo(airportCode);
    }
  };

  const handleApply = () => {
    // Here you can add any logic you want to execute when applying
    // For now, we'll just close the popover
    const popoverTrigger = document.querySelector(
      '[data-state="open"]'
    ) as HTMLElement;
    if (popoverTrigger) {
      popoverTrigger.click();
    }
  };
  const renderAirportField = (
    label: string,
    value: string,
    isOrigin: boolean
  ) => (
    <Popover>
      <PopoverTrigger asChild>
        <div className="flex-1 border rounded-lg p-2 cursor-pointer hover:border-red-500">
          <Label className="text-xs text-gray-500">{label}</Label>
          <div className="text-lg font-bold">
            {(isOrigin ? departureAirports : arrivalAirports).find(
              (a) => a.AIRPORTCODE === value
            )?.CITYNAME || value}
          </div>
          <div className="text-xs text-gray-500">
            {(isOrigin ? departureAirports : arrivalAirports).find(
              (a) => a.AIRPORTCODE === value
            )?.AIRPORTNAME}
            {(isOrigin ? departureAirports : arrivalAirports).find(
              (a) => a.AIRPORTCODE === value
            ) && ` (${value})`}
          </div>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-2">
          <input
            type="text"
            placeholder="Search for cities or airports"
            className="w-full p-2 border rounded"
            onChange={(e) => debouncedSearch(e.target.value, isOrigin)}
          />
          {(isOrigin ? isDepartureSearching : isArrivalSearching) ? (
            <div className="text-center">Searching...</div>
          ) : (isOrigin ? departureSearchError : arrivalSearchError) ? (
            <div className="text-red-500">
              {isOrigin ? departureSearchError : arrivalSearchError}
            </div>
          ) : (
            <div className="max-h-60 overflow-y-auto">
              {(isOrigin ? departureAirports : arrivalAirports).map((airport) => (
                <div
                  key={airport._id}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    handleAirportSelect(airport.AIRPORTCODE, isOrigin);
                    const popoverTrigger = document.querySelector(
                      '[data-state="open"]'
                    ) as HTMLElement;
                    if (popoverTrigger) {
                      popoverTrigger.click();
                    }
                  }}
                >
                  <div className="font-medium">{airport.CITYNAME}</div>
                  <div className="text-sm text-gray-500">
                    {airport.AIRPORTNAME} ({airport.AIRPORTCODE})
                  </div>
                  <div className="text-xs text-gray-400">
                    {airport.COUNTRYNAME}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );


  // const handleSearch = () => {
  //   const searchParams = new URLSearchParams({
  //     tripType,
  //     from,
  //     to,
  //     departureDate: departureDate.toISOString(),
  //     returnDate: returnDate ? returnDate.toISOString() : "",
  //     adults: travelers.adults.toString(),
  //     children: travelers.children.toString(),
  //     infants: travelers.infants.toString(),
  //     travelClass,
  //     specialFare,
  //   });
  //   router.push(`/flight-search?${searchParams.toString()}`);
  // };

  return (
    <main className="min-h-screen bg-white">
      
      <Header />


      <div className="w-full mx-auto bg-white px- sm:px-4 lg:px-0 my- sm:my-0">
        
        <div className="bg-white flex-col justify-center items-center relative p-2 sm:p-4 shadow-lg rounded-2xl">
        <div className="absolute inset-0 z-0">
        <Image 
          src="/bg5.jpg" 
          alt="Travel Background" 
          layout="fill" 
          objectFit="cover" 
          quality={90}
          
        />
      </div>
          <div className="w-full overflow-x-hidden z-10">
            <NavigationMenu />
          
          </div>
          <Card className="mt-6 bg-white rounded-xl overflow-hidden shadow-lg w-full mx-auto max-w-7xl lg:w-3/4 z-10">
            <div className="p-4 sm:p-6 lg:p-8 bg-cover bg-center bg-opacity-90 relative bg-white z-10">
              <div className="relative z-10">
                {/* Trip Type Selection */}
                {/* Trip Type Selection */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 space-y-4 sm:space-y-0">
                  <RadioGroup
                    defaultValue={tripType}
                    onValueChange={setTripType}
                    className="flex flex-wrap items-center gap-4 sm:gap-6"
                  >
                    <div className="flex items-center gap-2">
                      <RadioGroupItem
                        value="one-way"
                        id="one-way"
                        className="text-red-600"
                      />
                      <Label htmlFor="one-way" className="text-sm whitespace-nowrap">
                        One Way
                      </Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem
                        value="round-trip"
                        id="round-trip"
                        className="text-red-600"
                      />
                      <Label htmlFor="round-trip" className="text-sm whitespace-nowrap">
                        Round Trip
                      </Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem
                        value="multi-city"
                        id="multi-city"
                        className="text-red-600"
                      />
                      <Label htmlFor="multi-city" className="text-sm whitespace-nowrap">
                        Multi City
                      </Label>
                    </div>
                  </RadioGroup>
                  <span className="text-sm text-gray-600">
                    Book International and Domestic Flights
                  </span>
                </div>

                {/* Flight Search Form */}
                <div className="flex flex-col lg:flex-row items-stretch justify-between w-full gap-4 mb-8">
                  {/* From */}
                  <div className="w-full lg:w-auto lg:flex-1">
                    {renderAirportField("From", from, true)}
                  </div>

                  {/* Swap Button */}
                  <div className="flex items-center justify-center">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full w-10 h-10 text-red-500 hover:bg-red-50"
                      onClick={handleSwapLocations}
                    >
                      <SwapHorizontal className="w-6 h-6" />
                    </Button>
                  </div>

                  {/* To */}
                  <div className="w-full lg:w-auto lg:flex-1">
                    {renderAirportField("To", to, false)}
                  </div>

                  {/* Departure */}
                  <div className="w-full lg:w-auto lg:flex-1">
                    <Popover
                      open={isDatePickerOpen}
                      onOpenChange={setIsDatePickerOpen}
                    >
                      <PopoverTrigger asChild>
                        <div className="flex-1 border rounded-lg p-2 cursor-pointer hover:border-red-500">
                          <Label className="text-xs text-gray-500">Departure</Label>
                          <div className="text-lg font-bold">
                            {format(departureDate, "dd/MM/yyyy")}
                          </div>
                          <div className="text-xs text-gray-500">
                            {format(departureDate, "EEEE")}
                          </div>
                        </div>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={departureDate}
                          onSelect={(date) => handleDateSelect(date)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* Return Date */}
                  <div className="w-full lg:w-auto lg:flex-1">
                    <Popover
                      open={isReturnDatePickerOpen}
                      onOpenChange={setIsReturnDatePickerOpen}
                    >
                      <PopoverTrigger asChild>
                        <div className={cn(
                          "flex-1 border rounded-lg p-2 cursor-pointer hover:border-red-500",
                          tripType === "round-trip" ? "" : "opacity-50 pointer-events-none"
                        )}>
                          <Label className="text-xs text-gray-500">Return</Label>
                          <div className="text-lg font-bold">
                            {returnDate ? format(returnDate, "dd/MM/yyyy") : "Select"}
                          </div>
                          <div className="text-xs text-gray-500">
                            {returnDate ? format(returnDate, "EEEE") : "Date"}
                          </div>
                        </div>
                      </PopoverTrigger>
                      {tripType === "round-trip" && (
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={returnDate}
                            onSelect={(date) => handleDateSelect(date, true)}
                            initialFocus
                          />
                        </PopoverContent>
                      )}
                    </Popover>
                  </div>

                  {/* Travelers & Class */}
                  <div className="w-full lg:w-auto lg:flex-1">
                    <Popover>
                      <PopoverTrigger asChild>
                        <div className="flex-1 border rounded-lg p-2 cursor-pointer hover:border-red-500">
                          <Label className="text-xs text-gray-500">Travellers & Class</Label>
                          <div className="text-lg font-bold">
                            {travelers.adults + travelers.children + travelers.infants}
                          </div>
                          <div className="text-xs text-gray-500 truncate">
                            {travelClass}
                          </div>
                        </div>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-[90vw] sm:w-[500px] p-3 max-h-[80vh] overflow-y-auto"
                        align="start"
                        side="bottom"
                        alignOffset={-150}
                      >
                        {/* Travelers content remains the same */}
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                {/* Special Fares */}
                <div className="mb-8">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-sm font-medium">Select a special fare</span>
                    <span className="bg-red-100 text-red-700 text-[10px] font-medium px-2 py-0.5 rounded">
                      EXTRA SAVINGS
                    </span>
                  </div>
                  <RadioGroup
                    value={specialFare}
                    onValueChange={setSpecialFare}
                    className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3"
                  >
                    {[
                      {
                        value: "regular",
                        label: "Regular",
                        desc: "Regular fares",
                      },
                      {
                        value: "student",
                        label: "Student",
                        desc: "Extra discounts/baggage",
                      },
                      {
                        value: "senior",
                        label: "Senior Citizen",
                        desc: "Up to ₹ 600 off",
                      },
                      {
                        value: "armed",
                        label: "Armed Forces",
                        desc: "Up to ₹ 600 off",
                      },
                      {
                        value: "doctor",
                        label: "Doctor and Nurses",
                        desc: "Up to ₹ 600 off",
                      },
                    ].map((fare) => (
                      <div key={fare.value} className="relative">
                        <RadioGroupItem
                          value={fare.value}
                          id={fare.value}
                          className="peer hidden"
                        />
                        <Label
                          htmlFor={fare.value}
                          className="flex flex-col h-full border rounded-lg p-3 peer-checked:border-red-500 peer-checked:bg-red-50 cursor-pointer hover:border-red-500"
                        >
                          <span className="font-medium text-sm">{fare.label}</span>
                          <span className="text-xs text-gray-500">{fare.desc}</span>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
                <div className="mt-8 flex justify-center">
                  <Button
                    className=" bg-red-600 hover:bg-red-700 text-white px-16 py-6 text-xl font-semibold rounded-full disabled:opacity-70 disabled:cursor-not-allowed "
                    onClick={() => {
                      console.log("Search button clicked");
                      handleSearch();
                    }}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        SEARCHING...
                      </div>
                    ) : (
                      "SEARCH"
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </Card>
          <div className="relative z-20">
              <ExploreMore />
            </div>
        </div>
      </div>
      <div className="mx-4 sm:mx-6 lg:mx-20">
        <Offers />
        <FeaturedTours />
        <TopRatedHotels />
        <FlightOfferDeals />
      </div>
      <Footer />
    </main>
  );
}
