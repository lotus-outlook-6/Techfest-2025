
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
    
    // Trigger glitch effect - now persists as long as hovered
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
      className={`group relative outline-none transition-all duration-500 flex flex-col items-center justify-center overflow-visible ${isLarge ? 'px-12 py-5 md:px-20 md:py-7' : 'px-8 py-2.5 md:px-10 md:py-3'} ${className}`}
    >
      
      {/* 1. BACKGROUND GLOW */}
      <div className={`absolute inset-0 bg-fuchsia-600/10 blur-3xl rounded-full transition-opacity duration-700 ${isHovered ? 'opacity-100' : 'opacity-0'}`}></div>

      {/* 2. MAIN SOLID CHASSIS - Connected Geometry */}
      <div 
        className={`
          absolute inset-0 bg-[#0c0c0c] border-2 border-fuchsia-500/40 transition-all duration-500 
          group-hover:border-fuchsia-500 group-hover:scale-[1.02]
          shadow-[inset_0_0_15px_rgba(217,70,239,0.15)]
        `}
        style={{
          // Main octagonal frame
          clipPath: 'polygon(12px 0%, calc(100% - 12px) 0%, 100% 12px, 100% calc(100% - 12px), calc(100% - 12px) 100%, 12px 100%, 0% calc(100% - 12px), 0% 12px)'
        }}
      >
        {/* Subtle Internal Grid */}
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[radial-gradient(#d946ef_1px,transparent_1px)] bg-[size:8px_8px]"></div>
        
        {/* 3. INTEGRATED SIDE GAUGE */}
        <div className="absolute left-2.5 top-3 bottom-3 w-[2px] bg-fuchsia-950/50 rounded-full overflow-hidden">
          <div 
            className={`absolute bottom-0 left-0 w-full bg-fuchsia-500 transition-all duration-1000 ease-out shadow-[0_0_6px_#d946ef] ${isHovered ? 'h-full' : 'h-[20%]'}`}
          ></div>
        </div>

        {/* 4. ACTIVE SCANNER */}
        <div className={`absolute inset-0 pointer-events-none transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
            <div className="absolute top-0 left-0 w-full h-[1.5px] bg-fuchsia-400/50 blur-[1px] animate-[scan_4s_linear_infinite]"></div>
        </div>

        {/* 5. REINFORCED CORNERS - Connected Accents */}
        <div className="absolute top-0 right-0 w-6 h-6 pointer-events-none">
            <div className="absolute top-[2px] right-[12px] w-3 h-[2px] bg-fuchsia-400 group-hover:w-5 transition-all duration-500"></div>
            <div className="absolute top-[12px] right-[2px] h-3 w-[2px] bg-fuchsia-400 group-hover:h-5 transition-all duration-500"></div>
        </div>
        <div className="absolute bottom-0 left-0 w-6 h-6 pointer-events-none rotate-180">
            <div className="absolute top-[2px] right-[12px] w-3 h-[2px] bg-fuchsia-400 group-hover:w-5 transition-all duration-500"></div>
            <div className="absolute top-[12px] right-[2px] h-3 w-[2px] bg-fuchsia-400 group-hover:h-5 transition-all duration-500"></div>
        </div>
      </div>

      {/* 6. EXTERNAL HUD FRAME (Brackets) */}
      <div className={`absolute -inset-1.5 border border-fuchsia-500/20 transition-all duration-700 pointer-events-none ${isHovered ? 'opacity-100 scale-100 blur-0' : 'opacity-0 scale-110 blur-sm'}`}
        style={{ clipPath: 'polygon(0 0, 10% 0, 10% 2px, 2px 2px, 2px 10%, 0 10%)' }}
      ></div>
      <div className={`absolute -inset-1.5 border border-fuchsia-500/20 transition-all duration-700 pointer-events-none rotate-90 ${isHovered ? 'opacity-100 scale-100 blur-0' : 'opacity-0 scale-110 blur-sm'}`}
        style={{ clipPath: 'polygon(0 0, 10% 0, 10% 2px, 2px 2px, 2px 10%, 0 10%)' }}
      ></div>
      <div className={`absolute -inset-1.5 border border-fuchsia-500/20 transition-all duration-700 pointer-events-none rotate-180 ${isHovered ? 'opacity-100 scale-100 blur-0' : 'opacity-0 scale-110 blur-sm'}`}
        style={{ clipPath: 'polygon(0 0, 10% 0, 10% 2px, 2px 2px, 2px 10%, 0 10%)' }}
      ></div>
      <div className={`absolute -inset-1.5 border border-fuchsia-500/20 transition-all duration-700 pointer-events-none rotate-270 ${isHovered ? 'opacity-100 scale-100 blur-0' : 'opacity-0 scale-110 blur-sm'}`}
        style={{ clipPath: 'polygon(0 0, 10% 0, 10% 2px, 2px 2px, 2px 10%, 0 10%)' }}
      ></div>

      {/* 7. TEXT CONTENT */}
      <div className="relative z-10 flex flex-col items-center">
        {isLarge && (
          <div className={`flex items-center gap-2 mb-2 transition-all duration-500 ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-40 translate-y-1'}`}>
            <span className="w-1 h-1 bg-fuchsia-500 rounded-full shadow-[0_0_6px_#d946ef] animate-pulse"></span>
            <span className="text-[8px] font-mono tracking-[0.5em] text-fuchsia-300">
              UPLINK_ESTABLISHED
            </span>
          </div>
        )}
        
        {/* PRIMARY LABEL - Preserving 'Anton' */}
        <span className={`
          text-white font-anton tracking-[0.05em] transition-all duration-500 leading-none
          group-hover:scale-105 group-hover:drop-shadow-[0_0_12px_rgba(217,70,239,0.7)]
          ${isGlitching ? 'animate-[glitch-shadow_0.25s_infinite]' : ''}
          ${isLarge ? 'text-2xl md:text-4xl' : 'text-base md:text-xl'}
        `}>
          REGISTER
        </span>

        {isLarge && (
          <div className={`mt-3 flex items-center gap-2 transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-20'}`}>
            <span className="text-[7px] font-mono tracking-widest text-gray-500 uppercase">Secured Port</span>
            <div className="flex gap-1">
               <div className={`w-0.5 h-0.5 bg-fuchsia-500 transition-all ${isHovered ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`}></div>
               <div className={`w-0.5 h-0.5 bg-fuchsia-500 transition-all delay-100 ${isHovered ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`}></div>
               <div className={`w-0.5 h-0.5 bg-fuchsia-500 transition-all delay-200 ${isHovered ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`}></div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes scan {
          0% { transform: translateY(0); opacity: 0; }
          10% { opacity: 0.8; }
          90% { opacity: 0.8; }
          100% { transform: translateY(100%); opacity: 0; }
        }
        @keyframes glitch-shadow {
          0% { text-shadow: 2px 0 #ff00ff, -2px 0 #00ffff; transform: translate(0); }
          20% { text-shadow: -2px 0 #ff00ff, 2px 0 #00ffff; transform: translate(-1.5px, 0.5px); }
          40% { text-shadow: 2px -1.5px #ff00ff, -2px 1.5px #00ffff; transform: translate(1.5px, -0.5px); }
          60% { text-shadow: -1.5px 2px #ff00ff, 1.5px -2px #00ffff; transform: translate(-0.5px, -1.5px); }
          80% { text-shadow: 2px 0 #ff00ff, -2px 0 #00ffff; transform: translate(0.5px, 1.5px); }
          100% { text-shadow: 0 0 #ff00ff, 0 0 #00ffff; transform: translate(0); }
        }
      `}</style>
    </button>
  );
};

export default RegisterButton;
