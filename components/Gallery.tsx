
import React, { useEffect, useRef, useState } from 'react';

type AnimPhase = 'idle' | 'y' | 't' | 'g' | 'waiting' | 'all';

const Gallery: React.FC = () => {
  const yPath = "M 25 30 H 85 L 120 80 L 155 30 H 215 L 145 130 V 210 H 95 V 130 L 25 30 Z";
  
  const containerRef = useRef<HTMLDivElement>(null);
  const parallaxRef = useRef<SVGGElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [phase, setPhase] = useState<AnimPhase>('idle');
  const [isHovered, setIsHovered] = useState(false);
  const isAnimatingRef = useRef(false);

  // Ref-based tracking for high-performance animation
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
    };
  }, []);

  const triggerAnimationSequence = () => {
    if (isAnimatingRef.current) return;
    isAnimatingRef.current = true;
    setIsHovered(true);

    // Sequence timing
    // 1. Yantraksh pops (0 - 0.8s)
    setPhase('y');
    
    setTimeout(() => {
      // 2. Technical pops (0.8 - 1.6s)
      setPhase('t');
    }, 800);

    setTimeout(() => {
      // 3. Gallery pops (1.6 - 2.4s)
      setPhase('g');
    }, 1600);

    setTimeout(() => {
      // 4. Waiting / Reset Phase (2.4 - 3.4s) - Duration reduced to 1.0s
      // All text stays behind Y, glowing, in a scale-down state
      setPhase('waiting');
    }, 2400);

    setTimeout(() => {
      // 5. All together in FRONT (3.4 - 5.4s) - Duration: 2s
      setPhase('all');
    }, 3400);

    setTimeout(() => {
      // End of animation
      setPhase('idle');
      setIsHovered(false);
      isAnimatingRef.current = false;
    }, 5400);
  };

  const getTextStyle = (target: AnimPhase) => {
    const isActivelyPopped = phase === 'all' || phase === target;
    const isGlowVisible = isHovered;

    return {
      // Use opacity high when hovered
      opacity: isGlowVisible ? 1 : 0.7,
      
      // Intense glow when popped, soft glow when behind during sequence
      filter: isGlowVisible 
        ? `drop-shadow(0 0 30px rgba(255,255,255,${isActivelyPopped ? 0.8 : 0.2}))` 
        : 'none',
      
      // Depth Sorting:
      // Popped: translateZ(150px) - clearly in front of the logo (which is at 0)
      // Normal/Waiting: translateZ(-80px) - clearly behind the logo
      transform: isActivelyPopped 
        ? 'scale(1.15) translateZ(150px)' 
        : 'scale(1) translateZ(-80px)',
      
      transition: 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)'
    };
  };

  return (
    <div 
      ref={containerRef}
      className="relative flex items-center justify-center w-full h-full bg-transparent select-none overflow-hidden"
      style={{ WebkitFontSmoothing: 'antialiased', perspective: '1200px' }}
    >
      <style>{`
        @keyframes subtle-breathing {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.015); }
        }
        .animate-subtle-breathing {
          animation: subtle-breathing 16s ease-in-out infinite;
        }
        .parallax-layer {
          will-change: transform;
          backface-visibility: hidden;
          transform-style: preserve-3d;
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

        .preserve-3d-scene {
          transform-style: preserve-3d;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          pointer-events: none;
        }
      `}</style>

      {/* CANVAS BACKGROUND */}
      <canvas 
        ref={canvasRef}
        className="absolute inset-0 z-0 pointer-events-none"
      />

      {/* 3D PERSPECTIVE SCENE CONTAINER */}
      <div className="preserve-3d-scene">
        
        {/* TEXT LAYER - Sorted by translateZ in getTextStyle */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-16 md:gap-20 pointer-events-none" style={{ transformStyle: 'preserve-3d' }}>
          <span 
            className="gallery-depth-text text-[4rem] md:text-[6rem] lg:text-[8rem]"
            style={getTextStyle('y')}
          >
            YANTRAKSH
          </span>
          <span 
            className="gallery-depth-text text-[5rem] md:text-[7.5rem] lg:text-[10rem]"
            style={getTextStyle('t')}
          >
            TECHNICAL
          </span>
          <span 
            className="gallery-depth-text text-[4rem] md:text-[6rem] lg:text-[8rem]"
            style={getTextStyle('g')}
          >
            GALLERY
          </span>
        </div>

        {/* LOGO LAYER - Anchored at Z=0 */}
        <div 
          className="relative pointer-events-auto"
          style={{ transform: 'translateZ(0px)', transformStyle: 'preserve-3d' }}
          onMouseEnter={triggerAnimationSequence}
        >
          <div className="relative w-[240px] md:w-[380px] lg:w-[460px] aspect-square flex items-center justify-center shrink-0 cursor-pointer">
            <svg 
              viewBox="0 0 240 240" 
              className="w-full h-full drop-shadow-[0_0_60px_rgba(0,0,0,0.95)]"
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <pattern id="spacePattern" patternUnits="userSpaceOnUse" width="80" height="80">
                  <image 
                    href="https://img.freepik.com/premium-vector/seamless-pattern-with-cute-space-doodles-black-background_150234-147063.jpg?w=1480" 
                    width="80" height="80" preserveAspectRatio="xMidYMid slice"
                  />
                </pattern>
                <clipPath id="yClipStrict">
                  <path d={yPath} />
                </clipPath>
              </defs>

              <g clipPath="url(#yClipStrict)">
                <path d={yPath} fill="#050505" />
                <g ref={parallaxRef} className="parallax-layer">
                  <g className="animate-subtle-breathing" style={{ transformOrigin: '120px 120px' }}>
                    <rect x="-40" y="-40" width="320" height="320" fill="url(#spacePattern)" />
                  </g>
                </g>
                <path d={yPath} fill="black" opacity="0.1" pointerEvents="none" />
              </g>

              <path d={yPath} strokeLinejoin="round" strokeLinecap="round" className="neon-y-outline" />

              <g stroke="white" strokeWidth="0.5" opacity="0.2">
                <line x1="25" y1="20" x2="25" y2="40" />
                <line x1="15" y1="30" x2="35" y2="30" />
                <line x1="215" y1="20" x2="215" y2="40" />
                <line x1="205" y1="30" x2="225" y2="30" />
                <line x1="120" y1="70" x2="120" y2="90" />
                <line x1="110" y1="80" x2="130" y2="80" />
              </g>
            </svg>
          </div>
        </div>

      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/5 font-mono text-[8px] tracking-[2.5em] uppercase pointer-events-none">
        AXIS_PATTERN_UPLINK
      </div>
    </div>
  );
};

export default Gallery;
