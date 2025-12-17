import React, { useState, useEffect } from 'react';

interface HomeProps {
  onBack?: () => void;
}

const Home: React.FC<HomeProps> = ({ onBack }) => {
  const [showCursor, setShowCursor] = useState(true);

  // Blink effect for the terminal logo cursor
  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen w-full bg-[#050A1F] text-white font-mono flex flex-col relative overflow-hidden">
      
      {/* Top Left Container: YANTRAKSH Title & Terminal Button */}
      <div className="absolute top-8 left-8 z-20 flex flex-col items-start gap-6">
        
        {/* YANTRAKSH Title - Bigger size */}
        <span className="text-3xl md:text-4xl font-bold tracking-widest text-white/90">
            YANTRAKSH
        </span>

        {/* Terminal Logo Button - Moved here */}
        <button 
        onClick={onBack}
        className="group relative w-16 h-16 md:w-20 md:h-20 bg-[#1e1e1e] rounded-xl border border-gray-700 shadow-[0_0_15px_rgba(217,70,239,0.3)] flex items-center justify-center transition-all duration-300 outline-none hover:scale-105 hover:border-fuchsia-500 hover:shadow-[0_0_30px_rgba(217,70,239,0.6)] active:scale-95 cursor-pointer"
        aria-label="Return to Landing Page"
        >
            <span className="text-fuchsia-500 font-bold text-2xl md:text-3xl font-mono flex items-baseline">
                <span>&gt;</span>
                <span className={`${showCursor ? 'opacity-100' : 'opacity-0'}`}>_</span>
            </span>
            
            {/* Tooltip hint on hover - Positioned to the right */}
            <span className="absolute left-full ml-4 opacity-0 group-hover:opacity-100 transition-opacity text-xs text-fuchsia-400 tracking-wider whitespace-nowrap bg-black/80 px-2 py-1 rounded border border-fuchsia-500/30">
                RETURN_SYSTEM
            </span>
        </button>
      </div>

      {/* Center Content: Just the HOME title now */}
      <div className="w-full min-h-screen flex flex-col items-center justify-center z-10">
        
        {/* Title: HOME */}
        <h1 className="text-6xl md:text-8xl tracking-[0.2em] font-bold text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
          HOME
        </h1>

      </div>
      
      {/* Background Grid Decoration */}
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
    </div>
  );
};

export default Home;