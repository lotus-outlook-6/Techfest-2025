
import React, { useState, useEffect } from 'react';
import NavbarSlider from './NavbarSlider';
import RegisterButton from './RegisterButton';

interface HomeProps {
  onBack?: () => void;
}

const Home: React.FC<HomeProps> = ({ onBack }) => {
  const [showCursor, setShowCursor] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  // Very fast blink effect when hovered (approx 60ms interval for high-frequency feel)
  useEffect(() => {
    if (!isHovered) {
      setShowCursor(true);
      return;
    }

    const interval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 60);

    return () => clearInterval(interval);
  }, [isHovered]);

  return (
    <div className="min-h-screen w-full bg-[#050205] text-white font-mono flex flex-col relative overflow-hidden z-[100]">
      
      {/* BACKGROUND FLARE - Soft Fuchsia Ambient Light */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[60vh] bg-fuchsia-950/20 blur-[180px] pointer-events-none rounded-full"></div>

      {/* HEADER SECTION - items-center ensures horizontal alignment */}
      <header className="w-full h-24 flex items-center justify-between px-4 md:px-8 z-50 relative">
        
        {/* Top Left: Terminal Logo Unit - Decreased Size and moved more left */}
        <button 
          onClick={onBack}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="flex items-center gap-4 group cursor-pointer outline-none select-none transition-all duration-300 z-50"
        >
          {/* Decreased icon size to w-10/12 */}
          <div className="relative w-10 h-10 md:w-12 md:h-12 bg-[#0c0c0c] rounded-lg border border-fuchsia-500/40 shadow-[0_0_10px_rgba(217,70,239,0.2)] flex items-center justify-center transition-all duration-300 group-hover:border-fuchsia-400 group-hover:shadow-[0_0_15px_rgba(217,70,239,0.5)]">
            <span className="text-fuchsia-500 font-bold text-lg md:text-xl font-mono flex items-baseline">
              <span>&gt;</span>
              <span className={`${showCursor ? 'opacity-100' : 'opacity-0'}`}>_</span>
            </span>
          </div>
          {/* Decreased text size to text-lg/xl */}
          <span className="hidden md:block text-lg md:text-xl font-black tracking-[0.2em] font-sans text-white/60 group-hover:text-white transition-colors">
            YANTRAKSH
          </span>
        </button>

        {/* Top Center: The Nav Slider 
            Positioned absolutely at the center of the screen to ensure the 3rd point is perfectly aligned with the screen center.
        */}
        <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 z-40">
            <NavbarSlider />
        </div>

        {/* Top Right: Small Header Register */}
        <div className="hidden md:flex items-center z-50">
            <RegisterButton size="sm" />
        </div>
      </header>

      {/* Main Content: Focal Central Register Action */}
      <main className="flex-1 flex flex-col items-center justify-center z-10 relative">
        {/* Ambient Grid Floor Perspective */}
        <div className="absolute bottom-0 w-full h-[40vh] opacity-10 pointer-events-none" style={{ background: 'linear-gradient(0deg, #d946ef 1px, transparent 1px), linear-gradient(90deg, #d946ef 1px, transparent 1px)', backgroundSize: '40px 40px', transform: 'perspective(500px) rotateX(60deg)' }}></div>
        
        <div className="flex flex-col items-center text-center animate-fade-in-up">
            {/* Status Indicator */}
            <div className="mb-10 opacity-40">
                <span className="text-[10px] md:text-xs tracking-[1.2em] text-fuchsia-300 font-bold uppercase">
                    Initialize Phase 01
                </span>
            </div>
            
            {/* LARGE HERO REGISTER BUTTON */}
            <RegisterButton size="lg" />
            
            {/* Footnote / Decorative line */}
            <div className="mt-16 flex items-center gap-6 opacity-20">
                <div className="w-16 h-px bg-fuchsia-500"></div>
                <span className="text-[9px] tracking-[0.6em] font-black">SYSTEM_STABLE</span>
                <div className="w-16 h-px bg-fuchsia-500"></div>
            </div>
        </div>
      </main>

      {/* Decorative Scanline Overlay */}
      <div className="fixed inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,20,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] z-[1000] bg-[length:100%_4px,4px_100%] opacity-20"></div>

      <style>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 1.2s cubic-bezier(0.19, 1, 0.22, 1) forwards;
        }
      `}</style>
      
    </div>
  );
};

export default Home;
