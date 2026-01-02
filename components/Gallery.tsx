
import React, { useEffect, useRef } from 'react';

const Gallery: React.FC = () => {
  const yPath = "M 25 30 H 85 L 120 80 L 155 30 H 215 L 145 130 V 210 H 95 V 130 L 25 30 Z";
  
  const containerRef = useRef<HTMLDivElement>(null);
  const parallaxRef = useRef<SVGGElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
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

      // Parallax for the logo
      if (parallaxRef.current) {
        const moveX = smoothedRef.current.x * 5;
        const moveY = smoothedRef.current.y * 5;
        parallaxRef.current.style.transform = `translate3d(${moveX.toFixed(4)}px, ${moveY.toFixed(4)}px, 0)`;
      }

      // Draw Canvas Matrix
      ctx.clearRect(0, 0, width, height);
      
      const spacing = 32;
      const centerX = width / 2;
      const centerY = height / 2;
      
      // Counter-parallax for the matrix background
      const offsetX = smoothedRef.current.x * -30;
      const offsetY = smoothedRef.current.y * -30;

      // Pulse logic
      const speed = 0.002;
      const waveFrequency = 0.008;

      // Global shadow settings for neon glow
      ctx.shadowColor = "rgba(255, 255, 255, 0.8)";
      
      for (let x = -spacing; x < width + spacing * 2; x += spacing) {
        for (let y = -spacing; y < height + spacing * 2; y += spacing) {
          const posX = x + offsetX;
          const posY = y + offsetY;
          
          const dx = posX - centerX;
          const dy = posY - centerY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          // Radial wave calculation
          const pulse = Math.sin(time * speed - dist * waveFrequency);
          const normalizedPulse = (pulse + 1) / 2; // 0 to 1
          
          // Dot scaling
          const baseRadius = 1.0;
          const extraRadius = 4.5; // Larger peak size for better "enlarge" effect
          const currentRadius = baseRadius + (normalizedPulse * extraRadius);
          
          // Apply opacity based on pulse
          const opacity = 0.15 + (normalizedPulse * 0.6);
          
          // Radial mask imitation: fade out towards edges
          const maskStrength = Math.max(0, 1 - dist / (width * 0.65));
          
          if (maskStrength > 0.05) {
            // Enhanced white/grey neon glow
            ctx.shadowBlur = 4 + (normalizedPulse * 12); // Dynamic glow intensity
            ctx.fillStyle = `rgba(255, 255, 255, ${opacity * maskStrength})`;
            ctx.globalAlpha = 1.0; // Handled by fillStyle
            
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

  return (
    <div 
      ref={containerRef}
      className="relative flex items-center justify-center w-full h-full bg-transparent select-none overflow-hidden"
      style={{ WebkitFontSmoothing: 'antialiased' }}
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
          filter: drop-shadow(0 0 10px rgba(255,255,255,0.2));
          color: white;
          white-space: nowrap;
          line-height: 1;
          display: inline-block;
          opacity: 0.7;
          /* Normal scaling, no elongation */
          transform: none;
        }
      `}</style>

      {/* OPTIMIZED CANVAS BACKGROUND */}
      <canvas 
        ref={canvasRef}
        className="absolute inset-0 z-1 pointer-events-none"
      />

      {/* MAIN LAYOUT WRAPPER */}
      <div className="relative z-20 flex items-center justify-center w-full max-w-7xl h-full px-4 overflow-visible">
        
        {/* LEFT BOX REGION - YANTRAKSH */}
        <div className="hidden md:flex flex-1 items-center justify-end h-full overflow-visible pr-0 relative">
          <div className="absolute right-[-80px] lg:right-[-140px] z-10 pointer-events-none">
            <span className="gallery-depth-text md:text-[3.8rem] lg:text-[6.5rem]">
              YANTRAKSH
            </span>
          </div>
        </div>

        {/* CENTER LOGO - Foreground */}
        <div className="relative z-30 w-[240px] md:w-[380px] lg:w-[460px] aspect-square flex items-center justify-center shrink-0">
          <svg 
            viewBox="0 0 240 240" 
            className="w-full h-full drop-shadow-[0_0_60px_rgba(0,0,0,0.95)]"
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <pattern 
                id="spacePattern" 
                patternUnits="userSpaceOnUse" 
                width="80" 
                height="80"
              >
                <image 
                  href="https://img.freepik.com/premium-vector/seamless-pattern-with-cute-space-doodles-black-background_150234-147063.jpg?w=1480" 
                  width="80" 
                  height="80" 
                  preserveAspectRatio="xMidYMid slice"
                />
              </pattern>

              <clipPath id="yClipStrict">
                <path d={yPath} />
              </clipPath>
            </defs>

            {/* MAIN CLIPPED CONTENT */}
            <g clipPath="url(#yClipStrict)">
              <path d={yPath} fill="#050505" />
              
              {/* Parallax Group */}
              <g ref={parallaxRef} className="parallax-layer">
                <g className="animate-subtle-breathing" style={{ transformOrigin: '120px 120px' }}>
                  <rect 
                    x="-40" 
                    y="-40" 
                    width="320" 
                    height="320" 
                    fill="url(#spacePattern)" 
                  />
                </g>
              </g>
              
              <path d={yPath} fill="black" opacity="0.1" pointerEvents="none" />
            </g>

            {/* NEON FRAME OUTLINE */}
            <path 
              d={yPath} 
              strokeLinejoin="round" 
              strokeLinecap="round"
              className="neon-y-outline"
            />

            {/* TECHNICAL MEASUREMENT MARKS */}
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

        {/* RIGHT BOX REGION - GALLERY */}
        <div className="hidden md:flex flex-1 items-center justify-start h-full overflow-visible pl-0 relative">
          <div className="absolute left-[-80px] lg:left-[-140px] z-10 pointer-events-none">
            <span className="gallery-depth-text md:text-[3.8rem] lg:text-[6.5rem]">
              GALLERY
            </span>
          </div>
        </div>

        {/* MOBILE FALLBACK */}
        <div className="md:hidden absolute -bottom-16 left-0 right-0 flex justify-center gap-4">
           <span className="gallery-depth-text text-xl">YANTRAKSH</span>
           <span className="gallery-depth-text text-xl">GALLERY</span>
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/5 font-mono text-[8px] tracking-[2.5em] uppercase">
        AXIS_PATTERN_UPLINK
      </div>
    </div>
  );
};

export default Gallery;
