
import React, { useState, useEffect, useRef } from 'react';

interface TerminalProps {
  onEnter: () => void;
  isEntering?: boolean; // Kept for compatibility but unused as requested
  isMinimized?: boolean;
  onMinimize?: () => void;
  onClose?: () => void;
}

const Terminal: React.FC<TerminalProps> = ({ onEnter, isMinimized = false, onMinimize, onClose }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [inputValue, setInputValue] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const [animState, setAnimState] = useState<'opening' | 'open' | 'closing'>('opening');
  
  const [maximizeClicks, setMaximizeClicks] = useState(0);
  const [tooltipKey, setTooltipKey] = useState(0);
  const [tooltipMessage, setTooltipMessage] = useState('');
  
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setAnimState('open'), 50);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const targetText = 'Do you want to install YANTRAKSH!';
    let index = 0;
    const timeoutId = setTimeout(() => {
      const intervalId = setInterval(() => {
        index++;
        setInputValue(targetText.slice(0, index));
        if (index === targetText.length) clearInterval(intervalId);
      }, 50);
      return () => clearInterval(intervalId);
    }, 800);
    return () => clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setShowCursor(prev => !prev), 2500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!isMinimized && animState === 'open') {
        inputRef.current?.focus();
    }
  }, [isMinimized, animState]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isMinimized || animState !== 'open') return;
    setIsDragging(true);
    setDragOffset({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) setPosition({ x: e.clientX - dragOffset.x, y: e.clientY - dragOffset.y });
    };
    const handleMouseUp = () => setIsDragging(false);
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  const handleCloseTrigger = (e: React.MouseEvent) => {
      e.stopPropagation();
      setAnimState('closing');
      setTimeout(() => onClose?.(), 300);
  };
  
  const handleMaximizeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const messages = ["It cannot be maximized", "Nice try, but no.", "Still fixed size.", "Why are you persistent?", "BEYOND GODLIKE!!!!"];
    const messageIndex = maximizeClicks % messages.length;
    setTooltipMessage(messages[messageIndex]);
    setMaximizeClicks(prev => prev + 1);
    setTooltipKey(prev => prev + 1);
  };
  
  const LOGO_OFFSET_X = -140;
  const LOGO_OFFSET_Y = -150;

  let currentTransform = '';
  let currentOpacity = 1;

  if (isMinimized) {
      currentTransform = `translate(${position.x + LOGO_OFFSET_X}px, ${position.y + LOGO_OFFSET_Y}px) scale(0.02)`;
      currentOpacity = 0;
  } else if (animState === 'opening') {
      currentTransform = `translate(${position.x + LOGO_OFFSET_X}px, ${position.y + LOGO_OFFSET_Y}px) scale(0.02)`;
      currentOpacity = 0;
  } else if (animState === 'closing') {
      currentTransform = `translate(${position.x}px, ${position.y}px) scale(0.9)`;
      currentOpacity = 0;
  } else {
      currentTransform = `translate(${position.x}px, ${position.y}px) scale(1)`;
      currentOpacity = 1;
  }

  const conicGradient = `conic-gradient(from 0deg, transparent 0deg, transparent 200deg, #1e3a8a 240deg, #ec4899 280deg, #ef4444 310deg, #f97316 340deg, #ffff00 360deg)`;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[50] pointer-events-none">
      <div 
        className="pointer-events-auto absolute w-[90%] md:w-[650px] rounded-lg shadow-[0_0_40px_rgba(217,70,239,0.15)] flex flex-col font-mono text-sm md:text-base transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)]"
        style={{ transform: currentTransform, opacity: currentOpacity, cursor: isDragging ? 'grabbing' : 'default' }}
      >
        <div className="absolute -inset-[3px] rounded-[12px] overflow-hidden pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250%] h-[250%]">
                <div className="w-full h-full animate-spin-slow" style={{ background: conicGradient, animationDuration: '4s' }}></div>
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250%] h-[250%] opacity-60 blur-xl mix-blend-screen">
                <div className="w-full h-full animate-spin-slow" style={{ background: conicGradient, animationDuration: '4s' }}></div>
            </div>
        </div>
        <div className="absolute inset-0 bg-[#0c0c0c] rounded-lg z-0"></div>
        <div className="relative z-10 flex flex-col w-full h-full bg-transparent rounded-lg border border-gray-700/50">
            <div className="bg-[#181818] rounded-t-lg px-4 py-2 flex items-center justify-between select-none cursor-grab active:cursor-grabbing border-b border-gray-800" onMouseDown={handleMouseDown}>
                <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-6 h-6 bg-gray-800 rounded-sm"><span className="text-fuchsia-400 font-bold text-xs">{`>_`}</span></div>
                    <span className="text-gray-300 font-sans text-xs md:text-sm tracking-wide">Command Prompt</span>
                </div>
                <div className="flex items-center gap-2 opacity-75">
                    <div className="hover:bg-gray-700 w-10 h-10 flex items-center justify-center rounded transition-colors cursor-pointer" onClick={() => onMinimize?.()}>
                        <div className="w-3 h-px bg-gray-400"></div>
                    </div>
                    <div className="relative hover:bg-gray-700 w-10 h-10 flex items-center justify-center rounded cursor-pointer group/max" onClick={handleMaximizeClick}>
                        <div className="w-2.5 h-2.5 border border-gray-400"></div>
                        {tooltipKey > 0 && (
                        <div key={tooltipKey} className="absolute bottom-full left-1/2 mb-3 z-50 pointer-events-none animate-tooltip-sequence" style={{ transform: 'translateX(-50%)', minWidth: 'max-content' }}>
                            <div className="relative bg-white text-black text-xs font-bold px-4 py-2 rounded-2xl shadow-[0_0_20px_rgba(217,70,239,0.5)] border-2 border-fuchsia-500">
                                {tooltipMessage}
                                <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-fuchsia-500"></div>
                            </div>
                        </div>
                        )}
                    </div>
                    <div className="hover:bg-red-900/50 w-10 h-10 flex items-center justify-center rounded group/close cursor-pointer" onClick={handleCloseTrigger}>
                        <div className="w-2.5 h-2.5 relative">
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-px bg-gray-400 group-hover/close:bg-red-400 rotate-45"></div>
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-px bg-gray-400 group-hover/close:bg-red-400 -rotate-45"></div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="p-4 md:p-6 text-gray-200 flex-1 min-h-[250px] text-left font-mono rounded-b-lg overflow-hidden" onClick={() => inputRef.current?.focus()}>
                <div className="mb-6 text-gray-400 leading-relaxed">
                    <p>Triguna Sen School of Technology | Techfest [Version 3.60.2025.2026]</p>
                    <p>(c) Assam University Silchar. All rights reserved.</p>
                </div>
                <div className="flex items-center flex-wrap">
                    <span className="text-gray-200 mr-2 shrink-0">SOT:\3rd_Year\User{`>`}</span>
                    <div className="relative flex-1 flex items-center min-w-[200px]">
                        <input ref={inputRef} type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && onEnter()} className="bg-transparent border-none outline-none text-gray-100 w-full p-0 m-0 caret-transparent" autoComplete="off" />
                        {showCursor && !isMinimized && animState === 'open' && <div className="absolute h-4 w-2 bg-gray-200 pointer-events-none" style={{ left: `${inputValue.length}ch` }}></div>}
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Terminal;
