import React, { useState, useEffect, useCallback } from 'react';
import TimeDisplay from './components/TimeDisplay';
import WeatherDisplay from './components/WeatherDisplay';
import QuoteDisplay from './components/QuoteDisplay';
import { generateQuote } from './services/geminiService';
import type { Quote } from './types';

const App: React.FC = () => {
  const [quote, setQuote] = useState<Quote | null>(null);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [isContentVisible, setIsContentVisible] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNewQuoteAndImage = useCallback(async () => {
    setLoading(true);
    setIsContentVisible(false); // Start fade-out

    try {
      const newQuote = await generateQuote();
      // Use Date.now() to ensure a new image is fetched each time
      const newImageUrl = `https://picsum.photos/1920/1080?random=${Date.now()}`;
      
      // Preload image before setting state to ensure it's ready
      const img = new Image();
      img.src = newImageUrl;
      img.onload = () => {
          setTimeout(() => {
              setQuote(newQuote);
              setImageUrl(newImageUrl);
              setError(null);
              setLoading(false);
              setIsContentVisible(true); // Start fade-in
          }, 500); // Small delay to allow fade-out to complete
      };
      img.onerror = () => {
          // Fallback if image fails to load
          setQuote(newQuote);
          setError("Không thể tải ảnh nền.");
          setLoading(false);
          setIsContentVisible(true);
      };

    } catch (err) {
      setError("Không thể lấy trích dẫn mới.");
      setLoading(false);
      setIsContentVisible(true);
    }
  }, []);

  useEffect(() => {
    fetchNewQuoteAndImage(); // Initial fetch
    const intervalId = setInterval(fetchNewQuoteAndImage, 10000); // Fetch every 10 seconds

    return () => clearInterval(intervalId); // Cleanup on unmount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main 
      className="h-screen w-screen bg-cover bg-center transition-all duration-1000 ease-in-out"
      style={{ backgroundImage: `url(${imageUrl})` }}
    >
      <div className="relative h-full w-full bg-black/50 p-6 md:p-12 text-white">
        <header className="absolute top-6 left-6 md:top-12 md:left-12">
          <TimeDisplay />
        </header>

        <aside className="absolute top-6 right-6 md:top-12 md:right-12">
          <WeatherDisplay />
        </aside>

        <section className="h-full flex items-center justify-center">
           <QuoteDisplay quote={quote} loading={loading} isVisible={isContentVisible} />
        </section>

        {error && <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-red-400">{error}</p>}
      </div>
    </main>
  );
};

export default App;