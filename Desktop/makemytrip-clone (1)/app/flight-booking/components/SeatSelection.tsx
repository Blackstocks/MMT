// app/flight-booking/components/SeatSelection.tsx
"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface SeatSelectionProps {
  maxSeats: number;
  selectedSeats: string[];
  onSeatSelect: (seat: string) => void;
  calculateSeatPrice: (seat: string) => number;
}

export function SeatSelection({ 
  maxSeats, 
  selectedSeats, 
  onSeatSelect,
  calculateSeatPrice 
}: SeatSelectionProps) {
  const [hoveredSeat, setHoveredSeat] = useState<string | null>(null);

  const handleSeatClick = (seatId: string, isAvailable: boolean, isBlocked: boolean) => {
    if (!isAvailable || isBlocked) return;
    onSeatSelect(seatId); // Simply pass the seat ID to parent for handling
  };

  // Returns true if seat position should be blocked (for exits, etc)
  const isBlockedSeat = (row: number, col: number): boolean => {
    if (row === 12 || row === 13) { // Emergency exit rows
      return col === 0 || col === 5; // Block first and last seats
    }
    return false;
  };

  const renderSeatGrid = () => {
    const rows = 30;
    const seatsPerRow = 6;
    const grid = [];

    for (let row = 1; row <= rows; row++) {
      const rowSeats = [];
      for (let col = 0; col < seatsPerRow; col++) {
        const seatLetter = String.fromCharCode(65 + col);
        const seatId = `${row}${seatLetter}`;
        const isBlocked = isBlockedSeat(row, col);
        const isEmergencyExit = row === 12 || row === 13;
        const isAvailable = !isBlocked && Math.random() > 0.3;
        const isSelected = selectedSeats.includes(seatId);
        const isPremium = row <= 4 || (row >= 12 && row <= 13);
        const isFree = row >= 16 && row <= 19 && (col === 1 || col === 4);
        const isNonReclining = row === 30;

        rowSeats.push(
          <button
            key={seatId}
            className={cn(
              "w-6 h-6 text-[10px] font-medium rounded transition-colors relative",
              isBlocked ? "invisible" : "visible",
              isAvailable ? (
                isSelected 
                  ? "bg-blue-500 text-white ring-2 ring-blue-600" 
                  : isFree 
                    ? "bg-emerald-200" 
                    : isPremium 
                      ? "bg-violet-200"
                      : "bg-blue-100"
              ) : "bg-gray-300 cursor-not-allowed"
            )}
            onClick={() => handleSeatClick(seatId, isAvailable, isBlocked)}
            disabled={!isAvailable || isBlocked}
          >
            {isSelected ? "✓" : seatLetter}
            {isAvailable && (
              <span className={cn(
                "absolute -bottom-4 left-1/2 -translate-x-1/2 text-[8px]",
                isSelected && "font-medium text-blue-600"
              )}>
                ₹{calculateSeatPrice(seatId)}
              </span>
            )}
          </button>
        );

        // Add aisle gap after seats C and D
        if (col === 2) rowSeats.push(<div key={`aisle1-${row}`} className="w-3" />);
        if (col === 3) rowSeats.push(<div key={`aisle2-${row}`} className="w-3" />);
      }

      grid.push(
        <div key={row} className="flex items-center gap-1 mb-6">
          <span className="w-4 text-right text-[10px] font-medium">{row}</span>
          <div className="flex gap-1">{rowSeats}</div>
          <span className="w-4 text-left text-[10px] font-medium">{row}</span>
          
          {/* Emergency exit indicators */}
          {row === 12 && (
            <>
              <div className="absolute -left-16 text-[10px] font-medium text-red-500 flex items-center">
                <div className="w-1 h-8 bg-red-500 mr-1" />
                EXIT
              </div>
              <div className="absolute -right-16 text-[10px] font-medium text-red-500 flex items-center">
                EXIT
                <div className="w-1 h-8 bg-red-500 ml-1" />
              </div>
            </>
          )}
        </div>
      );
    }

    return grid;
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-sm font-medium">
            {selectedSeats.length} of {maxSeats} Seat(s) Selected
          </h3>
          <p className={cn(
            "text-xs",
            selectedSeats.length === maxSeats ? "text-green-600" : "text-orange-500"
          )}>
            {selectedSeats.length === maxSeats ? "✓ Selection complete" : "Selection pending"}
          </p>
        </div>
        <div className="text-xs text-green-600 bg-green-50 px-3 py-1 rounded-full">
          Use code HSBCFREESEAT
        </div>
      </div>

      {/* Plane Shape */}
      <div className="relative mx-auto w-[300px]">
        {/* Nose */}
        <div className="h-8 bg-gradient-to-b from-gray-100 rounded-t-full mb-4" />

        {/* Seat Map */}
        <div className="relative px-8">
          {renderSeatGrid()}
        </div>

        {/* Tail */}
        <div className="h-8 bg-gradient-to-t from-gray-100 rounded-b-full mt-4" />
      </div>

      {/* Legend */}
      <div className="mt-6 grid grid-cols-3 gap-4 text-[10px]">
        <div>
          <div className="font-medium mb-1">Seat Type</div>
          <div className="space-y-1">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-emerald-200" /> Free
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-blue-100" /> Regular
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-violet-200" /> Premium
            </div>
          </div>
        </div>

        <div>
          <div className="font-medium mb-1">Features</div>
          <div className="space-y-1">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 border-r-2 border-red-500" /> Exit Row
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 border-b border-black" /> Non-Reclining
            </div>
          </div>
        </div>

        <div>
          <div className="font-medium mb-1">Status</div>
          <div className="space-y-1">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-blue-500" /> Selected
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-gray-300" /> Unavailable
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}