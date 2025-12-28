
import React, { useState, useEffect, useRef, useMemo } from 'react';
import NavbarSlider from './NavbarSlider';
import RegisterButton from './RegisterButton';

interface HomeProps {
  onBack?: () => void;
}

const Home: React.FC<HomeProps> = ({ onBack }) => {
  const [showCursor, setShowCursor] = useState(true);
  const [rotation, setRotation] = useState(0); 
  const [isDragging, setIsDragging] = useState(false);
  const [aboutSlide, setAboutSlide] = useState(0); // 0: Yantraksh, 1: AU Silchar
  const [arrowsHovered, setArrowsHovered] = useState(false);
  
  const startX = useRef(0);
  const startRotation = useRef(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const galleryItems = useMemo(() => [
    { 
      id: '01', 
      title: 'ROBOTICS_UPLINK', 
      description: 'Synchronized biomechanical limbs operating through a decentralized neural network for high-precision tasks.',
      img: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=800' 
    },
    { 
      id: '02', 
      title: 'NEURAL_INTERFACE', 
      description: 'Advanced brain-computer mapping enabling direct data transfer between human cognition and digital storage.',
      img: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800' 
    },
    { 
      id: '03', 
      title: 'CYBER_CITY_V1', 
      description: 'A modular urban landscape designed for efficiency, powered entirely by sustainable quantum fusion reactors.',
      img: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800' 
    },
    { 
      id: '04', 
      title: 'BEYOND_SPACE', 
      description: 'Next-generation orbital propulsion systems designed for deep-space exploration and interstellar logistics.',
      img: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800' 
    },
    { 
      id: '05', 
      title: 'DRONE_SWARM', 
      description: 'Autonomous aerial units utilizing collective intelligence for rapid environmental mapping and defense monitoring.',
      img: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&q=80&w=800' 
    },
    { 
      id: '06', 
      title: 'CORE_REACTOR', 
      description: 'The heartbeat of the station, managing trillions of calculations per second to maintain planetary stability.',
      img: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800' 
    },
    { 
      id: '07', 
      title: 'VOID_NAVIGATOR', 
      description: 'Quantum positioning hardware capable of threading through sub-atomic dimensions for instantaneous travel.',
      img: 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&q=80&w=800' 
    },
  ], []);

  const aboutContent = useMemo(() => [
    {
      title: "YANTRAKSH?",
      description: "Yantraksh is the flagship annual technical festival of the Triguna Sen School of Technology, Assam University. It stands as a nexus where imagination meets engineering, inviting pioneers from across the nation to solve real-world complexities. From autonomous robotics to deep-level neural algorithms, Yantraksh is the crucible for the next generation of digital architects.",
      themeColor: "text-fuchsia-500",
      rawThemeColor: "#d946ef",
      glowColor: "rgba(217, 70, 239, 0.8)",
      accentColor: "border-fuchsia-500/40",
      bgGlow: "bg-fuchsia-900/5",
      glowClass: "drop-shadow-[0_0_20px_rgba(217,70,239,0.8)]"
    },
    {
      title: "ASSAM UNIVERSITY SILCHAR",
      description: "Assam University, a central university established in 1994, is situated in Dargakona, near Silchar. Spread across 600 acres, it hosts 16 schools and 42 departments. The university is a hub for academic excellence in Northeast India, providing a multi-cultural environment and cutting-edge research opportunities for students across diverse fields of science, technology, and humanities.",
      themeColor: "text-lime-400",
      rawThemeColor: "#a3e635",
      glowColor: "rgba(163, 230, 53, 0.8)",
      accentColor: "border-lime-400/40",
      bgGlow: "bg-lime-900/5",
      glowClass: "drop-shadow-[0_0_20px_rgba(163,230,53,0.8)]"
    }
  ], []);

  const activeIndex = useMemo(() => {
    const count = galleryItems.length;
    const angleStep = 360 / count;
    let normalized = ((-rotation % 360) + 360) % 360;
    let nearest = Math.round(normalized / angleStep) % count;
    return nearest;
  }, [rotation, galleryItems.length]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeout(() => setShowCursor(false), 50);
      setTimeout(() => setShowCursor(true), 150);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    startX.current = 'touches' in e ? e.touches[0].clientX : e.clientX;
    startRotation.current = rotation;
  };

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return;
    const currentX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const diff = currentX - startX.current;
    
    const sensitivity = window.innerWidth < 768 ? 600 : 1200;
    const rotationChange = (diff / sensitivity) * 360;
    
    setRotation(startRotation.current + rotationChange);
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    
    const count = galleryItems.length;
    const angleStep = 360 / count;
    const nearestRotation = Math.round(rotation / angleStep) * angleStep;
    
    setRotation(nearestRotation);
  };

  const nextSlide = () => {
    setAboutSlide((prev) => (prev + 1) % aboutContent.length);
  };

  const prevSlide = () => {
    setAboutSlide((prev) => (prev - 1 + aboutContent.length) % aboutContent.length);
  };

  const currentAbout = aboutContent[aboutSlide];

  return (
    <div 
      ref={scrollContainerRef}
      className="h-screen w-full bg-transparent text-white font-mono relative overflow-y-auto overflow-x-hidden z-[100] scroll-smooth pointer-events-auto select-none"
    >
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

      <div className="relative z-10">
        {/* HERO SECTION */}
        <section id="home" className="min-h-[calc(100vh-6rem)] flex flex-col items-center justify-center px-4 relative">
          <div className="text-center animate-home-entry mb-8">
            <h2 className="text-6xl md:text-9xl font-anton tracking-tighter text-white mb-6 leading-none drop-shadow-[0_0_40px_rgba(255,255,255,0.1)]">
              THE NEXT GEN <br/> <span className="text-fuchsia-500 drop-shadow-[0_0_30px_rgba(217,70,239,0.8)]">TECH_FEST</span>
            </h2>
            <p className="text-gray-400 text-sm md:text-lg tracking-[0.5em] font-medium uppercase max-w-2xl mx-auto opacity-70">
              Assam University | Triguna Sen School of Technology
            </p>
          </div>
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce opacity-40 cursor-pointer z-20 hover:opacity-100 transition-opacity" onClick={() => document.getElementById('about')?.scrollIntoView()}>
            <svg className="w-10 h-10 drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
            </svg>
          </div>
        </section>

        {/* REFINED ABOUT SECTION */}
        <section id="about" className="min-h-screen flex flex-col items-center justify-center px-4 relative bg-[#050505] overflow-hidden">
            {/* Ambient Background Glows */}
            <div className={`absolute top-1/4 left-1/4 w-[500px] h-[500px] transition-colors duration-1000 blur-[150px] rounded-full pointer-events-none ${currentAbout.bgGlow}`}></div>
            <div className={`absolute bottom-1/4 right-1/4 w-[500px] h-[500px] transition-colors duration-1000 blur-[150px] rounded-full pointer-events-none ${aboutSlide === 0 ? 'bg-blue-900/5' : 'bg-lime-900/5'}`}></div>

            {/* Top Decoration */}
            <div className="absolute top-24 left-1/2 -translate-x-1/2 flex flex-col items-center opacity-60 pointer-events-none z-20">
                <div className="w-full flex items-center justify-center">
                    <div className={`h-[1px] w-24 md:w-64 transition-colors duration-1000 ${aboutSlide === 0 ? 'bg-fuchsia-500/20' : 'bg-lime-400/20'}`}></div>
                    <div className={`w-32 md:w-64 h-[2.5px] transition-all duration-1000 relative flex items-center justify-between px-0.5 ${aboutSlide === 0 ? 'bg-fuchsia-500 shadow-[0_0_20px_#d946ef]' : 'bg-lime-400 shadow-[0_0_20px_#a3e635]'}`}>
                        <div className={`w-2.5 h-2.5 bg-black rotate-45 border-2 transition-colors duration-1000 -ml-1.5 ${aboutSlide === 0 ? 'border-fuchsia-400 shadow-[0_0_8px_#d946ef]' : 'border-lime-300 shadow-[0_0_8px_#a3e635]'}`}></div>
                        <div className={`w-2.5 h-2.5 bg-black rotate-45 border-2 transition-colors duration-1000 -mr-1.5 ${aboutSlide === 0 ? 'border-fuchsia-400 shadow-[0_0_8px_#d946ef]' : 'border-lime-300 shadow-[0_0_8px_#a3e635]'}`}></div>
                    </div>
                    <div className={`h-[1px] w-24 md:w-64 transition-colors duration-1000 ${aboutSlide === 0 ? 'bg-fuchsia-500/20' : 'bg-lime-400/20'}`}></div>
                </div>
            </div>

            <div className="relative w-full max-w-7xl flex items-center justify-center mt-12 px-12 md:px-24">
                
                {/* Clickable Left Arrow */}
                <button 
                  onClick={prevSlide}
                  onMouseEnter={() => setArrowsHovered(true)}
                  onMouseLeave={() => setArrowsHovered(false)}
                  className="absolute left-0 md:left-4 z-40 group outline-none transition-transform hover:scale-110 active:scale-95"
                >
                    <svg 
                      className={`w-12 h-16 md:w-16 md:h-24 transition-all duration-300 ${arrowsHovered ? 'opacity-100' : 'animate-rapid-arrow-blink'}`} 
                      viewBox="0 0 40 100"
                      style={{ 
                        color: currentAbout.rawThemeColor,
                        filter: arrowsHovered ? `drop-shadow(0 0 20px ${currentAbout.rawThemeColor})` : 'none'
                      }}
                    >
                        <polyline points="35,10 5,50 35,90" fill="none" stroke="currentColor" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>

                {/* Elongated Rectangle Box */}
                <div className={`bg-[#0c0c0c]/90 backdrop-blur-3xl border p-8 md:p-16 rounded-md shadow-[0_0_100px_rgba(0,0,0,0.9)] flex flex-col items-center relative overflow-hidden w-full md:w-[90%] transition-all duration-1000 min-h-[400px] ${aboutSlide === 0 ? 'border-white/5' : 'border-lime-400/10'}`}>
                    
                    {/* Interior Grid Effect */}
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] bg-[size:16px_16px]"></div>

                    {/* Corner Accents */}
                    <div className={`absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 transition-colors duration-1000 ${aboutSlide === 0 ? 'border-fuchsia-500/40' : 'border-lime-400/40'}`}></div>
                    <div className={`absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 transition-colors duration-1000 ${aboutSlide === 0 ? 'border-fuchsia-500/40' : 'border-lime-400/40'}`}></div>

                    {/* Left & Right HUD Side Bars */}
                    <div className={`absolute left-0 top-1/2 -translate-y-1/2 h-2/3 w-[2px] transition-colors duration-1000 ${aboutSlide === 0 ? 'bg-fuchsia-500/20' : 'bg-lime-400/20'}`}>
                        <div className={`absolute top-1/2 -translate-y-1/2 -left-0.5 w-1.5 h-12 transition-all duration-1000 ${aboutSlide === 0 ? 'bg-fuchsia-500 shadow-[0_0_10px_#d946ef]' : 'bg-lime-400 shadow-[0_0_10px_#a3e635]'}`}></div>
                    </div>
                    <div className={`absolute right-0 top-1/2 -translate-y-1/2 h-2/3 w-[2px] transition-colors duration-1000 ${aboutSlide === 0 ? 'bg-fuchsia-500/20' : 'bg-lime-400/20'}`}>
                        <div className={`absolute top-1/2 -translate-y-1/2 -right-0.5 w-1.5 h-12 transition-all duration-1000 ${aboutSlide === 0 ? 'bg-fuchsia-500 shadow-[0_0_10px_#d946ef]' : 'bg-lime-400 shadow-[0_0_10px_#a3e635]'}`}></div>
                    </div>

                    {/* Content */}
                    <h3 key={`title-${aboutSlide}`} className="text-3xl md:text-6xl font-anton tracking-tight text-white mb-10 text-center uppercase flex flex-wrap justify-center items-center gap-x-4 animate-char-reveal">
                        <span className="text-gray-400">ABOUT</span>
                        <span className={`${currentAbout.themeColor} transition-all duration-1000 ${currentAbout.glowClass} px-3 py-1`}>
                          {currentAbout.title}
                        </span>
                    </h3>

                    <p key={`desc-${aboutSlide}`} className="text-gray-300 text-base md:text-xl font-space leading-relaxed text-center max-w-4xl opacity-90 drop-shadow-lg font-light tracking-wide animate-char-reveal">
                        {currentAbout.description}
                    </p>
                </div>

                {/* Clickable Right Arrow */}
                <button 
                  onClick={nextSlide}
                  onMouseEnter={() => setArrowsHovered(true)}
                  onMouseLeave={() => setArrowsHovered(false)}
                  className="absolute right-0 md:right-4 z-40 group outline-none transition-transform hover:scale-110 active:scale-95"
                >
                    <svg 
                      className={`w-12 h-16 md:w-16 md:h-24 transition-all duration-300 ${arrowsHovered ? 'opacity-100' : 'animate-rapid-arrow-blink'}`} 
                      viewBox="0 0 40 100"
                      style={{ 
                        color: currentAbout.rawThemeColor,
                        filter: arrowsHovered ? `drop-shadow(0 0 20px ${currentAbout.rawThemeColor})` : 'none'
                      }}
                    >
                        <polyline points="5,10 35,50 5,90" fill="none" stroke="currentColor" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
            </div>
        </section>

        {/* GALLERY SECTION */}
        <section id="gallery" className="min-h-screen flex flex-col items-center justify-center py-4 bg-black/10 overflow-visible">
          <div className="w-full max-w-[100vw] flex flex-col items-center overflow-visible">
            
            <div className="w-full flex justify-center mb-4"> 
              <div className="relative inline-block px-8 py-1 bg-transparent">
                <h3 className="text-2xl md:text-5xl font-anton tracking-normal text-white uppercase flex items-center gap-4">
                  <span className="w-10 h-px bg-fuchsia-600/30"></span>
                  GALLERY
                  <span className="w-10 h-px bg-fuchsia-600/30"></span>
                </h3>
              </div>
            </div>

            {/* MINIMIZED 3D CIRCULAR TRACKING CONTAINER */}
            <div 
              className="relative w-full h-[220px] md:h-[350px] flex items-center justify-center perspective-[1200px] cursor-grab active:cursor-grabbing overflow-visible"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={handleMouseDown}
              onTouchMove={handleMouseMove}
              onTouchEnd={handleMouseUp}
              style={{ transformStyle: 'preserve-3d' }}
            >
              {galleryItems.map((item, index) => {
                const count = galleryItems.length;
                const angleStep = 360 / count;
                const itemRotation = (index * angleStep) + rotation;
                const rad = (itemRotation * Math.PI) / 180;
                
                const radius = window.innerWidth < 768 ? 200 : 420;
                
                const x = Math.sin(rad) * radius;
                const z = Math.cos(rad) * radius - radius;
                
                const normalizedZ = z / (2 * radius);
                const scale = 0.6 + (1 + normalizedZ) * 0.4;
                const opacity = 0.15 + (1 + normalizedZ) * 0.85;
                const zIndex = Math.round((z + radius * 2) * 10);

                return (
                  <div 
                    key={item.id}
                    className={`
                      absolute rounded-[1.8rem] overflow-hidden border
                      transition-all duration-700 ease-out
                      ${index === activeIndex ? 'border-fuchsia-500/50 shadow-[0_0_50px_rgba(217,70,239,0.3)]' : 'border-white/10 shadow-2xl'}
                      w-[180px] md:w-[480px] aspect-[16/10] bg-[#0c0c0c]
                    `}
                    style={{
                      transform: `translate3d(${x}px, 0, ${z}px) scale(${scale})`,
                      opacity: opacity,
                      zIndex: zIndex,
                      pointerEvents: index === activeIndex ? 'auto' : 'none',
                      transition: isDragging ? 'none' : 'all 0.8s cubic-bezier(0.19, 1, 0.22, 1)',
                    }}
                  >
                    <img 
                      src={item.img} 
                      alt={item.title} 
                      className={`w-full h-full object-cover transition-all duration-1000 ${index === activeIndex ? 'grayscale-0 brightness-110' : 'grayscale brightness-[0.3] blur-[1px]'}`}
                      draggable="false"
                    />
                    <div className={`absolute inset-0 bg-black/40 transition-opacity duration-1000 ${index === activeIndex ? 'opacity-0' : 'opacity-100'}`}></div>
                  </div>
                );
              })}
            </div>

            {/* DESCRIPTION SECTION - MOVED UP & REFINED */}
            <div className="mt-4 w-full flex flex-col items-center text-center px-6">
               <h4 className="text-2xl md:text-4xl font-anton text-white tracking-wide uppercase drop-shadow-[0_0_15px_rgba(217,70,239,0.4)] mb-2">
                   {galleryItems[activeIndex].title}
               </h4>
               <p className="text-gray-400 text-xs md:text-sm font-space leading-relaxed max-w-lg opacity-80 italic">
                  {galleryItems[activeIndex].description}
               </p>
            </div>

          </div>
        </section>

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
        @keyframes rapid-arrow-blink {
          0%, 80% { 
            opacity: 0.2; 
          }
          83%, 89%, 95% { 
            opacity: 1; 
          }
          86%, 92%, 98% { 
            opacity: 0.2; 
          }
          100% { 
            opacity: 0.2; 
          }
        }
        .animate-rapid-arrow-blink {
          animation: rapid-arrow-blink 5s infinite ease-in-out;
        }
        @keyframes char-reveal {
          from { opacity: 0; filter: blur(8px); transform: translateY(10px); }
          to { opacity: 1; filter: blur(0); transform: translateY(0); }
        }
        .animate-char-reveal {
          animation: char-reveal 0.8s cubic-bezier(0.19, 1, 0.22, 1) forwards;
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
      `}</style>
    </div>
  );
};

export default Home;
