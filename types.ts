
export interface Quote {
  text: string;
  author: string;
}

export interface ForecastDay {
  day: string;
  temperature: number;
  icon: string;
}

export interface WeatherData {
  city: string;
  temperature: number;
  description: string;
  icon: string;
  forecast: ForecastDay[];
}
