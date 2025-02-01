// app/flight-search/page.tsx
import { Suspense } from 'react';
import FlightSearchClient from './components/FlightSearchClient';

export default function FlightSearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <FlightSearchClient />
    </Suspense>
  );
}