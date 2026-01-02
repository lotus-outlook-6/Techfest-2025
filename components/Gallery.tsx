
import React, { useEffect, useRef } from 'react';

const Gallery: React.FC = () => {
  const yPath = "M 25 30 H 85 L 120 80 L 155 30 H 215 L 145 130 V 210 H 95 V 130 L 25 30 Z";
  
  const containerRef = useRef<HTMLDivElement>(null);
  const parallaxRef = useRef<SVGGElement>(null);
  
  // Ref-based tracking for high-performance animation
  const mouseRef = useRef({ x: 0, y: 0 });
  const smoothedRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      
      // Target values normalized from -1 to 1
      mouseRef.current.x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      mouseRef.current.y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    };

    const animate = () => {
      // Linear Interpolation (lerp) for smooth easing
      const easing = 0.08; 
      
      smoothedRef.current.x += (mouseRef.current.x - smoothedRef.current.x) * easing;
      smoothedRef.current.y += (mouseRef.current.y - smoothedRef.current.y) * easing;

      if (parallaxRef.current) {
        // Multiplier reduced to 5 for "very slight" movement
        const moveX = smoothedRef.current.x * 5;
        const moveY = smoothedRef.current.y * 5;
        
        // translate3d combined with toFixed(4) keeps the rendering crisp on sub-pixels
        parallaxRef.current.style.transform = `translate3d(${moveX.toFixed(4)}px, ${moveY.toFixed(4)}px, 0)`;
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove);
    rafRef.current = requestAnimationFrame(animate);

    return () => {
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
          50% { transform: scale(1.015); } /* Minimal zoom for professional look */
        }
        .animate-subtle-breathing {
          animation: subtle-breathing 16s ease-in-out infinite;
        }
        .parallax-layer {
          will-change: transform;
          backface-visibility: hidden; /* Fixes "sudden blur" by keeping layer in GPU */
          transform-style: preserve-3d;
        }
      `}</style>

      <div className="relative z-10 w-[300px] md:w-[500px] aspect-square flex items-center justify-center">
        <svg 
          viewBox="0 0 240 240" 
          className="w-full h-full"
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
            {/* Solid background to prevent bleed-through */}
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
            
            {/* Dark wash for contrast */}
            <path d={yPath} fill="black" opacity="0.1" pointerEvents="none" />
          </g>

          {/* WHITE FRAME OUTLINE */}
          <path 
            d={yPath} 
            stroke="white" 
            strokeWidth="2" 
            strokeLinejoin="round" 
            strokeLinecap="round"
            className="drop-shadow-[0_0_12px_rgba(255,255,255,0.6)]"
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

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/5 font-mono text-[8px] tracking-[2.5em] uppercase">
        AXIS_PATTERN_UPLINK
      </div>
    </div>
  );
};

export default Gallery;
