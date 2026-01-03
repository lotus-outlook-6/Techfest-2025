
import React, { useEffect, useRef, useState } from 'react';

type AnimPhase = 'idle' | 'y' | 't' | 'g' | 'waiting' | 'all';

interface GalleryImage {
  id: number;
  url: string;
  title: string;
  category: string;
}

const GALLERY_IMAGES: GalleryImage[] = [
  { id: 1, title: 'NEURAL_LINK_v1', category: 'BIOTECH', url: 'https://images.unsplash.com/photo-1555664424-778a1e5e1b48?q=80&w=1000' },
  { id: 2, title: 'QUANTUM_CORE', category: 'ENERGY', url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1000' },
  { id: 3, title: 'ORBITAL_STATION', category: 'AEROSPACE', url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1000' },
  { id: 4, title: 'ROBOTIC_ARM_X', category: 'ROBOTICS', url: 'https://images.unsplash.com/photo-1589254065878-42c9da997008?q=80&w=1000' },
  { id: 5, title: 'CYBER_HUB', category: 'INFRA', url: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?q=80&w=1000' },
  { id: 6, title: 'VOID_NAV', category: 'NAVIGATION', url: 'https://images.unsplash.com/photo-1614728263952-84ea256f9679?q=80&w=1000' },
];

const Gallery: React.FC = () => {
  const yPath = "M 25 30 H 85 L 120 80 L 155 30 H 215 L 145 130 V 210 H 95 V 130 L 25 30 Z";
  
  const containerRef = useRef<HTMLDivElement>(null);
  const parallaxRef = useRef<SVGGElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gallerySectionRef = useRef<HTMLDivElement>(null);
  
  const [phase, setPhase] = useState<AnimPhase>('idle');
  const [isHovered, setIsHovered] = useState(false);
  const isAnimatingRef = useRef(false);
  const dwellTimerRef = useRef<number | null>(null);

  const mouseRef = useRef({ x: 0, y: 0 });
  const smoothedRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    
    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      mouseRef.current.x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      mouseRef.current.y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    };

    const animate = (time: number) => {
      const easing = 0.08; 
      smoothedRef.current.x += (mouseRef.current.x - smoothedRef.current.x) * easing;
      smoothedRef.current.y += (mouseRef.current.y - smoothedRef.current.y) * easing;

      if (parallaxRef.current) {
        const moveX = smoothedRef.current.x * 5;
        const moveY = smoothedRef.current.y * 5;
        parallaxRef.current.style.transform = `translate3d(${moveX.toFixed(4)}px, ${moveY.toFixed(4)}px, 0)`;
      }

      ctx.clearRect(0, 0, width, height);
      const spacing = 32;
      const centerX = width / 2;
      const centerY = height / 2;
      const offsetX = smoothedRef.current.x * -30;
      const offsetY = smoothedRef.current.y * -30;
      const speed = 0.002;
      const waveFrequency = 0.008;

      ctx.shadowColor = "rgba(255, 255, 255, 0.8)";
      for (let x = -spacing; x < width + spacing * 2; x += spacing) {
        for (let y = -spacing; y < height + spacing * 2; y += spacing) {
          const posX = x + offsetX;
          const posY = y + offsetY;
          const dx = posX - centerX;
          const dy = posY - centerY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const pulse = Math.sin(time * speed - dist * waveFrequency);
          const normalizedPulse = (pulse + 1) / 2;
          const currentRadius = 1.0 + (normalizedPulse * 4.5);
          const opacity = 0.15 + (normalizedPulse * 0.6);
          const maskStrength = Math.max(0, 1 - dist / (width * 0.65));
          if (maskStrength > 0.05) {
            ctx.shadowBlur = 4 + (normalizedPulse * 12);
            ctx.fillStyle = `rgba(255, 255, 255, ${opacity * maskStrength})`;
            ctx.beginPath();
            ctx.arc(posX, posY, currentRadius, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }
      rafRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove);
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (dwellTimerRef.current) window.clearTimeout(dwellTimerRef.current);
    };
  }, []);

  const triggerAnimationSequence = () => {
    if (isAnimatingRef.current) return;
    isAnimatingRef.current = true;
    setIsHovered(true);

    setPhase('y');
    setTimeout(() => setPhase('t'), 800);
    setTimeout(() => setPhase('g'), 1600);
    setTimeout(() => setPhase('waiting'), 2400);
    setTimeout(() => setPhase('all'), 3400);
    setTimeout(() => {
      setPhase('idle');
      setIsHovered(false);
      isAnimatingRef.current = false;
    }, 5400);
  };

  const handleMouseEnter = () => {
    if (isAnimatingRef.current) return;
    if (dwellTimerRef.current) window.clearTimeout(dwellTimerRef.current);
    dwellTimerRef.current = window.setTimeout(() => triggerAnimationSequence(), 3000);
  };

  const handleMouseLeave = () => {
    if (dwellTimerRef.current) {
      window.clearTimeout(dwellTimerRef.current);
      dwellTimerRef.current = null;
    }
  };

  const scrollToGallery = () => {
    gallerySectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const getTextStyle = (target: AnimPhase) => {
    const isActivelyPopped = phase === 'all' || phase === target;
    const isGlowVisible = isHovered;

    return {
      opacity: isGlowVisible ? 1 : 0.7,
      filter: isGlowVisible 
        ? `drop-shadow(0 0 30px rgba(255,255,255,${isActivelyPopped ? 0.8 : 0.2}))` 
        : 'none',
      transform: isActivelyPopped 
        ? 'scale(1.15) translateZ(150px)' 
        : 'scale(1) translateZ(-80px)',
      transition: 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)'
    };
  };

  return (
    <div 
      ref={containerRef}
      className="relative block w-full h-full bg-transparent select-none overflow-y-auto scroll-smooth no-scrollbar"
      style={{ WebkitFontSmoothing: 'antialiased', perspective: '1200px' }}
    >
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        
        @keyframes subtle-breathing {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.015); }
        }
        .animate-subtle-breathing {
          animation: subtle-breathing 16s ease-in-out infinite;
        }

        @keyframes neon-flicker-subtle {
          0%, 100% { filter: drop-shadow(0 0 10px #ff00ff) drop-shadow(0 0 25px rgba(255, 0, 255, 0.6)); stroke-opacity: 1; }
          50% { filter: drop-shadow(0 0 18px #ff00ff) drop-shadow(0 0 40px rgba(255, 0, 255, 0.8)); stroke-opacity: 0.9; }
        }

        .neon-y-outline {
          animation: neon-flicker-subtle 4s ease-in-out infinite;
          stroke: #ff00ff;
          stroke-width: 2.5;
        }

        .gallery-depth-text {
          font-family: 'Anton', sans-serif;
          letter-spacing: 0.15em;
          color: white;
          white-space: nowrap;
          line-height: 1;
          display: block;
          text-align: center;
          will-change: transform, opacity, filter;
        }

        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-bounce-subtle { animation: bounce-subtle 2s infinite ease-in-out; }
      `}</style>

      {/* HERO SECTION */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
        <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none" />

        <div className="relative w-full h-full flex items-center justify-center -translate-y-12 md:-translate-y-16" style={{ transformStyle: 'preserve-3d' }}>
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-16 md:gap-20 pointer-events-none" style={{ transformStyle: 'preserve-3d' }}>
            <span className="gallery-depth-text text-[4rem] md:text-[6rem] lg:text-[8rem]" style={getTextStyle('y')}>YANTRAKSH</span>
            <span className="gallery-depth-text text-[5rem] md:text-[7.5rem] lg:text-[10rem]" style={getTextStyle('t')}>TECHNICAL</span>
            <span className="gallery-depth-text text-[4rem] md:text-[6rem] lg:text-[8rem]" style={getTextStyle('g')}>GALLERY</span>
          </div>

          <div 
            className="relative pointer-events-auto"
            style={{ transform: 'translateZ(0px)', transformStyle: 'preserve-3d' }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div className="relative w-[240px] md:w-[380px] lg:w-[460px] aspect-square flex items-center justify-center shrink-0 cursor-pointer">
              <svg viewBox="0 0 240 240" className="w-full h-full drop-shadow-[0_0_60px_rgba(0,0,0,0.95)]" fill="none">
                <defs>
                  <pattern id="spacePattern" patternUnits="userSpaceOnUse" width="80" height="80">
                    <image href="https://img.freepik.com/premium-vector/seamless-pattern-with-cute-space-doodles-black-background_150234-147063.jpg?w=1480" width="80" height="80" preserveAspectRatio="xMidYMid slice" />
                  </pattern>
                  <clipPath id="yClipStrict"><path d={yPath} /></clipPath>
                </defs>
                <g clipPath="url(#yClipStrict)">
                  <path d={yPath} fill="#050505" />
                  <g ref={parallaxRef} className="parallax-layer">
                    <g className="animate-subtle-breathing" style={{ transformOrigin: '120px 120px' }}>
                      <rect x="-40" y="-40" width="320" height="320" fill="url(#spacePattern)" />
                    </g>
                  </g>
                </g>
                <path d={yPath} strokeLinejoin="round" strokeLinecap="round" className="neon-y-outline" />
              </svg>
            </div>
          </div>
        </div>

        {/* SCROLL TRIGGER BUTTON - Simplified grey arrow, moved higher */}
        <button 
          onClick={scrollToGallery}
          className="absolute bottom-32 left-1/2 -translate-x-1/2 z-20 group flex flex-col items-center outline-none animate-bounce-subtle"
        >
          <svg 
            className="w-10 h-10 text-gray-500/80 group-hover:text-gray-300 transition-colors duration-300 drop-shadow-[0_0_8px_rgba(0,0,0,0.5)]" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </button>
      </section>

      {/* SCROLLABLE IMAGES SECTION */}
      <section ref={gallerySectionRef} className="min-h-screen w-full bg-[#050505]/80 backdrop-blur-md pt-20 pb-40 px-6 md:px-20 relative border-t border-fuchsia-500/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-end justify-between mb-20 gap-8">
            <div>
              <h3 className="text-4xl md:text-6xl font-anton text-white tracking-wider uppercase mb-4">Project_Archives</h3>
              <p className="text-gray-400 font-mono text-xs md:text-sm tracking-[0.2em] uppercase opacity-60">System Log: Accessing secure technical imagery...</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="h-px w-20 bg-fuchsia-500/30"></div>
              <span className="text-fuchsia-500 font-mono text-xs font-bold">STATUS: STABLE</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {GALLERY_IMAGES.map((img) => (
              <div key={img.id} className="group relative aspect-[16/11] overflow-hidden rounded-2xl border border-white/5 bg-[#0c0c0c] transition-all duration-500 hover:border-fuchsia-500/40 hover:shadow-[0_0_40px_rgba(217,70,239,0.15)]">
                <img 
                  src={img.url} 
                  alt={img.title} 
                  className="w-full h-full object-cover grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
                
                <div className="absolute bottom-6 left-6 right-6 flex flex-col">
                  <span className="text-[10px] text-fuchsia-500 font-bold tracking-widest mb-1">{img.category}</span>
                  <h4 className="text-xl font-anton text-white tracking-wide uppercase transition-transform duration-500 group-hover:translate-x-2">{img.title}</h4>
                </div>

                {/* TECH ACCENTS */}
                <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                   <div className="w-1.5 h-1.5 bg-fuchsia-500 rounded-full animate-pulse"></div>
                   <div className="w-1.5 h-1.5 bg-fuchsia-500 rounded-full animate-pulse delay-75"></div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-32 text-center">
            <div className="inline-block p-1 bg-gradient-to-r from-transparent via-fuchsia-500/20 to-transparent w-full mb-8"></div>
            <p className="text-gray-500 font-mono text-[10px] tracking-[1em] uppercase">End of Directory</p>
          </div>
        </div>
      </section>

      <div className="fixed bottom-10 left-10 text-white/5 font-mono text-[8px] tracking-[2.5em] uppercase pointer-events-none z-0">
        AXIS_PATTERN_UPLINK
      </div>
    </div>
  );
};

export default Gallery;
