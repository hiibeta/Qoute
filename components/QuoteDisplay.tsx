import React from 'react';
import type { Quote } from '../types';

interface QuoteDisplayProps {
  quote: Quote | null;
  loading: boolean;
  isVisible: boolean;
}

const QuoteDisplay: React.FC<QuoteDisplayProps> = ({ quote, loading, isVisible }) => {
  return (
    <div className={`text-center text-white w-full max-w-5xl px-4 transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      {loading && !quote ? (
        <p className="text-2xl italic">Đang tìm kiếm nguồn cảm hứng...</p>
      ) : quote ? (
        <figure>
          <blockquote className="text-3xl md:text-5xl italic font-light" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.7)' }}>
            “{quote.text}”
          </blockquote>
          <figcaption className="mt-6 text-xl md:text-2xl" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}>
            — {quote.author || 'Vô danh'}
          </figcaption>
        </figure>
      ) : null}
    </div>
  );
};

export default QuoteDisplay;