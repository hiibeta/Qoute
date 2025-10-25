import React, { useState, useEffect } from 'react';

const TimeDisplay: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    const timerId = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);

    return () => {
      clearInterval(timerId);
    };
  }, []);

  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  };

  const dateOptions: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };

  return (
    <div className="text-left text-white">
      <h1 className="text-6xl md:text-8xl font-bold tracking-tight" style={{ textShadow: '0 4px 10px rgba(0,0,0,0.5)' }}>
        {currentDate.toLocaleTimeString('vi-VN', timeOptions)}
      </h1>
      <p className="text-lg md:text-xl mt-2" style={{ textShadow: '0 2px 6px rgba(0,0,0,0.5)' }}>
        {currentDate.toLocaleDateString('vi-VN', dateOptions)}
      </p>
    </div>
  );
};

export default TimeDisplay;