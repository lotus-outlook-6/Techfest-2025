import React, { useState, useEffect } from 'react';

interface HomeProps {
  onBack?: () => void;
}

const Home: React.FC<HomeProps> = ({ onBack }) => {
  const [showCursor, setShowCursor] = useState(true);

  // Burst blink effect for the terminal logo cursor
  useEffect(() => {
    const runBurst = () => {
      // 3 fast blinks (toggle 6 times)
      // Off, On, Off, On, Off, On
      [0, 80, 160, 240, 320, 400].forEach((delay, i) => {
        setTimeout(() => {
          setShowCursor(i % 2 !== 0);
        }, delay);
      });
      
      // Ensure it stays 'on' after the burst
      setTimeout(() => setShowCursor(true), 500);
    };

    // Initial delay before first burst
    const initialDelay = setTimeout(runBurst, 5000);

    // Set up recurring burst every 5 seconds
    const interval = setInterval(runBurst, 5000);

    return () => {
      clearTimeout(initialDelay);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="min-h-screen w-full bg-[#050A1F] text-white font-mono flex flex-col relative overflow-hidden">
      
      {/* Top Left Container: Unified Return Button wrapping both Logo and Text */}
      <button 
        onClick={onBack}
        className="absolute top-8 left-8 z-20 flex flex-row items-center gap-5 group cursor-pointer outline-none focus:ring-0 select-none text-left"
        aria-label="Return to Landing Page"
      >
        {/* Terminal Logo Area */}
        <div className="relative w-12 h-12 md:w-14 md:h-14 bg-[#1e1e1e] rounded-lg border border-gray-700 shadow-[0_0_15px_rgba(217,70,239,0.3)] flex items-center justify-center transition-all duration-300 group-hover:scale-105 group-hover:border-fuchsia-500 group-hover:shadow-[0_0_30px_rgba(217,70,239,0.6)] active:scale-95">
          <span className="text-fuchsia-500 font-bold text-xl md:text-2xl font-mono flex items-baseline">
            <span>&gt;</span>
            <span className={`${showCursor ? 'opacity-100' : 'opacity-0'}`}>_</span>
          </span>
        </div>

        {/* YANTRAKSH Title with Glow - Hover effect adds fuchsia glow */}
        <span className="text-2xl md:text-3xl font-bold tracking-[0.15em] text-white uppercase font-sans drop-shadow-[0_0_12px_rgba(255,255,255,0.8)] transition-all duration-300 group-hover:text-fuchsia-400 group-hover:drop-shadow-[0_0_15px_rgba(217,70,239,0.8)]">
          YANTRAKSH
        </span>
      </button>

      {/* Center Content: HOME title */}
      <div className="w-full min-h-screen flex flex-col items-center justify-center z-10">
        
        {/* Title: HOME */}
        <h1 className="text-7xl md:text-9xl tracking-[0.25em] font-bold text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.2)] font-sans">
          HOME
        </h1>

      </div>
      
      {/* Background Grid Decoration */}
      <div className="absolute inset-0 pointer-events-none opacity-10 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:60px_60px]"></div>
      
      {/* Subtle Scanlines overlay */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,20,0)_50%,rgba(0,0,0,0.1)_50%)] z-[5] bg-[length:100%_4px] opacity-20"></div>
    </div>
  );
};

export default Home;