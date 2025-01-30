// components/FlightFilters.tsx
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import type { FlightFilters } from "@/types/flight"

interface FlightFiltersProps {
  filters: FlightFilters;
  setFilters: (filters: FlightFilters) => void;
}

export default function FlightFilters({ filters, setFilters }: FlightFiltersProps) {
  const handlePriceRangeChange = (value: number[]) => {
    setFilters({ ...filters, priceRange: [value[0], value[1]] });
  };

  const toggleStop = (value: string) => {
    const newStops = filters.stops.includes(value)
      ? filters.stops.filter((stop) => stop !== value)
      : [...filters.stops, value];
    setFilters({ ...filters, stops: newStops });
  };

  const toggleAirline = (value: string) => {
    const newAirlines = filters.airlines.includes(value)
      ? filters.airlines.filter((airline) => airline !== value)
      : [...filters.airlines, value];
    setFilters({ ...filters, airlines: newAirlines });
  };

  return (
    <Card className="p-6 space-y-6 h-fit sticky top-24 w-80">
      <div>
        <h3 className="font-semibold mb-4">Popular Filters</h3>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="non-stop" 
              checked={filters.stops.includes("non-stop")}
              onCheckedChange={() => toggleStop("non-stop")}
            />
            <Label htmlFor="non-stop">Non Stop</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="one-stop" 
              checked={filters.stops.includes("one-stop")}
              onCheckedChange={() => toggleStop("one-stop")}
            />
            <Label htmlFor="one-stop">1 Stop</Label>
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-4">Price Range</h3>
        <Slider
          min={0}
          max={20000}
          step={100}
          value={filters.priceRange}
          onValueChange={handlePriceRangeChange}
          className="w-full"
        />
        <div className="flex justify-between mt-2 text-sm text-gray-600">
          <span>₹{filters.priceRange[0]}</span>
          <span>₹{filters.priceRange[1]}</span>
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-4">Airlines</h3>
        <div className="space-y-2">
          {["Indigo", "Air India", "SpiceJet", "Vistara"].map((airline) => (
            <div key={airline} className="flex items-center space-x-2">
              <Checkbox
                id={airline}
                checked={filters.airlines.includes(airline)}
                onCheckedChange={() => toggleAirline(airline)}
              />
              <Label htmlFor={airline}>{airline}</Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-4">Departure Time</h3>
        <div className="space-y-2">
          {[
            { label: "Morning (6AM - 12PM)", value: "morning" },
            { label: "Afternoon (12PM - 6PM)", value: "afternoon" },
            { label: "Evening (6PM - 12AM)", value: "evening" },
            { label: "Night (12AM - 6AM)", value: "night" },
          ].map((time) => (
            <div key={time.value} className="flex items-center space-x-2">
              <Checkbox
                id={time.value}
                checked={filters.departureTime.includes(time.value)}
                onCheckedChange={() => {
                  const newTimes = filters.departureTime.includes(time.value)
                    ? filters.departureTime.filter((t) => t !== time.value)
                    : [...filters.departureTime, time.value];
                  setFilters({ ...filters, departureTime: newTimes });
                }}
              />
              <Label htmlFor={time.value}>{time.label}</Label>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}