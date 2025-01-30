"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";

interface SeatProps {
  number: string;
  price: number | null;
  status: "available" | "occupied" | "selected" | "free";
  type?: "exit" | "xl" | "non-reclining";
}

export default function SeatSelection() {
  const [selectedSeat, setSelectedSeat] = useState<string | null>(null);

  // This would typically come from an API
  const generateSeats = () => {
    const rows = Array.from({ length: 30 }, (_, i) => i + 1);
    const columns = ["A", "B", "C", "", "D", "E", "F"];
    
    return rows.map(row => 
      columns.map(col => {
        if (!col) return null;
        const seatNumber = `${row}${col}`;
        return {
          number: seatNumber,
          price: row >= 15 && row <= 20 ? 0 : 299,
          status: row === 21 || row === 26 || row === 28 ? "occupied" : 
                 (row >= 15 && row <= 20) ? "free" : "available",
          type: row === 30 ? "non-reclining" : undefined
        };
      })
    );
  };

  const seats = generateSeats();

  const handleSeatSelect = (seat: SeatProps) => {
    if (seat.status === "occupied") return;
    setSelectedSeat(seat.number);
  };

  return (
    <div className="p-6 bg-white rounded-lg">
      {/* Tabs */}
      <div className="border-b mb-6">
        <div className="flex gap-6">
          <button className="px-4 py-2 text-blue-500 border-b-2 border-blue-500">
            Seats
          </button>
          <button className="px-4 py-2 text-gray-500">
            Meals
          </button>
        </div>
      </div>

      {/* Promo Banner */}
      <Alert className="bg-green-50 text-green-700 mb-6">
        Get Free Seat with coupon HSBCFREESEAT
      </Alert>

      {/* Flight Info */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold">Kolkata → Jaipur</h2>
          <p className="text-gray-600">
            {selectedSeat ? "1" : "0"} of 1 Seat(s) Selected
          </p>
        </div>
        <div className="text-sm text-orange-500">
          Selection pending
        </div>
      </div>

      {/* Seat Map */}
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full">
          {seats.map((row, rowIndex) => (
            <div key={rowIndex} className="flex justify-center gap-1 mb-1">
              <span className="w-6 text-center text-sm text-gray-500">
                {rowIndex + 1}
              </span>
              {row.map((seat, colIndex) => 
                seat === null ? (
                  <div key={colIndex} className="w-8" />
                ) : (
                  <button
                    key={colIndex}
                    className={`
                      w-8 h-8 rounded text-xs flex flex-col items-center justify-center
                      ${seat.status === 'available' ? 'bg-blue-100 hover:bg-blue-200' : ''}
                      ${seat.status === 'occupied' ? 'bg-gray-200 cursor-not-allowed' : ''}
                      ${seat.status === 'selected' ? 'bg-green-500 text-white' : ''}
                      ${seat.status === 'free' ? 'bg-green-100 text-green-700' : ''}
                      ${seat.type === 'non-reclining' ? 'border-t-2 border-black' : ''}
                    `}
                    onClick={() => handleSeatSelect(seat)}
                    disabled={seat.status === 'occupied'}
                  >
                    {seat.number.slice(1)}
                    {seat.price !== null && seat.price > 0 && (
                      <span className="text-[10px]">₹{seat.price}</span>
                    )}
                  </button>
                )
              )}
              <span className="w-6 text-center text-sm text-gray-500">
                {rowIndex + 1}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-100"></div>
          <span className="text-sm">Free</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-100"></div>
          <span className="text-sm">₹ 130-400</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-violet-100"></div>
          <span className="text-sm">₹ 450-2000</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border border-gray-300"></div>
          <span className="text-sm">Exit Row Seats</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-white border-t-2 border-black"></div>
          <span className="text-sm">Non Reclining</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 flex items-center justify-center text-[10px]">XL</div>
          <span className="text-sm">Extra Legroom</span>
        </div>
      </div>

      {/* Row Facilities */}
      <div className="mt-8 flex justify-center gap-8">
        <div className="flex items-center gap-2">
          <img src="/icons/galley.svg" alt="Galley" className="w-6 h-6" />
          <span className="text-sm">Galley</span>
        </div>
        <div className="flex items-center gap-2">
          <img src="/icons/washroom.svg" alt="Washroom" className="w-6 h-6" />
          <span className="text-sm">Washroom</span>
        </div>
      </div>
    </div>
  );
}