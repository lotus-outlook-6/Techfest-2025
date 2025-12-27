
import React, { useState, useEffect } from 'react';
import Terminal from './components/Terminal';
import Countdown from './components/Countdown';
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

  // Initial Boot Sequence (Only happens once on site load)
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

  /**
   * Universal Transition Orchestrator
   */
  const triggerTransition = (targetIsHome: boolean) => {
    setIsTransitioning(true);
    
    // Step 2: Show the transition screen after the initial "zoom out" starts
    setTimeout(() => {
        setShowTransitionLoader(true);
    }, 800);

    // Step 3: Swap the underlying content mid-transition
    setTimeout(() => {
        setShowHome(targetIsHome);
    }, 5500);

    // Step 4: Final cleanup
    setTimeout(() => {
        setShowTransitionLoader(false);
        setIsTransitioning(false);
    }, 6500);
  };

  const handleEnter = () => triggerTransition(true);
  const handleHomeBack = () => triggerTransition(false);

  const handleLogoClick = () => {
    if (isLayoutExpanded) {
        if (isMinimized) {
            setIsMinimized(false);
        } else {
            // Adds more persistent gradient blobs to the background
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
      
      {/* PERSISTENT STABLE BACKGROUND LAYER (Z-0) */}
      <div 
        className={`fixed inset-0 z-0 transition-opacity duration-1000 ${showHome ? 'opacity-40' : 'opacity-100'}`}
        style={{
          // Deeper base to allow dynamic blobs to pop
          background: 'radial-gradient(circle at 50% 100%, rgba(20, 5, 25, 1) 0%, rgba(5, 5, 5, 1) 100%)'
        }}
      >
        {staggerState.background && (
          <Background burstTrigger={bgBurst} />
        )}
        <MatrixRain active={isMusicPlaying} />
      </div>

      {/* PERSISTENT AUDIO PLAYER (Z-300) */}
      <MusicPlayer 
        onPlayChange={setIsMusicPlaying} 
        hideButton={showHome || !showMain || isTransitioning} 
      />
      
      {/* INITIAL BOOT LOADING SCREEN */}
      {isAppLoading && <LoadingScreen />}

      {/* TRANSITION LOADING SCREEN (Z-500) */}
      {showTransitionLoader && <LoadingScreen isTransition={true} />}

      {/* FULL-SCREEN BLACK VOID OVERLAY (Z-400) */}
      <div className={`fixed inset-0 z-[400] bg-black transition-opacity duration-1000 ${isTransitioning ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}></div>

      {/* LANDING PAGE WRAPPER */}
      {!showHome && (
        <div className={`
          fixed inset-0 flex flex-col items-center justify-center transition-all duration-[1200ms] ease-in-out z-[200] pointer-events-none
          ${showMain ? 'opacity-100' : 'opacity-0'} 
          ${isTransitioning ? 'blur-[50px] scale-[0.8] opacity-0' : 'blur-0 scale-100'}
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
            <div className="pointer-events-auto">
              <Terminal 
                onEnter={handleEnter} 
                isMinimized={isMinimized}
                onMinimize={() => setIsMinimized(true)}
                onClose={handleTerminalClose}
              />
            </div>
          )}
        </div>
      )}

      {/* HOME PAGE WRAPPER */}
      {showHome && (
        <div className={`
          fixed inset-0 w-full h-full transition-all duration-[1200ms] ease-out z-[200] pointer-events-none
          ${isTransitioning ? 'blur-[50px] scale-[0.8] opacity-0' : 'blur-0 scale-100 opacity-100'}
        `}>
          <Home onBack={handleHomeBack} />
        </div>
      )}

      {/* GLOBAL SCANLINES / POST-PROCESS LAYER */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,20,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-[600] bg-[length:100%_2px,3px_100%] opacity-20"></div>

    </div>
  );
}

export default App;
