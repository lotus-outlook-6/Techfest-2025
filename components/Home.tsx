
import React, { useState, useEffect, useRef, useMemo } from 'react';
import NavbarSlider from './NavbarSlider';
import RegisterButton from './RegisterButton';

interface HomeProps {
  onBack?: () => void;
}

interface NoteParticle {
  id: number;
  x: number;
  y: number;
  rotation: number;
  scale: number;
  type: number;
}

interface Laser {
  id: number;
  top: number;
  width: number;
  duration: number;
  delay: number;
  thickness: number;
}

const Home: React.FC<HomeProps> = ({ onBack }) => {
  const [showCursor, setShowCursor] = useState(true);
  const [rotation, setRotation] = useState(0); 
  const [isDragging, setIsDragging] = useState(false);
  const [aboutSlide, setAboutSlide] = useState(0); // 0: Yantraksh, 1: AU Silchar
  const [arrowsHovered, setArrowsHovered] = useState(false);
  
  // Parallax state for Earth image
  const [parallaxOffset, setParallaxOffset] = useState({ x: 0, y: 0 });

  // Musicia Hover Effect States
  const [isMusiciaHovered, setIsMusiciaHovered] = useState(false);
  const [notes, setNotes] = useState<NoteParticle[]>([]);
  const noteIdCounter = useRef(0);
  const spawnTimer = useRef<number | null>(null);

  // Footer Year Animation State
  const [isYearForward, setIsYearForward] = useState(false);
  const yearResetTimer = useRef<number | null>(null);
  const footerRef = useRef<HTMLElement>(null);
  const aboutRef = useRef<HTMLElement>(null);

  const startX = useRef(0);
  const startRotation = useRef(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Laser Rain Logic
  const lasers = useMemo(() => {
    return Array.from({ length: 25 }).map((_, i) => ({
      id: i,
      top: Math.random() * 100,
      width: Math.random() * 300 + 50,
      duration: Math.random() * 2 + 1.5,
      delay: Math.random() * 5,
      thickness: Math.random() * 2 + 1
    }));
  }, []);

  const galleryItems = useMemo(() => [
    { 
      id: '01', 
      title: 'ROBOTICS_UPLINK', 
      description: 'Synchronized biomechanical limbs operating through a decentralized neural network for high-precision tasks.',
      img: 'https://images.unsplash.com/photo-1589254065878-42c9da997008?q=80&w=1200&auto=format&fit=crop' 
    },
    { 
      id: '02', 
      title: 'NEURAL_INTERFACE', 
      description: 'Advanced brain-computer mapping enabling direct data transfer between human cognition and digital storage.',
      img: 'https://images.unsplash.com/photo-1555664424-778a1e5e1b48?q=80&w=1200&auto=format&fit=crop' 
    },
    { 
      id: '03', 
      title: 'CYBER_CITY_V1', 
      description: 'A modular urban landscape designed for efficiency, powered entirely by sustainable quantum fusion reactors.',
      img: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?q=80&w=1200&auto=format&fit=crop' 
    },
    { 
      id: '04', 
      title: 'BEYOND_SPACE', 
      description: 'Next-generation orbital propulsion systems designed for deep-space exploration and interstellar logistics.',
      img: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200&auto=format&fit=crop' 
    },
    { 
      id: '05', 
      title: 'DRONE_SWARM', 
      description: 'Autonomous aerial units utilizing collective intelligence for rapid environmental mapping and defense monitoring.',
      img: 'https://images.unsplash.com/photo-1473960104312-bf2e12017180?q=80&w=1200&auto=format&fit=crop' 
    },
    { 
      id: '06', 
      title: 'CORE_REACTOR', 
      description: 'The heartbeat of the station, managing trillions of calculations per second to maintain planetary stability.',
      img: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop' 
    },
    { 
      id: '07', 
      title: 'VOID_NAVIGATOR', 
      description: 'Quantum positioning hardware capable of threading through sub-atomic dimensions for instantaneous travel.',
      img: 'https://images.unsplash.com/photo-1614728263952-84ea256f9679?q=80&w=1200&auto=format&fit=crop' 
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
      glowClass: "animate-fuchsia-glow"
    },
    {
      title: "ASSAM UNIVERSITY SILCHAR",
      description: "Assam University, a central university established in 1994, is situated in Dargakona, near Silchar. Spread across 600 acres, it hosts 16 schools and 42 departments. The university is a hub for academic excellence in Northeast India, providing a multi-cultural environment and cutting-edge research opportunities for students across diverse fields of science, technology, and humanities.",
      themeColor: "text-lime-400",
      rawThemeColor: "#a3e635",
      glowColor: "rgba(163, 230, 53, 0.8)",
      accentColor: "border-lime-400/40",
      bgGlow: "bg-lime-900/5",
      glowClass: "animate-lime-glow"
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

  const musiciaEvent = {
    id: "E_01",
    name: "MUSICIA",
    desc: "The cosmic symphony where waves of sound fuse with digital rhythms. Experience the absolute fusion of cultural excellence and musical energy.",
    time: "20:00 IST | SOT FIELD",
    img: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1920&auto=format&fit=crop"
  };

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

  // Window-wide Mouse Move Handler for Parallax
  useEffect(() => {
    const handleWindowMouseMove = (e: MouseEvent) => {
      // Calculate normalized mouse position (-0.5 to 0.5)
      const nx = (e.clientX / window.innerWidth) - 0.5;
      const ny = (e.clientY / window.innerHeight) - 0.5;
      
      // Subtle parallax intensity
      setParallaxOffset({
        x: nx * 30, // Max 15px drift
        y: ny * 30
      });
    };

    window.addEventListener('mousemove', handleWindowMouseMove);
    return () => window.removeEventListener('mousemove', handleWindowMouseMove);
  }, []);

  // Music Note Spawning Logic
  useEffect(() => {
    if (isMusiciaHovered) {
      spawnTimer.current = window.setInterval(() => {
        const newNote: NoteParticle = {
          id: ++noteIdCounter.current,
          x: Math.random() * 100 - 50, // Percentage offset
          y: Math.random() * 40 - 20,
          rotation: Math.random() * 60 - 30,
          scale: Math.random() * 0.5 + 0.5,
          type: Math.floor(Math.random() * 3) // 3 different note icons
        };
        setNotes(prev => [...prev, newNote]);
        
        // Cleanup note after animation
        setTimeout(() => {
          setNotes(prev => prev.filter(n => n.id !== newNote.id));
        }, 2000);
      }, 150);
    } else {
      if (spawnTimer.current) clearInterval(spawnTimer.current);
    }
    return () => {
      if (spawnTimer.current) clearInterval(spawnTimer.current);
    };
  }, [isMusiciaHovered]);

  // Observer for automatic year pop when scrolling to footer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            handleYearTrigger();
          }
        });
      },
      { threshold: 0.5 }
    );

    if (footerRef.current) {
      observer.observe(footerRef.current);
    }

    return () => observer.disconnect();
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

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.target as HTMLImageElement;
    target.src = "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1200&auto=format&fit=crop"; 
  };

  const handleYearTrigger = () => {
    if (isYearForward) return;
    
    setIsYearForward(true);
    if (yearResetTimer.current) window.clearTimeout(yearResetTimer.current);
    
    // Auto-reset after 3 seconds
    yearResetTimer.current = window.setTimeout(() => {
      setIsYearForward(false);
    }, 3000);
  };

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
        const StaticLeaf = ({ rotate, x = 0, y = 0 }: { rotate: number, x?: number, y?: number }) => {
          return (
            <g transform={`translate(${x}, ${y})`}>
              <g className="leaf-container">
                <path 
                  d="M 0 0 C -4 -8, -4 -13, 0 -18 C 4 -13, 4 -8, 0 0" 
                  fill="currentColor" 
                  className="leaf-visual"
                  transform={`rotate(${rotate})`}
                />
                <g className="coin-visual" opacity="0">
                  <circle r="6" fill="#fbbf24" stroke="#b45309" strokeWidth="0.8" />
                  <text y="2" fontSize="6" textAnchor="middle" fill="#b45309" fontWeight="bold" style={{fontFamily: 'Arial, sans-serif'}}>$</text>
                </g>
              </g>
            </g>
          );
        };

        return (
          <svg className={`w-full h-full ${colorClass}`} viewBox="0 0 240 130">
            <defs>
              <filter id="fin-glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="5" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>
            <g transform="translate(120, 120) scale(0.85)">
              <g>
                <path d="M -8 0 Q -6 -35 0 -55 L 8 0 Z" fill="#050505" stroke="currentColor" strokeWidth="2" />
                <line x1="0" y1="-6" x2="0" y2="-50" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" opacity="0.3" />
                <g>
                  <path d="M -4 -20 Q -22 -28 -40 -45" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <path d="M 4 -24 Q 28 -32 48 -48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <path d="M -2 -40 Q -28 -52 -36 -85" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <path d="M 2 -44 Q 32 -56 36 -95" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <path d="M 0 -55 Q 0 -80 10 -110" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </g>
                <StaticLeaf x={-20} y={-26} rotate={-100} />
                <StaticLeaf x={-40} y={-45} rotate={-55} />
                <StaticLeaf x={24} y={-30} rotate={100} />
                <StaticLeaf x={48} y={-48} rotate={55} />
                <StaticLeaf x={-36} y={-85} rotate={-12} />
                <StaticLeaf x={-31} y={-65} rotate={-40} />
                <StaticLeaf x={-18} y={-46} rotate={-85} />
                <StaticLeaf x={36} y={-95} rotate={12} />
                <StaticLeaf x={31} y={-68} rotate={40} />
                <StaticLeaf x={18} y={-50} rotate={85} />
                <StaticLeaf x={10} y={-110} rotate={0} />
                <StaticLeaf x={0} y={-80} rotate={0} />
                <g filter="url(#fin-glow)">
                  <StaticLeaf x={-6} y={-45} rotate={-155} />
                  <StaticLeaf x={6} y={-50} rotate={155} />
                </g>
              </g>
            </g>
          </svg>
        );
      default:
        return null;
    }
  };

  const getModuleHoverClasses = (color: string) => {
    switch(color) {
      case 'cyan': return 'hover:border-cyan-400 hover:shadow-[0_0_80px_rgba(34,211,238,0.3)]';
      case 'fuchsia': return 'hover:border-fuchsia-500 hover:shadow-[0_0_80px_rgba(217,70,239,0.3)]';
      case 'lime': return 'hover:border-lime-400 hover:shadow-[0_0_80px_rgba(163,230,53,0.3)]';
      case 'orange': return 'hover:border-orange-400 hover:shadow-[0_0_80px_rgba(251,146,60,0.3)]';
      default: return 'hover:border-fuchsia-500/50';
    }
  };

  const getModuleTextClasses = (color: string) => {
    switch(color) {
      case 'cyan': return 'group-hover:text-cyan-400 group-hover:drop-shadow-[0_0_30px_rgba(34,211,238,1)]';
      case 'fuchsia': return 'group-hover:text-fuchsia-400 group-hover:drop-shadow-[0_0_30px_rgba(217,70,239,1)]';
      case 'lime': return 'group-hover:text-lime-400 group-hover:drop-shadow-[0_0_30px_rgba(163,230,53,1)]';
      case 'orange': return 'group-hover:text-orange-400 group-hover:drop-shadow-[0_0_30px_rgba(251,146,60,1)]';
      default: return 'group-hover:text-fuchsia-400';
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
            <h2 className="text-6xl md:text-9xl font-anton tracking-tighter text-white mb-6 leading-none drop-shadow-[0_0_20px_rgba(255,255,255,0.05)]">
              THE NEXT GEN <br/> <span className="text-fuchsia-500 drop-shadow-[0_0_15px_rgba(217,70,239,0.4)]">TECH_FEST</span>
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

        {/* ABOUT SECTION WITH EXPANSIVE SPACE BACKGROUND */}
        <section id="about" ref={aboutRef} className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
            
            {/* CINEMATIC SPACE BACKGROUND LAYER */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden select-none">
                {/* 1. Starfield Layer */}
                <div className="absolute inset-0 bg-black bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-60"></div>
                
                {/* 2. Cinematic Orbital Earth with Mouse Parallax & Enhanced Idle Animation */}
                <div 
                  className="absolute inset-0 w-full h-full flex justify-center items-center opacity-85 transition-transform duration-[1200ms] ease-out"
                  style={{ transform: `translate3d(${parallaxOffset.x}px, ${parallaxOffset.y}px, 0)` }}
                >
                    <div className="relative w-full h-full">
                        <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/10 via-transparent to-transparent z-10 pointer-events-none"></div>
                        <img 
                            src="https://wallpaperaccess.com/full/6863838.jpg" 
                            className="w-full h-full object-cover animate-earth-orbit-drift"
                            alt="Expansive Orbital View"
                        />
                    </div>
                </div>

                {/* Subtlest background texture */}
                <div className="absolute inset-0 bg-[#050505]/5 z-1"></div>
            </div>

            {/* FOREGROUND CONTENT WRAPPER */}
            <div 
              onMouseEnter={() => setArrowsHovered(true)}
              onMouseLeave={() => setArrowsHovered(false)}
              className="relative z-[50] w-full max-w-7xl flex items-center justify-center px-12 md:px-24"
            >
                {/* Navigation Arrows with persistent layered soft shadow */}
                <button onClick={prevSlide} className="absolute left-0 md:left-4 z-40 group outline-none transition-transform hover:scale-110 active:scale-95">
                    <svg 
                      className={`w-12 h-16 md:w-16 md:h-24 transition-all duration-300 ${arrowsHovered ? 'opacity-100' : 'animate-rapid-arrow-blink'}`} 
                      viewBox="0 0 40 100" 
                      style={{ 
                        color: currentAbout.rawThemeColor, 
                        filter: arrowsHovered 
                          ? `drop-shadow(0 0 25px ${currentAbout.rawThemeColor}) drop-shadow(0 0 30px rgba(0,0,0,0.95))` 
                          : 'drop-shadow(0 0 12px rgba(0,0,0,0.9)) drop-shadow(0 0 2px rgba(0,0,0,0.8))' 
                      }}
                    >
                        <polyline points="35,10 5,50 35,90" fill="none" stroke="currentColor" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>

                {/* ABOUT CARD (Translucent box) */}
                <div className={`
                    group/aboutcard
                    relative overflow-hidden w-full md:w-[90%] rounded-[2.5rem] shadow-[0_0_150px_rgba(0,0,0,0.85)] 
                    flex flex-col items-center transition-all duration-1000 min-h-[400px] border
                    bg-[#0c0c0c]/80 backdrop-blur-3xl
                    ${aboutSlide === 0 ? 'border-white/5' : 'border-lime-400/10'}
                `}>
                    {/* DOTTED GRID PATTERN */}
                    <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(rgba(255,255,255,0.06)_1.2px,transparent_1.2px)] bg-[size:24px_24px] z-10"></div>

                    <div className="relative z-20 w-full flex flex-col items-center p-8 md:p-16">
                        <h3 className="relative z-10 text-3xl md:text-6xl font-anton tracking-tight text-white mb-10 text-center uppercase flex flex-wrap justify-center items-center gap-x-4 animate-char-reveal">
                            <span className="text-gray-400/80">ABOUT</span>
                            {/* key={aboutSlide} ensures the element re-renders and triggers animate-blink-once on switch. group-hover triggers animate-blink-flicker on card hover */}
                            <span 
                              key={aboutSlide} 
                              className={`${currentAbout.themeColor} transition-all duration-1000 ${currentAbout.glowClass} px-4 py-2 rounded-xl group-hover/aboutcard:animate-blink-flicker animate-blink-once`}
                            >
                              {currentAbout.title}
                            </span>
                        </h3>
                        <p key={`desc-${aboutSlide}`} className="relative z-10 text-gray-200 text-base md:text-xl font-space leading-relaxed text-center max-w-4xl opacity-95 drop-shadow-[0_4px_12px_rgba(0,0,0,1)] font-light tracking-wide animate-char-reveal">{currentAbout.description}</p>
                    </div>
                </div>

                {/* Right Arrow with persistent layered soft shadow */}
                <button onClick={nextSlide} className="absolute right-0 md:right-4 z-40 group outline-none transition-transform hover:scale-110 active:scale-95">
                    <svg 
                      className={`w-12 h-16 md:w-16 md:h-24 transition-all duration-300 ${arrowsHovered ? 'opacity-100' : 'animate-rapid-arrow-blink'}`} 
                      viewBox="0 0 40 100" 
                      style={{ 
                        color: currentAbout.rawThemeColor, 
                        filter: arrowsHovered 
                          ? `drop-shadow(0 0 25px ${currentAbout.rawThemeColor}) drop-shadow(0 0 30px rgba(0,0,0,0.95))` 
                          : 'drop-shadow(0 0 12px rgba(0,0,0,0.9)) drop-shadow(0 0 2px rgba(0,0,0,0.8))' 
                      }}
                    >
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
                  TECHNICAL <span className="text-fuchsia-500 drop-shadow-[0_0_10px_#d946ef]">GALLERY</span>
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
                    <img 
                      src={item.img} 
                      alt={item.title} 
                      className={`w-full h-full object-cover transition-all duration-1000 ${index === activeIndex ? 'grayscale-0 brightness-110' : 'grayscale brightness-[0.3] blur-[1px]'}`} 
                      draggable="false" 
                      onError={handleImageError}
                    />
                    <div className={`absolute inset-0 bg-black/40 transition-opacity duration-1000 ${index === activeIndex ? 'opacity-0' : 'opacity-100'}`}></div>
                  </div>
                );
              })}
            </div>
            <div className="w-full flex flex-col items-center text-center px-6 mb-8">
               <h4 className="text-2xl md:text-4xl font-anton text-white tracking-wide uppercase drop-shadow-[0_0_10px_rgba(217,70,239,0.3)] mb-2 transition-all duration-500">{galleryItems[activeIndex].title}</h4>
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
              TECHNICAL <span className="text-fuchsia-500 drop-shadow-[0_0_10px_#d946ef]">MODULES</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full mb-20">
              {modules.map((module) => (
                <div key={module.id} className={`group relative bg-[#0c0c0c]/80 border border-white/5 rounded-[2.5rem] p-0 transition-all duration-700 flex flex-col items-center overflow-hidden ${getModuleHoverClasses(module.color)}`}>
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
                    <h4 className={`text-2xl font-anton text-white mb-3 tracking-wide transition-all duration-500 ${getModuleTextClasses(module.color)}`}>{module.name}</h4>
                    <p className="text-gray-400 text-xs font-space leading-relaxed h-10 overflow-hidden opacity-70 group-hover:opacity-100 transition-opacity">{module.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="group relative cursor-pointer" onClick={() => document.getElementById('musicia-strip')?.scrollIntoView()}>
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

        {/* MUSICIA BANNER STRIP */}
        <section id="musicia-strip" className="h-[220px] md:h-[280px] w-full relative overflow-hidden bg-black group/musicia flex items-center border-y-2 border-fuchsia-500/30 shadow-[0_0_50px_rgba(0,0,0,0.8)] px-10 md:px-24">
          <div className="absolute inset-0 z-0">
             <img src={musiciaEvent.img} alt="Musicia Banner" className="w-full h-full object-cover opacity-80 transition-transform duration-[2s] group-hover/musicia:scale-110 grayscale-[10%]" />
             <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/80"></div>
             <div className="absolute inset-0 bg-fuchsia-950/20 mix-blend-overlay"></div>
          </div>
          <div className="relative z-10 w-full flex flex-col md:flex-row items-center justify-between h-full py-8 gap-8">
            <div className="flex flex-col items-center md:items-start transition-transform duration-700 text-center md:text-left">
               <span className="inline-block text-[10px] md:text-xs text-fuchsia-400 font-bold tracking-[0.4em] bg-black/60 px-4 py-1.5 rounded-full border border-fuchsia-500/30 backdrop-blur-md mb-4 animate-fade-in">{musiciaEvent.time}</span>
               
               <div 
                 className="relative mb-4 cursor-default"
                 onMouseEnter={() => setIsMusiciaHovered(true)}
                 onMouseLeave={() => setIsMusiciaHovered(false)}
               >
                  <div className="absolute inset-0 pointer-events-none overflow-visible">
                    {notes.map(note => (
                      <div 
                        key={note.id}
                        className="absolute animate-float-note opacity-0"
                        style={{ 
                          left: `calc(50% + ${note.x}%)`, 
                          top: `calc(50% + ${note.y}%)`,
                          transform: `rotate(${note.rotation}deg) scale(${note.scale})`,
                          color: '#d946ef'
                        }}
                      >
                        {note.type === 0 && (
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>
                        )}
                        {note.type === 1 && (
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3l.01 10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6zm4.5 3h-3v-1h3v1z"/></svg>
                        )}
                        {note.type === 2 && (
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M21 3l-6 1.45V17.03c-.73-.44-1.61-.7-2.58-.7-2.48 0-4.5 1.75-4.5 3.91s2.02 3.91 4.5 3.91 4.5-1.75 4.5-3.91c0-.1-.01-.2-.02-.3V6.91l4-1v2.12c-.73-.44-1.61-.7-2.58-.7-2.48 0-4.5 1.75-4.5 3.91s2.02 3.91 4.5 3.91 4.5-1.75 4.5-3.91c0-.1-.01-.2-.02-.3V3z"/></svg>
                        )}
                      </div>
                    ))}
                  </div>

                  <h3 className={`text-5xl md:text-9xl font-anton tracking-tight text-white uppercase drop-shadow-[0_0_15px_rgba(217,70,239,0.5)] transition-all duration-300 leading-none ${isMusiciaHovered ? 'animate-musicia-vibrate text-fuchsia-400' : ''}`}>
                    {musiciaEvent.name}
                  </h3>
               </div>

               <p className="text-gray-200 text-[10px] md:text-xs font-space tracking-[0.15em] opacity-70 uppercase max-w-xl leading-relaxed">
                  {musiciaEvent.desc}
               </p>
            </div>
            
            <div className="group/enter relative flex items-center justify-center shrink-0">
              <div className="absolute inset-0 bg-fuchsia-500/20 blur-2xl opacity-0 group-hover/enter:opacity-100 transition-opacity duration-500"></div>
              <button className="relative z-10 px-8 py-4 md:px-12 md:py-6 bg-black/40 backdrop-blur-3xl border border-fuchsia-500/40 hover:border-fuchsia-500 text-white font-anton text-lg md:text-2xl tracking-widest rounded-xl transition-all duration-300 hover:scale-105 hover:-translate-y-1 shadow-[0_0_20px_rgba(217,70,239,0.1)] hover:shadow-[0_0_40px_rgba(217,70,239,0.3)]">
                <div className="flex items-center gap-4">
                  <span className="whitespace-nowrap">ENTER MUSICIA</span>
                  <svg className="w-6 h-6 md:w-8 md:h-8 text-fuchsia-500 group-hover/enter:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </div>
              </button>
            </div>
          </div>
        </section>

        <section id="register" className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden bg-gradient-to-b from-transparent to-fuchsia-950/10">
          <div className="relative w-full max-w-6xl mx-auto flex flex-col items-center justify-center p-12 md:p-24 overflow-hidden rounded-[3rem] z-20">
              <div className="absolute inset-0 pointer-events-none z-0">
                {lasers.map(laser => (
                  <div 
                    key={laser.id}
                    className="absolute bg-fuchsia-500 opacity-60 shadow-[0_0_15px_#d946ef] animate-laser-move"
                    style={{
                      top: `${laser.top}%`,
                      height: `${laser.thickness}px`,
                      width: `${laser.width}px`,
                      left: '-50%',
                      animationDuration: `${laser.duration}s`,
                      animationDelay: `${laser.delay}s`,
                      filter: `blur(${Math.random() * 2}px)`
                    }}
                  />
                ))}
              </div>
              <div className="absolute inset-0 bg-[#0c0c0c]/50 backdrop-blur-[180px] rounded-[3rem] border border-white/10 shadow-[0_0_150px_rgba(0,0,0,0.95)] z-10 pointer-events-none"></div>
              <div className="relative z-20 flex flex-col items-center justify-center">
                  <h4 className="text-4xl md:text-7xl font-anton tracking-tighter text-white mb-16 max-w-4xl px-4 text-center leading-tight">
                    READY TO ASCEND INTO THE <span className="text-fuchsia-500 drop-shadow-[0_0_15px_rgba(217,70,239,0.4)]">DIGITAL_REALM?</span>
                  </h4>
                  <RegisterButton size="lg" />
              </div>
          </div>
        </section>

        {/* CINEMATIC SPACE FOOTER SECTION */}
        <section ref={footerRef} id="footer-banner" className="h-[75vh] w-full relative overflow-hidden flex flex-col items-center justify-center py-4 px-4 transition-all duration-500 bg-black">
          {/* CINEMATIC SPACE BACKGROUND ELEMENTS */}
          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
             {/* Nebula Base */}
             <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_40%,rgba(139,92,246,0.15)_0%,transparent_50%),radial-gradient(circle_at_80%_60%,rgba(34,211,238,0.15)_0%,transparent_50%)] opacity-80 animate-nebula-pulse"></div>
             
             {/* Starfield */}
             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-40"></div>

             {/* BLACK HOLE ENTITY (Right Side) */}
             <div className="absolute right-[10%] top-1/2 -translate-y-1/2 w-[40vw] h-[40vw] flex items-center justify-center">
                {/* Gravitational Lensing Rings */}
                <div className="absolute w-[110%] h-[110%] rounded-full border border-fuchsia-500/10 blur-xl animate-lensing-pulse"></div>
                <div className="absolute w-[105%] h-[105%] rounded-full border border-cyan-400/5 blur-md"></div>
                
                {/* Main Rotating Accretion Disk */}
                <div className="absolute w-[140%] h-[35%] bg-gradient-to-r from-transparent via-orange-500/60 to-transparent blur-[40px] rotate-[25deg] animate-accretion-spin"></div>
                <div className="absolute w-[130%] h-[15%] bg-gradient-to-r from-transparent via-white/40 to-transparent blur-[15px] rotate-[25deg] animate-accretion-spin-reverse opacity-80"></div>
                
                {/* Event Horizon */}
                <div className="relative w-[18vw] h-[18vw] bg-black rounded-full shadow-[0_0_100px_rgba(0,0,0,1)] z-10">
                   <div className="absolute inset-0 rounded-full shadow-[inset_0_0_30px_rgba(255,165,0,0.4)]"></div>
                </div>
             </div>

             {/* FUTURISTIC SPACE SHUTTLE (Left Side) */}
             <div className="absolute left-[15%] top-1/2 -translate-y-1/2 w-48 h-32 animate-shuttle-drift">
                <div className="relative w-full h-full animate-shuttle-spin">
                   <svg viewBox="0 0 200 100" className="w-full h-full drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]">
                      {/* Shuttle Body */}
                      <path d="M 20 50 L 50 30 L 140 30 L 170 50 L 140 70 L 50 70 Z" fill="#1a1a1a" stroke="#444" strokeWidth="1" />
                      <path d="M 50 30 L 70 10 L 130 10 L 140 30 Z" fill="#222" />
                      {/* Windows */}
                      <rect x="145" y="45" width="15" height="10" rx="2" fill="rgba(34,211,238,0.6)" />
                      {/* Wing Details */}
                      <path d="M 60 30 L 40 15 L 100 15 L 110 30" fill="#111" />
                      <path d="M 60 70 L 40 85 L 100 85 L 110 70" fill="#111" />
                      {/* Thruster Base */}
                      <rect x="15" y="42" width="10" height="16" fill="#333" />
                   </svg>
                   {/* Realistic Thruster Glow */}
                   <div className="absolute -left-6 top-1/2 -translate-y-1/2 w-10 h-10 bg-cyan-400 blur-xl opacity-0 animate-thruster-pulse"></div>
                   <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full blur-sm opacity-0 animate-thruster-pulse delay-75"></div>
                </div>
             </div>
          </div>

          <div className="relative z-10 flex flex-col items-center justify-center text-center max-w-full w-full flex-1 group/footer overflow-hidden">
            {/* 2026 Background Year - Constrained precisely */}
            <div className={`
              absolute left-1/2 -translate-x-1/2 pointer-events-none select-none
              transition-all duration-1000 ease-[cubic-bezier(0.19,1,0.22,1)]
              ${isYearForward 
                ? 'z-20 opacity-100 blur-0 text-fuchsia-400 drop-shadow-[0_0_80px_rgba(217,70,239,1)] scale-[1.15]' 
                : 'z-0 opacity-70 blur-[3px] text-fuchsia-500/70 drop-shadow-[0_0_20px_rgba(217,70,239,0.3)] scale-100'}
              top-[40%] md:top-[38%] translate-y-0
            `}>
               <span className="text-[12vw] md:text-[10rem] font-anton tracking-[0.05em] leading-none inline-block scale-x-[1.3] scale-y-[1.8] transform origin-center">2026</span>
            </div>

            {/* MAIN YANTRAKSH TEXT - LARGER SIZE */}
            <h2 
              onMouseEnter={handleYearTrigger}
              className="relative z-10 text-[28vw] md:text-[23vw] font-anton text-white leading-none tracking-[-0.04em] drop-shadow-[0_10px_80px_rgba(0,0,0,0.8)] transition-all duration-1000 hover:scale-[1.03] cursor-default px-6 md:px-12 w-full text-center -translate-y-10 md:-translate-y-20"
            >
              YANTRAKSH
            </h2>

            {/* PINNED SOCIAL HANDLES */}
            <div className="absolute bottom-4 left-0 right-0 flex flex-col items-center gap-4">
               <span className="text-white text-xs md:text-lg font-anton tracking-[0.4em] uppercase opacity-90 drop-shadow-lg">OUR SOCIAL HANDLES</span>
               
               <div className="flex flex-wrap justify-center gap-5 md:gap-8 items-center">
                  <a href="#" className="text-white hover:text-fuchsia-500 transition-all duration-300 hover:scale-125">
                    <svg className="w-5 h-5 md:w-7 md:h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849s-.011 3.585-.069 4.85c-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07s-3.584-.012-4.849-.07c-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849s.012-3.584.07-4.849c.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948s.014 3.667.072 4.947c.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072s3.667-.014 4.947-.072c4.358-.2 6.78-2.618 6.98-6.98.058-1.28.072-1.689.072-4.948s-.014-3.667-.072-4.947c-.2-4.358-2.618-6.78-6.98-6.98-1.28-.058-1.689-.072-4.948-.072zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                  </a>
                  <a href="#" className="text-white hover:text-blue-500 transition-all duration-300 hover:scale-125">
                    <svg className="w-5 h-5 md:w-7 md:h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.04c-5.5 0-10 4.5-10 10.04 0 5 3.66 9.14 8.44 9.88v-6.99h-2.54v-2.89h2.54v-2.2c0-2.5 1.52-3.89 3.77-3.89 1.08 0 2.2.19 2.2.19v2.43h-1.24c-1.24 0-1.63.77-1.63 1.56v1.91h2.74l-.44 2.89h-2.3v6.99c4.78-.74 8.44-4.88 8.44-9.88 0-5.54-4.5-10.04-10-10.04z"/></svg>
                  </a>
                  <a href="#" className="text-white hover:text-gray-400 transition-all duration-300 hover:scale-125">
                    <svg className="w-5 h-5 md:w-7 md:h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                  </a>
                  <a href="#" className="text-white hover:text-blue-600 transition-all duration-300 hover:scale-125">
                    <svg className="w-5 h-5 md:w-7 md:h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                  </a>
                  <a href="#" className="text-white hover:text-[#FF4500] transition-all duration-300 hover:scale-125">
                    <svg className="w-5 h-5 md:w-7 md:h-7" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 11.5c0-1.65-1.35-3-3-3-.4 0-.78.08-1.13.23-1.64-1.16-3.87-1.9-6.31-1.97l1.43-4.52 3.93.84c.01 1.1.91 1.98 2 1.98 1.1 0 2-.9 2-2s-.9-2-2-2c-.78 0-1.47.44-1.81 1.1l-4.47-.96c-.22-.05-.44.09-.51.3l-1.67 5.27c-2.48.04-4.77.79-6.44 1.97-.35-.15-.73-.23-1.13-.23-1.65 0-3 1.35-3 3 0 1.25.77 2.33 1.86 2.77-.04.24-.06.48-.06.73 0 3.31 3.58 6 8 6s8-2.69 8-6c0-.25-.02-.48-.06-.72 1.09-.44 1.86-1.52 1.86-2.78zM7 13.5c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zm9.73 4.81c-.6.6-1.55.91-2.73.91s-2.13-.31-2.73-.91c-.2-.2-.2-.51 0-.71.2-.2.51-.2.71 0 .4.4 1.14.6 2.02.6s1.62-.2 2.02-.6c.2-.2.51-.2.71 0 .2.2.2.51 0 .71zM15 15.5c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/>
                    </svg>
                  </a>
                  <a href="#" className="text-white hover:text-red-600 transition-all duration-300 hover:scale-125">
                    <svg className="w-5 h-5 md:w-7 md:h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.612 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg>
                  </a>
                  <a href="mailto:contact@yantraksh.org" className="text-white hover:text-fuchsia-500 transition-all duration-300 hover:scale-125">
                    <svg className="w-5 h-5 md:w-7 md:h-7" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                    </svg>
                  </a>
               </div>
               {/* CREDITS LINE */}
               <p className="text-gray-500 text-[8px] md:text-[9px] uppercase tracking-[0.3em] font-space opacity-50">
                 made in collaboration of Lotus_Proton_6 & Shaunak_Sen
               </p>
            </div>
          </div>
        </section>
      </div>

      <style>{`
        @keyframes fusion-drift {
          0% { transform: translate(-20%, -20%) rotate(0deg) scale(1); }
          50% { transform: translate(20%, 20%) rotate(180deg) scale(1.3); }
          100% { transform: translate(-20%, -20%) rotate(360deg) scale(1); }
        }
        @keyframes robot-floating { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
        .animate-robot-floating { animation: robot-floating 4s ease-in-out infinite; }
        @keyframes eye-blink { 0%, 45%, 55%, 100% { transform: scaleY(1); } 50% { transform: scaleY(0.1); } }
        .animate-eye-blink { animation: eye-blink 5s ease-in-out infinite; transform-origin: center; }
        @keyframes shackle-steady { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-12px); } }
        .shackle-steady-animation { animation: shackle-steady 3s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite; }
        @keyframes shield-vibrate { 0% { transform: translate(0, 0); } 25% { transform: translate(-1.5px, 1.5px); } 50% { transform: translate(1.5px, -1.5px); } 75% { transform: translate(-1px, -2px); } 100% { transform: translate(1px, 2px); } }
        .group:hover .shield-vibrate-layer { animation: shield-vibrate 0.08s linear infinite; }
        @keyframes dna-breathe { 0%, 100% { transform: translateY(0) scale(1, 1); } 50% { transform: translateY(-4px) scale(1.05, 0.98); } }
        .dna-subtle-breathing { animation: dna-breathe 4s ease-in-out infinite; transform-origin: center; }
        @keyframes rung-blink-sequence { 0%, 5% { opacity: 0; filter: blur(2px); } 8%, 100% { opacity: 0.8; filter: blur(0); } }
        .group:hover .dna-rung-pulse { animation: rung-blink-sequence 1.5s linear infinite; }
        
        .leaf-visual { 
          transition: opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1), transform 0.5s cubic-bezier(0.4, 0, 0.2, 1); 
          opacity: 1; 
        }
        .coin-visual { 
          transition: opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1), transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1); 
          opacity: 0; 
          transform: scale(0.4); 
        }
        .group:hover .leaf-visual { opacity: 0; transform: scale(0.85); }
        .group:hover .coin-visual { opacity: 1; transform: scale(1.1); }

        @keyframes musicia-vibrate {
          0% { transform: translate(0,0) scale(1); }
          10% { transform: translate(-2px, 1px) scale(1.01); }
          20% { transform: translate(2px, -1px) scale(0.99); }
          30% { transform: translate(-2px, -2px) scale(1.02); }
          40% { transform: translate(2px, 2px) scale(1); }
          50% { transform: translate(-1px, 1px) scale(1.01); }
          60% { transform: translate(1px, -1px) scale(0.99); }
          70% { transform: translate(-2px, 1px) scale(1.02); }
          80% { transform: translate(2px, -2px) scale(1); }
          90% { transform: translate(-1px, 2px) scale(1.01); }
          100% { transform: translate(0,0) scale(1); }
        }
        .animate-musicia-vibrate { animation: musicia-vibrate 0.3s linear infinite; }
        @keyframes float-note {
          0% { transform: translateY(0) scale(0.5); opacity: 0; filter: blur(5px); }
          20% { opacity: 0.8; filter: blur(0); }
          80% { opacity: 0.6; }
          100% { transform: translateY(-150px) translateX(var(--tw-translate-x, 40px)) rotate(45deg) scale(1.2); opacity: 0; filter: blur(2px); }
        }
        .animate-float-note { animation: float-note 2s ease-out forwards; }
        @keyframes laser-move {
          0% { left: -50%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { left: 150%; opacity: 0; }
        }
        .animate-laser-move { animation: laser-move linear infinite; }
        @keyframes home-entry { from { opacity: 0; transform: scale(1.05) translateY(40px); filter: blur(15px); } to { opacity: 1; transform: scale(1) translateY(0); filter: blur(0); } }
        .animate-home-entry { animation: home-entry 1.8s cubic-bezier(0.19, 1, 0.22, 1) forwards; }
        @keyframes rapid-arrow-blink { 0%, 80% { opacity: 0.2; } 83%, 89%, 95% { opacity: 1; } 86%, 92%, 98% { opacity: 0.2; } 100% { opacity: 0.2; } }
        .animate-rapid-arrow-blink { animation: rapid-arrow-blink 5s infinite ease-in-out; }
        @keyframes char-reveal { from { opacity: 0; filter: blur(8px); transform: translateY(10px); } to { opacity: 1; filter: blur(0); transform: translateY(0); } }
        .animate-char-reveal { animation: char-reveal 0.8s cubic-bezier(0.19, 1, 0.22, 1) forwards; }
        
        /* THE SPECIFIC TEXT BLINK EFFECTS */
        @keyframes blink-active-stutter {
          0%, 10%, 20%, 30%, 40%, 100% { opacity: 1; filter: brightness(1); }
          5%, 15%, 25%, 35% { opacity: 0.3; filter: brightness(1.6) contrast(1.2); }
        }
        /* triggers on hover */
        .animate-blink-flicker { 
          animation: blink-active-stutter 0.7s cubic-bezier(0.45, 0.05, 0.55, 0.95) forwards; 
        }
        /* triggers on entry/re-mount */
        .animate-blink-once { 
          animation: blink-active-stutter 0.35s cubic-bezier(0.45, 0.05, 0.55, 0.95) forwards; 
        }

        @keyframes fuchsia-glow-pulse {
          0%, 100% { text-shadow: 0 0 4px #d946ef, 0 0 10px rgba(217, 70, 239, 0.2); }
          50% { text-shadow: 0 0 8px #d946ef, 0 0 15px rgba(217, 70, 239, 0.4); }
        }
        .animate-fuchsia-glow { animation: fuchsia-glow-pulse 3s ease-in-out infinite; }
        @keyframes lime-glow-pulse {
          0%, 100% { text-shadow: 0 0 4px #a3e635, 0 0 10px rgba(163, 230, 53, 0.2); }
          50% { text-shadow: 0 0 8px #a3e635, 0 0 15px rgba(163, 230, 53, 0.4); }
        }
        .animate-lime-glow { animation: lime-glow-pulse 3s ease-in-out infinite; }

        /* SPACE FOOTER ANIMATIONS */
        @keyframes nebula-pulse {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.1); opacity: 1; }
        }
        @keyframes accretion-spin {
          from { transform: rotate(25deg) scale(1); filter: blur(40px) brightness(1); }
          50% { transform: rotate(25deg) scale(1.05); filter: blur(45px) brightness(1.2); }
          to { transform: rotate(385deg) scale(1); filter: blur(40px) brightness(1); }
        }
        @keyframes accretion-spin-reverse {
          from { transform: rotate(25deg) scale(1); }
          to { transform: rotate(-335deg) scale(1); }
        }
        @keyframes lensing-pulse {
          0%, 100% { transform: scale(1); opacity: 0.1; }
          50% { transform: scale(1.02); opacity: 0.2; }
        }
        @keyframes shuttle-drift {
          0%, 100% { transform: translateY(-50%) translateX(0); }
          50% { transform: translateY(-55%) translateX(15px); }
        }
        @keyframes shuttle-spin {
          from { transform: rotateY(0deg) rotateX(0deg); }
          to { transform: rotateY(360deg) rotateX(10deg); }
        }
        @keyframes thruster-pulse {
          0%, 100% { opacity: 0; transform: translateY(-50%) scale(0.8); }
          50% { opacity: 0.6; transform: translateY(-50%) scale(1.2); }
        }
        .animate-nebula-pulse { animation: nebula-pulse 10s ease-in-out infinite; }
        .animate-accretion-spin { animation: accretion-spin 15s linear infinite; }
        .animate-accretion-spin-reverse { animation: accretion-spin-reverse 10s linear infinite; }
        .animate-lensing-pulse { animation: lensing-pulse 4s ease-in-out infinite; }
        .animate-shuttle-drift { animation: shuttle-drift 8s ease-in-out infinite; }
        .animate-shuttle-spin { animation: shuttle-spin 12s linear infinite; transform-style: preserve-3d; perspective: 500px; }
        .animate-thruster-pulse { animation: thruster-pulse 0.2s ease-in-out infinite; }

        /* ABOUT SPACE ANIMATIONS (Enhanced organic drift) */
        @keyframes earth-orbit-drift {
            0%, 100% { transform: scale(1) translate(0, 0) rotate(0deg); }
            25% { transform: scale(1.02) translate(15px, -8px) rotate(0.1deg); }
            50% { transform: scale(1.01) translate(-10px, 15px) rotate(-0.15deg); }
            75% { transform: scale(1.03) translate(-15px, -10px) rotate(0.05deg); }
        }
        .animate-earth-orbit-drift { animation: earth-orbit-drift 40s ease-in-out infinite; }

        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: rgba(0,0,0,0.2); }
        ::-webkit-scrollbar-thumb { background: #d946ef; border-radius: 10px; box-shadow: 0 0 10px rgba(217,70,239,0.5); }
      `}</style>
    </div>
  );
};

export default Home;
