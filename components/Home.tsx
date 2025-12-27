
import React, { useState, useEffect, useRef } from 'react';
import NavbarSlider from './NavbarSlider';
import RegisterButton from './RegisterButton';

interface HomeProps {
  onBack?: () => void;
}

const Home: React.FC<HomeProps> = ({ onBack }) => {
  const [showCursor, setShowCursor] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startX = useRef(0);

  const galleryItems = [
    { id: '01', title: 'ROBOTICS_UPLINK', category: 'ENGINEERING', img: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=800' },
    { id: '02', title: 'NEURAL_INTERFACE', category: 'AI_DATA', img: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800' },
    { id: '03', title: 'CYBER_CITY_V1', category: 'ARCHITECTURE', img: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800' },
    { id: '04', title: 'BEYOND_SPACE', category: 'ASTRO_TECH', img: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800' },
    { id: '05', title: 'DRONE_SWARM', category: 'DEFENSE', img: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&q=80&w=800' },
    { id: '06', title: 'CORE_REACTOR', category: 'ENERGY', img: 'https://images.unsplash.com/photo-1517433447739-69b710427303?auto=format&fit=crop&q=80&w=800' },
    { id: '07', title: 'VOID_NAVIGATOR', category: 'QUANTUM', img: 'https://images.unsplash.com/photo-1506318137071-a8e063b4b519?auto=format&fit=crop&q=80&w=800' },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeout(() => setShowCursor(false), 50);
      setTimeout(() => setShowCursor(true), 150);
      setTimeout(() => setShowCursor(false), 250);
      setTimeout(() => setShowCursor(true), 350);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    startX.current = 'touches' in e ? e.touches[0].clientX : e.clientX;
  };

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return;
    const currentX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const diff = currentX - startX.current;
    // We keep the drag offset for visual feedback
    setDragOffset(diff * 0.7);
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    
    const threshold = 50;
    const spacing = window.innerWidth < 768 ? 140 : 280;
    
    if (Math.abs(dragOffset) > threshold) {
      // Sensitivity: how many pixels represent a full 1-item step
      // Using spacing / 1.5 makes it feel natural to drag multiple items
      const sensitivity = spacing * 0.8;
      let steps = Math.round(Math.abs(dragOffset) / sensitivity);
      
      // Ensure at least 1 step if threshold is crossed
      if (steps === 0) steps = 1;
      
      const direction = dragOffset > 0 ? -1 : 1; // Drag right moves index left
      const totalItems = galleryItems.length;
      
      // Calculate new index with proper wrapping for steps
      let newIndex = (activeIndex + (direction * steps)) % totalItems;
      if (newIndex < 0) newIndex += totalItems;
      
      setActiveIndex(newIndex);
    }
    setDragOffset(0);
  };

  return (
    <div 
      ref={scrollContainerRef}
      className="h-screen w-full bg-transparent text-white font-mono relative overflow-y-auto overflow-x-hidden z-[100] scroll-smooth pointer-events-auto select-none"
    >
      {/* STICKY HEADER */}
      <header className="sticky top-0 w-full h-20 md:h-24 flex items-center justify-between px-6 md:px-12 z-[150] bg-black/40 backdrop-blur-3xl border-b border-fuchsia-500/10 shadow-[0_4px_30px_rgba(0,0,0,0.3)] transition-all duration-300">
        <div className="flex items-center gap-4 md:gap-5 group select-none shrink-0">
          <div 
            onClick={onBack}
            className="w-10 h-10 md:w-12 md:h-12 bg-[#1e1e1e] border border-gray-700 rounded-sm md:rounded-md flex items-center justify-center shadow-[0_0_15px_rgba(217,70,239,0.25)] hover:scale-105 hover:border-fuchsia-500 hover:shadow-[0_0_25px_rgba(217,70,239,0.5)] transition-all duration-300 cursor-pointer"
          >
            <span className="text-fuchsia-500 font-bold text-xl md:text-2xl font-mono flex pointer-events-none">
              <span>&gt;</span>
              <span className={`${showCursor ? 'opacity-100' : 'opacity-0'}`}>_</span>
            </span>
          </div>
          <span 
            onClick={onBack}
            className="text-xl md:text-3xl font-anton tracking-[0.08em] text-white hover:text-fuchsia-400 hover:drop-shadow-[0_0_10px_rgba(217,70,239,0.4)] transition-all duration-500 uppercase cursor-pointer"
          >
            YANTRAKSH
          </span>
        </div>

        <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 z-40">
            <NavbarSlider />
        </div>

        <div className="flex items-center z-50 shrink-0">
            <RegisterButton size="sm" />
        </div>
      </header>

      {/* SCROLLABLE SECTIONS */}
      <div className="relative z-10">
        
        {/* SECTION 1: HERO */}
        <section id="home" className="min-h-[calc(100vh-6rem)] flex flex-col items-center justify-center px-4 relative">
          <div className="text-center animate-home-entry mb-8">
            <h2 className="text-6xl md:text-9xl font-anton tracking-tighter text-white mb-6 leading-none drop-shadow-[0_0_40px_rgba(255,255,255,0.1)]">
              THE NEXT GEN <br/> <span className="text-fuchsia-500 drop-shadow-[0_0_30px_rgba(217,70,239,0.8)]">TECH_FEST</span>
            </h2>
            <p className="text-gray-400 text-sm md:text-lg tracking-[0.5em] font-medium uppercase max-w-2xl mx-auto opacity-70">
              Assam University | Triguna Sen School of Technology
            </p>
          </div>
          
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce opacity-40 cursor-pointer z-20 hover:opacity-100 transition-opacity" onClick={() => document.getElementById('gallery')?.scrollIntoView()}>
            <svg className="w-10 h-10 drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
            </svg>
          </div>
        </section>

        {/* SECTION 2: GALLERY SECTION */}
        <section id="gallery" className="min-h-screen flex flex-col items-center justify-center py-4 bg-black/10">
          <div className="w-full max-w-[100vw] flex flex-col items-center overflow-hidden">
            
            {/* GALLERY TITLE */}
            <div className="w-full flex justify-center mb-4">
              <div className="relative inline-block px-8 py-1 bg-transparent">
                <h3 className="text-3xl md:text-6xl font-anton tracking-[0.5em] text-white uppercase flex items-center gap-4">
                  <span className="w-12 h-px bg-fuchsia-600/30"></span>
                  GALLERY
                  <span className="w-12 h-px bg-fuchsia-600/30"></span>
                </h3>
              </div>
            </div>

            {/* CIRCULAR LOOP CAROUSEL */}
            <div 
              className="relative w-full h-[280px] md:h-[420px] flex items-center justify-center perspective-[2000px] cursor-grab active:cursor-grabbing overflow-visible"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={handleMouseDown}
              onTouchMove={handleMouseMove}
              onTouchEnd={handleMouseUp}
            >
              {galleryItems.map((item, index) => {
                let relativeIndex = index - activeIndex;
                const total = galleryItems.length;
                const half = Math.floor(total / 2);
                
                // Wrap relativeIndex for circular logic
                if (relativeIndex < -half) relativeIndex += total;
                if (relativeIndex > half) relativeIndex -= total;

                const isCenter = relativeIndex === 0;
                
                // Adjusted dimensions: background images are slightly smaller than main
                const spacing = window.innerWidth < 768 ? 140 : 280;
                
                const translateX = relativeIndex * spacing + (isCenter ? dragOffset : 0);
                const translateZ = Math.abs(relativeIndex) * -300; 
                // Scale is higher now (0.9 for first side card instead of 0.85)
                const scale = 1 - Math.abs(relativeIndex) * 0.08;
                const opacity = 1 - Math.abs(relativeIndex) * 0.25; 
                const rotateY = relativeIndex * -35; 
                const zIndex = 100 - Math.abs(relativeIndex);

                return (
                  <div 
                    key={item.id}
                    className={`
                      absolute rounded-[2.2rem] overflow-hidden border
                      transition-all duration-[1000ms] ease-[cubic-bezier(0.19,1,0.22,1)]
                      ${isCenter ? 'w-[250px] md:w-[600px] border-fuchsia-500/40 shadow-[0_0_60px_rgba(217,70,239,0.25)]' : 'w-[230px] md:w-[540px] border-white/5 shadow-2xl'}
                      aspect-[16/10] bg-[#0c0c0c]
                    `}
                    style={{
                      transform: `translateX(${translateX}px) translateZ(${translateZ}px) scale(${scale}) rotateY(${rotateY}deg)`,
                      opacity: Math.max(0.1, opacity),
                      zIndex: zIndex,
                      pointerEvents: isCenter ? 'auto' : 'none',
                    }}
                  >
                    <img 
                      src={item.img} 
                      alt={item.title} 
                      className={`w-full h-full object-cover transition-all duration-1000 ${isCenter ? 'grayscale-0' : 'grayscale brightness-[0.4] contrast-125 blur-[0.5px]'}`}
                      draggable="false"
                    />
                    
                    {/* Dark gradient for non-active depth */}
                    <div className={`absolute inset-0 bg-black/50 transition-opacity duration-1000 ${isCenter ? 'opacity-0' : 'opacity-100'}`}></div>
                    
                    {/* Brackets for center card */}
                    {isCenter && (
                      <div className="absolute inset-0 pointer-events-none border-[6px] border-fuchsia-500/5">
                         <div className="absolute top-6 left-6 w-14 h-14 border-t-[3px] border-l-[3px] border-fuchsia-500 shadow-[0_0_15px_#d946ef]"></div>
                         <div className="absolute bottom-6 right-6 w-14 h-14 border-b-[3px] border-r-[3px] border-fuchsia-500 shadow-[0_0_15px_#d946ef]"></div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* DESCRIPTION TEXT */}
            <div className="mt-2 w-full flex flex-col items-center gap-0.5">
               <span className="text-fuchsia-500 text-[9px] font-bold tracking-[0.9em] uppercase opacity-50">
                   NODE_UPLINK_0{activeIndex + 1}
               </span>
               <h4 className="text-2xl md:text-5xl font-anton text-white tracking-[0.05em] uppercase drop-shadow-[0_0_20px_rgba(217,70,239,0.5)]">
                   {galleryItems[activeIndex].title}
               </h4>
               <div className="flex items-center gap-3">
                  <span className="text-gray-500 text-[10px] font-mono tracking-[0.6em] uppercase">
                      [{galleryItems[activeIndex].category}]
                  </span>
               </div>
            </div>

          </div>
        </section>

        {/* SECTION 3: REGISTER */}
        <section id="register" className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden bg-gradient-to-b from-transparent to-fuchsia-950/10">
          <div className="absolute bottom-0 w-full h-[60vh] opacity-[0.15] pointer-events-none" style={{ 
            backgroundImage: 'linear-gradient(rgba(217, 70, 239, 0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(217, 70, 239, 0.4) 1px, transparent 1px)', 
            backgroundSize: '80px 80px', 
            transform: 'perspective(1000px) rotateX(70deg) translateY(100px)',
            maskImage: 'linear-gradient(to top, black, transparent)'
          }}></div>
          
          <div className="flex flex-col items-center text-center z-20">
              <div className="mb-12 flex flex-col items-center gap-4">
                  <div className="w-12 h-12 rounded-full border border-fuchsia-500 flex items-center justify-center animate-spin-slow">
                    <div className="w-2 h-2 bg-fuchsia-500 rounded-full shadow-[0_0_15px_#d946ef]"></div>
                  </div>
                  <span className="text-[10px] md:text-xs tracking-[1.5em] text-fuchsia-400 font-bold uppercase animate-pulse">
                      Initialize_Phase_Alpha
                  </span>
              </div>
              
              <h4 className="text-4xl md:text-7xl font-anton tracking-tighter text-white mb-16 max-w-4xl px-4">
                READY TO ASCEND INTO THE <span className="text-fuchsia-500">DIGITAL_REALM?</span>
              </h4>
              
              <RegisterButton size="lg" />
          </div>
        </section>

      </div>

      <style>{`
        @keyframes home-entry {
          from { opacity: 0; transform: scale(1.05) translateY(40px); filter: blur(15px); }
          to { opacity: 1; transform: scale(1) translateY(0); filter: blur(0); }
        }
        .animate-home-entry {
          animation: home-entry 1.8s cubic-bezier(0.19, 1, 0.22, 1) forwards;
        }
        ::-webkit-scrollbar {
          width: 5px;
        }
        ::-webkit-scrollbar-track {
          background: rgba(0,0,0,0.2);
        }
        ::-webkit-scrollbar-thumb {
          background: #d946ef;
          border-radius: 10px;
          box-shadow: 0 0 10px rgba(217,70,239,0.5);
        }
        .font-anton {
          text-shadow: 0 0 20px rgba(255,255,255,0.1);
        }
      `}</style>
      
    </div>
  );
};

export default Home;
