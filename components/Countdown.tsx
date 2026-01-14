import React, { useState, useEffect } from 'react';

const Countdown: React.FC = () => {
  const [time, setTime] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    milliseconds: 0
  });

  useEffect(() => {
    // Set target date to March 25, 2026
    const targetDate = new Date('March 25, 2026 00:00:00').getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTime({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
          milliseconds: Math.floor((difference % 1000) / 10)
        });
      } else {
        // Stop at zero
        setTime({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          milliseconds: 0
        });
        clearInterval(interval);
      }
    }, 50);

    return () => clearInterval(interval);
  }, []);

  const format = (num: number) => num.toString().padStart(2, '0');

  // Reusable Separator Component
  const Separator = () => (
    <div className="text-4xl md:text-5xl font-bold tracking-widest opacity-60 text-white/80 pb-1">:</div>
  );

  return (
    <div className="flex gap-4 md:gap-6 items-start justify-center text-white select-none drop-shadow-[0_0_5px_rgba(217,70,239,0.5)]">
      <div className="flex flex-col items-center">
        <span className="text-4xl md:text-5xl font-bold tracking-widest">{format(time.days)}</span>
        <span className="text-[10px] md:text-xs text-fuchsia-400 mt-1 uppercase tracking-widest">Days</span>
      </div>
      
      <Separator />

      <div className="flex flex-col items-center">
        <span className="text-4xl md:text-5xl font-bold tracking-widest">{format(time.hours)}</span>
        <span className="text-[10px] md:text-xs text-fuchsia-400 mt-1 uppercase tracking-widest">Hrs</span>
      </div>

      <Separator />

      <div className="flex flex-col items-center">
        <span className="text-4xl md:text-5xl font-bold tracking-widest">{format(time.minutes)}</span>
        <span className="text-[10px] md:text-xs text-fuchsia-400 mt-1 uppercase tracking-widest">Min</span>
      </div>

      <Separator />

      <div className="flex flex-col items-center">
        <span className="text-4xl md:text-5xl font-bold tracking-widest w-16 text-center">{format(time.seconds)}</span>
        <span className="text-[10px] md:text-xs text-fuchsia-400 mt-1 uppercase tracking-widest">Sec</span>
      </div>
    </div>
  );
};

export default Countdown;