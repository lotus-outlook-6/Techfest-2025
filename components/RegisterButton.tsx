
import React, { useState, useEffect, useRef } from 'react';

interface RegisterButtonProps {
  className?: string;
  size?: 'sm' | 'lg';
}

const RegisterButton: React.FC<RegisterButtonProps> = ({ className = "", size = "sm" }) => {
  const isLarge = size === 'lg';
  const [isHovered, setIsHovered] = useState(false);
  const [isGlitching, setIsGlitching] = useState(false);
  const glitchTimeoutRef = useRef<number | null>(null);

  const handleMouseEnter = () => {
    setIsHovered(true);
    
    // Trigger glitch effect
    setIsGlitching(true);
    if (glitchTimeoutRef.current) window.clearTimeout(glitchTimeoutRef.current);

    // Play a short UI sound
    const audio = new Audio('https://cdn.pixabay.com/audio/2022/03/10/audio_c36203a95c.mp3');
    audio.volume = 0.1;
    audio.play().catch(() => {});
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setIsGlitching(false);
    if (glitchTimeoutRef.current) window.clearTimeout(glitchTimeoutRef.current);
  };

  useEffect(() => {
    return () => {
      if (glitchTimeoutRef.current) window.clearTimeout(glitchTimeoutRef.current);
    };
  }, []);

  return (
    <button 
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`group relative outline-none transition-all duration-500 flex flex-col items-center justify-center overflow-visible ${isLarge ? 'px-16 py-3.5 md:px-20 md:py-4' : 'px-8 py-2 md:px-10 md:py-3'} ${className}`}
    >
      
      {/* 1. BACKGROUND GLOW */}
      <div className={`absolute inset-0 bg-fuchsia-600/5 blur-2xl rounded-full transition-opacity duration-700 ${isHovered ? 'opacity-100' : 'opacity-0'}`}></div>

      {/* 2. MAIN SOLID CHASSIS - Updated for more horizontal stretch */}
      <div 
        className={`
          absolute inset-0 bg-[#0c0c0c] border border-fuchsia-500/30 transition-all duration-500 
          group-hover:border-fuchsia-500 group-hover:scale-[1.01]
          shadow-[inset_0_0_10px_rgba(217,70,239,0.1)]
        `}
        style={{
          // More subtle octagonal frame (4px cuts for tighter corners)
          clipPath: 'polygon(4px 0%, calc(100% - 4px) 0%, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 0% calc(100% - 4px), 0% 4px)'
        }}
      >
        {/* Subtle Internal Grid */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#d946ef_1px,transparent_1px)] bg-[size:6px_6px]"></div>
        
        {/* 3. INTEGRATED SIDE GAUGE (Minimized) */}
        <div className="absolute left-1.5 top-2 bottom-2 w-[1px] bg-fuchsia-950/30 rounded-full overflow-hidden">
          <div 
            className={`absolute bottom-0 left-0 w-full bg-fuchsia-500/60 transition-all duration-1000 ease-out shadow-[0_0_4px_#d946ef] ${isHovered ? 'h-full' : 'h-[10%]'}`}
          ></div>
        </div>

        {/* 4. ACTIVE SCANNER */}
        <div className={`absolute inset-0 pointer-events-none transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
            <div className="absolute top-0 left-0 w-full h-[1px] bg-fuchsia-400/30 blur-[0.5px] animate-[scan_3s_linear_infinite]"></div>
        </div>

        {/* 5. CORNER ACCENTS (Reduced size) */}
        <div className="absolute top-0 right-0 w-4 h-4 pointer-events-none">
            <div className="absolute top-[1.5px] right-[4px] w-2 h-[1px] bg-fuchsia-400/80 group-hover:w-4 transition-all duration-500"></div>
            <div className="absolute top-[4px] right-[1.5px] h-2 w-[1px] bg-fuchsia-400/80 group-hover:h-4 transition-all duration-500"></div>
        </div>
        <div className="absolute bottom-0 left-0 w-4 h-4 pointer-events-none rotate-180">
            <div className="absolute top-[1.5px] right-[4px] w-2 h-[1px] bg-fuchsia-400/80 group-hover:w-4 transition-all duration-500"></div>
            <div className="absolute top-[4px] right-[1.5px] h-2 w-[1px] bg-fuchsia-400/80 group-hover:h-4 transition-all duration-500"></div>
        </div>
      </div>

      {/* 6. EXTERNAL HUD FRAME (Minimized Brackets) */}
      <div className={`absolute -inset-1 border border-fuchsia-500/10 transition-all duration-700 pointer-events-none ${isHovered ? 'opacity-100 scale-100 blur-0' : 'opacity-0 scale-105 blur-sm'}`}
        style={{ clipPath: 'polygon(0 0, 8% 0, 8% 1px, 1px 1px, 1px 8%, 0 8%)' }}
      ></div>
      <div className={`absolute -inset-1 border border-fuchsia-500/10 transition-all duration-700 pointer-events-none rotate-180 ${isHovered ? 'opacity-100 scale-100 blur-0' : 'opacity-0 scale-105 blur-sm'}`}
        style={{ clipPath: 'polygon(0 0, 8% 0, 8% 1px, 1px 1px, 1px 8%, 0 8%)' }}
      ></div>

      {/* 7. TEXT CONTENT */}
      <div className="relative z-10 flex flex-col items-center">
        <span className={`
          text-white font-anton tracking-[0.08em] transition-all duration-500 leading-none
          group-hover:drop-shadow-[0_0_8px_rgba(217,70,239,0.5)]
          ${isGlitching ? 'animate-[glitch-shadow_0.2s_infinite]' : ''}
          ${isLarge ? 'text-2xl md:text-3xl' : 'text-sm md:text-lg'}
        `}>
          REGISTER
        </span>
      </div>

      <style>{`
        @keyframes scan {
          0% { transform: translateY(0); opacity: 0; }
          20% { opacity: 0.5; }
          80% { opacity: 0.5; }
          100% { transform: translateY(100%); opacity: 0; }
        }
        @keyframes glitch-shadow {
          0% { text-shadow: 1.5px 0 #ff00ff, -1.5px 0 #00ffff; transform: translate(0); }
          50% { text-shadow: -1.5px 0 #ff00ff, 1.5px 0 #00ffff; transform: translate(-1px, 0.5px); }
          100% { text-shadow: 0 0 #ff00ff, 0 0 #00ffff; transform: translate(0); }
        }
      `}</style>
    </button>
  );
};

export default RegisterButton;
