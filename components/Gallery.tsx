
import React, { useEffect, useRef, useState } from 'react';

type AnimPhase = 'idle' | 'y' | 't' | 'g' | 'waiting' | 'all';

interface GalleryImage {
  id: number;
  url: string;
  title: string;
  category: string;
}

const INITIAL_IMAGES: GalleryImage[] = [
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
  
  const [images, setImages] = useState<GalleryImage[]>(INITIAL_IMAGES);
  const [phase, setPhase] = useState<AnimPhase>('idle');
  const [isHovered, setIsHovered] = useState(false);
  const isAnimatingRef = useRef(false);
  const dwellTimerRef = useRef<number | null>(null);

  // States for the 3D Stack / Carousel
  const [isExpanded, setIsExpanded] = useState(false);
  const [showSlider, setShowSlider] = useState(false);
  const [autoRotation, setAutoRotation] = useState(0);
  const rotationRef = useRef(0);
  
  // Spring-Loaded Slider States
  const [sliderValue, setSliderValue] = useState(0); // -100 to 100
  const [isSliderHovered, setIsSliderHovered] = useState(false);
  const isHoldingSlider = useRef(false);
  const [isManualInteraction, setIsManualInteraction] = useState(false);
  const resumeTimerRef = useRef<number | null>(null);

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

      // 1. Rotation Logic
      if (isExpanded) {
        if (Math.abs(sliderValue) > 0.5) {
          const normalizedDisplacement = sliderValue / 100;
          const variableSpeed = Math.sign(normalizedDisplacement) * Math.pow(Math.abs(normalizedDisplacement), 1.6) * 7.5;
          rotationRef.current = (rotationRef.current + variableSpeed) % 360;
        } else if (!isManualInteraction) {
          rotationRef.current = (rotationRef.current + 0.15) % 360;
        }
        setAutoRotation(rotationRef.current);
      }

      // 2. Spring Physics for Slider (Snap back when not holding)
      if (!isHoldingSlider.current && Math.abs(sliderValue) > 0.1) {
        setSliderValue(prev => prev * 0.82); 
      } else if (!isHoldingSlider.current && Math.abs(sliderValue) <= 0.1) {
        setSliderValue(0);
      }

      // Background Rendering
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
          const dist = Math.sqrt(dx * dx + (posY - centerY) * (posY - centerY));
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
  }, [isExpanded, isManualInteraction, sliderValue]);

  const resetManualInteractionTimer = () => {
    setIsManualInteraction(true);
    if (resumeTimerRef.current) window.clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = window.setTimeout(() => {
      setIsManualInteraction(false);
    }, 2000); 
  };

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

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isExpanded) return;
    const val = parseFloat(e.target.value);
    setSliderValue(val);
    resetManualInteractionTimer();
  };

  const handleExpand = () => {
    setIsExpanded(true);
    // Delay slider appearance until expansion transition is well underway
    setTimeout(() => {
      setShowSlider(true);
    }, 400);
  };

  const handleCollapse = () => {
    if (!isExpanded) return;

    // Hide slider immediately
    setShowSlider(false);

    // FIND THE FRONT-MOST IMAGE INDEX
    const count = images.length;
    const angleStep = 360 / count;
    let frontIndex = 0;
    let maxCos = -2;

    for (let i = 0; i < count; i++) {
      const itemRotation = (i * angleStep) + autoRotation;
      const rad = (itemRotation * Math.PI) / 180;
      const currentCos = Math.cos(rad);
      if (currentCos > maxCos) {
        maxCos = currentCos;
        frontIndex = i;
      }
    }

    const newImages = [...images];
    const shifted = [];
    for (let i = 0; i < count; i++) {
      shifted.push(newImages[(frontIndex + i) % count]);
    }

    setImages(shifted);
    setIsExpanded(false);
    rotationRef.current = 0;
    setAutoRotation(0);
    setIsManualInteraction(false);
    setSliderValue(0);
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

        input[type=range].gallery-slider {
          -webkit-appearance: none;
          width: 100%;
          height: 32px;
          background: transparent;
          z-index: 30;
          cursor: pointer;
        }
        input[type=range].gallery-slider::-webkit-slider-runnable-track {
          width: 100%;
          height: 6px;
          cursor: pointer;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
        }
        input[type=range].gallery-slider::-webkit-slider-thumb {
          height: 22px;
          width: 80px;
          background: transparent;
          cursor: pointer;
          -webkit-appearance: none;
          margin-top: -8px;
        }

        @keyframes flow-arrows-rtl {
          0% { background-position: 0% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes flow-arrows-ltr {
          0% { background-position: 0% 0; }
          100% { background-position: -200% 0; }
        }

        .arrow-flow-text {
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          font-weight: 900;
          font-family: monospace;
          font-size: 26px; 
          letter-spacing: -3px;
          transition: background 0.4s ease-in-out;
        }
        
        .arrows-normal {
          background-image: linear-gradient(90deg, #d946ef 0%, #ffffff 50%, #d946ef 100%);
        }
        .arrows-inverted {
          background-image: linear-gradient(90deg, #ffffff 0%, #d946ef 50%, #ffffff 100%);
        }

        .flow-rtl { animation: flow-arrows-rtl 1.2s linear infinite; }
        .flow-ltr { animation: flow-arrows-ltr 1.2s linear infinite; }

        .slider-pill-thumb {
          transition: background-color 0.4s ease, transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.4s ease;
          will-change: left, transform, background-color;
        }

        .slider-cursor-glow {
          position: fixed;
          width: 180px;
          height: 180px;
          background: radial-gradient(circle at center, rgba(217, 70, 239, 0.2) 0%, transparent 75%);
          pointer-events: none;
          z-index: 50;
          transform: translate(-50%, -50%);
          mix-blend-mode: screen;
        }
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

      {/* GALLERY SECTION */}
      <section ref={gallerySectionRef} className="min-h-screen w-full bg-transparent pt-2 pb-20 px-6 md:px-20 relative border-t border-fuchsia-500/10">
        <div className="max-w-7xl mx-auto flex flex-col items-center">
          <div className="flex flex-col items-center justify-center mb-0">
            <h3 className="text-4xl md:text-7xl font-anton text-white tracking-widest uppercase text-center flex flex-col">
              <span>YANTRAKSH</span>
              <span className="text-fuchsia-500 drop-shadow-[0_0_15px_rgba(217,70,239,0.4)]">TECHNICAL GALLERY</span>
            </h3>
          </div>

          <div 
            className="relative w-full min-h-[420px] md:min-h-[460px] flex items-center justify-center perspective-[1500px] overflow-visible cursor-default"
            onClick={() => { if(isExpanded) handleCollapse(); }}
          >
            <div 
              className="relative w-[320px] md:w-[480px] aspect-[16/10] flex items-center justify-center"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {images.map((img, index) => {
                const count = images.length;
                const angleStep = 360 / count;
                const itemRotation = (index * angleStep) + autoRotation;
                const rad = (itemRotation * Math.PI) / 180;
                
                const radius = window.innerWidth < 768 ? 200 : 380;
                const x = isExpanded ? Math.sin(rad) * radius : 0;
                // Use a larger range for Z depth sorting to ensure preserve-3d works cleanly
                const z = isExpanded ? (Math.cos(rad) * radius - radius) : -index * 30;
                const rotateZ = isExpanded ? 0 : index * 2.5 - 5;
                const opacity = isExpanded ? (0.2 + (Math.cos(rad) + 1) * 0.4) : 1;
                const scale = isExpanded ? (0.75 + (Math.cos(rad) + 1) * 0.25) : 1;
                
                // When expanded, we rely on preserve-3d and translate3d Z position for sorting.
                // When collapsed, we can use simple stack order.
                const zIndex = isExpanded ? 0 : count - index;

                return (
                  <div 
                    key={img.id}
                    className="absolute inset-0 rounded-3xl border border-white/10 overflow-hidden bg-[#0c0c0c] transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)]"
                    style={{ 
                      // Removing discrete 'transform' from transition during continuous rotation to keep it smooth
                      transitionProperty: isExpanded ? 'opacity, scale, border-color, box-shadow' : 'all',
                      transform: `translate3d(${x}px, 0, ${z}px) rotateZ(${rotateZ}deg) scale(${scale})`,
                      opacity: opacity,
                      zIndex: zIndex,
                      pointerEvents: isExpanded ? 'none' : (index === 0 ? 'auto' : 'none'),
                      boxShadow: isExpanded ? `0 0 30px rgba(217,70,239,${(Math.cos(rad) + 1) * 0.1})` : '0 10px 40px rgba(0,0,0,0.5)',
                      cursor: isExpanded ? 'default' : (index === 0 ? 'pointer' : 'default')
                    }}
                    onClick={(e) => {
                      if (!isExpanded && index === 0) {
                        e.stopPropagation();
                        handleExpand();
                      }
                    }}
                  >
                    <img 
                      src={img.url} 
                      alt={img.title} 
                      className={`w-full h-full object-cover transition-all duration-1000 ${isExpanded ? 'grayscale-0' : 'opacity-60 grayscale'}`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80"></div>
                    
                    <div className="absolute bottom-6 left-8 right-8 flex flex-col items-start">
                      <span className="text-[10px] text-fuchsia-500 font-bold tracking-[0.3em] mb-1 uppercase">{img.category}</span>
                      <h4 className="text-xl md:text-2xl font-anton text-white tracking-wide uppercase">{img.title}</h4>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* SPRING-LOADED SCROLL BAR (FADING PILL) */}
          <div className="w-full max-w-lg px-10 relative overflow-visible h-24 flex flex-col items-center">
            <div 
              className={`w-full flex flex-col items-center transition-opacity duration-1000 ease-[cubic-bezier(0.19,1,0.22,1)] ${showSlider ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            >
               <div 
                 className="relative w-full h-12 flex items-center group/slider"
                 onMouseEnter={() => setIsSliderHovered(true)}
                 onMouseLeave={() => setIsSliderHovered(false)}
               >
                 {/* CURSOR GLOW */}
                 {(isSliderHovered || isHoldingSlider.current) && (
                   <div 
                     className="slider-cursor-glow"
                     style={{ 
                       left: `calc(${(sliderValue + 100) / 2}% - 0px)`,
                       top: '50%'
                     }}
                   />
                 )}

                 {/* VISUAL TRACK */}
                 <div className="absolute left-0 right-0 h-[3px] bg-white/10 rounded-full"></div>
                 
                 {/* ACTUAL SLIDER (Thumb hidden) */}
                 <input 
                   type="range" 
                   min="-100" 
                   max="100" 
                   step="0.1"
                   value={sliderValue}
                   onChange={handleSliderChange}
                   onMouseDown={() => { isHoldingSlider.current = true; resetManualInteractionTimer(); }}
                   onMouseUp={() => { isHoldingSlider.current = false; }}
                   onMouseLeave={() => { isHoldingSlider.current = false; }}
                   onTouchStart={() => { isHoldingSlider.current = true; resetManualInteractionTimer(); }}
                   onTouchEnd={() => { isHoldingSlider.current = false; }}
                   className="gallery-slider relative z-20"
                 />
                 
                 {/* CUSTOM VISUAL THUMB (Optimized Light Flow) */}
                 <div 
                   className={`absolute top-1/2 -translate-y-1/2 w-[80px] h-[22px] rounded-full flex items-center justify-between px-3 pointer-events-none slider-pill-thumb 
                    ${(isSliderHovered || isHoldingSlider.current) 
                        ? 'bg-fuchsia-500 shadow-[0_0_60px_#d946ef,0_0_30px_rgba(217,70,239,0.8),0_0_15px_rgba(255,255,255,0.4)] scale-110' 
                        : 'bg-white shadow-[0_0_30px_rgba(255,255,255,0.7),0_0_10px_rgba(255,255,255,0.3)]'}`}
                   style={{ 
                     left: `calc(${(sliderValue + 100) / 2}% - 40px)`,
                     zIndex: 25
                   }}
                 >
                   <span className={`arrow-flow-text flow-rtl ${(isSliderHovered || isHoldingSlider.current) ? 'arrows-inverted' : 'arrows-normal'}`}>«</span>
                   <span className={`arrow-flow-text flow-ltr ${(isSliderHovered || isHoldingSlider.current) ? 'arrows-inverted' : 'arrows-normal'}`}>»</span>
                 </div>
               </div>
            </div>
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
