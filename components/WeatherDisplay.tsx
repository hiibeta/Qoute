
import React, { useState, useEffect } from 'react';
import type { WeatherData } from '../types';

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
      const mockData: WeatherData = {
        city: "Vị trí của bạn",
        temperature: Math.floor(Math.random() * 15) + 20, // Temp between 20 and 34
        description: randomDesc,
        icon: weatherIcons[randomDesc === 'Trời quang' || randomDesc === 'Nắng gắt' ? 'Clear' : 'Clouds'],
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
    <div className="text-white text-lg font-medium" style={{ textShadow: '0 2px 6px rgba(0,0,0,0.5)' }}>
      {error && <p>{error}</p>}
      {!weather && !error && <p>Đang tải thời tiết...</p>}
      {weather && (
        <div className="flex items-center gap-3">
          <span className="text-3xl">{weather.icon}</span>
          <div>
            <p className="font-bold text-xl">{weather.temperature}°C</p>
            <p className="text-base">{weather.city}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherDisplay;
