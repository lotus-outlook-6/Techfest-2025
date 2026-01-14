import React, { useRef, useEffect, useState } from 'react';

interface InteractiveTextProps {
  onLogoClick?: () => void;
}

const InteractiveText: React.FC<InteractiveTextProps> = ({ onLogoClick }) => {
  const lettersRef = useRef<(HTMLSpanElement | null)[]>([]);
  const requestRef = useRef<number>(0);
  
  // State for blinking underscore on button
  const [showCursor, setShowCursor] = useState(true);
  const [isClicked, setIsClicked] = useState(false);
  
  // Glitch Effect State
  const [isGlitching, setIsGlitching] = useState(false);
  const glitchTimeoutRef = useRef<number | null>(null);
  const blinkTimeoutsRef = useRef<number[]>([]); // Store IDs for individual blink sounds

  // Physics state for each letter (9 letters total: Y,A,N,T,R,A, K, S,H)
  const letterStates = useRef(Array(9).fill(null).map(() => ({ x: 0, y: 0, blur: 0 })));
  
  // Mouse state tracking
  const mouse = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  // Blink animation for button
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeout(() => setShowCursor(false), 50);
      setTimeout(() => setShowCursor(true), 150);
      setTimeout(() => setShowCursor(false), 250);
      setTimeout(() => setShowCursor(true), 350);
      if (Math.random() > 0.5) {
           setTimeout(() => setShowCursor(false), 450);
           setTimeout(() => setShowCursor(true), 550);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Main Animation Loop
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
        mouse.current.targetX = e.clientX;
        mouse.current.targetY = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove);

    const animate = () => {
        // 1. Smooth Mouse Following
        const dx = mouse.current.targetX - mouse.current.x;
        const dy = mouse.current.targetY - mouse.current.y;
        
        const mouseLagFactor = 0.12; 
        
        mouse.current.x += dx * mouseLagFactor;
        mouse.current.y += dy * mouseLagFactor;

        // Velocity tracking
        const vx = dx * mouseLagFactor;
        const vy = dy * mouseLagFactor;
        const speed = Math.sqrt(vx*vx + vy*vy);

        // READ PHASE: Get positions of all letters first to avoid layout thrashing
        const metrics = letterStates.current.map((state, i) => {
            const span = lettersRef.current[i];
            if (!span) return null;
            const rect = span.getBoundingClientRect();
            const originX = rect.left - state.x;
            const originY = rect.top - state.y;
            return {
                centerX: originX + rect.width / 2,
                centerY: originY + rect.height / 2
            };
        });

        // CALCULATION & WRITE PHASE
        letterStates.current.forEach((state, i) => {
            const metric = metrics[i];
            if (!metric) return;

            const { centerX, centerY } = metric;

            const distDx = mouse.current.x - centerX;
            const distDy = mouse.current.y - centerY;
            const dist = Math.sqrt(distDx * distDx + distDy * distDy);

            const radius = 120; 
            
            let targetBlur = 0;
            let targetX = 0;
            let targetY = 0;

            if (dist < radius) {
                const influence = Math.pow(1 - dist / radius, 2); 
                targetBlur = (influence * 4) + (influence * speed * 0.8); 
                const dragFactor = 0.8; 
                const repulsionFactor = 0.15;
                targetX = (vx * influence * dragFactor) - (distDx * influence * repulsionFactor);
                targetY = (vy * influence * dragFactor) - (distDy * influence * repulsionFactor);
            }

            const returnSpeed = 0.1;
            state.x += (targetX - state.x) * returnSpeed;
            state.y += (targetY - state.y) * returnSpeed;
            state.blur += (targetBlur - state.blur) * returnSpeed;

            const span = lettersRef.current[i];
            if (span) {
                if (Math.abs(state.x) > 0.05 || Math.abs(state.y) > 0.05 || state.blur > 0.05) {
                     span.style.transform = `translate3d(${state.x.toFixed(2)}px, ${state.y.toFixed(2)}px, 0)`;
                     span.style.filter = `blur(${state.blur.toFixed(1)}px)`;
                } else {
                     span.style.transform = 'translate3d(0,0,0)';
                     span.style.filter = 'none';
                }
            }
        });

        requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);

    return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  const handleClick = () => {
      const audio = new Audio('https://cdn.pixabay.com/audio/2025/01/25/audio_33947eea08.mp3');
      audio.volume = 0.5;
      audio.play().catch(() => {});

      setIsClicked(true);
      if (onLogoClick) onLogoClick();
      setTimeout(() => setIsClicked(false), 200);
  };

  const playSwooshSound = () => {
    const audio = new Audio('https://cdn.pixabay.com/audio/2025/08/02/audio_6f4893deae.mp3');
    audio.volume = 0.5;
    audio.play().catch(() => {});
  };

  const playBlinkSound = () => {
    const audio = new Audio('https://cdn.pixabay.com/audio/2025/04/30/audio_c81de40176.mp3');
    audio.volume = 0.3;
    audio.play().catch(() => {});
  };

  const handleKMouseEnter = (e: React.MouseEvent) => {
    if (glitchTimeoutRef.current) clearTimeout(glitchTimeoutRef.current);
    blinkTimeoutsRef.current.forEach(id => clearTimeout(id));
    blinkTimeoutsRef.current = [];
    setIsGlitching(false);
    
    setTimeout(() => {
        setIsGlitching(true);
        const blinkTimings = [50, 150, 250, 350];
        blinkTimings.forEach(time => {
            const id = window.setTimeout(playBlinkSound, time);
            blinkTimeoutsRef.current.push(id);
        });
        glitchTimeoutRef.current = window.setTimeout(() => {
            setIsGlitching(false);
        }, 1000);
    }, 10);
  };

  const renderChar = (char: string, index: number, className: string = "") => (
      <span 
        key={index} 
        ref={el => { lettersRef.current[index] = el; }} 
        className="inline-block select-none transition-colors duration-300"
        style={{ willChange: 'transform, filter' }} 
      >
        <span className={`${className} ${isGlitching ? 'glitch-mode' : ''}`}>
            {char}
        </span>
      </span>
  );

  return (
    <div className="relative z-[100] flex items-center justify-center max-w-[95vw] md:max-w-none">
       <style>{`
        @keyframes glitch-border-blink {
            0% { text-shadow: none; transform: skewX(0deg); }
            5% { text-shadow: 2px 0 0 #ff00ff, -2px 0 0 #00ffff; transform: skewX(-5deg); }
            10% { text-shadow: none; transform: skewX(0deg); }
            15% { text-shadow: -2px 0 0 #ff00ff, 2px 0 0 #00ffff; transform: skewX(5deg); }
            20% { text-shadow: none; transform: skewX(0deg); }
            25% { text-shadow: 2px 0 0 #ff00ff; transform: skewX(-2deg); }
            30% { text-shadow: none; transform: skewX(0deg); }
            35% { text-shadow: -2px 0 0 #00ffff; transform: skewX(2deg); }
            40% { text-shadow: none; transform: skewX(0deg); }
            100% { text-shadow: none; transform: skewX(0deg); }
        }
        .glitch-mode {
            animation: glitch-border-blink 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }
      `}</style>

      {/* Terminal Icon Button */}
      <button 
        onClick={handleClick}
        className={`w-14 h-14 md:w-16 md:h-16 relative mr-4 md:mr-5 shrink-0 flex items-center justify-center bg-[#1e1e1e] rounded-lg border border-gray-700 shadow-[0_0_15px_rgba(217,70,239,0.3)] cursor-pointer select-none transition-all duration-200 outline-none focus:ring-2 focus:ring-fuchsia-500/50 z-30
            ${isClicked ? 'scale-90 border-fuchsia-500 bg-[#2a2a2a]' : 'hover:scale-105 hover:border-fuchsia-500 hover:shadow-[0_0_25px_rgba(217,70,239,0.6)]'}
        `}
        aria-label="Terminal Button"
      >
        <span className="text-fuchsia-500 font-bold text-2xl md:text-3xl font-mono flex">
          <span>&gt;</span>
          <span className={`${showCursor ? 'opacity-100' : 'opacity-0'}`}>_</span>
        </span>
      </button>

      {/* The Text Container */}
      <h1 
        className="text-5xl sm:text-7xl md:text-7xl font-black tracking-tight sm:tracking-wider uppercase flex items-center cursor-default shrink-0"
        onMouseEnter={playSwooshSound}
      >
         {'YANTRA'.split('').map((c, i) => renderChar(c, i, "text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]"))}
         <span 
            ref={el => { lettersRef.current[6] = el; }}
            className="inline-block relative mx-0.5 sm:mx-1 select-none"
            style={{ willChange: 'transform, filter' }}
            onMouseEnter={handleKMouseEnter}
         >
            <span className={`relative z-10 text-transparent bg-clip-text bg-[radial-gradient(circle_at_center,_#ffffff_60%,_#f0abfc_100%)] drop-shadow-[0_0_3px_rgba(217,70,239,0.5)] ${isGlitching ? 'glitch-mode' : ''}`}>K</span>
            <span className="absolute -top-1 right-0 text-fuchsia-500 opacity-50 blur-sm z-0">K</span>
         </span>
         {'SH'.split('').map((c, i) => renderChar(c, i + 7, "text-white"))}
      </h1>
    </div>
  );
};

export default InteractiveText;