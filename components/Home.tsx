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

  const modules = useMemo(() => [
    {
      id: "M_01",
      name: "ROBOTICS",
      desc: "Kinetic neural networks and expressive autonomous interfaces.",
      status: "ACTIVE",
      color: "cyan"
    },
    {
      id: "M_02",
      name: "CYBERSEC",
      desc: "Neural tunnel encryption and adaptive perimeter defense.",
      status: "STABLE",
      color: "fuchsia"
    },
    {
      id: "M_03",
      name: "BIO-TECH",
      desc: "Synthetic genomics and bioluminescent data synthesis.",
      status: "STANDBY",
      color: "lime"
    },
    {
      id: "M_04",
      name: "FIN-TECH",
      desc: "Algorithmic capital flow and quantum ledger protocols.",
      status: "INIT",
      color: "orange"
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

  const renderModuleInfographic = (moduleName: string, color: string) => {
    const colorClass = color === 'fuchsia' ? 'text-fuchsia-500' : color === 'cyan' ? 'text-cyan-400' : color === 'lime' ? 'text-lime-400' : 'text-orange-400';
    
    switch(moduleName) {
      case "ROBOTICS":
        return (
          <svg className={`w-full h-full ${colorClass}`} viewBox="0 0 240 120">
            <defs>
              <filter id="eye-glow-v3" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3.5" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>
            <g className="animate-robot-floating">
              <path d="M 65 65 A 55 55 0 0 1 175 65" fill="none" stroke="currentColor" strokeWidth="2" className="opacity-10" />
              <rect x="58" y="55" width="12" height="28" rx="6" fill="currentColor" className="opacity-30" />
              <rect x="170" y="55" width="12" height="28" rx="6" fill="currentColor" className="opacity-30" />
              <rect x="75" y="30" width="90" height="70" rx="22" fill="#050505" stroke="currentColor" strokeWidth="1.5" />
              <rect x="80" y="36" width="80" height="58" rx="16" fill="#0c0c0c" className="opacity-90" />
              <g filter="url(#eye-glow-v3)" className="eye-movement-layer">
                <g className="transition-all duration-700">
                   <rect x="92" y="50" width="18" height="24" rx="7" fill="currentColor" className="opacity-100 group-hover:opacity-0 transition-all duration-700 ease-in-out animate-eye-blink origin-center" />
                   <path d="M 90 65 Q 101 48 112 65" fill="none" stroke="currentColor" strokeWidth="5.5" strokeLinecap="round" className="opacity-0 group-hover:opacity-100 transition-all duration-1000 delay-100 ease-out origin-center scale-x-90" />
                </g>
                <g className="transition-all duration-700">
                   <rect x="130" y="50" width="18" height="24" rx="7" fill="currentColor" className="opacity-100 group-hover:opacity-0 transition-all duration-700 ease-in-out animate-eye-blink origin-center" />
                   <path d="M 128 65 Q 139 48 150 65" fill="none" stroke="currentColor" strokeWidth="5.5" strokeLinecap="round" className="opacity-0 group-hover:opacity-100 transition-all duration-1000 delay-100 ease-out origin-center scale-x-90" />
                </g>
              </g>
              <circle cx="120" cy="40" r="1.5" fill="currentColor" className="opacity-20" />
            </g>
          </svg>
        );
      case "CYBERSEC":
        return (
          <svg className={`w-full h-full ${colorClass}`} viewBox="0 0 240 120">
            <defs>
              <filter id="cyber-steady-glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>
            <g transform="translate(120, 60)">
              <path 
                className="shackle-steady-animation"
                d="M -18 -10 V -26 A 18 18 0 0 1 18 -26 V -10" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="6.5" 
                strokeLinecap="round"
              />
              <rect x="-28" y="-12" width="56" height="48" rx="10" fill="#050505" stroke="currentColor" strokeWidth="2.5" />
              <rect x="-22" y="-6" width="44" height="36" rx="6" fill="#0c0c0c" opacity="0.9" />
              <g filter="url(#cyber-steady-glow)">
                <circle cx="0" cy="12" r="5" fill="currentColor" className="animate-pulse" />
                <rect x="-1.5" y="15" width="3" height="8" rx="1.5" fill="currentColor" opacity="0.6" />
              </g>
              <line x1="-15" y1="-6" x2="-10" y2="-6" stroke="currentColor" strokeWidth="1" opacity="0.4" />
              <line x1="10" y1="-6" x2="15" y2="-6" stroke="currentColor" strokeWidth="1" opacity="0.4" />
              <g className="shield-vibrate-layer opacity-0 group-hover:opacity-100 transition-all duration-300" filter="url(#cyber-steady-glow)">
                <path 
                   d="M -40 -35 L 40 -35 L 40 10 Q 40 45 0 60 Q -40 45 -40 10 Z" 
                   fill="none" 
                   stroke="currentColor" 
                   strokeWidth="4" 
                   className="opacity-60"
                />
                <path 
                   d="M -40 -35 L 40 -35 L 40 10 Q 40 45 0 60 Q -40 45 -40 10 Z" 
                   fill="currentColor" 
                   opacity="0.25" 
                />
                <path 
                   d="M -34 -29 L 34 -29 L 34 8 Q 34 38 0 52 Q -34 38 -34 8 Z" 
                   fill="none" 
                   stroke="currentColor" 
                   strokeWidth="1.2" 
                   opacity="0.5" 
                />
                <g opacity="0.5" strokeWidth="0.5">
                   <path d="M -12 2 L -4 -4 L 4 -4 L 12 2 L 4 8 L -4 8 Z" fill="none" stroke="currentColor" />
                </g>
              </g>
            </g>
          </svg>
        );
      case "BIO-TECH":
        const getDNAX = (y: number) => {
          return 18 * Math.sin(((y - 25) * Math.PI) / 50);
        };
        const rungYPositions = [-52, -42, -32, -15, -5, 5, 15, 32, 42, 52];
        const points1: string[] = [];
        const points2: string[] = [];
        for (let y = -60; y <= 60; y += 2) {
          const x = getDNAX(y);
          points1.push(`${x},${y}`);
          points2.push(`${-x},${y}`);
        }
        return (
          <svg className={`w-full h-full ${colorClass}`} viewBox="0 0 240 160">
            <g transform="translate(120, 80)">
              <g className="dna-subtle-breathing">
                <g>
                  {rungYPositions.map((y, i) => {
                    const x = Math.abs(getDNAX(y));
                    return (
                      <line 
                        key={i} 
                        x1={-x} y1={y} x2={x} y2={y} 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round"
                        className="dna-rung-pulse opacity-60"
                        style={{ animationDelay: `${i * 0.15}s` } as React.CSSProperties}
                      />
                    );
                  })}
                </g>
                <g>
                  <polyline points={points1.join(' ')} fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
                  <polyline points={points2.join(' ')} fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" className="opacity-90" />
                </g>
              </g>
            </g>
          </svg>
        );
      case "FIN-TECH":
        // Refined Botanical Digital Tree - Pro Interaction Model
        const ProBotanicalLeaf = ({ index, rotate, scale = 1, x = 0, y = 0 }: { index: number, rotate: number, scale?: number, x?: number, y?: number }) => (
          <g transform={`translate(${x}, ${y}) rotate(${rotate}) scale(${scale})`}>
            {/* 
              This leaf uses staggered transition delays.
              On HOVER, it FALLS with gravity.
              On EXIT, it POPS back in with a bouncy elastic transition.
            */}
            <path 
              d="M 0 0 C -4 -8, -4 -13, 0 -18 C 4 -13, 4 -8, 0 0" 
              fill="currentColor" 
              className="
                leaf-dynamic-state
                transition-all duration-[700ms] ease-[cubic-bezier(0.34,1.56,0.64,1)]
                group-hover:translate-y-[180px] group-hover:rotate-[280deg] group-hover:opacity-0 group-hover:scale-0 group-hover:duration-[900ms] group-hover:ease-[cubic-bezier(0.5,0,1,1)]
              "
              style={{ 
                transformOrigin: 'bottom center',
                // Delay for sequential falling/popping
                transitionDelay: `${index * 0.08}s`
              } as React.CSSProperties} 
            />
          </g>
        );

        return (
          <svg className={`w-full h-full ${colorClass}`} viewBox="0 0 240 130">
            <defs>
              <filter id="pro-tree-glow-clean" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="5" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>
            <g transform="translate(120, 120) scale(0.85)">
              <g className="animate-tree-sway">
                {/* Unified idle breathing - whole tree sways together */}
                <path d="M -8 0 Q -6 -35 0 -55 L 8 0 Z" fill="#050505" stroke="currentColor" strokeWidth="2" />
                <line x1="0" y1="-6" x2="0" y2="-50" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" opacity="0.3" />

                {/* Branches with Staggered Pro Leaves */}
                <g>
                  <path d="M -4 -20 Q -22 -28 -40 -45" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <ProBotanicalLeaf index={0} x={-20} y={-26} rotate={-100} scale={0.8} />
                  <ProBotanicalLeaf index={1} x={-40} y={-45} rotate={-55} scale={1.1} />
                </g>

                <g>
                  <path d="M 4 -24 Q 28 -32 48 -48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <ProBotanicalLeaf index={2} x={24} y={-30} rotate={100} scale={0.8} />
                  <ProBotanicalLeaf index={3} x={48} y={-48} rotate={55} scale={1.1} />
                </g>

                <g>
                  <path d="M -2 -40 Q -28 -52 -36 -85" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <ProBotanicalLeaf index={4} x={-36} y={-85} rotate={-12} scale={1.3} />
                  <ProBotanicalLeaf index={5} x={-31} y={-65} rotate={-40} scale={0.9} />
                  <ProBotanicalLeaf index={6} x={-18} y={-46} rotate={-85} scale={0.7} />
                </g>

                <g>
                  <path d="M 2 -44 Q 32 -56 36 -95" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <ProBotanicalLeaf index={7} x={36} y={-95} rotate={12} scale={1.3} />
                  <ProBotanicalLeaf index={8} x={31} y={-68} rotate={40} scale={0.9} />
                  <ProBotanicalLeaf index={9} x={18} y={-50} rotate={85} scale={0.7} />
                </g>

                <g>
                  <path d="M 0 -55 Q 0 -80 10 -110" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <ProBotanicalLeaf index={10} x={10} y={-110} rotate={0} scale={1.2} />
                  <ProBotanicalLeaf index={11} x={0} y={-80} rotate={0} scale={1.0} />
                </g>

                <g filter="url(#pro-tree-glow-clean)">
                  <ProBotanicalLeaf index={12} x={-6} y={-45} rotate={-155} scale={0.6} />
                  <ProBotanicalLeaf index={13} x={6} y={-50} rotate={155} scale={0.6} />
                </g>
              </g>
            </g>
          </svg>
        );
      default:
        return null;
    }
  };

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

        <section id="about" className="min-h-screen flex flex-col items-center justify-center px-4 relative bg-[#050505] overflow-hidden">
            <div className={`absolute top-1/4 left-1/4 w-[500px] h-[500px] transition-colors duration-1000 blur-[150px] rounded-full pointer-events-none ${currentAbout.bgGlow}`}></div>
            <div 
              onMouseEnter={() => setArrowsHovered(true)}
              onMouseLeave={() => setArrowsHovered(false)}
              className="relative w-full max-w-7xl flex items-center justify-center mt-12 px-12 md:px-24"
            >
                <button onClick={prevSlide} className="absolute left-0 md:left-4 z-40 group outline-none transition-transform hover:scale-110 active:scale-95">
                    <svg className={`w-12 h-16 md:w-16 md:h-24 transition-all duration-300 ${arrowsHovered ? 'opacity-100' : 'animate-rapid-arrow-blink'}`} viewBox="0 0 40 100" style={{ color: currentAbout.rawThemeColor, filter: arrowsHovered ? `drop-shadow(0 0 20px ${currentAbout.rawThemeColor})` : 'none' }}>
                        <polyline points="35,10 5,50 35,90" fill="none" stroke="currentColor" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
                <div className={`bg-[#0c0c0c]/90 backdrop-blur-3xl border p-8 md:p-16 rounded-[2.5rem] shadow-[0_0_100px_rgba(0,0,0,0.9)] flex flex-col items-center relative overflow-hidden w-full md:w-[90%] transition-all duration-1000 min-h-[400px] ${aboutSlide === 0 ? 'border-white/5' : 'border-lime-400/10'}`}>
                    <h3 key={`title-${aboutSlide}`} className="text-3xl md:text-6xl font-anton tracking-tight text-white mb-10 text-center uppercase flex flex-wrap justify-center items-center gap-x-4 animate-char-reveal">
                        <span className="text-gray-400">ABOUT</span>
                        <span className={`${currentAbout.themeColor} transition-all duration-1000 ${currentAbout.glowClass} px-3 py-1`}>{currentAbout.title}</span>
                    </h3>
                    <p key={`desc-${aboutSlide}`} className="text-gray-300 text-base md:text-xl font-space leading-relaxed text-center max-w-4xl opacity-90 drop-shadow-lg font-light tracking-wide animate-char-reveal">{currentAbout.description}</p>
                </div>
                <button onClick={nextSlide} className="absolute right-0 md:right-4 z-40 group outline-none transition-transform hover:scale-110 active:scale-95">
                    <svg className={`w-12 h-16 md:w-16 md:h-24 transition-all duration-300 ${arrowsHovered ? 'opacity-100' : 'animate-rapid-arrow-blink'}`} viewBox="0 0 40 100" style={{ color: currentAbout.rawThemeColor, filter: arrowsHovered ? `drop-shadow(0 0 20px ${currentAbout.rawThemeColor})` : 'none' }}>
                        <polyline points="5,10 35,50 5,90" fill="none" stroke="currentColor" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
            </div>
        </section>

        <section id="gallery" className="min-h-screen flex flex-col items-center justify-center py-10 bg-black/10 overflow-visible">
          <div className="w-full max-w-[100vw] flex flex-col items-center overflow-visible">
            <div className="w-full flex justify-center mb-2"> 
              <div className="relative inline-block px-12 py-2 bg-transparent">
                <h3 className="text-3xl md:text-6xl font-anton tracking-tight text-white uppercase flex items-center gap-6">
                  <span className="w-16 h-px bg-fuchsia-600/30"></span>
                  TECHNICAL <span className="text-fuchsia-500 drop-shadow-[0_0_20px_#d946ef]">GALLERY</span>
                  <span className="w-16 h-px bg-fuchsia-600/30"></span>
                </h3>
              </div>
            </div>
            <div className="relative w-full h-[220px] md:h-[400px] flex items-center justify-center perspective-[1200px] cursor-grab active:cursor-grabbing overflow-visible mb-4" onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp} onTouchStart={handleMouseDown} onTouchMove={handleMouseMove} onTouchEnd={handleMouseUp} style={{ transformStyle: 'preserve-3d' }}>
              {galleryItems.map((item, index) => {
                const count = galleryItems.length;
                const angleStep = 360 / count;
                const itemRotation = (index * angleStep) + rotation;
                const rad = (itemRotation * Math.PI) / 180;
                const radius = window.innerWidth < 768 ? 200 : 450;
                const x = Math.sin(rad) * radius;
                const z = Math.cos(rad) * radius - radius;
                const normalizedZ = z / (2 * radius);
                const scale = 0.6 + (1 + normalizedZ) * 0.4;
                const opacity = 0.15 + (1 + normalizedZ) * 0.85;
                const zIndex = Math.round((z + radius * 2) * 10);
                return (
                  <div key={item.id} className={`absolute rounded-[2.5rem] overflow-hidden border transition-all duration-700 ease-out ${index === activeIndex ? 'border-fuchsia-500/50 shadow-[0_0_50px_rgba(217,70,239,0.3)]' : 'border-white/10 shadow-2xl'} w-[180px] md:w-[500px] aspect-[16/10] bg-[#0c0c0c]`} style={{ transform: `translate3d(${x}px, 0, ${z}px) scale(${scale})`, opacity: opacity, zIndex: zIndex, pointerEvents: index === activeIndex ? 'auto' : 'none', transition: isDragging ? 'none' : 'all 0.8s cubic-bezier(0.19, 1, 0.22, 1)', }}>
                    <img src={item.img} alt={item.title} className={`w-full h-full object-cover transition-all duration-1000 ${index === activeIndex ? 'grayscale-0 brightness-110' : 'grayscale brightness-[0.3] blur-[1px]'}`} draggable="false" />
                    <div className={`absolute inset-0 bg-black/40 transition-opacity duration-1000 ${index === activeIndex ? 'opacity-0' : 'opacity-100'}`}></div>
                  </div>
                );
              })}
            </div>
            <div className="w-full flex flex-col items-center text-center px-6 mb-8">
               <h4 className="text-2xl md:text-4xl font-anton text-white tracking-wide uppercase drop-shadow-[0_0_15px_rgba(217,70,239,0.4)] mb-2 transition-all duration-500">{galleryItems[activeIndex].title}</h4>
               <p className="text-gray-400 text-xs md:text-lg font-space leading-relaxed max-w-2xl opacity-80 italic mb-10 transition-all duration-500">{galleryItems[activeIndex].description}</p>
               <div className="group relative cursor-pointer">
                  <div className="absolute inset-0 bg-fuchsia-500/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="px-10 py-3 md:px-14 md:py-4 bg-[#0c0c0c] border border-white/10 rounded-md flex items-center gap-4 transition-all duration-300 group-hover:border-fuchsia-500/50 group-hover:translate-y-[-2px]">
                    <span className="text-white font-anton text-lg md:text-2xl tracking-[0.1em] uppercase">VIEW GALLERY</span>
                    <svg className="w-6 h-6 text-fuchsia-500 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </div>
               </div>
            </div>
          </div>
        </section>

        <section id="modules" className="min-h-screen flex flex-col items-center justify-center py-20 px-4 relative overflow-hidden bg-[#050505]">
          <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[linear-gradient(rgba(217,70,239,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(217,70,239,0.2)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
          <div className="relative z-10 w-full max-w-7xl flex flex-col items-center">
            <h3 className="text-4xl md:text-7xl font-anton tracking-tighter text-white mb-20 text-center uppercase">
              TECHNICAL <span className="text-fuchsia-500 drop-shadow-[0_0_20px_#d946ef]">MODULES</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full mb-20">
              {modules.map((module) => (
                <div key={module.id} className="group relative bg-[#0c0c0c]/80 border border-white/5 rounded-[2.5rem] p-0 transition-all duration-700 hover:border-fuchsia-500/50 hover:shadow-[0_0_60px_rgba(217,70,239,0.1)] flex flex-col items-center overflow-hidden">
                  <div className="relative w-full h-48 flex items-center justify-center bg-black/40">
                    <div className="absolute inset-0 bg-fuchsia-500/5 blur-2xl rounded-full animate-pulse"></div>
                    <div className="w-full h-full">
                       {renderModuleInfographic(module.name, module.color)}
                    </div>
                  </div>
                  <div className="w-full p-8 pt-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] text-gray-500 font-bold tracking-[0.2em]">{module.id}</span>
                      <div className="flex items-center gap-1.5">
                        <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${module.status === 'ACTIVE' ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
                        <span className="text-[9px] text-gray-400 font-bold tracking-widest uppercase">{module.status}</span>
                      </div>
                    </div>
                    <h4 className="text-2xl font-anton text-white mb-3 tracking-wide group-hover:text-fuchsia-400 transition-colors duration-500">{module.name}</h4>
                    <p className="text-gray-400 text-xs font-space leading-relaxed h-10 overflow-hidden opacity-70 group-hover:opacity-100 transition-opacity">{module.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="group relative cursor-pointer">
              <div className="absolute inset-0 bg-fuchsia-500/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="px-10 py-3 md:px-14 md:py-4 bg-[#0c0c0c] border border-white/10 rounded-md flex items-center gap-4 transition-all duration-300 group-hover:border-fuchsia-500/50 group-hover:translate-y-[-2px]">
                <span className="text-white font-anton text-lg md:text-2xl tracking-[0.1em] uppercase">VIEW MODULES</span>
                <svg className="w-6 h-6 text-fuchsia-500 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </div>
            </div>
          </div>
        </section>

        <section id="register" className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden bg-gradient-to-b from-transparent to-fuchsia-950/10">
          <div className="flex flex-col items-center text-center z-20">
              <h4 className="text-4xl md:text-7xl font-anton tracking-tighter text-white mb-16 max-w-4xl px-4">
                READY TO ASCEND INTO THE <span className="text-fuchsia-500">DIGITAL_REALM?</span>
              </h4>
              <RegisterButton size="lg" />
          </div>
        </section>
      </div>

      <style>{`
        /* ROBOTICS - EMO STYLE ANIMATIONS */
        @keyframes robot-floating { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
        .animate-robot-floating { animation: robot-floating 4s ease-in-out infinite; }
        @keyframes eye-blink { 0%, 45%, 55%, 100% { transform: scaleY(1); } 50% { transform: scaleY(0.1); } }
        .animate-eye-blink { animation: eye-blink 5s ease-in-out infinite; transform-origin: center; }
        .eye-movement-layer { animation: eye-movement 9s ease-in-out infinite; transform-origin: center; transition: transform 0.8s cubic-bezier(0.19, 1, 0.22, 1); }
        .group:hover .eye-movement-layer { animation: none; transform: translate(0, 0); }
        @keyframes eye-movement { 0%, 100% { transform: translate(0, 0); } 15% { transform: translate(8px, -4px); } 30% { transform: translate(-8px, 3px); } 55% { transform: translate(5px, 5px); } 80% { transform: translate(-4px, -6px); } }

        /* CYBERSEC STEADY LOCK ANIMATION */
        @keyframes shackle-steady {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }
        .shackle-steady-animation { 
          animation: shackle-steady 3s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite; 
        }

        /* CYBERSEC SHIELD VIBRATION */
        @keyframes shield-vibrate {
          0% { transform: translate(0, 0); }
          25% { transform: translate(-1.5px, 1.5px); }
          50% { transform: translate(1.5px, -1.5px); }
          75% { transform: translate(-1px, -2px); }
          100% { transform: translate(1px, 2px); }
        }
        .group:hover .shield-vibrate-layer {
           animation: shield-vibrate 0.08s linear infinite;
        }

        /* BIO-TECH - ORGANIC PERSISTENT BREATHING */
        @keyframes dna-breathe {
          0%, 100% { transform: translateY(0) scale(1, 1); }
          50% { transform: translateY(-4px) scale(1.05, 0.98); }
        }
        .dna-subtle-breathing {
          animation: dna-breathe 4s ease-in-out infinite;
          transform-origin: center;
        }

        /* DNA RUNG SEQUENTIAL "OFF" PULSE */
        @keyframes rung-blink-sequence {
          0%, 5% { opacity: 0; filter: blur(2px); }
          8%, 100% { opacity: 0.8; filter: blur(0); }
        }
        .group:hover .dna-rung-pulse {
          animation: rung-blink-sequence 1.5s linear infinite;
        }

        /* FIN-TECH - REFINED ORGANIC TREE ANIMATIONS */
        @keyframes tree-sway {
          0%, 100% { transform: rotate(-1.5deg); }
          50% { transform: rotate(1.5deg); }
        }
        .animate-tree-sway {
          /* Restore organic breathing sway - leaves are transitionally static within this group unless hovered */
          animation: tree-sway 7s ease-in-out infinite;
          transform-origin: bottom center;
        }
        
        /* 
          Leaf state is strictly managed via transitions on the ProBotanicalLeaf.
          The staggered delays handle the "one-by-one" requirement perfectly.
          The elastic cubic-bezier handles the "pop" on exit.
        */
        .leaf-dynamic-state {
            /* Ensures no jitter - leaf is perfectly static until card is hovered */
            transform: translate(0,0) rotate(0deg) scale(1);
            opacity: 1;
        }

        @keyframes home-entry { from { opacity: 0; transform: scale(1.05) translateY(40px); filter: blur(15px); } to { opacity: 1; transform: scale(1) translateY(0); filter: blur(0); } }
        .animate-home-entry { animation: home-entry 1.8s cubic-bezier(0.19, 1, 0.22, 1) forwards; }
        @keyframes rapid-arrow-blink { 0%, 80% { opacity: 0.2; } 83%, 89%, 95% { opacity: 1; } 86%, 92%, 98% { opacity: 0.2; } 100% { opacity: 0.2; } }
        .animate-rapid-arrow-blink { animation: rapid-arrow-blink 5s infinite ease-in-out; }
        @keyframes char-reveal { from { opacity: 0; filter: blur(8px); transform: translateY(10px); } to { opacity: 1; filter: blur(0); transform: translateY(0); } }
        .animate-char-reveal { animation: char-reveal 0.8s cubic-bezier(0.19, 1, 0.22, 1) forwards; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: rgba(0,0,0,0.2); }
        ::-webkit-scrollbar-thumb { background: #d946ef; border-radius: 10px; box-shadow: 0 0 10px rgba(217,70,239,0.5); }
      `}</style>
    </div>
  );
};

export default Home;