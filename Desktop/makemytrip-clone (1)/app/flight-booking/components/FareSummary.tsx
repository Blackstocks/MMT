"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { Flight } from "@/types/flight";
import { useEffect } from "react";

interface FareSummaryProps {
  flight: Flight;
  selectedSeats: string[];
  addOns: string[];
  calculateSeatPrice: (seat: string) => number;
  loading?: boolean;
}

export function FareSummary({
  flight,
  selectedSeats,
  addOns,
  calculateSeatPrice,
  loading = false
}: FareSummaryProps) {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const seatTotal = selectedSeats.reduce((sum, seat) => sum + calculateSeatPrice(seat), 0);
  const addOnTotal = addOns.reduce((sum, addOn) => (addOn === "fast-forward" ? sum + 500 : sum), 0);
  const totalAmount = flight.Fare.BaseFare + flight.Fare.Tax + seatTotal + addOnTotal;

  const handlePayment = () => {
    const options = {
      key: "rzp_test_H6ucy17am6kIdB", // Replace with your Razorpay key
      amount: totalAmount * 100, // Amount in paise
      currency: "INR",
      name: "Flight Booking",
      description: "Payment for flight booking",
      image: "https://yourwebsite.com/logo.png",
      handler: function (response: any) {
        alert("Payment successful: " + response.razorpay_payment_id);
      },
      prefill: {
        name: "John Doe",
        email: "johndoe@example.com",
        contact: "9876543210",
      },
      theme: {
        color: "#f44336",
      },
    };

    const rzp1 = new (window as any).Razorpay(options);
    rzp1.open();
  };

  return (
    <Card className="sticky top-4">
      <div className="p-6">
        <h3 className="font-semibold mb-4">Fare Summary</h3>

        <div className="space-y-4">
          <div className="flex justify-between">
            <div>
              <div className="font-medium">Base Fare</div>
              <div className="text-sm text-gray-500">Adult (1)</div>
            </div>
            <div>₹ {flight.Fare.BaseFare.toLocaleString('en-IN')}</div>
          </div>

          <div className="flex justify-between">
            <div>
              <div className="font-medium">Taxes & Surcharges</div>
              <div className="text-sm text-gray-500">Including GST</div>
            </div>
            <div>₹ {flight.Fare.Tax.toLocaleString('en-IN')}</div>
          </div>

          {selectedSeats.length > 0 && (
            <div className="flex justify-between">
              <div>
                <div className="font-medium">Seat Charges</div>
                <div className="text-sm text-gray-500">
                  {selectedSeats.map((seat) => `${seat} (₹${calculateSeatPrice(seat)})`).join(', ')}
                </div>
              </div>
              <div>₹ {seatTotal.toLocaleString('en-IN')}</div>
            </div>
          )}

          {addOns.length > 0 && addOns.map((addOn) => (
            <div key={addOn} className="flex justify-between">
              <div>
                <div className="font-medium">{addOn === 'fast-forward' ? 'Fast Forward' : addOn}</div>
                <div className="text-sm text-gray-500">
                  {addOn === 'fast-forward' ? 'Priority Check-in + Boarding' : ''}
                </div>
              </div>
              <div>₹ {addOn === 'fast-forward' ? '500' : '0'}</div>
            </div>
          ))}

          <Separator className="my-4" />

          <div className="flex justify-between items-center font-bold">
            <span>Total Amount</span>
            <span className="text-xl">₹ {totalAmount.toLocaleString('en-IN')}</span>
          </div>

          <Button 
            className="w-full bg-red-600 text-white"
            onClick={handlePayment}
            disabled={loading}
          >
            {loading ? "Processing..." : "Continue"}
          </Button>
        </div>
      </div>
    </Card>
  );
}
