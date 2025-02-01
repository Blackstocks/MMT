// app/flight-search/page.tsx
import { ErrorBoundary } from '../components/ErrorBoundary';
import FlightSearchClient from './components/FlightSearchClient';

export default function FlightSearchPage() {
  return (
    <ErrorBoundary>
      <FlightSearchClient />
    </ErrorBoundary>
  );
}