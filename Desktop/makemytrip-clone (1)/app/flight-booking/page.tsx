// app/flight-booking/page.tsx
import { Suspense } from 'react';
import FlightBookingClient from './components/FlightBookingClient';

export default function FlightBookingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-red-500"></div>
      </div>
    }>
      <FlightBookingClient />
    </Suspense>
  );
}