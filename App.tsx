
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
import NavbarSlider from './components/NavbarSlider';
import RegisterButton from './components/RegisterButton';
import Gallery from './components/Gallery';
import Modules from './components/Modules';
import Events from './components/Events';
import Team from './components/Team';

// Generic View for Sub-Sections - Changed to justify-start for proper scroll behavior
const SectionView: React.FC<{ title: string; children?: React.ReactNode }> = ({ title, children }) => (
  <div className="w-screen h-full flex flex-col items-center justify-start shrink-0 relative overflow-hidden select-none">
    {children ? children : (
      <div className="relative z-10 flex flex-col items-center animate-fade-in pt-40">
        <h1 className="text-6xl md:text-9xl font-mono font-bold tracking-[0.3em] text-white uppercase drop-shadow-[0_0_40px_rgba(217,70,239,0.4)]">
          {title}
        </h1>
        <div className="h-1 w-48 bg-fuchsia-500 mt-8 blur-sm animate-pulse"></div>
      </div>
    )}
  </div>
);

function App() {
  const [isAppLoading, setIsAppLoading] = useState(true);
  const [showMain, setShowMain] = useState(false);
  const [staggerState, setStaggerState] = useState({
    background: false,
    header: false,
    timer: false
  });

  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [showMainLayout, setShowMainLayout] = useState(false);
  const [currentSection, setCurrentSection] = useState('HOME');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showTransitionLoader, setShowTransitionLoader] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const [isLayoutExpanded, setIsLayoutExpanded] = useState(false);
  const [showTerminal, setShowTerminal] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [bgBurst, setBgBurst] = useState(0);

  const SECTIONS = ['HOME', 'GALLERY', 'MODULES', 'EVENTS', 'TEAM'];
  const activeSectionIndex = SECTIONS.indexOf(currentSection);

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

  const triggerEntryTransition = () => {
    setIsTransitioning(true);
    setTimeout(() => {
        setShowTransitionLoader(true);
    }, 800);

    setTimeout(() => {
        setShowMainLayout(true);
        setCurrentSection('HOME');
    }, 5500);

    setTimeout(() => {
        setShowTransitionLoader(false);
        setIsTransitioning(false);
    }, 6500);
  };

  const handleEnter = () => triggerEntryTransition();
  const handleHomeBack = () => {
      setIsTransitioning(true);
      setTimeout(() => {
          setShowMainLayout(false);
          setCurrentSection('HOME');
      }, 500);
      setTimeout(() => {
          setIsTransitioning(false);
      }, 1200);
  };

  const handleSectionSelect = (section: string) => {
      if (section !== currentSection) {
          setCurrentSection(section);
      }
      setIsMobileMenuOpen(false);
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

  const toggleMobileMenu = (e?: React.MouseEvent | React.TouchEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="min-h-screen w-full text-white flex flex-col items-center justify-center relative overflow-hidden font-sans bg-[#050505]">
      
      {/* PERSISTENT BACKGROUND */}
      <div 
        className={`fixed inset-0 z-0 transition-opacity duration-1000 ${showMainLayout ? 'opacity-40' : 'opacity-100'}`}
        style={{
          background: 'radial-gradient(circle at 50% 100%, rgba(20, 5, 25, 1) 0%, rgba(5, 5, 5, 1) 100%)'
        }}
      >
        {staggerState.background && (
          <Background burstTrigger={bgBurst} />
        )}
        <MatrixRain active={isMusicPlaying} />
      </div>

      <MusicPlayer 
        onPlayChange={setIsMusicPlaying} 
        hideButton={showMainLayout || !showMain || isTransitioning} 
      />
      
      {isAppLoading && <LoadingScreen />}
      {showTransitionLoader && <LoadingScreen isTransition={true} />}

      <div className={`fixed inset-0 z-[400] bg-black transition-opacity duration-1000 ${isTransitioning ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}></div>

      {!showMainLayout && (
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
                onEnter={triggerEntryTransition} 
                isMinimized={isMinimized}
                onMinimize={() => setIsMinimized(true)}
                onClose={handleTerminalClose}
              />
            </div>
          )}
        </div>
      )}

      {showMainLayout && (
        <div className="fixed inset-0 z-[200] flex flex-col pointer-events-auto animate-fade-in">
          
          {/* MOBILE OVERLAY MENU */}
          <div className={`fixed inset-0 z-[2900] bg-black/75 backdrop-blur-3xl transition-all duration-700 flex flex-col items-center justify-center ${isMobileMenuOpen ? 'opacity-100 pointer-events-auto scale-100' : 'opacity-0 pointer-events-none scale-110'}`}>
             <nav className="flex flex-col items-center gap-10 md:gap-14">
                {SECTIONS.map((section, idx) => (
                    <button 
                        key={section}
                        onClick={() => handleSectionSelect(section)}
                        className={`text-4xl md:text-7xl font-anton tracking-widest transition-all duration-500 hover:scale-110 active:scale-95 ${currentSection === section ? 'text-fuchsia-500 drop-shadow-[0_0_15px_#d946ef]' : 'text-white/40 hover:text-white'}`}
                        style={{ transitionDelay: isMobileMenuOpen ? `${idx * 100}ms` : '0ms' }}
                    >
                        {section}
                    </button>
                ))}
             </nav>
          </div>

          <header className="fixed top-0 left-0 w-full h-20 md:h-24 flex items-center justify-between px-4 md:px-12 z-[3000] bg-black/40 backdrop-blur-3xl border-b border-fuchsia-500/10 shadow-[0_4px_30px_rgba(0,0,0,0.3)] pointer-events-auto">
            <div className="flex items-center gap-3 md:gap-5 group select-none shrink-0 cursor-pointer transition-transform hover:scale-[0.98]" onClick={handleHomeBack}>
              <div className="w-8 h-8 md:w-12 md:h-12 bg-[#1e1e1e] border border-gray-700 rounded-md flex items-center justify-center shadow-[0_0_15px_rgba(217,70,239,0.25)] group-hover:border-fuchsia-500 transition-all duration-300">
                <span className="text-fuchsia-500 font-bold text-lg md:text-2xl font-mono flex pointer-events-none"><span>&gt;</span><span>_</span></span>
              </div>
              <span className="text-lg md:text-3xl font-anton tracking-[0.08em] text-white group-hover:text-fuchsia-400 transition-colors uppercase">YANTRAKSH</span>
            </div>
            
            <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2">
              <NavbarSlider initialSection={currentSection} onSelect={handleSectionSelect} />
            </div>

            <div className="flex items-center gap-2 md:gap-6 shrink-0 relative z-[3100]">
                <div className="scale-75 md:scale-100 origin-right transition-transform hover:scale-[0.8]">
                    <RegisterButton size="sm" />
                </div>
                {/* HAMBURGER ICON - Highest Priority Hit Area */}
                <button 
                    onClick={toggleMobileMenu}
                    onTouchStart={(e) => { e.stopPropagation(); }}
                    className="lg:hidden w-14 h-14 flex flex-col items-center justify-center gap-1.5 focus:outline-none hover:bg-white/5 rounded-full transition-all active:scale-90 relative z-[3500]"
                    aria-label="Toggle Menu"
                >
                    <div className={`w-7 h-1 bg-white rounded-full transition-all duration-300 transform ${isMobileMenuOpen ? 'rotate-45 translate-y-2.5' : ''}`}></div>
                    <div className={`w-7 h-1 bg-white rounded-full transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0 scale-x-0' : ''}`}></div>
                    <div className={`w-7 h-1 bg-white rounded-full transition-all duration-300 transform ${isMobileMenuOpen ? '-rotate-45 -translate-y-2.5' : ''}`}></div>
                </button>
            </div>
          </header>

          <div className="flex-1 w-full relative overflow-hidden mt-20 md:mt-24">
            <div 
              className="flex w-full h-full transition-transform duration-[800ms] ease-[cubic-bezier(0.19,1,0.22,1)]"
              style={{ transform: `translateX(-${activeSectionIndex * 100}vw)` }}
            >
              <SectionView title="HOME">
                <Home onBack={handleHomeBack} onSectionChange={handleSectionSelect} initialSection={currentSection} hideNavbar={true} />
              </SectionView>
              <SectionView title="GALLERY">
                <Gallery />
              </SectionView>
              <SectionView title="MODULES">
                <Modules />
              </SectionView>
              <SectionView title="EVENTS">
                <Events />
              </SectionView>
              <SectionView title="TEAM">
                <Team />
              </SectionView>
            </div>
          </div>
        </div>
      )}

      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,20,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-[600] bg-[length:100%_2px,3px_100%] opacity-20"></div>

    </div>
  );
}

export default App;
