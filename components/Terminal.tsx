import React, { useState, useEffect, useRef } from 'react';

interface TerminalProps {
  onEnter: () => void;
  isEntering: boolean;
  isMinimized?: boolean;
  onMinimize?: () => void;
  onClose?: () => void;
}

const Terminal: React.FC<TerminalProps> = ({ onEnter, isEntering, isMinimized = false, onMinimize, onClose }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [inputValue, setInputValue] = useState(''); // Start empty for typing effect
  const [showCursor, setShowCursor] = useState(true);
  
  // Animation States: 'opening' | 'open' | 'closing'
  const [animState, setAnimState] = useState<'opening' | 'open' | 'closing'>('opening');
  
  // Easter Egg State
  const [maximizeClicks, setMaximizeClicks] = useState(0);
  const [tooltipKey, setTooltipKey] = useState(0); // Used to restart animation
  const [tooltipMessage, setTooltipMessage] = useState('');
  
  const inputRef = useRef<HTMLInputElement>(null);

  // Trigger opening animation on mount
  useEffect(() => {
    // Small delay to ensure DOM is rendered before transitioning CSS
    const timer = setTimeout(() => {
      setAnimState('open');
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  // Typing effect
  useEffect(() => {
    const targetText = 'Do you want to install YANTRAKSH!';
    let index = 0;
    
    // Initial delay before typing starts
    const timeoutId = setTimeout(() => {
      const intervalId = setInterval(() => {
        index++;
        setInputValue(targetText.slice(0, index));
        if (index === targetText.length) {
          clearInterval(intervalId);
        }
      }, 50); // 50ms per character

      return () => clearInterval(intervalId);
    }, 800); // Start after 800ms

    return () => clearTimeout(timeoutId);
  }, []);

  // Blinking cursor effect (every 5 seconds cycle = 2500ms toggle)
  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  // Auto-focus input
  useEffect(() => {
    if (!isMinimized && !isEntering && animState === 'open') {
        inputRef.current?.focus();
    }
  }, [isMinimized, isEntering, animState]);

  // Handle Dragging Logic
  const handleMouseDown = (e: React.MouseEvent) => {
    if (isMinimized || animState !== 'open') return; // Disable drag when minimized or animating
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      setPosition({
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onEnter();
    }
  };

  const handleCloseTrigger = (e: React.MouseEvent) => {
      e.stopPropagation();
      setAnimState('closing');
      // Wait for animation to finish before unmounting
      setTimeout(() => {
          onClose?.();
      }, 300);
  };
  
  // -- Easter Egg Handler --
  const handleMaximizeClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent drag

    const messages = [
      "It cannot be maximized",
      "Nice try, but no.",
      "Still fixed size.",
      "Why are you persistent?",
      "BEYOND GODLIKE!!!!"
    ];

    const messageIndex = maximizeClicks % messages.length;
    setTooltipMessage(messages[messageIndex]);
    
    setMaximizeClicks(prev => prev + 1);
    setTooltipKey(prev => prev + 1); // Changing key forces React to re-mount the component, restarting animation
  };
  
  // -- Transformation Logic --
  
  // Coordinates relative to center where the logo roughly resides
  // Since we are now fixed centered, these offsets are from the center of the screen
  const LOGO_OFFSET_X = -140;
  const LOGO_OFFSET_Y = -150; // Adjusted for new layout

  let currentTransform = '';
  let currentOpacity = 1;
  let transitionStyle = '';

  if (isMinimized) {
      // Minimize: Suck into logo
      currentTransform = `translate(${position.x + LOGO_OFFSET_X}px, ${position.y + LOGO_OFFSET_Y}px) scale(0.02)`;
      currentOpacity = 0;
      transitionStyle = 'transform 0.7s cubic-bezier(0.19, 1, 0.22, 1), opacity 0.7s ease';
  } else if (animState === 'opening') {
      // Opening Start: Start at logo position
      currentTransform = `translate(${position.x + LOGO_OFFSET_X}px, ${position.y + LOGO_OFFSET_Y}px) scale(0.02)`;
      currentOpacity = 0;
      transitionStyle = 'none'; // No transition for initial state set
  } else if (animState === 'closing') {
      // Closing: Fade out and scale down slightly
      currentTransform = `translate(${position.x}px, ${position.y}px) scale(0.9)`;
      currentOpacity = 0;
      transitionStyle = 'all 0.3s ease-in';
  } else {
      // Open / Idle: Centered
      currentTransform = `translate(${position.x}px, ${position.y}px) scale(1)`;
      currentOpacity = 1;
      // Bouncy spring effect for opening, standard ease for dragging/restore
      transitionStyle = isDragging ? 'none' : 'transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.4s ease';
  }

  return (
    // Fixed container allows free dragging anywhere on screen without margin constraints
    // pointer-events-none ensures clicks pass through to background when not interacting with terminal
    <div className={`fixed inset-0 flex items-center justify-center z-30 pointer-events-none ${isEntering ? 'opacity-0 scale-125' : 'opacity-100'} transition-all duration-1000 ease-in-out`}>
      <div 
        className={`pointer-events-auto absolute w-[90%] md:w-[650px] bg-[#0c0c0c]/90 backdrop-blur-md rounded-lg border border-gray-700/50 shadow-[0_0_40px_rgba(217,70,239,0.15)] flex flex-col font-mono text-sm md:text-base group hover:border-fuchsia-500/30`}
        style={{ 
          transform: currentTransform,
          opacity: currentOpacity,
          transition: transitionStyle,
          cursor: isDragging ? 'grabbing' : 'default',
          boxShadow: (isMinimized || animState === 'opening') ? 'none' : '0 0 0 1px rgba(255, 255, 255, 0.05), 0 0 30px rgba(217, 70, 239, 0.1)',
        }}
      >
        {/* Terminal Header / Title Bar - Added rounded-t-lg */}
        <div 
          className="bg-[#181818] rounded-t-lg px-4 py-2 flex items-center justify-between select-none cursor-grab active:cursor-grabbing border-b border-gray-800"
          onMouseDown={handleMouseDown}
        >
          <div className="flex items-center gap-3">
             <div className="flex items-center justify-center w-6 h-6 bg-gray-800 rounded-sm">
                <span className="text-fuchsia-400 font-bold text-xs">{`>_`}</span>
             </div>
             <span className="text-gray-300 font-sans text-xs md:text-sm tracking-wide">Command Prompt</span>
          </div>
          {/* Window Controls */}
          <div className="flex items-center gap-2 opacity-75">
            <div 
                className="hover:bg-gray-700 w-10 h-10 flex items-center justify-center rounded transition-colors cursor-pointer"
                onClick={(e) => { e.stopPropagation(); onMinimize?.(); }}
            >
                <div className="w-3 h-px bg-gray-400"></div>
            </div>
            
            {/* Maximize Button - Easter Egg Enabled */}
            <div 
              className="relative hover:bg-gray-700 w-10 h-10 flex items-center justify-center rounded transition-colors cursor-pointer group/max"
              onClick={handleMaximizeClick}
            >
                <div className="w-2.5 h-2.5 border border-gray-400"></div>
                
                {/* Tooltip Overlay */}
                {tooltipKey > 0 && (
                  <div 
                    key={tooltipKey}
                    className="absolute bottom-full left-1/2 mb-3 z-50 pointer-events-none animate-tooltip-sequence"
                    style={{ transform: 'translateX(-50%)', minWidth: 'max-content' }}
                  >
                     <div className="relative bg-white text-black text-xs font-bold px-4 py-2 rounded-2xl shadow-[0_0_20px_rgba(217,70,239,0.5)] whitespace-nowrap border-2 border-fuchsia-500">
                        {tooltipMessage}
                        
                        {/* Comic Bubble Triangle Tail */}
                        {/* Outer colored border triangle */}
                        <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-fuchsia-500"></div>
                        {/* Inner white triangle to create outline effect */}
                        <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-[3px] w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-white"></div>
                     </div>
                  </div>
                )}
            </div>
            
            <div 
                className="hover:bg-red-900/50 w-10 h-10 flex items-center justify-center rounded transition-colors group/close cursor-pointer"
                onClick={handleCloseTrigger}
            >
                <div className="w-2.5 h-2.5 relative">
                   <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-px bg-gray-400 group-hover/close:bg-red-400 rotate-45"></div>
                   <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-px bg-gray-400 group-hover/close:bg-red-400 -rotate-45"></div>
                </div>
            </div>
          </div>
        </div>

        {/* Terminal Content Body - Added rounded-b-lg and overflow-hidden */}
        <div 
          className="p-4 md:p-6 text-gray-200 flex-1 min-h-[250px] text-left font-mono rounded-b-lg overflow-hidden"
          onClick={() => inputRef.current?.focus()}
          style={{ fontFamily: "'Consolas', 'Monaco', 'Courier New', monospace" }}
        >
          <div className="mb-6 text-gray-400 leading-relaxed">
            <p>Triguna Sen School of Technology | Techfest [Version 3.60.2025.2026]</p>
            <p>(c) Assam University Silchar. All rights reserved.</p>
          </div>
          
          {/* Active Input Line */}
          <div className="flex items-center flex-wrap">
             <span className="text-gray-200 mr-2 shrink-0">SOT:\3rd_Year\User{`>`}</span>
             <div className="relative flex-1 flex items-center min-w-[200px]">
                <input 
                  ref={inputRef}
                  type="text" 
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="bg-transparent border-none outline-none text-gray-100 w-full p-0 m-0 caret-transparent"
                  autoComplete="off"
                  disabled={isMinimized || animState !== 'open'}
                />
                {/* Custom Block Cursor */}
                {showCursor && !isMinimized && animState === 'open' && (
                    <div 
                        className="absolute h-4 w-2 bg-gray-200 pointer-events-none"
                        style={{ left: `${inputValue.length}ch` }}
                    ></div>
                )}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terminal;