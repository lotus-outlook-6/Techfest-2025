
import React, { useState, useEffect } from 'react';
import Terminal from './components/Terminal';
import Countdown from './components/Countdown';
import Decorations from './components/Decorations';
import Background from './components/Background';
import MatrixRain from './components/MatrixRain';
import InteractiveText from './components/InteractiveText';
import MusicPlayer from './components/MusicPlayer';
import Home from './components/Home';
import LoadingScreen from './components/LoadingScreen';
import SocialButtons from './components/SocialButtons';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [showMain, setShowMain] = useState(false);
  const [staggerState, setStaggerState] = useState({
    background: false,
    header: false,
    timer: false
  });

  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [showHome, setShowHome] = useState(false);
  const [isLayoutExpanded, setIsLayoutExpanded] = useState(false);
  const [showTerminal, setShowTerminal] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [bgBurst, setBgBurst] = useState(0);

  // Loading sequence orchestration
  useEffect(() => {
    // 1. Loading screen duration (3s)
    const loadTimer = setTimeout(() => {
      setIsLoading(false);
      setShowMain(true);
      
      // 2. Background start
      setTimeout(() => setStaggerState(prev => ({ ...prev, background: true })), 100);
      
      // 3. Header appears
      setTimeout(() => setStaggerState(prev => ({ ...prev, header: true })), 1000);
      
      // 4. Timer fades in
      setTimeout(() => setStaggerState(prev => ({ ...prev, timer: true })), 1800);

    }, 3000);

    return () => clearTimeout(loadTimer);
  }, []);

  const handleEnter = () => {
    setShowHome(true);
  };

  const handleHomeBack = () => {
    setShowHome(false);
  };

  const handleLogoClick = () => {
    if (isLayoutExpanded) {
        if (isMinimized) {
            setIsMinimized(false);
        } else {
            setBgBurst(prev => prev + 1);
        }
    } else {
        setIsLayoutExpanded(true);
        setTimeout(() => {
            setIsMinimized(false);
            setShowTerminal(true);
        }, 800);
    }
  };

  const handleTerminalClose = () => {
      setShowTerminal(false);
      setIsMinimized(false);
      setIsLayoutExpanded(false);
  };

  return (
    <div className="min-h-screen w-full text-white flex flex-col items-center justify-center relative overflow-hidden font-sans bg-[#050505]">
      
      {/* 
          GLOBAL COMPONENTS 
          These stay mounted across page transitions to ensure 
          uninterrupted audio and ambient effects.
          Passing showHome as hideButton prop to remove UI on Home page.
      */}
      <MusicPlayer onPlayChange={setIsMusicPlaying} hideButton={showHome} />
      
      {/* Matrix Rain placed very low in stacking order (z-1) */}
      <MatrixRain active={isMusicPlaying} />

      {showHome ? (
        <Home onBack={handleHomeBack} />
      ) : (
        <>
          {isLoading && <LoadingScreen />}

          {/* Main Landing App Content */}
          <div className={`fixed inset-0 flex flex-col items-center justify-center transition-opacity duration-1000 ${showMain ? 'opacity-100' : 'opacity-0'} pointer-events-none`}>
            
            {/* Background Decorations Layer */}
            {staggerState.background && (
              <div className="absolute inset-0 animate-fade-in pointer-events-none z-0">
                 <Background burstTrigger={bgBurst} />
                 <Decorations />
              </div>
            )}
            
            {/* Social Buttons Layer */}
            {staggerState.background && <SocialButtons />}
            
            {/* Terminal Layer */}
            {showTerminal && (
              <div className="pointer-events-auto contents">
                <Terminal 
                  onEnter={handleEnter} 
                  isEntering={false}
                  isMinimized={isMinimized}
                  onMinimize={() => setIsMinimized(true)}
                  onClose={handleTerminalClose}
                />
              </div>
            )}
            
            {/* Main Layout Container - Explicitly z-20 to be above MatrixRain (z-1) */}
            <div className={`relative z-20 flex flex-col items-center justify-center w-full max-w-5xl px-4 pointer-events-none`}>
              
              {/* Header / Logo Wrapper */}
              {staggerState.header && (
                <div 
                    className={`
                        relative transition-all duration-1000 ease-[cubic-bezier(0.19,1,0.22,1)] animate-fade-in w-full text-center
                        ${isLayoutExpanded ? '-translate-y-[35vh]' : 'translate-y-0'}
                    `}
                >
                  <div className="flex items-center justify-center pointer-events-auto">
                     <InteractiveText onLogoClick={handleLogoClick} />
                  </div>
                  
                  <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-fuchsia-500 to-transparent mt-4 opacity-70 animate-line"></div>
                  
                  {/* Countdown Timer Wrapper - Positioned relative to the line */}
                  <div className={`
                      absolute top-full left-1/2 -translate-x-1/2 pt-12
                      transition-all duration-1000 ease-[cubic-bezier(0.19,1,0.22,1)] origin-top
                      ${staggerState.timer ? 'opacity-100' : 'opacity-0'}
                      ${isLayoutExpanded 
                          ? 'translate-y-[56vh] scale-110 blur-0' 
                          : 'translate-y-0 heavy-blur'}
                  `}>
                     <Countdown />
                  </div>
                </div>
              )}

            </div>
            
            {/* Scan lines overlay - Highest layer */}
            <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,20,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-[100] bg-[length:100%_2px,3px_100%] pointer-events-none mix-blend-overlay opacity-30"></div>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
