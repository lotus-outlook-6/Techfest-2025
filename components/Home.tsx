
import React, { useState, useEffect } from 'react';
import NavbarSlider from './NavbarSlider';
import RegisterButton from './RegisterButton';

interface HomeProps {
  onBack?: () => void;
}

const Home: React.FC<HomeProps> = ({ onBack }) => {
  const [showCursor, setShowCursor] = useState(true);

  // Replicating the exact signature blink logic from the landing page
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeout(() => setShowCursor(false), 50);
      setTimeout(() => setShowCursor(true), 150);
      setTimeout(() => setShowCursor(false), 250);
      setTimeout(() => setShowCursor(true), 350);
      if (Math.random() > 0.5) {
           setTimeout(() => setShowCursor(false), 450);
           setTimeout(() => setShowCursor(true), 550);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-screen w-full bg-[#050205] text-white font-mono relative overflow-y-auto overflow-x-hidden z-[100] scroll-smooth">
      
      {/* BACKGROUND FLARE - Persistent ambient light */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full h-[60vh] bg-fuchsia-950/10 blur-[180px] pointer-events-none rounded-full z-0"></div>

      {/* STICKY HEADER - Balanced proportions */}
      <header className="sticky top-0 w-full h-20 md:h-24 flex items-center justify-between px-6 md:px-12 z-[150] bg-[#050205]/95 backdrop-blur-md border-b border-fuchsia-500/10">
        
        {/* Branding Area - Styled exactly like landing page */}
        <div className="flex items-center gap-4 md:gap-5 group select-none shrink-0">
          {/* Logo Box - Updated to be a slightly rounded square instead of a squircle */}
          <div 
            onClick={onBack}
            className="w-10 h-10 md:w-12 md:h-12 bg-[#1e1e1e] border border-gray-700 rounded-sm md:rounded-md flex items-center justify-center shadow-[0_0_15px_rgba(217,70,239,0.25)] hover:scale-105 hover:border-fuchsia-500 hover:shadow-[0_0_25px_rgba(217,70,239,0.5)] transition-all duration-300 cursor-pointer"
          >
            <span className="text-fuchsia-500 font-bold text-xl md:text-2xl font-mono flex pointer-events-none">
              <span>&gt;</span>
              <span className={`${showCursor ? 'opacity-100' : 'opacity-0'}`}>_</span>
            </span>
          </div>
          
          {/* YANTRAKSH Text - Using Anton font as in central hero text */}
          <span 
            onClick={onBack}
            className="text-xl md:text-3xl font-anton tracking-[0.08em] text-white hover:text-fuchsia-400 hover:drop-shadow-[0_0_10px_rgba(217,70,239,0.4)] transition-all duration-500 uppercase cursor-pointer"
          >
            YANTRAKSH
          </span>
        </div>

        {/* Central Navigation Slider - PRESERVED */}
        <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 z-40">
            <NavbarSlider />
        </div>

        {/* Right Side CTA - PRESERVED */}
        <div className="flex items-center z-50 shrink-0">
            <RegisterButton size="sm" />
        </div>
      </header>

      {/* SCROLLABLE SECTIONS */}
      <div className="relative z-10">
        
        {/* SECTION 1: HERO */}
        <section id="home" className="min-h-[calc(100vh-5rem)] flex flex-col items-center justify-center px-4 relative">
          <div className="text-center animate-fade-in-up">
            <h2 className="text-5xl md:text-8xl font-anton tracking-widest text-white mb-6 drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]">
              THE NEXT GEN <br/> TECH FEST
            </h2>
            <p className="text-fuchsia-400 text-sm md:text-base tracking-[1em] font-bold uppercase opacity-60">
              Triguna Sen School of Technology
            </p>
          </div>
          
          <div className="absolute bottom-10 animate-bounce opacity-30">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
            </svg>
          </div>
        </section>

        {/* SECTION 2: MODULES */}
        <section id="modules" className="min-h-screen flex flex-col items-center justify-center px-4 py-24 bg-[#080308]/50">
          <div className="max-w-6xl w-full">
            <h3 className="text-3xl md:text-4xl font-anton tracking-widest text-white mb-16 flex items-center gap-6">
              <span className="w-12 h-px bg-fuchsia-500"></span>
              CORE_MODULES
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((item) => (
                <div key={item} className="group bg-[#0c0c0c] border border-fuchsia-500/20 rounded-2xl p-10 transition-all hover:border-fuchsia-500/60 hover:shadow-[0_0_40px_rgba(217,70,239,0.05)] relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 text-[10px] text-fuchsia-500/30 font-mono tracking-widest uppercase">M_0{item}</div>
                  <div className="w-16 h-16 bg-fuchsia-500/5 rounded-xl flex items-center justify-center mb-8 border border-fuchsia-500/10 group-hover:bg-fuchsia-500/10 group-hover:scale-110 transition-all">
                    <div className="w-6 h-6 bg-fuchsia-500 rounded shadow-[0_0_12px_#d946ef]"></div>
                  </div>
                  <h4 className="text-2xl font-anton tracking-wide text-white mb-4">SYSTEM PROTOCOL</h4>
                  <p className="text-base text-gray-500 leading-relaxed font-sans opacity-80">High-frequency distributed infrastructure for massive computational throughput.</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 3: GALLERY */}
        <section id="gallery" className="min-h-screen flex flex-col items-center justify-center px-4 py-24">
          <div className="max-w-6xl w-full">
             <h3 className="text-3xl md:text-4xl font-anton tracking-widest text-white mb-16 flex items-center gap-6">
               <span className="w-12 h-px bg-fuchsia-500"></span>
               VISUAL_ARCHIVE
             </h3>
             <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="aspect-square bg-[#0c0c0c] border border-white/5 rounded-xl overflow-hidden group relative flex items-center justify-center">
                    <div className="absolute inset-0 bg-fuchsia-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <span className="text-white/5 font-anton text-6xl group-hover:text-white/20 transition-colors">0{i+1}</span>
                  </div>
                ))}
             </div>
          </div>
        </section>

        {/* SECTION 4: FINAL CTA (CLIMAX) */}
        <section id="register" className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden">
          {/* Ambient Grid Floor */}
          <div className="absolute bottom-0 w-full h-[60vh] opacity-[0.07] pointer-events-none" style={{ background: 'linear-gradient(0deg, #d946ef 1px, transparent 1px), linear-gradient(90deg, #d946ef 1px, transparent 1px)', backgroundSize: '60px 60px', transform: 'perspective(600px) rotateX(65deg)' }}></div>
          
          <div className="flex flex-col items-center text-center z-20">
              <div className="mb-12">
                  <span className="text-xs md:text-sm tracking-[1.5em] text-fuchsia-400 font-bold uppercase animate-pulse">
                      Initialize Phase 01
                  </span>
              </div>
              
              <RegisterButton size="lg" />
              
              <div className="mt-24 flex items-center gap-10 opacity-30">
                  <div className="w-32 h-px bg-fuchsia-500"></div>
                  <span className="text-[12px] tracking-[0.8em] font-black text-fuchsia-100 uppercase">System Stable</span>
                  <div className="w-32 h-px bg-fuchsia-500"></div>
              </div>
          </div>
        </section>

      </div>

      {/* Persistent Scanline Effect */}
      <div className="fixed inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,20,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.02),rgba(0,255,0,0.01),rgba(0,0,255,0.02))] z-[1000] bg-[length:100%_4px,4px_100%] opacity-20"></div>

      <style>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(50px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 1.2s cubic-bezier(0.19, 1, 0.22, 1) forwards;
        }
        ::-webkit-scrollbar {
          width: 6px;
        }
        ::-webkit-scrollbar-track {
          background: #050205;
        }
        ::-webkit-scrollbar-thumb {
          background: #d946ef;
          border-radius: 10px;
          box-shadow: 0 0 10px #d946ef;
        }
      `}</style>
      
    </div>
  );
};

export default Home;
