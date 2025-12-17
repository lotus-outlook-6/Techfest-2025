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
        // We need to calculate the 'original' center, so we subtract current transform
        const metrics = letterStates.current.map((state, i) => {
            const span = lettersRef.current[i];
            if (!span) return null;
            const rect = span.getBoundingClientRect();
            // Recover the layout position by subtracting the current animation offset
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

            // Distance from smoothed mouse to letter center
            const distDx = mouse.current.x - centerX;
            const distDy = mouse.current.y - centerY;
            const dist = Math.sqrt(distDx * distDx + distDy * distDy);

            // Sphere of influence radius
            const radius = 120; 
            
            let targetBlur = 0;
            let targetX = 0;
            let targetY = 0;

            if (dist < radius) {
                const influence = Math.pow(1 - dist / radius, 2); 

                // Blur Logic:
                // Base blur when hovering (influence * 4) + Motion blur (speed based)
                // This ensures effect persists even when mouse is stationary.
                targetBlur = (influence * 4) + (influence * speed * 0.8); 

                // Displacement Logic:
                // 1. Drag: Move with mouse velocity (vx, vy)
                const dragFactor = 0.8; 
                // 2. Repulsion: Move away from mouse slightly when stationary/hovering
                const repulsionFactor = 0.15;

                targetX = (vx * influence * dragFactor) - (distDx * influence * repulsionFactor);
                targetY = (vy * influence * dragFactor) - (distDy * influence * repulsionFactor);
            }

            // Interpolate letter state towards target (Spring/Ease)
            const returnSpeed = 0.1;
            
            state.x += (targetX - state.x) * returnSpeed;
            state.y += (targetY - state.y) * returnSpeed;
            state.blur += (targetBlur - state.blur) * returnSpeed;

            // Apply to DOM
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
      // Mechanical Key Press Sound
      const audio = new Audio('https://cdn.pixabay.com/audio/2025/01/25/audio_33947eea08.mp3');
      audio.volume = 0.5;
      audio.play().catch(() => {});

      setIsClicked(true);
      if (onLogoClick) onLogoClick();
      setTimeout(() => setIsClicked(false), 200);
  };

  const playSwooshSound = () => {
    // Restored Swoosh Effect for main text hover
    const audio = new Audio('https://cdn.pixabay.com/audio/2025/08/02/audio_6f4893deae.mp3');
    audio.volume = 0.4;
    audio.play().catch(() => {});
  };

  const playBlinkSound = () => {
    // Specific Glitch Blip
    const audio = new Audio('https://cdn.pixabay.com/audio/2025/04/30/audio_c81de40176.mp3');
    audio.volume = 0.5;
    audio.play().catch(() => {});
  };

  const handleKMouseEnter = (e: React.MouseEvent) => {
    // Prevent this from triggering other handlers if nested (though structure is flat siblings inside h1 mostly)
    // But conceptually correct to isolate logic.
    
    // Stop any current sequence and reset state
    if (glitchTimeoutRef.current) clearTimeout(glitchTimeoutRef.current);
    
    // Clear any pending individual blink sounds
    blinkTimeoutsRef.current.forEach(id => clearTimeout(id));
    blinkTimeoutsRef.current = [];
    
    // Reset to restart animation
    setIsGlitching(false);
    
    setTimeout(() => {
        setIsGlitching(true);

        // Schedule "Blink" sounds to match the CSS animation keyframes
        // Times: 50ms, 150ms, 250ms, 350ms
        const blinkTimings = [50, 150, 250, 350];
        
        blinkTimings.forEach(time => {
            const id = window.setTimeout(playBlinkSound, time);
            blinkTimeoutsRef.current.push(id);
        });
        
        // Stop glitching after 1 second
        glitchTimeoutRef.current = window.setTimeout(() => {
            setIsGlitching(false);
        }, 1000);
    }, 10);
  };

  // Render Helpers
  const renderChar = (char: string, index: number, className: string = "") => (
      <span 
        key={index} 
        ref={el => { lettersRef.current[index] = el; }} 
        className="inline-block select-none transition-colors duration-300"
        style={{ willChange: 'transform, filter' }} 
      >
        <span className={className}>
            {char}
        </span>
      </span>
  );

  return (
    <div className="relative z-20 flex items-center justify-center">
       <style>{`
        @keyframes glitch-border-blink {
            0% { text-shadow: none; }
            5% { text-shadow: 1.5px 0 0 #ff00ff, -1.5px 0 0 #00ffff; }
            10% { text-shadow: none; }
            15% { text-shadow: -1.5px 0 0 #ff00ff, 1.5px 0 0 #00ffff; }
            20% { text-shadow: none; }
            25% { text-shadow: 1.5px 0 0 #ff00ff; }
            30% { text-shadow: none; }
            35% { text-shadow: -1.5px 0 0 #00ffff; }
            40% { text-shadow: none; }
            100% { text-shadow: none; }
        }
        .glitch-mode {
            animation: glitch-border-blink 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }
      `}</style>

      {/* Terminal Icon Button */}
      <button 
        onClick={handleClick}
        className={`w-10 h-10 md:w-16 md:h-16 relative mr-3 md:mr-5 shrink-0 flex items-center justify-center bg-[#1e1e1e] rounded-lg border border-gray-700 shadow-[0_0_15px_rgba(217,70,239,0.3)] cursor-pointer select-none transition-all duration-200 outline-none focus:ring-2 focus:ring-fuchsia-500/50 z-30
            ${isClicked ? 'scale-90 border-fuchsia-500 bg-[#2a2a2a]' : 'hover:scale-105 hover:border-fuchsia-500 hover:shadow-[0_0_25px_rgba(217,70,239,0.6)]'}
        `}
        aria-label="Terminal Button"
      >
        <span className="text-fuchsia-500 font-bold text-xl md:text-3xl font-mono flex">
          <span>&gt;</span>
          <span className={`${showCursor ? 'opacity-100' : 'opacity-0'}`}>_</span>
        </span>
      </button>

      {/* The Text Container - Plays Swoosh on Hover */}
      <h1 
        className="text-5xl md:text-7xl font-black tracking-wider uppercase flex items-center cursor-default"
        onMouseEnter={playSwooshSound}
      >
         {/* YANTRA - Indices 0-5 */}
         {'YANTRA'.split('').map((c, i) => renderChar(c, i, "text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]"))}
         
         {/* K - Index 6 - Special Structure with Glitch Trigger */}
         <span 
            ref={el => { lettersRef.current[6] = el; }}
            className="inline-block relative mx-1 select-none"
            style={{ willChange: 'transform, filter' }}
            onMouseEnter={handleKMouseEnter}
         >
            {/* Main K - Applies glitch class only when triggered */}
            <span className={`relative z-10 text-transparent bg-clip-text bg-[radial-gradient(circle_at_center,_#ffffff_60%,_#f0abfc_100%)] drop-shadow-[0_0_3px_rgba(217,70,239,0.5)] ${isGlitching ? 'glitch-mode' : ''}`}>K</span>
            <span className="absolute -top-1 right-0 text-fuchsia-500 opacity-50 blur-sm z-0">K</span>
         </span>

         {/* SH - Indices 7-8 */}
         {'SH'.split('').map((c, i) => renderChar(c, i + 7, "text-white"))}
      </h1>
    </div>
  );
};

export default InteractiveText;