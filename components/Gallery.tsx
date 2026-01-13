
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

const SPOTLIGHT_IMAGES = [
  { id: 's1', url: 'https://images.unsplash.com/photo-1768151088111-6cbc40bb8e8b?q=80&w=1077&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', title: 'COMPETITIVE CODING', tag: 'ENGINEERING' },
  { id: 's2', url: 'https://images.unsplash.com/photo-1768151103408-c9d56ceb61c1?q=80&w=1077&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', title: 'ROBO RACE', tag: 'ROBOTICS' },
  { id: 's3', url: 'https://images.unsplash.com/photo-1768151119770-b71e040a213c?q=80&w=1340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', title: 'IMAGE PROMPTING', tag: 'AI' },
  { id: 's4', url: 'https://images.unsplash.com/photo-1768151109794-b616124234ad?q=80&w=1340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', title: 'TECH DEBATE', tag: 'DEBATE' },
];

const Gallery: React.FC = () => {
  // Y-Path coordinates
  const yPath = "M 25 30 H 85 L 120 80 L 155 30 H 215 L 145 130 V 210 H 95 V 130 L 25 30 Z";
  
  const containerRef = useRef<HTMLDivElement>(null);
  const parallaxRef = useRef<SVGGElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gallerySectionRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLElement>(null);
  
  const [images, setImages] = useState<GalleryImage[]>(INITIAL_IMAGES);
  const [phase, setPhase] = useState<AnimPhase>('idle');
  const [isHovered, setIsHovered] = useState(false);
  const [fillProgress, setFillProgress] = useState(0); 
  const [isDraining, setIsDraining] = useState(false);
  const isAnimatingRef = useRef(false);
  const fillRequestRef = useRef<number | null>(null);

  const [isExpanded, setIsExpanded] = useState(true);
  const [showSlider, setShowSlider] = useState(true);
  const [autoRotation, setAutoRotation] = useState(0);
  const rotationRef = useRef(0);
  
  const [sliderValue, setSliderValue] = useState(0); 
  const [isSliderHovered, setIsSliderHovered] = useState(false);
  const isHoldingSlider = useRef(false);
  const [isManualInteraction, setIsManualInteraction] = useState(false);
  const resumeTimerRef = useRef<number | null>(null);

  const [isYearForward, setIsYearForward] = useState(false);
  const yearResetTimer = useRef<number | null>(null);

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

      if (isExpanded) {
        if (Math.abs(sliderValue) > 0.5) {
          const normalizedDisplacement = sliderValue / 100;
          const variableSpeed = Math.sign(normalizedDisplacement) * Math.pow(Math.abs(normalizedDisplacement), 1.6) * 15.0;
          rotationRef.current = (rotationRef.current + variableSpeed) % 360;
        } else if (!isManualInteraction) {
          rotationRef.current = (rotationRef.current + 0.5) % 360;
        }
        setAutoRotation(rotationRef.current);
      }

      if (!isHoldingSlider.current && Math.abs(sliderValue) > 0.1) {
        setSliderValue(prev => prev * 0.82); 
      } else if (!isHoldingSlider.current && Math.abs(sliderValue) <= 0.1) {
        setSliderValue(0);
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
    };
  }, [isExpanded, isManualInteraction, sliderValue]);

  useEffect(() => {
    if (isAnimatingRef.current) return;

    if (isDraining) {
      const drain = () => {
        setFillProgress(prev => {
          const next = prev - 3.0; 
          if (next <= 0) {
            setIsDraining(false);
            triggerAnimationSequence();
            return 0;
          }
          fillRequestRef.current = requestAnimationFrame(drain);
          return next;
        });
      };
      if (fillRequestRef.current) cancelAnimationFrame(fillRequestRef.current);
      fillRequestRef.current = requestAnimationFrame(drain);
    } else if (isHovered && fillProgress < 100) {
      const fill = () => {
        setFillProgress(prev => {
          const next = prev + 1.2; 
          if (next >= 100) {
            setIsDraining(true);
            return 100;
          }
          fillRequestRef.current = requestAnimationFrame(fill);
          return next;
        });
      };
      if (fillRequestRef.current) cancelAnimationFrame(fillRequestRef.current);
      fillRequestRef.current = requestAnimationFrame(fill);
    } else if (!isHovered && fillProgress > 0) {
      const unfill = () => {
        setFillProgress(prev => {
          const next = prev - 2.0; 
          if (next <= 0) return 0;
          fillRequestRef.current = requestAnimationFrame(unfill);
          return next;
        });
      };
      if (fillRequestRef.current) cancelAnimationFrame(fillRequestRef.current);
      fillRequestRef.current = requestAnimationFrame(unfill);
    }

    return () => {
      if (fillRequestRef.current) cancelAnimationFrame(fillRequestRef.current);
    };
  }, [isHovered, isDraining]);

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
    if (footerRef.current) observer.observe(footerRef.current);
    return () => observer.disconnect();
  }, []);

  const resetManualInteractionTimer = () => {
    setIsManualInteraction(true);
    if (resumeTimerRef.current) window.clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = window.setTimeout(() => {
      setIsManualInteraction(false);
    }, 2000); 
  };

  const handleYearTrigger = () => {
    if (isYearForward) return;
    setIsYearForward(true);
    if (yearResetTimer.current) window.clearTimeout(yearResetTimer.current);
    yearResetTimer.current = window.setTimeout(() => setIsYearForward(false), 3000);
  };

  const triggerAnimationSequence = () => {
    if (isAnimatingRef.current) return;
    isAnimatingRef.current = true;

    setPhase('y');
    setTimeout(() => setPhase('t'), 800);
    setTimeout(() => setPhase('g'), 1600);
    setTimeout(() => setPhase('waiting'), 2400);
    setTimeout(() => setPhase('all'), 3400);
    setTimeout(() => {
      setPhase('idle');
      isAnimatingRef.current = false;
      setFillProgress(0); 
      setIsDraining(false);
    }, 5400);
  };

  const scrollToGallery = () => {
    gallerySectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const getTextStyle = (target: AnimPhase) => {
    const isActivelyPopped = phase === 'all' || phase === target;
    const isGlowVisible = isAnimatingRef.current;

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
    setTimeout(() => {
      setShowSlider(true);
    }, 400);
  };

  const handleCollapse = () => {
    if (!isExpanded) return;
    setShowSlider(false);
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
      className="relative block w-full h-full bg-transparent select-none overflow-y-auto scroll-smooth"
      style={{ WebkitFontSmoothing: 'antialiased', perspective: '1200px' }}
    >
      <style>{`
        @keyframes subtle-breathing { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.015); } }
        .animate-subtle-breathing { animation: subtle-breathing 16s ease-in-out infinite; }

        @keyframes neon-flicker-subtle {
          0%, 100% { filter: drop-shadow(0 0 10px #ff00ff) drop-shadow(0 0 25px rgba(255, 0, 255, 0.6)); stroke-opacity: 1; }
          50% { filter: drop-shadow(0 0 18px #ff00ff) drop-shadow(0 0 40px rgba(255, 0, 255, 0.8)); stroke-opacity: 0.9; }
        }

        .neon-y-outline { animation: neon-flicker-subtle 4s ease-in-out infinite; stroke: #ff00ff; stroke-width: 2.5; fill: transparent; transition: stroke 0.4s ease; }
        
        @keyframes wave-move-h { 0% { transform: translateX(0); } 100% { transform: translateX(-400px); } }
        .white-wave { fill: #ffffff; animation: wave-move-h 1.8s linear infinite; }

        .gallery-depth-text { font-family: 'Anton', sans-serif; letter-spacing: 0.15em; color: white; white-space: nowrap; line-height: 1; display: block; text-align: center; will-change: transform, opacity, filter; }

        @keyframes bounce-subtle { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        .animate-bounce-subtle { animation: bounce-subtle 2s infinite ease-in-out; }

        input[type=range].gallery-slider { -webkit-appearance: none; width: 100%; height: 32px; background: transparent; z-index: 30; cursor: pointer; }
        input[type=range].gallery-slider::-webkit-slider-runnable-track { width: 100%; height: 6px; cursor: pointer; background: rgba(255, 255, 255, 0.1); border-radius: 4px; }
        input[type=range].gallery-slider::-webkit-slider-thumb { height: 22px; width: 80px; background: transparent; cursor: pointer; -webkit-appearance: none; margin-top: -8px; }

        @keyframes flow-arrows-rtl { 0% { background-position: 0% 0; } 100% { background-position: 200% 0; } }
        @keyframes flow-arrows-ltr { 0% { background-position: 0% 0; } 100% { background-position: -200% 0; } }

        .arrow-flow-text { background-size: 200% auto; -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-weight: 900; font-family: monospace; font-size: 26px; letter-spacing: -3px; transition: background 0.4s ease-in-out; }
        .arrows-normal { background-image: linear-gradient(90deg, #d946ef 0%, #ffffff 50%, #d946ef 100%); }
        .arrows-inverted { background-image: linear-gradient(90deg, #ffffff 0%, #d946ef 50%, #ffffff 100%); }
        .flow-rtl { animation: flow-arrows-rtl 1.2s linear infinite; }
        .flow-ltr { animation: flow-arrows-ltr 1.2s linear infinite; }

        .slider-pill-thumb { transition: background-color 0.4s ease, transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.4s ease; will-change: left, transform, background-color; }

        .slider-cursor-glow { position: fixed; width: 180px; height: 180px; background: radial-gradient(circle at center, rgba(217, 70, 239, 0.2) 0%, transparent 75%); pointer-events: none; z-index: 50; transform: translate(-50%, -50%); mix-blend-mode: screen; }

        @keyframes nebula-pulse { 0%, 100% { transform: scale(1); opacity: 0.8; } 50% { transform: scale(1.1); opacity: 1; } }
        @keyframes accretion-spin { from { transform: rotate(25deg) scale(1); filter: blur(40px) brightness(1); } 50% { transform: rotate(25deg) scale(1.05); filter: blur(45px) brightness(1.2); } to { transform: rotate(385deg) scale(1); filter: blur(40px) brightness(1); } }
        @keyframes accretion-spin-reverse { from { transform: rotate(25deg) scale(1); } to { transform: rotate(-335deg) scale(1); } }
        @keyframes lensing-pulse { 0%, 100% { transform: scale(1); opacity: 0.1; } 50% { transform: scale(1.02); opacity: 0.2; } }
        @keyframes shuttle-drift { 0%, 100% { transform: translateY(-50%) translateX(0); } 50% { transform: translateY(-55%) translateX(15px); } }
        @keyframes shuttle-spin { from { transform: rotateY(0deg) rotateX(0deg); } to { transform: rotateY(360deg) rotateX(10deg); } }
        @keyframes thruster-pulse { 0%, 100% { opacity: 0; transform: translateY(-50%) scale(0.8); } 50% { opacity: 0.6; transform: translateY(-50%) scale(1.2); } }
        .animate-nebula-pulse { animation: nebula-pulse 10s ease-in-out infinite; }
        .animate-accretion-spin { animation: accretion-spin 15s linear infinite; }
        .animate-accretion-spin-reverse { animation: accretion-spin-reverse 10s linear infinite; }
        .animate-lensing-pulse { animation: lensing-pulse 4s ease-in-out infinite; }
        .animate-shuttle-drift { animation: shuttle-drift 8s ease-in-out infinite; }
        .animate-shuttle-spin { animation: shuttle-spin 12s linear infinite; transform-style: preserve-3d; perspective: 500px; }
        .animate-thruster-pulse { animation: thruster-pulse 0.2s ease-in-out infinite; }
      `}</style>

      {/* HERO SECTION */}
      <section className="relative h-screen w-full shrink-0 flex items-center justify-center overflow-hidden">
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
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div className="relative w-[240px] md:w-[380px] lg:w-[460px] aspect-square flex items-center justify-center shrink-0 cursor-pointer">
              <svg viewBox="0 0 240 240" className="w-full h-full drop-shadow-[0_0_60px_rgba(0,0,0,0.95)]" fill="none">
                <defs>
                  <pattern id="spacePattern" patternUnits="userSpaceOnUse" width="80" height="80">
                    <image href="https://img.freepik.com/premium-vector/seamless-pattern-with-cute-space-doodles-black-background_150234-147063.jpg?w=1480" width="80" height="80" preserveAspectRatio="xMidYMid slice" />
                  </pattern>
                  <clipPath id="yClipStrict"><path d={yPath} /></clipPath>
                  <clipPath id="yFillMask">
                    <rect x="0" y={210 - (fillProgress * 1.8)} width="240" height="240" />
                  </clipPath>
                </defs>
                <g clipPath="url(#yClipStrict)">
                  <path d={yPath} fill="#050505" />
                  <g ref={parallaxRef} className="parallax-layer">
                    <g className="animate-subtle-breathing" style={{ transformOrigin: '120px 120px' }}>
                      <rect x="-40" y="-40" width="320" height="320" fill="url(#spacePattern)" />
                    </g>
                  </g>
                </g>
                <g clipPath="url(#yClipStrict)">
                  <g clipPath="url(#yFillMask)">
                    <g transform={`translate(0, ${210 - (fillProgress * 1.8)})`}>
                       <path className="white-wave opacity-90 shadow-[0_0_20px_white]" d="M 0 0 C 40 -20, 80 20, 120 0 C 160 -20, 200 20, 240 0 C 280 -20, 320 20, 360 0 C 400 -20, 440 20, 480 0 C 520 -20, 560 20, 600 0 V 300 H 0 Z" />
                       <path className="white-wave opacity-50" style={{ animationDuration: '3.0s', animationDirection: 'reverse' }} d="M 0 5 C 50 15, 100 -5, 150 5 C 200 15, 250 -5, 300 5 C 350 15, 400 -5, 450 5 C 500 15, 550 -5, 600 5 V 300 H 0 Z" />
                       <path className="white-wave opacity-30" style={{ animationDuration: '4.2s' }} d="M 0 -8 C 60 5, 120 -15, 180 -8 C 240 5, 300 -15, 360 -8 C 420 5, 480 -15, 540 -8 C 600 5, 660 -15, 720 -8 V 300 H 0 Z" />
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
          <svg className="w-10 h-10 text-gray-500/80 group-hover:text-gray-300 transition-colors duration-300 drop-shadow-[0_0_8px_rgba(0,0,0,0.5)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </button>
      </section>

      {/* GALLERY SECTION */}
      <section ref={gallerySectionRef} className="min-h-screen w-full bg-transparent shrink-0 pt-24 md:pt-32 pb-20 px-6 md:px-20 relative border-t border-fuchsia-500/10">
        <div className="max-w-7xl auto flex flex-col items-center">
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
                const z = isExpanded ? (Math.cos(rad) * radius - radius) : -index * 30;
                const rotateZ = isExpanded ? 0 : index * 2.5 - 5;
                const opacity = isExpanded ? (0.2 + (Math.cos(rad) + 1) * 0.4) : 1;
                const scale = isExpanded ? (0.75 + (Math.cos(rad) + 1) * 0.25) : 1;
                const zIndex = isExpanded ? 0 : count - index;
                return (
                  <div 
                    key={img.id}
                    className="absolute inset-0 rounded-3xl border border-white/10 overflow-hidden bg-[#0c0c0c] transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)]"
                    style={{ 
                      transitionProperty: isExpanded ? 'opacity, scale, border-color, box-shadow' : 'all',
                      transform: `translate3d(${x}px, 0, ${z}px) rotateZ(${rotateZ}deg) scale(${scale})`,
                      opacity: opacity,
                      zIndex: zIndex,
                      pointerEvents: isExpanded ? 'none' : (index === 0 ? 'auto' : 'none'),
                      boxShadow: isExpanded ? `0 0 30px rgba(217,70,239,${(Math.cos(rad) + 1) * 0.1})` : '0 10px 40px rgba(0,0,0,0.5)',
                      cursor: isExpanded ? 'default' : (index === 0 ? 'pointer' : 'default')
                    }}
                    onClick={(e) => { if (!isExpanded && index === 0) { e.stopPropagation(); handleExpand(); } }}
                  >
                    <img src={img.url} alt={img.title} className={`w-full h-full object-cover transition-all duration-1000 ${isExpanded ? 'grayscale-0' : 'opacity-60 grayscale'}`} />
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

          <div className="w-full max-w-lg px-10 relative overflow-visible h-24 flex flex-col items-center">
            <div className={`w-full flex flex-col items-center transition-opacity duration-1000 ease-[cubic-bezier(0.19,1,0.22,1)] ${showSlider ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
               <div className="relative w-full h-12 flex items-center group/slider" onMouseEnter={() => setIsSliderHovered(true)} onMouseLeave={() => setIsSliderHovered(false)}>
                 {(isSliderHovered || isHoldingSlider.current) && (
                   <div className="slider-cursor-glow" style={{ left: `calc(${(sliderValue + 100) / 2}% - 0px)`, top: '50%' }} />
                 )}
                 <div className="absolute left-0 right-0 h-[3px] bg-white/10 rounded-full"></div>
                 <input type="range" min="-100" max="100" step="0.1" value={sliderValue} onChange={handleSliderChange} onMouseDown={() => { isHoldingSlider.current = true; resetManualInteractionTimer(); }} onMouseUp={() => { isHoldingSlider.current = false; }} onMouseLeave={() => { isHoldingSlider.current = false; }} onTouchStart={() => { isHoldingSlider.current = true; resetManualInteractionTimer(); }} onTouchEnd={() => { isHoldingSlider.current = false; }} className="gallery-slider relative z-20" />
                 <div className={`absolute top-1/2 -translate-y-1/2 w-[80px] h-[22px] rounded-full flex items-center justify-between px-3 pointer-events-none slider-pill-thumb ${(isSliderHovered || isHoldingSlider.current) ? 'bg-fuchsia-500 shadow-[0_0_60px_#d946ef,0_0_30px_rgba(217,70,239,0.8),0_0_15px_rgba(255,255,255,0.4)] scale-110' : 'bg-white shadow-[0_0_30px_rgba(255,255,255,0.7),0_0_10px_rgba(255,255,255,0.3)]'}`} style={{ left: `calc(${(sliderValue + 100) / 2}% - 40px)`, zIndex: 25 }}>
                   <span className={`arrow-flow-text flow-rtl ${(isSliderHovered || isHoldingSlider.current) ? 'arrows-inverted' : 'arrows-normal'}`}>«</span>
                   <span className={`arrow-flow-text flow-ltr ${(isSliderHovered || isHoldingSlider.current) ? 'arrows-inverted' : 'arrows-normal'}`}>»</span>
                 </div>
               </div>
            </div>
          </div>
        </div>

        {/* NEW 2X2 GRID GALLERY SECTION */}
        <div className="max-w-7xl mx-auto mt-32 px-6 flex flex-col items-center gap-16 relative z-10">
          <div className="flex flex-col items-center text-center gap-4">
            <div className="h-px w-24 bg-gradient-to-r from-transparent via-fuchsia-500 to-transparent"></div>
            <h3 className="text-4xl md:text-6xl font-anton text-white tracking-widest uppercase">
              SPOTLIGHT <span className="text-fuchsia-500 drop-shadow-[0_0_15px_rgba(217,70,239,0.4)]">_REELS</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full max-w-6xl">
            {SPOTLIGHT_IMAGES.map((img) => (
              <div key={img.id} className="group relative aspect-[16/10] rounded-[2rem] overflow-hidden border border-white/5 bg-[#0a0a0a] shadow-2xl transition-all duration-700 hover:border-fuchsia-500/50 hover:-translate-y-2">
                <img src={img.url} alt={img.title} className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-110 grayscale-[0.2] group-hover:grayscale-0" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                <div className="absolute top-6 right-6 w-8 h-8 border-t-2 border-r-2 border-white/20 group-hover:border-fuchsia-500 transition-colors" />
                <div className="absolute bottom-6 left-6 w-8 h-8 border-b-2 border-l-2 border-white/20 group-hover:border-fuchsia-500 transition-colors" />
                <div className="absolute bottom-8 left-8 right-8 flex flex-col gap-1 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-fuchsia-500 animate-pulse" />
                    <span className="text-[10px] font-mono text-fuchsia-400 font-bold tracking-[0.4em] uppercase">{img.tag}</span>
                  </div>
                  <h4 className="text-3xl font-anton text-white tracking-wider uppercase leading-none">{img.title}</h4>
                  <div className="h-0.5 w-12 bg-white/20 mt-2" />
                </div>
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(circle_at_center,#ffffff_1px,transparent_1px)] bg-[size:16px_16px]" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* INTERACTIVE FOOTER BANNER */}
      <section ref={footerRef} id="footer-banner" className="h-[75vh] w-full shrink-0 relative overflow-hidden flex flex-col items-center justify-center py-4 px-4 transition-all duration-500 bg-black z-[100]">
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_40%,rgba(139,92,246,0.15)_0%,transparent_50%),radial-gradient(circle_at_80%_60%,rgba(34,211,238,0.15)_0%,transparent_50%)] opacity-80 animate-nebula-pulse"></div>
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-40"></div>
          <div className="absolute right-[10%] top-1/2 -translate-y-1/2 w-[40vw] h-[40vw] flex items-center justify-center">
            <div className="absolute w-[110%] h-[110%] rounded-full border border-fuchsia-500/10 blur-xl animate-lensing-pulse"></div>
            <div className="absolute w-[105%] h-[105%] rounded-full border border-cyan-400/5 blur-md"></div>
            <div className="absolute w-[140%] h-[35%] bg-gradient-to-r from-transparent via-orange-500/60 to-transparent blur-[40px] rotate-[25deg] animate-accretion-spin"></div>
            <div className="absolute w-[130%] h-[15%] bg-gradient-to-r from-transparent via-white/40 to-transparent blur-[15px] rotate-[25deg] animate-accretion-spin-reverse opacity-80"></div>
            <div className="relative w-[18vw] h-[18vw] bg-black rounded-full shadow-[0_0_100px_rgba(0,0,0,1)] z-10">
              <div className="absolute inset-0 rounded-full shadow-[inset_0_0_30px_rgba(255,165,0,0.4)]"></div>
            </div>
          </div>
          <div className="absolute left-[15%] top-1/2 -translate-y-1/2 w-48 h-32 animate-shuttle-drift">
            <div className="relative w-full h-full animate-shuttle-spin">
              <svg viewBox="0 0 200 100" className="w-full h-full drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]">
                <path d="M 20 50 L 50 30 L 140 30 L 170 50 L 140 70 L 50 70 Z" fill="#1a1a1a" stroke="#444" strokeWidth="1" />
                <path d="M 50 30 L 70 10 L 130 10 L 140 30 Z" fill="#222" />
                <rect x="145" y="45" width="15" height="10" rx="2" fill="rgba(34,211,238,0.6)" />
                <path d="M 60 30 L 40 15 L 100 15 L 110 30" fill="#111" />
                <path d="M 60 70 L 40 85 L 100 85 L 110 70" fill="#111" />
                <rect x="15" y="42" width="10" height="16" fill="#333" />
              </svg>
              <div className="absolute -left-6 top-1/2 -translate-y-1/2 w-10 h-10 bg-cyan-400 blur-xl opacity-0 animate-thruster-pulse"></div>
              <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full blur-sm opacity-0 animate-thruster-pulse delay-75"></div>
            </div>
          </div>
        </div>
        <div className="relative z-10 flex flex-col items-center justify-center text-center max-w-full w-full flex-1 group/footer overflow-hidden">
          <div className={`absolute left-1/2 -translate-x-1/2 pointer-events-none select-none transition-all duration-1000 ease-[cubic-bezier(0.19,1,0.22,1)] ${isYearForward ? 'z-20 opacity-100 blur-0 text-fuchsia-400 drop-shadow-[0_0_80px_rgba(217,70,239,1)] scale-[1.15]' : 'z-0 opacity-70 blur-[3px] text-fuchsia-500/70 drop-shadow-[0_0_20px_rgba(217,70,239,0.3)] scale-100'} top-[40%] md:top-[38%] translate-y-0`}>
            <span className="text-[12vw] md:text-[10rem] font-anton tracking-[0.05em] leading-none inline-block scale-x-[1.3] scale-y-[1.8] transform origin-center">2026</span>
          </div>
          <h2 onMouseEnter={handleYearTrigger} className="relative z-10 text-[28vw] md:text-[23vw] font-anton text-white leading-none tracking-[-0.04em] drop-shadow-[0_10px_80px_rgba(0,0,0,0.8)] transition-all duration-1000 hover:scale-[1.03] cursor-default px-6 md:px-12 w-full text-center -translate-y-10 md:-translate-y-20">YANTRAKSH</h2>
          <div className="absolute bottom-4 left-0 right-0 flex flex-col items-center gap-4">
            <span className="text-white text-xs md:text-lg font-anton tracking-[0.4em] uppercase opacity-90 drop-shadow-lg">OUR SOCIAL HANDLES</span>
            <div className="flex flex-wrap justify-center gap-5 md:gap-8 items-center">
              <a href="#" className="text-white hover:text-fuchsia-500 transition-all duration-300 hover:scale-125"><svg className="w-5 h-5 md:w-7 md:h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849s-.011 3.585-.069 4.85c-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07s-3.584-.012-4.849-.07c-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849s.012-3.584.07-4.849c.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948s.014 3.667.072 4.947c.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072s3.667-.014 4.947-.072c4.358-.2 6.78-2.618 6.98-6.98.058-1.28.072-1.689.072-4.948s-.014-3.667-.072-4.947c-.2-4.358-2.618-6.78-6.98-6.98-1.28-.058-1.689-.072-4.948-.072zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg></a>
              <a href="#" className="text-white hover:text-blue-500 transition-all duration-300 hover:scale-125"><svg className="w-5 h-5 md:w-7 md:h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.04c-5.5 0-10 4.5-10 10.04 0 5 3.66 9.14 8.44 9.88v-6.99h-2.54v-2.89h2.54v-2.2c0-2.5 1.52-3.89 3.77-3.89 1.08 0 2.2.19 2.2.19v2.43h-1.24c-1.24 0-1.63.77-1.63 1.56v1.91h2.74l-.44 2.89h-2.3v6.99c4.78-.74 8.44-4.88 8.44-9.88 0-5.54-4.5-10.04-10-10.04z"/></svg></a>
              <a href="#" className="text-white hover:text-gray-400 transition-all duration-300 hover:scale-125"><svg className="w-5 h-5 md:w-7 md:h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg></a>
              <a href="#" className="text-white hover:text-blue-600 transition-all duration-300 hover:scale-125"><svg className="w-5 h-5 md:w-7 md:h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg></a>
              <a href="#" className="text-white hover:text-[#FF4500] transition-all duration-300 hover:scale-125"><svg className="w-5 h-5 md:w-7 md:h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M24 11.5c0-1.65-1.35-3-3-3-.4 0-.78.08-1.13.23-1.64-1.16-3.87-1.9-6.31-1.97l1.43-4.52 3.93.84c.01 1.1.91 1.98 2 1.98 1.1 0 2-.9 2-2s-.9-2-2-2c-.78 0-1.47.44-1.81 1.1l-4.47-.96c-.22-.05-.44.09-.51.3l-1.67 5.27c-2.48.04-4.77.79-6.44 1.97-.35-.15-.73-.23-1.13-.23-1.65 0-3 1.35-3 3 0 1.25.77 2.33 1.86 2.77-.04.24-.06.48-.06.73 0 3.31 3.58 6 8 6s8-2.69 8-6c0-.25-.02-.48-.06-.72 1.09-.44 1.86-1.52 1.86-2.78zM7 13.5c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zm9.73 4.81c-.6.6-1.55.91-2.73.91s-2.13-.31-2.73-.91c-.2-.2-.2-.51 0-.71.2-.2.51-.2.71 0 .4.4 1.14.6 2.02.6s1.62-.2 2.02-.6c.2-.2.51-.2.71 0 .2.2.2.51 0 .71zM15 15.5c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/></svg></a>
              <a href="#" className="text-white hover:text-red-600 transition-all duration-300 hover:scale-125"><svg className="w-5 h-5 md:w-7 md:h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.612 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg></a>
              <a href="mailto:contact@yantraksh.org" className="text-white hover:text-fuchsia-500 transition-all duration-300 hover:scale-125"><svg className="w-5 h-5 md:w-7 md:h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg></a>
            </div>
            <p className="text-gray-500 text-[8px] md:text-[9px] uppercase tracking-[0.3em] font-space opacity-50">made in collaboration of Lotus_Proton_6 & REET</p>
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
