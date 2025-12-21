
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
  const [isAppLoading, setIsAppLoading] = useState(true);
  const [showMain, setShowMain] = useState(false);
  const [staggerState, setStaggerState] = useState({
    background: false,
    header: false,
    timer: false
  });

  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [showHome, setShowHome] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showTransitionLoader, setShowTransitionLoader] = useState(false);
  
  const [isLayoutExpanded, setIsLayoutExpanded] = useState(false);
  const [showTerminal, setShowTerminal] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [bgBurst, setBgBurst] = useState(0);

  // Initial Boot Sequence
  useEffect(() => {
    const loadTimer = setTimeout(() => {
      setIsAppLoading(false);
      setShowMain(true);
      setTimeout(() => setStaggerState(prev => ({ ...prev, background: true })), 100);
      setTimeout(() => setStaggerState(prev => ({ ...prev, header: true })), 1000);
      setTimeout(() => setStaggerState(prev => ({ ...prev, timer: true })), 1800);
    }, 3000);
    return () => clearTimeout(loadTimer);
  }, []);

  // Simplified Transition Logic
  const startTransition = (toHome: boolean) => {
    setIsTransitioning(true);
    
    // Wait for initial blur/fade-out
    setTimeout(() => {
        setShowTransitionLoader(true);
    }, 800);

    // Swap content mid-load
    setTimeout(() => {
        setShowHome(toHome);
    }, 5500);

    // Un-blur and finish
    setTimeout(() => {
        setShowTransitionLoader(false);
        setIsTransitioning(false);
    }, 6500);
  };

  const handleEnter = () => startTransition(true);
  const handleHomeBack = () => startTransition(false);

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
      
      {/* PERSISTENT STABLE BACKGROUND LAYER (Z-0) - No Scaling/Blurring during transition */}
      <div className={`fixed inset-0 z-0 transition-opacity duration-1000 ${showHome ? 'opacity-40' : 'opacity-100'}`}>
        {staggerState.background && (
          <>
            <Background burstTrigger={bgBurst} />
            <Decorations />
          </>
        )}
        <MatrixRain active={isMusicPlaying} />
      </div>

      <MusicPlayer onPlayChange={setIsMusicPlaying} hideButton={showHome} />
      
      {/* INITIAL BOOT LOADING */}
      {isAppLoading && <LoadingScreen />}

      {/* TRANSITION LOADING SCREEN (Z-500) */}
      {showTransitionLoader && <LoadingScreen isTransition={true} />}

      {/* Transition Overlay (Z-400) */}
      <div className={`fixed inset-0 z-[400] bg-black transition-opacity duration-1000 ${isTransitioning ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}></div>

      {/* CONTENT LAYERS (Z-100 TO Z-300) */}
      
      {/* LANDING PAGE CONTENT WRAPPER - Scales and blurs independently of background */}
      {!showHome && (
        <div className={`
          fixed inset-0 flex flex-col items-center justify-center transition-all duration-[1200ms] ease-in-out z-[200]
          ${showMain ? 'opacity-100' : 'opacity-0'} 
          ${isTransitioning ? 'blur-[40px] scale-[0.8] opacity-0' : 'blur-0 scale-100'}
        `}>
          <SocialButtons />
          
          <div className="relative z-20 flex flex-col items-center justify-center w-full max-w-5xl px-4 pointer-events-none">
            {staggerState.header && (
              <div className={`relative transition-all duration-1000 ease-[cubic-bezier(0.19,1,0.22,1)] animate-fade-in w-full text-center ${isLayoutExpanded ? '-translate-y-[35vh]' : 'translate-y-0'}`}>
                <div className="flex items-center justify-center pointer-events-auto">
                   <InteractiveText onLogoClick={handleLogoClick} />
                </div>
                <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-fuchsia-500 to-transparent mt-4 opacity-70 animate-line"></div>
                <div className={`absolute top-full left-1/2 -translate-x-1/2 pt-12 transition-all duration-1000 ease-[cubic-bezier(0.19,1,0.22,1)] origin-top ${staggerState.timer ? 'opacity-100' : 'opacity-0'} ${isLayoutExpanded ? 'translate-y-[56vh] scale-110 blur-0' : 'translate-y-0 heavy-blur'}`}>
                   <Countdown />
                </div>
              </div>
            )}
          </div>

          {showTerminal && (
            <Terminal 
              onEnter={handleEnter} 
              isMinimized={isMinimized}
              onMinimize={() => setIsMinimized(true)}
              onClose={handleTerminalClose}
            />
          )}
        </div>
      )}

      {/* HOME PAGE CONTENT WRAPPER - Scales and blurs independently of background */}
      {showHome && (
        <div className={`
          fixed inset-0 w-full h-full transition-all duration-[1200ms] ease-out z-[200]
          ${isTransitioning ? 'blur-[40px] scale-[0.8] opacity-0' : 'blur-0 scale-100 opacity-100'}
        `}>
          <Home onBack={handleHomeBack} />
        </div>
      )}

      {/* Global CRT Scanlines (Z-600) */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,20,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-[600] bg-[length:100%_2px,3px_100%] opacity-20"></div>
    </div>
  );
}

export default App;
