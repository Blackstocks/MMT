// types/flight.ts

export interface FlightSegment {
    Baggage: string;
    CabinBaggage: string;
    CabinClass: number;
    Airline: {
      AirlineCode: string;
      AirlineName: string;
      FlightNumber: string;
      FareClass: string;
      OperatingCarrier: string;
    };
    Origin: {
      Airport: {
        AirportCode: string;
        AirportName: string;
        Terminal: string;
        CityCode: string;
        CityName: string;
        CountryCode: string;
      };
    };
    Destination: {
      Airport: {
        AirportCode: string;
        AirportName: string;
        Terminal: string;
        CityCode: string;
        CityName: string;
        CountryCode: string;
      };
    };
    DepartureTime: string;
    ArrivalTime: string;
    Duration: string;
  }
  
  export interface FlightFare {
    Currency: string;
    BaseFare: number;
    Tax: number;
    YQTax: number;
    AdditionalTxnFeeOfrd: number;
    AdditionalTxnFeePub: number;
    PublishedFare: number;
    OfferedFare: number;
  }
  
  export interface Flight {
    ResultIndex: string;
    Source: number;
    IsLCC: boolean;
    IsRefundable: boolean;
    Segments: FlightSegment[][];
    Fare: FlightFare;
  }
  
  export interface FlightFilters {
    priceRange: [number, number];
    stops: string[];
    airlines: string[];
    departureTime: string[];
    arrivalTime: string[];
    sortBy: string;
  }