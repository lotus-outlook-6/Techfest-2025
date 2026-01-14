
import React, { useState, useEffect, useRef } from 'react';

interface HistoryLine {
  text: string;
  color: string;
  isTable?: boolean;
}

interface TerminalProps {
  onEnter: () => void;
  isEntering?: boolean;
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
  
  // Terminal Logic State
  const [history, setHistory] = useState<HistoryLine[]>([]);
  const [animatedLines, setAnimatedLines] = useState<string[]>(['', '']);
  const [isInputReady, setIsInputReady] = useState(false);
  const [currentPrompt, setCurrentPrompt] = useState('SOT:\\3rd_Year\\User>');
  const [activePromptColor, setActivePromptColor] = useState('text-gray-200');
  const [isExitAwaiting, setIsExitAwaiting] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  
  const [maximizeClicks, setMaximizeClicks] = useState(0);
  const [tooltipKey, setTooltipKey] = useState(0);
  const [tooltipMessage, setTooltipMessage] = useState('');
  
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const HEADER_LINES = [
    'Triguna Sen School of Technology | Techfest [Version 3.60.2025.2026]',
    '(c) Assam University Silchar. All rights reserved.'
  ];

  const ADMIN_INSTRUCTION = 'SOT:\\3rd_Year\\Admin_LP6> Use these commands to deep dive into the terminal: "help", "dir", "echo", "clc", "exit"';

  const ECHO_COLORS = [
    'text-fuchsia-500',
    'text-cyan-400',
    'text-lime-400',
    'text-orange-400',
    'text-red-500',
    'text-blue-500',
    'text-purple-400',
    'text-yellow-300'
  ];

  useEffect(() => {
    const timer = setTimeout(() => setAnimState('open'), 50);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history, animatedLines, inputValue, isThinking]);

