import React, { useState, useRef } from 'react';
import Terminal from './components/Terminal';
import Countdown from './components/Countdown';
import WarpEffect from './components/WarpEffect';
import Decorations from './components/Decorations';
import Background from './components/Background';
import MatrixRain from './components/MatrixRain';
import InteractiveText from './components/InteractiveText';
import MusicPlayer from './components/MusicPlayer';

function App() {
  const [isEntering, setIsEntering] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  
  // -- Animation States --
  // Controls the positioning of Logo and Countdown (Expanded vs Centered)
  const [isLayoutExpanded, setIsLayoutExpanded] = useState(false);
  // Controls the rendering of the Terminal component
  const [showTerminal, setShowTerminal] = useState(false);
  
  // Minimized state for the terminal window itself
  const [isMinimized, setIsMinimized] = useState(false);
  
  // State to trigger background bursts
  const [bgBurst, setBgBurst] = useState(0);

  const handleEnter = () => {
    setIsEntering(true);
    // Simulate transition time
    setTimeout(() => {
      setShowContent(true);
    }, 2000);
  };

  const handleLogoClick = () => {
    if (isLayoutExpanded) {
        // If layout is already expanded, clicking might just trigger effects or restore if minimized
        if (isMinimized) {
            setIsMinimized(false);
        } else {
            setBgBurst(prev => prev + 1);
        }
    } else {
        // -- OPEN SEQUENCE --
        // 1. Expand Layout (Logo Up, Timer Down)
        setIsLayoutExpanded(true);
        
        // 2. Wait for animation to create space (800ms matches the CSS transition duration)
        setTimeout(() => {
            setIsMinimized(false);
            setShowTerminal(true);
        }, 800);
    }
  };

  const handleTerminalClose = () => {
      // -- CLOSE SEQUENCE --
      // 1. Terminal is already animating out internally. Unmount it.
      setShowTerminal(false);
      setIsMinimized(false);

      // 2. Collapse Layout back to center
      setIsLayoutExpanded(false);
  };

  if (showContent) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center relative overflow-hidden">
        <WarpEffect active={true} />
        <MusicPlayer onPlayChange={setIsMusicPlaying} />
        <div className="z-10 text-center animate-pulse">
           <h1 className="text-6xl md:text-8xl font-black mb-4 neon-text-filled tracking-widest">WELCOME</h1>
           <p className="text-fuchsia-300 tracking-[1em]">SYSTEM ACCESS GRANTED</p>
           <button 
             onClick={() => { 
               setIsEntering(false); 
               setShowContent(false); 
               setIsMinimized(false); 
               setShowTerminal(false);
               setIsLayoutExpanded(false);
             }}
             className="mt-12 px-8 py-2 border border-fuchsia-500 text-fuchsia-500 hover:bg-fuchsia-500 hover:text-black transition-colors font-mono"
           >
             RESET SYSTEM
           </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white flex flex-col items-center justify-center relative overflow-hidden font-sans">
      
      {/* Audio Player Control */}
      <MusicPlayer onPlayChange={setIsMusicPlaying} />

      {/* Dynamic Backgrounds with Burst Trigger */}
      <Background burstTrigger={bgBurst} />
      
      {/* Matrix Overlay (Active when music is playing) */}
      <MatrixRain active={isMusicPlaying} />
      
      {/* Background Decorations */}
      <Decorations />
      
      {/* Terminal Layer - Fixed Position */}
      {showTerminal && (
        <Terminal 
          onEnter={handleEnter} 
          isEntering={isEntering} 
          isMinimized={isMinimized}
          onMinimize={() => setIsMinimized(true)}
          onClose={handleTerminalClose}
        />
      )}
      
      {/* Main Layout Container */}
      <div className={`relative z-10 flex flex-col items-center justify-center w-full max-w-5xl px-4 transition-opacity duration-1000 ${isEntering ? 'opacity-0 scale-150' : 'opacity-100'}`}>
        
        {/* Header / Logo Wrapper - Animates UP */}
        <div 
            className={`
                relative mb-8 transition-transform duration-1000 ease-[cubic-bezier(0.25,0.8,0.25,1)]
                ${isLayoutExpanded ? '-translate-y-[28vh]' : 'translate-y-0'}
            `}
        >
          <div className="flex items-center justify-center">
             <InteractiveText onLogoClick={handleLogoClick} />
          </div>
          <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-fuchsia-500 to-transparent mt-4 opacity-70"></div>
        </div>

        {/* Countdown Timer Wrapper - Animates DOWN */}
        <div className={`
            transition-all duration-1000 ease-[cubic-bezier(0.25,0.8,0.25,1)] origin-center
            ${isLayoutExpanded 
                ? 'translate-y-[28vh] scale-110 opacity-100 blur-0' 
                : 'translate-y-0 scale-100 opacity-60 blur-[6px]'}
        `}>
           <Countdown />
        </div>

      </div>

      {/* Warp Effect Overlay */}
      <WarpEffect active={isEntering} />
      
      {/* Scan lines overlay */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,20,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-[100] bg-[length:100%_2px,3px_100%] pointer-events-none mix-blend-overlay opacity-30"></div>

    </div>
  );
}

export default App;