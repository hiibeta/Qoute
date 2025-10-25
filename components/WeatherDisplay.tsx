
import React, { useState, useEffect } from 'react';
import type { WeatherData, ForecastDay } from '../types';

// Mock weather icons
const weatherIcons: { [key: string]: string } = {
  Clear: '☀️',
  Clouds: '☁️',
  Rain: '🌧️',
  Drizzle: '🌦️',
  Thunderstorm: '⛈️',
  Snow: '❄️',
  Mist: '🌫️',
};

// Mock weather fetching function as we don't have a real API key for frontend
const fetchMockWeather = (lat: number, lon: number): Promise<WeatherData> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockDescriptions = ['Trời quang', 'Nhiều mây', 'Mưa nhẹ', 'Nắng gắt'];
      const randomDesc = mockDescriptions[Math.floor(Math.random() * mockDescriptions.length)];
      
      const days = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
      const today = new Date().getDay();
      const mockForecast: ForecastDay[] = [];
      const iconKeys = Object.keys(weatherIcons);

      for (let i = 1; i <= 3; i++) {
        const dayIndex = (today + i) % 7;
        const randomIconKey = iconKeys[Math.floor(Math.random() * iconKeys.length)];
        mockForecast.push({
          day: days[dayIndex],
          temperature: Math.floor(Math.random() * 10) + 22, // Temp between 22 and 31
          icon: weatherIcons[randomIconKey],
        });
      }

      const mockData: WeatherData = {
        city: "Vị trí của bạn",
        temperature: Math.floor(Math.random() * 15) + 20, // Temp between 20 and 34
        description: randomDesc,
        icon: weatherIcons[randomDesc === 'Trời quang' || randomDesc === 'Nắng gắt' ? 'Clear' : 'Clouds'],
        forecast: mockForecast,
      };
      resolve(mockData);
    }, 500);
  });
};


const WeatherDisplay: React.FC = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Trình duyệt không hỗ trợ định vị.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const weatherData = await fetchMockWeather(latitude, longitude);
          setWeather(weatherData);
        } catch (err) {
          setError("Không thể lấy dữ liệu thời tiết.");
        }
      },
      () => {
        setError("Không thể truy cập vị trí.");
      }
    );
  }, []);

  return (
    <div className="text-white p-4 rounded-xl bg-black/20 backdrop-blur-sm" style={{ textShadow: '0 2px 6px rgba(0,0,0,0.5)' }}>
      {error && <p className="text-sm">{error}</p>}
      {!weather && !error && <p className="text-sm">Đang tải thời tiết...</p>}
      {weather && (
        <div>
          {/* Current Weather */}
          <div className="flex items-center gap-4">
            <div className="text-4xl">{weather.icon}</div>
            <div>
              <p className="font-bold text-2xl">{weather.temperature}°C</p>
              <p className="text-sm">{weather.description}</p>
              <p className="text-xs text-gray-300">{weather.city}</p>
            </div>
          </div>
          
          {/* Divider */}
          <hr className="my-3 border-white/20" />

          {/* Forecast */}
          <div className="flex justify-around gap-2 text-center">
            {weather.forecast.map((day) => (
              <div key={day.day} className="flex flex-col items-center">
                <p className="font-medium text-sm">{day.day}</p>
                <p className="text-2xl my-1">{day.icon}</p>
                <p className="font-semibold text-sm">{day.temperature}°</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherDisplay;