  // Initial Typing Sequence
  useEffect(() => {
    const line1 = 'SOT:\\3rd_Year\\User> Do you want to install YANTRAKSH!';
    const line2 = 'Press "Enter" to continue or "ESC" to exit';
    
    let l1Idx = 0;
    let l2Idx = 0;

    const startTyping = setTimeout(() => {
      const t1 = setInterval(() => {
        l1Idx++;
        setAnimatedLines(prev => [line1.slice(0, l1Idx), prev[1]]);
        if (l1Idx === line1.length) {
          clearInterval(t1);
          setTimeout(() => {
            const t2 = setInterval(() => {
              l2Idx++;
              setAnimatedLines(prev => [prev[0], line2.slice(0, l2Idx)]);
              if (l2Idx === line2.length) {
                clearInterval(t2);
                setIsInputReady(true);
              }
            }, 30);
          }, 400);
        }
      }, 40);
      return () => clearInterval(t1);
    }, 600);

    return () => clearTimeout(startTyping);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setShowCursor(prev => !prev), 600);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!isMinimized && animState === 'open' && isInputReady && !isThinking) {
        inputRef.current?.focus();
    }
  }, [isMinimized, animState, isInputReady, isThinking]);

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

  const typeResponse = async (lines: string[], resultColor?: string, tableMode = false) => {
    setIsThinking(true);
    // Simulate "Processing" delay
    await new Promise(r => setTimeout(r, 600));

    for (const fullText of lines) {
      if (fullText === '') {
        setHistory(prev => [...prev, { text: '', color: activePromptColor }]);
        continue;
      }
      
      let currentText = '';
      // Create a slot in history for the typing line
      setHistory(prev => [...prev, { text: '', color: resultColor || activePromptColor, isTable: tableMode }]);
      
      const charArray = Array.from(fullText);
      for (const char of charArray) {
        currentText += char;
        setHistory(prev => {
          const newHist = [...prev];
          newHist[newHist.length - 1] = { text: currentText, color: resultColor || activePromptColor, isTable: tableMode };
          return newHist;
        });
        await new Promise(r => setTimeout(r, tableMode ? 5 : 15));
      }
    }
    setIsThinking(false);
  };

  const processCommand = async (cmd: string) => {
    const trimmed = cmd.trim().toLowerCase();
    const isUser = currentPrompt.includes('User');

    if (isUser) {
        if (trimmed === '') {
            onEnter();
            return;
        } else {
            await typeResponse(['invalid input']);
            return;
        }
    }

    if (isExitAwaiting) {
        if (trimmed === '') {
            setCurrentPrompt('SOT:\\3rd_Year\\User>');
            setIsExitAwaiting(false);
            setHistory([]);
            return;
        } else {
            setIsExitAwaiting(false);
            await typeResponse(['Exit protocol aborted.']);
            return;
        }
    }

    if (trimmed === 'help') {
        await typeResponse([
            '',
            'Provides abstruse elucidations of executable directives within the Admin_LP6 environment:',
            'DIR   — Enumerates site artefacts in tabular manifestation with teleological utility.',
            'ECHO  — Catalyzes chromatic transmutation of textual insignia via "ECHO" or "ECHO DEF".',
            'CLC   — Obliterates ocular residues of antecedent invocations, reinstating solely the prologue.',
            'EXIT  — Initiates cessation protocol of Admin modality, soliciting affirmation prior to User reversion.',
            ''
        ], 'text-fuchsia-400');
        return;
    }

    if (trimmed === 'dir') {
        await typeResponse([
            '+-------------+----------------------------------------------+',
            '| File        | Description                                  |',
            '+-------------+----------------------------------------------+',
            '| home.tsx    | Constitutes the primordial ingress interface |',
            '| landing.tsx | Manifests the vestibular prelude for users   |',
            '| gallery     | Curates pictorial and multimedia expositions |',
            '| modules     | Encapsulates pedagogic or functional units   |',
            '| events      | Chronicles temporal congregations and affairs|',
            '| teams       | Enumerates collaborative cohorts and members |',
            '+-------------+----------------------------------------------+'
        ], 'text-cyan-400', true);
        return;
    }

    if (trimmed.startsWith('echo')) {
        const parts = trimmed.split(' ');
        let newColor = activePromptColor;
        if (parts.length > 1 && parts[1] === 'def') {
            newColor = 'text-gray-200';
        } else {
            newColor = ECHO_COLORS[Math.floor(Math.random() * ECHO_COLORS.length)];
        }
        await typeResponse(['Admin is Echoed successfully!']);
        // Only update active color AFTER the command finishes typing
        setActivePromptColor(newColor);
        return;
    }

    if (trimmed === 'clc') {
        setIsThinking(true);
        await new Promise(r => setTimeout(r, 400));
        setHistory([{ text: '', color: activePromptColor }, { text: ADMIN_INSTRUCTION, color: activePromptColor }]);
        setIsThinking(false);
        return;
    }

    if (trimmed === 'exit') {
        setIsExitAwaiting(true);
        await typeResponse(['Do you want to exit? Press "Enter" key to exit']);
        return;
    }

    await typeResponse(['invalid input']);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (isThinking) {
      e.preventDefault();
      return;
    }

    if (e.key === 'Enter') {
      const cmd = inputValue;
      setHistory(prev => [...prev, { text: `${currentPrompt} ${cmd} ENTER Pressed`, color: activePromptColor }]);
      setInputValue('');
      processCommand(cmd);
    } else if (e.key === 'Escape') {
      if (currentPrompt.includes('Admin')) return;
      const cmd = inputValue;
      const adminPrompt = 'SOT:\\3rd_Year\\Admin_LP6>';
      setHistory(prev => [
          ...prev, 
          { text: `${currentPrompt} ${cmd} ESC Pressed`, color: 'text-gray-200' },
          { text: '', color: 'text-gray-200' }, 
          { text: ADMIN_INSTRUCTION, color: activePromptColor }
      ]);
      setInputValue('');
      setCurrentPrompt(adminPrompt);
    }
  };

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
            <div ref={scrollRef} className="p-4 md:p-6 text-gray-200 h-[280px] text-left font-mono rounded-b-lg overflow-y-auto custom-scrollbar" onClick={() => !isThinking && inputRef.current?.focus()}>
                <div className="mb-4 text-gray-400 leading-relaxed">
                    {HEADER_LINES.map((l, i) => <p key={i}>{l}</p>)}
                </div>
                
                {/* Initial Typing Animations */}
                <div className="mb-1">
                    <p className="text-gray-200">{animatedLines[0]}</p>
                    <p className="text-gray-200">{animatedLines[1]}</p>
                </div>

                {/* Command History */}
                <div className="space-y-1 whitespace-pre-wrap">
                  {history.map((line, idx) => (
                    <p key={idx} className={`${line.color} min-h-[1.2em] ${line.isTable ? 'leading-tight text-[10px] md:text-xs' : ''}`}>
                      {line.text}
                    </p>
                  ))}
                </div>

                {/* Processing Indicator */}
                {isThinking && (
                  <div className="flex items-center gap-2 mt-1">
                     <span className={`${activePromptColor} animate-pulse`}>[SYSTEM] PROCESSING...</span>
                  </div>
                )}

                {/* Current Interactive Line */}
                {isInputReady && !isThinking && (
                  <div className="flex items-center flex-wrap mt-1">
                      <span className={`${activePromptColor} mr-2 shrink-0`}>
                        {currentPrompt}
                      </span>
                      <div className="relative flex-1 flex items-center min-w-[200px]">
                          <input 
                            ref={inputRef} 
                            type="text" 
                            value={inputValue} 
                            onChange={(e) => setInputValue(e.target.value)} 
                            onKeyDown={handleKeyDown}
                            className="bg-transparent border-none outline-none text-gray-100 w-full p-0 m-0 caret-transparent" 
                            autoComplete="off" 
                          />
                          {showCursor && !isMinimized && animState === 'open' && (
                            <div 
                              className={`absolute h-4 w-2 pointer-events-none ${activePromptColor.startsWith('text-') ? activePromptColor.replace('text-', 'bg-') : 'bg-gray-200'}`} 
                              style={{ left: `${inputValue.length}ch` }}
                            ></div>
                          )}
                      </div>
                  </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default Terminal;
