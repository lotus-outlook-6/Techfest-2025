import React, { useState, useRef, useEffect } from 'react';

interface ModuleData {
  id: string;
  name: string;
  tagline: string;
  shortDesc: string;
  longDesc: string;
  status: 'ACTIVE' | 'STABLE' | 'INIT' | 'ENCRYPTED' | 'STANDBY';
  color: string;
  icon: string;
  imageUrl: string;
}

const MODULES_DATA: ModuleData[] = [
  {
    id: "M_01",
    name: "Competitive Coding",
    tagline: "Code-Combat / Algorithm Arena",
    shortDesc: "Where Logic Meets Speed.",
    longDesc: "Step into the ultimate battleground of bits and bytes. This module tests your problem-solving skills, algorithmic efficiency, and coding speed. Participants will face a series of grueling challenges ranging from basic logic to complex dynamic programming.",
    status: "ACTIVE",
    color: "cyan",
    icon: "code",
    imageUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: "M_02",
    name: "Robo War/Race",
    tagline: "Metal Mayhem / Robo-Rage",
    shortDesc: "Build. Brawl. Conquer.",
    longDesc: "Witness the clash of steel! Whether it is maneuvering through a treacherous obstacle course in record time or battling it out in the arena to be the last bot standing, this module is for the true hardware enthusiasts. Bring your creations to life and let the motors roar.",
    status: "ACTIVE",
    color: "fuchsia",
    icon: "robot",
    imageUrl: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: "M_03",
    name: "Image Prompting",
    tagline: "Prompt-o-Graphy / AI Artistry",
    shortDesc: "Imagine it. Type it. Create it.",
    longDesc: "Harness the power of Generative AI. In this competition, your keyboard is your paintbrush. Participants will be given abstract themes or specific scenarios and must use prompt engineering to generate the most accurate, creative, and visually stunning AI art.",
    status: "STABLE",
    color: "orange",
    icon: "image",
    imageUrl: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: "M_04",
    name: "Cyber Escape Room",
    tagline: "The Firewall Breach / Net-Lock",
    shortDesc: "Can You Hack Your Way Out?",
    longDesc: "You are trapped in a digital fortress. This is a CTF (Capture The Flag) style event mixed with logic puzzles. Participants must decrypt codes, find hidden flags in source code, and solve cryptographic riddles to 'unlock' the next room and escape before the timer runs out.",
    status: "INIT",
    color: "blue",
    icon: "security",
    imageUrl: "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: "M_05",
    name: "SUSTAINABLE AGRI",
    tagline: "Agro-Tech / Green Innovation",
    shortDesc: "Cultivating the Future.",
    longDesc: "Technology meets mother nature. This module invites innovative ideas and prototypes that solve real-world agricultural problems. From IoT-based irrigation systems to drone crop monitoring, showcase how technology cab make farming more precise and sustainable.",
    status: "STABLE",
    color: "lime",
    icon: "leaf",
    imageUrl: "https://images.unsplash.com/photo-1560493676-04071c5f467b?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: "M_06",
    name: "Tech Debate",
    tagline: "Binary Banter / The Tech Forum",
    shortDesc: "Voices of the Future.",
    longDesc: "Not all battles are fought with code; some are won with words. Engage in heated discussions on the most controversial and cutting-edge topics in technology. Logic, articulation, and technical knowledge are your weapons.",
    status: "ENCRYPTED",
    color: "red",
    icon: "debate",
    imageUrl: "https://plus.unsplash.com/premium_photo-1744976431332-a8057b153e9e?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  }
];

const ModuleIcon: React.FC<{ type: string; color: string; className?: string }> = ({ type, color, className = "" }) => {
  const colorMap: Record<string, string> = {
    fuchsia: 'text-fuchsia-500',
    cyan: 'text-cyan-400',
    lime: 'text-lime-400',
    orange: 'text-orange-400',
    blue: 'text-blue-500',
    red: 'text-red-500'
  };
  const c = colorMap[color] || 'text-white';

  switch (type) {
    case 'robot':
      return <svg className={`${className} ${c}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="11" width="18" height="10" rx="2" /><circle cx="12" cy="5" r="2" /><path d="M12 7v4M8 15h.01M16 15h.01" strokeLinecap="round" /></svg>;
    case 'code':
      return <svg className={`${className} ${c}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /><line x1="14" y1="4" x2="10" y2="20" /></svg>;
    case 'image':
      return <svg className={`${className} ${c}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>;
    case 'security':
      return <svg className={`${className} ${c}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>;
    case 'leaf':
      return <svg className={`${className} ${c}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 20c0 0 2-12 11-14c6-1 7 4 7 4c0 0-2 11-11 13c-4.5 1-7-3-7-3Z" /><path d="M2 22c2-1 4-2 6-2c4-2 8-5 11-13" /></svg>;
    case 'debate':
      return <svg className={`${className} ${c}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /><path d="M8 9h8" /><path d="M8 13h6" /></svg>;
    default: return null;
  }
};

const Modules: React.FC = () => {
  const contentRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLElement>(null);
  const [activePage, setActivePage] = useState(-1); 
  const [isYearForward, setIsYearForward] = useState(false);
  const yearResetTimer = useRef<number | null>(null);

  useEffect(() => {
    if (activePage === 6) {
      const timer = setTimeout(() => {
        setActivePage(-1);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [activePage]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            handleYearTrigger();
          }
        });
      },
      { threshold: 0.5 }
    );
    if (footerRef.current) observer.observe(footerRef.current);
    return () => observer.disconnect();
  }, []);

  const handleYearTrigger = () => {
    if (isYearForward) return;
    setIsYearForward(true);
    if (yearResetTimer.current) window.clearTimeout(yearResetTimer.current);
    yearResetTimer.current = window.setTimeout(() => setIsYearForward(false), 3000);
  };

  const scrollToContent = () => contentRef.current?.scrollIntoView({ behavior: 'smooth' });

  const handleOpenBook = () => {
    setActivePage(0);
  };

  const handleNextPage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activePage < 6) {
      setActivePage(prev => prev + 1);
    } else {
      setActivePage(-1);
    }
  };
  
  const handlePrevPage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activePage >= 0) setActivePage(prev => prev - 1);
  };

  const handleViewModuleDetails = (index: number) => {
    scrollToContent();
    setActivePage(index);
  };

  const getContainerTranslation = () => {
    if (activePage === -1) return 'translateX(-200px)';
    if (activePage === 6) return 'translateX(200px)';
    return 'translateX(0)';
  };

  const letters = "YANTRAKSH".split("");
  const directions = ["top", "bottom", "left", "right", "top", "bottom", "left", "right", "top"];

  return (
    <div className="w-full h-full flex flex-col items-center overflow-y-auto overflow-x-hidden no-scrollbar scroll-smooth bg-transparent">
      <style>{`
        @keyframes slide-top-pro { 0% { transform: translateY(-120px) scale(0.8); opacity: 0; filter: blur(12px); } 100% { transform: translateY(0) scale(1); opacity: 1; filter: blur(0); } }
        @keyframes slide-bottom-pro { 0% { transform: translateY(120px) scale(0.8); opacity: 0; filter: blur(12px); } 100% { transform: translateY(0) scale(1); opacity: 1; filter: blur(0); } }
        @keyframes slide-left-pro { 0% { transform: translateX(-120px) scale(0.8); opacity: 0; filter: blur(12px); } 100% { transform: translateX(0) scale(1); opacity: 1; filter: blur(0); } }
        @keyframes slide-right-pro { 0% { transform: translateX(120px) scale(0.8); opacity: 0; filter: blur(12px); } 100% { transform: translateX(0) scale(1); opacity: 1; filter: blur(0); } }
        @keyframes float-hero { 0%, 100% { transform: translate(0, 0) rotate(0deg); } 33% { transform: translate(15px, -25px) rotate(5deg); } 66% { transform: translate(-10px, 15px) rotate(-3deg); } }
        .animate-float-hero { animation: float-hero 10s ease-in-out infinite; }
        .letter-anim { display: inline-block; animation-duration: 1.0s; animation-fill-mode: forwards; animation-timing-function: cubic-bezier(0.23, 1, 0.32, 1); opacity: 0; }
        .modules-word-anim { display: block; animation: slide-top-pro 1.2s cubic-bezier(0.23, 1, 0.32, 1) forwards; animation-delay: 1.0s; opacity: 0; }

        .book-container {
          position: relative;
          width: 800px;
          height: 550px;
          transition: transform 1.2s cubic-bezier(0.645, 0.045, 0.355, 1);
          transform-style: preserve-3d;
        }
        .book-page {
          position: absolute;
          width: 50%;
          height: 100%;
          top: 0;
          right: 0;
          transform-origin: left center;
          transition: transform 0.8s cubic-bezier(0.645, 0.045, 0.355, 1);
          transform-style: preserve-3d;
        }
        .book-page.flipped { transform: rotateY(-180deg); }
        .page-front, .page-back { position: absolute; width: 100%; height: 100%; top: 0; left: 0; backface-visibility: hidden; overflow: hidden; border-radius: 0 15px 15px 0; }
        .page-back { transform: rotateY(180deg); border-radius: 15px 0 0 15px; }
        .page-shadow { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: linear-gradient(to right, rgba(0,0,0,0.1) 0%, transparent 10%); pointer-events: none; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

        .card-glow-cyan { box-shadow: 0 0 30px rgba(34, 211, 238, 0.1); }
        .card-glow-cyan:hover { box-shadow: 0 0 50px rgba(34, 211, 238, 0.3); }
        .card-glow-fuchsia { box-shadow: 0 0 30px rgba(217, 70, 239, 0.1); }
        .card-glow-fuchsia:hover { box-shadow: 0 0 50px rgba(217, 70, 239, 0.3); }
        .card-glow-blue { box-shadow: 0 0 30px rgba(59, 130, 246, 0.1); }
        .card-glow-blue:hover { box-shadow: 0 0 50px rgba(59, 130, 246, 0.3); }
        .card-glow-lime { box-shadow: 0 0 30px rgba(163, 230, 53, 0.1); }
        .card-glow-lime:hover { box-shadow: 0 0 50px rgba(163, 230, 53, 0.3); }
        .card-glow-orange { box-shadow: 0 0 30px rgba(251, 146, 60, 0.1); }
        .card-glow-orange:hover { box-shadow: 0 0 50px rgba(251, 146, 60, 0.3); }
        .card-glow-red { box-shadow: 0 0 30px rgba(239, 68, 68, 0.1); }
        .card-glow-red:hover { box-shadow: 0 0 50px rgba(239, 68, 68, 0.3); }

        @keyframes nebula-pulse { 0%, 100% { transform: scale(1); opacity: 0.8; } 50% { transform: scale(1.1); opacity: 1; } }
        @keyframes accretion-spin { from { transform: rotate(25deg) scale(1); filter: blur(40px) brightness(1); } 50% { transform: rotate(25deg) scale(1.05); filter: blur(45px) brightness(1.2); } to { transform: rotate(385deg) scale(1); filter: blur(40px) brightness(1); } }
        @keyframes accretion-spin-reverse { from { transform: rotate(25deg) scale(1); } to { transform: rotate(-335deg) scale(1); } }
        @keyframes lensing-pulse { 0%, 100% { transform: scale(1); opacity: 0.1; } 50% { transform: scale(1.02); opacity: 0.2; } }
        @keyframes shuttle-drift { 0%, 100% { transform: translateY(-50%) translateX(0); } 50% { transform: translateY(-55%) translateX(15px); } }
        @keyframes shuttle-spin { from { transform: rotateY(0deg) rotateX(0deg); } to { transform: rotateY(360deg) rotateX(10deg); } }
        @keyframes thruster-pulse { 0%, 100% { opacity: 0; transform: translateY(-50%) scale(0.8); } 50% { opacity: 0.6; transform: translateY(-50%) scale(1.2); } }
        .animate-nebula-pulse { animation: nebula-pulse 10s ease-in-out infinite; }
        .animate-accretion-spin { animation: accretion-spin 15s linear infinite; }
        .animate-accretion-spin-reverse { animation: accretion-spin-reverse 10s linear infinite; }
        .animate-lensing-pulse { animation: lensing-pulse 4s ease-in-out infinite; }
        .animate-shuttle-drift { animation: shuttle-drift 8s ease-in-out infinite; }
        .animate-shuttle-spin { animation: shuttle-spin 12s linear infinite; transform-style: preserve-3d; perspective: 500px; }
        .animate-thruster-pulse { animation: thruster-pulse 0.2s ease-in-out infinite; }
      `}</style>
      
      {/* HERO SECTION */}
      <section className="min-h-screen w-full flex flex-col items-center justify-center relative shrink-0 overflow-visible">
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="relative w-full h-full max-w-7xl mx-auto">
            <div className="absolute top-[8%] left-[5%] md:left-[10%] animate-float-hero">
              <ModuleIcon type="code" color="cyan" className="w-20 h-20 md:w-32 md:h-32 opacity-20" />
            </div>
            <div className="absolute top-[38%] left-[2%] md:left-[5%] animate-float-hero" style={{ animationDelay: '-2s' }}>
              <ModuleIcon type="security" color="blue" className="w-20 h-20 md:w-32 md:h-32 opacity-20" />
            </div>
            <div className="absolute bottom-[22%] left-[5%] md:left-[10%] animate-float-hero" style={{ animationDelay: '-4s' }}>
              <ModuleIcon type="leaf" color="lime" className="w-20 h-20 md:w-32 md:h-32 opacity-20" />
            </div>
            <div className="absolute top-[8%] right-[5%] md:right-[10%] animate-float-hero" style={{ animationDelay: '-6s' }}>
              <ModuleIcon type="robot" color="fuchsia" className="w-20 h-20 md:w-32 md:h-32 opacity-20" />
            </div>
            <div className="absolute top-[38%] right-[2%] md:right-[5%] animate-float-hero" style={{ animationDelay: '-8s' }}>
              <ModuleIcon type="image" color="orange" className="w-20 h-20 md:w-32 md:h-32 opacity-20" />
            </div>
            <div className="absolute bottom-[22%] right-[5%] md:right-[10%] animate-float-hero" style={{ animationDelay: '-10s' }}>
              <ModuleIcon type="debate" color="red" className="w-20 h-20 md:w-32 md:h-32 opacity-20" />
            </div>
          </div>
        </div>

        <div className="relative w-full max-w-5xl flex items-center justify-center z-10">
          <div className="relative text-center px-6">
            <h2 className="text-5xl md:text-[8.5rem] font-anton text-white uppercase leading-none flex justify-center gap-[0.05em] md:gap-[0.08em] tracking-tight">
              {letters.map((char, i) => (
                <span key={i} className="letter-anim" style={{ animationName: `slide-${directions[i]}-pro`, animationDelay: `${i * 0.08}s` }}>{char}</span>
              ))}
            </h2>
            <span className="modules-word-anim text-3xl md:text-5xl lg:text-7xl font-anton text-fuchsia-500 tracking-tighter md:tracking-tight animate-text-glow mt-4" style={{ animationDelay: '1.2s' }}>TECHNICAL MODULES</span>
          </div>
        </div>

        <div className="absolute bottom-32 md:bottom-40 left-1/2 -translate-x-1/2 animate-bounce cursor-pointer z-20" onClick={scrollToContent}>
          <svg className="w-10 h-10 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
        </div>
      </section>

      {/* DIGITAL BOOK CONTENT SECTION */}
      <div id="module-book-content" ref={contentRef} className="min-h-screen w-full shrink-0 flex flex-col items-center justify-center py-20 px-6 perspective-[2000px] overflow-visible">
        
        <div className="book-container" style={{ transform: getContainerTranslation() }}>
          {/* SHEET 6: Final Module Details + Back Cover */}
          <div className={`book-page ${activePage >= 6 ? 'flipped' : ''}`} style={{ zIndex: activePage >= 6 ? 56 : 94, pointerEvents: (activePage === 5 || activePage === 6) ? 'auto' : 'none' }}>
            <div className="page-front bg-[#0d1b31] border-y border-r border-white/5 shadow-[-5px_0_15px_rgba(0,0,0,0.5)]">
               <div className="page-shadow"></div>
               <div className="w-full h-full flex flex-col items-center p-8 text-center relative pt-10">
                  <div className="w-14 h-14 mb-4 bg-red-500/5 rounded-full p-3 flex items-center justify-center shadow-[0_0_20px_rgba(239,68,68,0.1)]">
                     <ModuleIcon type={MODULES_DATA[5].icon} color={MODULES_DATA[5].color} className="w-full h-full" />
                  </div>
                  <h3 className="text-2xl font-anton text-white mb-1 tracking-widest uppercase leading-tight">{MODULES_DATA[5].name}</h3>
                  <p className="text-[10px] font-bold font-space uppercase tracking-[0.2em] mb-1 text-red-400 opacity-90">{MODULES_DATA[5].tagline}</p>
                  <p className="text-[9px] font-medium font-mono uppercase tracking-[0.1em] mb-4 text-white opacity-40">{MODULES_DATA[5].shortDesc}</p>
                  <p className="text-gray-300 text-sm font-space max-w-xs mb-4 opacity-90 leading-relaxed overflow-hidden line-clamp-6">{MODULES_DATA[5].longDesc}</p>
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-full flex justify-center px-10">
                     <button className="w-full max-w-[150px] py-2 bg-[#0a1528]/90 border border-red-500/40 text-white font-anton tracking-[0.2em] text-[10px] rounded-[2rem] hover:bg-red-500 hover:border-red-500 transition-all duration-300 shadow-[0_0_20px_rgba(239,68,68,0.15)] uppercase">
                       FILL_FORM
                     </button>
                  </div>
                  <button onClick={handleNextPage} className="absolute bottom-4 right-4 w-9 h-9 flex items-center justify-center bg-white/5 border border-white/10 rounded-full hover:bg-fuchsia-500 hover:text-white transition-all shadow-lg group">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
               </div>
            </div>
            <div className="page-back bg-[#0a1528] border-y border-l border-white/20 shadow-[5px_0_15px_rgba(0,0,0,0.5)]">
               <div className="w-full h-full flex flex-col items-center justify-center p-10 relative">
                  <div className="flex flex-col items-center gap-6 text-center">
                     <div className="w-20 h-20 border-2 border-fuchsia-500/30 rounded-full flex items-center justify-center mb-4"><svg className="w-10 h-10 text-fuchsia-500/60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2L2 7L12 12L22 7L12 2Z" /><path d="M2 17L12 22L22 17" /><path d="M2 12L17L22 12" /></svg></div>
                     <h4 className="text-white font-anton text-4xl tracking-[0.2em] uppercase opacity-70 leading-none">ARCHIVE<br/>SECURED</h4>
                     <div className="flex gap-1 h-12 items-end mb-4 opacity-40">{[...Array(16)].map((_, i) => (<div key={i} className="bg-white" style={{ width: `${Math.random() * 3 + 1}px`, height: `${Math.random() * 40 + 40}%` }}></div>))}</div>
                  </div>
                  <button onClick={handlePrevPage} className="absolute bottom-4 left-4 w-12 h-12 flex items-center justify-center bg-white/10 border border-white/20 rounded-full hover:bg-cyan-500 hover:text-white transition-all shadow-xl group"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg></button>
               </div>
            </div>
          </div>

          {/* SHEETS 1-5 */}
          {[1, 2, 3, 4, 5].slice().reverse().map((sheetId) => {
            const moduleIndex = sheetId - 1;
            const module = MODULES_DATA[moduleIndex];
            const nextModule = MODULES_DATA[moduleIndex + 1];
            const isFlipped = activePage >= sheetId;
            const zIndex = isFlipped ? (sheetId + 50) : (100 - sheetId);
            const canInteract = (activePage === moduleIndex || activePage === sheetId);

            return (
              <div key={`sheet-${sheetId}`} className={`book-page ${isFlipped ? 'flipped' : ''}`} style={{ zIndex, pointerEvents: canInteract ? 'auto' : 'none' }}>
                <div className="page-front bg-[#0d1b31] border-y border-r border-white/5 shadow-[-5px_0_15px_rgba(0,0,0,0.5)]">
                  <div className="page-shadow"></div>
                  <div className="w-full h-full flex flex-col items-center p-8 text-center relative pt-10">
                     <div className={`w-14 h-14 mb-4 bg-${module.color}-500/5 rounded-full p-3 flex items-center justify-center shadow-[0_0_20px_rgba(0,0,0,0.1)]`}><ModuleIcon type={module.icon} color={module.color} className="w-full h-full" /></div>
                     <h3 className="text-2xl font-anton text-white mb-1 tracking-widest uppercase shrink-0 leading-tight">{module.name}</h3>
                     <p className="text-[10px] font-bold font-space uppercase tracking-[0.2em] mb-1 text-fuchsia-400 opacity-90">{module.tagline}</p>
                     <p className="text-[9px] font-medium font-mono uppercase tracking-[0.1em] mb-4 text-white opacity-40">{module.shortDesc}</p>
                     <p className="text-gray-300 text-sm font-space max-w-xs mb-4 opacity-95 leading-relaxed overflow-hidden line-clamp-6">{module.longDesc}</p>
                     <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-full flex justify-center px-10">
                        <button className={`w-full max-w-[150px] py-2 bg-[#0a1528]/90 border border-${module.color}-500/40 text-white font-anton tracking-[0.2em] text-[10px] rounded-[2rem] hover:bg-fuchsia-500 hover:border-fuchsia-500 transition-all duration-300 shadow-[0_0_20px_rgba(217,70,239,0.15)] uppercase`}>
                          FILL_FORM
                        </button>
                     </div>
                     <button onClick={handleNextPage} className="absolute bottom-4 right-4 w-9 h-9 flex items-center justify-center bg-white/5 border border-white/10 rounded-full hover:bg-fuchsia-500 hover:text-white transition-all shadow-lg group"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg></button>
                  </div>
                </div>
                <div className="page-back bg-[#0a1e3d] border-y border-l border-white/5 shadow-[5px_0_15px_rgba(0,0,0,0.5)]">
                  <div className="w-full h-full flex items-center justify-center p-8 relative">
                    <div className="relative w-full aspect-square bg-white p-4 shadow-2xl transform rotate-[-3deg]">
                       <div className="w-full h-[85%] bg-gray-200 overflow-hidden mb-2"><img src={nextModule.imageUrl} className="w-full h-full object-cover grayscale-[0.2]" alt="Module Visual" /></div>
                       <div className="font-space text-black text-[10px] font-bold text-center opacity-70 uppercase tracking-widest">{nextModule.name}</div>
                    </div>
                    <button onClick={handlePrevPage} className="absolute bottom-4 left-4 w-12 h-12 flex items-center justify-center bg-white/10 border border-white/20 rounded-full hover:bg-cyan-500 hover:text-white transition-all shadow-xl group"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg></button>
                  </div>
                </div>
              </div>
            );
          })}

          {/* SHEET 0 */}
          <div className={`book-page ${activePage >= 0 ? 'flipped' : ''}`} style={{ zIndex: activePage >= 0 ? 50 : 200, pointerEvents: (activePage === -1 || activePage === 0) ? 'auto' : 'none' }}>
            <div onClick={handleOpenBook} className="page-front bg-gradient-to-br from-[#1a3a6c] to-[#0a1528] flex flex-col items-center justify-center border-y border-r border-white/20 cursor-pointer group shadow-[10px_0_30px_rgba(0,0,0,0.5)]">
              <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
              <div className="relative z-10 flex flex-col items-center gap-6 text-center">
                  <div className="w-24 h-24 border-2 border-fuchsia-500/50 rounded-full flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(217,70,239,0.3)] animate-pulse"><svg className="w-12 h-12 text-fuchsia-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2L2 7L12 12L22 7L12 2Z" /><path d="M2 17L12 22L22 17" /><path d="M2 12L17L22 12" /></svg></div>
                  <h2 className="text-white font-anton text-4xl tracking-[0.2em] px-10 leading-tight uppercase">TECHNICAL<br/><span className="text-fuchsia-500 drop-shadow-[0_0_10px_rgba(217,70,239,0.5)]">MODULES</span></h2>
                  <div className="h-px w-20 bg-white/20 my-4"></div>
                  <p className="text-fuchsia-400 font-mono text-[10px] tracking-[0.4em] uppercase opacity-70 group-hover:opacity-100 transition-opacity">Click to view modules</p>
              </div>
              <div className="absolute left-0 top-0 bottom-0 w-6 bg-black/40 shadow-inner"></div>
            </div>
            <div className="page-back bg-[#0a1e3d] border-y border-l border-white/5 shadow-[5px_0_15px_rgba(0,0,0,0.5)]">
              <div className="w-full h-full flex items-center justify-center p-8 relative">
                <div className="relative w-full aspect-square bg-white p-4 shadow-2xl transform rotate-[2deg]">
                   <div className="w-full h-[85%] bg-gray-200 overflow-hidden mb-2"><img src={MODULES_DATA[0].imageUrl} className="w-full h-full object-cover grayscale-[0.2]" alt="Module 1 Visual" /></div>
                   <div className="font-space text-black text-[10px] font-bold text-center opacity-70 uppercase tracking-widest">{MODULES_DATA[0].name}</div>
                </div>
                <button onClick={handlePrevPage} className="absolute bottom-4 left-4 w-12 h-12 flex items-center justify-center bg-white/10 border border-white/20 rounded-full hover:bg-cyan-500 hover:text-white transition-all shadow-xl group"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg></button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODULE CARDS SECTION */}
      <section className="w-full shrink-0 max-w-7xl mx-auto py-32 px-6 flex flex-col items-center gap-16 relative overflow-visible z-10">
        <div className="flex flex-col items-center text-center gap-4">
          <div className="h-px w-24 bg-gradient-to-r from-transparent via-fuchsia-500 to-transparent"></div>
          <h3 className="text-4xl md:text-7xl font-anton text-white tracking-widest uppercase">
            EXPLORE <span className="text-fuchsia-500 drop-shadow-[0_0_15px_rgba(217,70,239,0.4)]">ALL_UNITS</span>
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 w-full mb-32">
          {MODULES_DATA.map((module, idx) => (
            <div 
              key={module.id} 
              className={`group relative bg-[#0c0c0c]/60 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 transition-all duration-700 flex flex-col items-center overflow-hidden hover:-translate-y-2 hover:border-white/30 card-glow-${module.color}`}
            >
              <div className={`absolute top-0 right-0 w-32 h-32 bg-${module.color}-500/10 blur-[60px] rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-${module.color}-500/20 transition-all duration-700`}></div>
              
              <div className="relative mb-8 p-6 bg-white/5 rounded-3xl group-hover:bg-white/10 transition-colors duration-500">
                <ModuleIcon type={module.icon} color={module.color} className="w-12 h-12" />
              </div>

              <h4 className="text-2xl font-anton text-white mb-4 tracking-widest uppercase text-center group-hover:text-fuchsia-400 transition-colors duration-500 leading-tight">
                {module.name}
              </h4>

              <p className="text-gray-400 text-sm font-space leading-relaxed text-center opacity-70 group-hover:opacity-100 transition-opacity mb-8 line-clamp-3">
                {module.tagline}
              </p>

              <button 
                onClick={() => handleViewModuleDetails(idx)}
                className={`w-full py-4 bg-[#0a1528]/80 border border-white/10 text-white font-orbitron tracking-[0.3em] text-[11px] font-bold rounded-2xl hover:bg-white hover:text-black transition-all duration-500 uppercase shadow-lg group-hover:shadow-${module.color}-500/20 group-hover:scale-[1.02]`}
              >
                VIEW MODULE
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* INTERACTIVE FOOTER BANNER - ENSURED CORRECT STACKING AND VISIBILITY */}
      <section ref={footerRef} id="footer-banner" className="h-[75vh] shrink-0 w-full relative overflow-hidden flex flex-col items-center justify-center py-4 px-4 transition-all duration-500 bg-black z-[100]">
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_40%,rgba(139,92,246,0.15)_0%,transparent_50%),radial-gradient(circle_at_80%_60%,rgba(34,211,238,0.15)_0%,transparent_50%)] opacity-80 animate-nebula-pulse"></div>
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-40"></div>
          <div className="absolute right-[10%] top-1/2 -translate-y-1/2 w-[40vw] h-[40vw] flex items-center justify-center">
            <div className="absolute w-[110%] h-[110%] rounded-full border border-fuchsia-500/10 blur-xl animate-lensing-pulse"></div>
            <div className="absolute w-[105%] h-[105%] rounded-full border border-cyan-400/5 blur-md"></div>
            <div className="absolute w-[140%] h-[35%] bg-gradient-to-r from-transparent via-orange-500/60 to-transparent blur-[40px] rotate-[25deg] animate-accretion-spin"></div>
            <div className="absolute w-[130%] h-[15%] bg-gradient-to-r from-transparent via-white/40 to-transparent blur-[15px] rotate-[25deg] animate-accretion-spin-reverse opacity-80"></div>
            <div className="relative w-[18vw] h-[18vw] bg-black rounded-full shadow-[0_0_100px_rgba(0,0,0,1)] z-10">
              <div className="absolute inset-0 rounded-full shadow-[inset_0_0_30px_rgba(255,165,0,0.4)]"></div>
            </div>
          </div>
          <div className="absolute left-[15%] top-1/2 -translate-y-1/2 w-48 h-32 animate-shuttle-drift">
            <div className="relative w-full h-full animate-shuttle-spin">
              <svg viewBox="0 0 200 100" className="w-full h-full drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]">
                <path d="M 20 50 L 50 30 L 140 30 L 170 50 L 140 70 L 50 70 Z" fill="#1a1a1a" stroke="#444" strokeWidth="1" />
                <path d="M 50 30 L 70 10 L 130 10 L 140 30 Z" fill="#222" />
                <rect x="145" y="45" width="15" height="10" rx="2" fill="rgba(34,211,238,0.6)" />
                <path d="M 60 30 L 40 15 L 100 15 L 110 30" fill="#111" />
                <path d="M 60 70 L 40 85 L 100 85 L 110 70" fill="#111" />
                <rect x="15" y="42" width="10" height="16" fill="#333" />
              </svg>
              <div className="absolute -left-6 top-1/2 -translate-y-1/2 w-10 h-10 bg-cyan-400 blur-xl opacity-0 animate-thruster-pulse"></div>
              <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full blur-sm opacity-0 animate-thruster-pulse delay-75"></div>
            </div>
          </div>
        </div>
        <div className="relative z-10 flex flex-col items-center justify-center text-center max-w-full w-full flex-1 group/footer overflow-hidden">
          <div className={`absolute left-1/2 -translate-x-1/2 pointer-events-none select-none transition-all duration-1000 ease-[cubic-bezier(0.19,1,0.22,1)] ${isYearForward ? 'z-20 opacity-100 blur-0 text-fuchsia-400 drop-shadow-[0_0_80px_rgba(217,70,239,1)] scale-[1.15]' : 'z-0 opacity-70 blur-[3px] text-fuchsia-500/70 drop-shadow-[0_0_20px_rgba(217,70,239,0.3)] scale-100'} top-[40%] md:top-[38%] translate-y-0`}>
            <span className="text-[12vw] md:text-[10rem] font-anton tracking-[0.05em] leading-none inline-block scale-x-[1.3] scale-y-[1.8] transform origin-center">2026</span>
          </div>
          <h2 onMouseEnter={handleYearTrigger} className="relative z-10 text-[28vw] md:text-[23vw] font-anton text-white leading-none tracking-[-0.04em] drop-shadow-[0_10px_80px_rgba(0,0,0,0.8)] transition-all duration-1000 hover:scale-[1.03] cursor-default px-6 md:px-12 w-full text-center -translate-y-10 md:-translate-y-20">YANTRAKSH</h2>
          <div className="absolute bottom-4 left-0 right-0 flex flex-col items-center gap-4">
            <span className="text-white text-xs md:text-lg font-anton tracking-[0.4em] uppercase opacity-90 drop-shadow-lg">OUR SOCIAL HANDLES</span>
            <div className="flex flex-wrap justify-center gap-5 md:gap-8 items-center">
              <a href="#" className="text-white hover:text-fuchsia-500 transition-all duration-300 hover:scale-125"><svg className="w-5 h-5 md:w-7 md:h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849s-.011 3.585-.069 4.85c-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07s-3.584-.012-4.849-.07c-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849s.012-3.584.07-4.849c.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948s.014 3.667.072 4.947c.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072s3.667-.014 4.947-.072c4.358-.2 6.78-2.618 6.98-6.98.058-1.28.072-1.689.072-4.948s-.014-3.667-.072-4.947c-.2-4.358-2.618-6.78-6.98-6.98-1.28-.058-1.689-.072-4.948-.072zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg></a>
              <a href="#" className="text-white hover:text-blue-500 transition-all duration-300 hover:scale-125"><svg className="w-5 h-5 md:w-7 md:h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.04c-5.5 0-10 4.5-10 10.04 0 5 3.66 9.14 8.44 9.88v-6.99h-2.54v-2.89h2.54v-2.2c0-2.5 1.52-3.89 3.77-3.89 1.08 0 2.2.19 2.2.19v2.43h-1.24c-1.24 0-1.63.77-1.63 1.56v1.91h2.74l-.44 2.89h-2.3v6.99c4.78-.74 8.44-4.88 8.44-9.88 0-5.54-4.5-10.04-10-10.04z"/></svg></a>
              <a href="#" className="text-white hover:text-gray-400 transition-all duration-300 hover:scale-125"><svg className="w-5 h-5 md:w-7 md:h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg></a>
              <a href="#" className="text-white hover:text-blue-600 transition-all duration-300 hover:scale-125"><svg className="w-5 h-5 md:w-7 md:h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg></a>
              <a href="#" className="text-white hover:text-[#FF4500] transition-all duration-300 hover:scale-125"><svg className="w-5 h-5 md:w-7 md:h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M24 11.5c0-1.65-1.35-3-3-3-.4 0-.78.08-1.13.23-1.64-1.16-3.87-1.9-6.31-1.97l1.43-4.52 3.93.84c.01 1.1.91 1.98 2 1.98 1.1 0 2-.9 2-2s-.9-2-2-2c-.78 0-1.47.44-1.81 1.1l-4.47-.96c-.22-.05-.44.09-.51.3l-1.67 5.27c-2.48.04-4.77.79-6.44 1.97-.35-.15-.73-.23-1.13-.23-1.65 0-3 1.35-3 3 0 1.25.77 2.33 1.86 2.77-.04.24-.06.48-.06.73 0 3.31 3.58 6 8 6s8-2.69 8-6c0-.25-.02-.48-.06-.72 1.09-.44 1.86-1.52 1.86-2.78zM7 13.5c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zm9.73 4.81c-.6.6-1.55.91-2.73.91s-2.13-.31-2.73-.91c-.2-.2-.2-.51 0-.71.2-.2.51-.2.71 0 .4.4 1.14.6 2.02.6s1.62-.2 2.02-.6c.2-.2.51-.2.71 0 .2.2.2.51 0 .71zM15 15.5c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/></svg></a>
              <a href="#" className="text-white hover:text-red-600 transition-all duration-300 hover:scale-125"><svg className="w-5 h-5 md:w-7 md:h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.612 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg></a>
              <a href="mailto:contact@yantraksh.org" className="text-white hover:text-fuchsia-500 transition-all duration-300 hover:scale-125"><svg className="w-5 h-5 md:w-7 md:h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg></a>
            </div>
            <p className="text-gray-500 text-[8px] md:text-[9px] uppercase tracking-[0.3em] font-space opacity-50">made in collaboration of Lotus_Proton_6 & REET</p>
          </div>
        </div>
      </section>

      <div className="w-full pb-0 shrink-0 text-center opacity-10">
        <span className="text-[9px] font-mono tracking-[1.5em] text-white uppercase">YANTRAKSH // END OF TRANSMISSION</span>
      </div>

      {/* AMBIENT BG */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-5">
        <div className="absolute top-[-10%] left-[-10%] w-[1000px] h-[1000px] bg-emerald-900/10 blur-[180px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[1000px] h-[1000px] bg-fuchsia-900/10 blur-[180px] rounded-full"></div>
      </div>
    </div>
  );
};

export default Modules;