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

  // Tìm nạp một câu trích dẫn mới và xử lý hoạt ảnh mờ dần cho văn bản
  const fetchNewQuote = useCallback(async () => {
    setLoading(true);
    setIsContentVisible(false); // Bắt đầu mờ dần cho câu trích dẫn

    try {
      const newQuote = await generateQuote();
      // Chờ cho hiệu ứng mờ dần hoàn tất trước khi cập nhật nội dung và làm mờ dần
      setTimeout(() => {
        setQuote(newQuote);
        setError(null);
        setLoading(false);
        setIsContentVisible(true); // Bắt đầu làm mờ dần
      }, 500);
    } catch (err) {
      setError("Không thể lấy trích dẫn mới.");
      setLoading(false);
      setIsContentVisible(true);
    }
  }, []);

  // Tìm nạp một hình nền mới
  const fetchNewImage = useCallback(() => {
    const newImageUrl = `https://picsum.photos/1920/1080?random=${Date.now()}`;
    const img = new Image();
    img.src = newImageUrl;
    img.onload = () => {
      setImageUrl(newImageUrl);
    };
    img.onerror = () => {
      // Không hiển thị lỗi cho nền, chỉ ghi lại nó. Ứng dụng có thể hoạt động mà không có nó.
      console.error("Không thể tải ảnh nền.");
    };
  }, []);

  useEffect(() => {
    // Tìm nạp ban đầu cho cả hai
    fetchNewQuote();
    fetchNewImage();

    // Thiết lập các khoảng thời gian
    const quoteIntervalId = setInterval(fetchNewQuote, 30000); // Tìm nạp câu trích dẫn sau mỗi 30 giây
    const imageIntervalId = setInterval(fetchNewImage, 60000); // Tìm nạp hình ảnh sau mỗi 1 phút (60 * 1000 ms)

    return () => {
      clearInterval(quoteIntervalId);
      clearInterval(imageIntervalId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Chỉ chạy một lần khi gắn kết

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
