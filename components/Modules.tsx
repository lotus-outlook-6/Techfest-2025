
import React, { useState, useRef, useEffect } from 'react';

interface ModuleData {
  id: string;
  name: string;
  shortDesc: string;
  longDesc: string;
  status: 'ACTIVE' | 'STABLE' | 'INIT' | 'ENCRYPTED';
  color: string;
  icon: string;
  imageUrl: string;
}

const MODULES_DATA: ModuleData[] = [
  {
    id: "M_01",
    name: "COMPETITIVE CODING",
    shortDesc: "Algorithmic showdowns and logic optimization.",
    longDesc: "The ultimate test of speed and efficiency. Solve complex algorithmic challenges under tight constraints using C++, Python, or Java.",
    status: "ACTIVE",
    color: "cyan",
    icon: "code",
    imageUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: "M_02",
    name: "ROBO WAR/RACE",
    shortDesc: "Mechanical combat and high-speed kinetics.",
    longDesc: "Enter the arena where steel meets speed. From heavy-duty combat robots to agile racers traversing treacherous obstacle courses.",
    status: "ACTIVE",
    color: "fuchsia",
    icon: "robot",
    imageUrl: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: "M_03",
    name: "IMAGE PROMPTING",
    shortDesc: "Generative AI and creative directives.",
    longDesc: "Master the art of the prompt. Use cutting-edge generative models to synthesize visual masterpieces from textual instructions.",
    status: "STABLE",
    color: "orange",
    icon: "image",
    imageUrl: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: "M_04",
    name: "CYBER ESCAPE ROOM",
    shortDesc: "Cryptography puzzles and network infiltration.",
    longDesc: "A race against the clock. Decrypt files, bypass firewalls, and solve digital riddles to secure your exit from a locked virtual environment.",
    status: "INIT",
    color: "blue",
    icon: "security",
    imageUrl: "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: "M_05",
    name: "SUSTAINABLE AGRI",
    shortDesc: "Sustainable tech for the future of farming.",
    longDesc: "Precision and Sustainable Agriculture. Explore IOT sensors, drone mapping, and automated systems designed to revolutionize modern food production.",
    status: "STABLE",
    color: "lime",
    icon: "leaf",
    imageUrl: "https://images.unsplash.com/photo-1560493676-04071c5f467b?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: "M_06",
    name: "TECH DEBATE",
    shortDesc: "Discourse on the ethics of innovation.",
    longDesc: "The clash of ideas. Defend or challenge the socio-economic impacts of emerging technologies like AGI, Bio-hacking, and Space Privatization.",
    status: "ENCRYPTED",
    color: "red",
    icon: "debate",
    imageUrl: "https://images.unsplash.com/photo-1475721027785-f74dea327912?q=80&w=1000&auto=format&fit=crop"
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
  
  // activePage states:
  // -1: Closed (Front Cover centered)
  // 0...6: Index of the current sheet flipped.
  // When activePage = 6, book is closed at the back (Archive Secured).
  const [activePage, setActivePage] = useState(-1); 

  const scrollToContent = () => contentRef.current?.scrollIntoView({ behavior: 'smooth' });

  // Auto reset to front cover after 5 seconds of being at the back cover
  useEffect(() => {
    if (activePage === 6) {
      const timer = setTimeout(() => {
        setActivePage(-1);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [activePage]);

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

  const getContainerTranslation = () => {
    if (activePage === -1) return 'translateX(-200px)'; // Center front cover
    if (activePage === 6) return 'translateX(200px)';   // Center back cover
    return 'translateX(0)'; // Center spine when open
  };

  const letters = "YANTRAKSH".split("");
  const directions = ["top", "bottom", "left", "right", "top", "bottom", "left", "right", "top"];

  return (
    <div className="w-full h-full flex flex-col items-center overflow-y-auto overflow-x-hidden no-scrollbar scroll-smooth">
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
      <div id="module-book-content" ref={contentRef} className="min-h-screen w-full flex flex-col items-center justify-center py-20 px-6 perspective-[2000px] overflow-visible">
        
        <div 
          className="book-container"
          style={{ transform: getContainerTranslation() }}
        >
          {/* SHEET 6 (Last Sheet): Front = Module 6 Details, Back = Back Cover UI */}
          <div className={`book-page ${activePage >= 6 ? 'flipped' : ''}`} style={{ zIndex: activePage >= 6 ? 56 : 94, pointerEvents: activePage === 5 || activePage === 6 ? 'auto' : 'none' }}>
            {/* Front: Tech Debate (M6) Details */}
            <div className="page-front bg-[#0d1b31] border-y border-r border-white/5 shadow-[-5px_0_15px_rgba(0,0,0,0.5)]">
               <div className="page-shadow"></div>
               <div className="w-full h-full flex flex-col items-center p-8 text-center relative pt-16">
                  <div className="w-20 h-20 mb-6 bg-red-500/5 rounded-full p-4 flex items-center justify-center shadow-[0_0_20px_rgba(239,68,68,0.1)]">
                     <ModuleIcon type={MODULES_DATA[5].icon} color={MODULES_DATA[5].color} className="w-full h-full" />
                  </div>
                  <h3 className="text-3xl font-anton text-white mb-2 tracking-widest uppercase">{MODULES_DATA[5].name}</h3>
                  <p className="text-gray-400 text-sm font-space max-w-xs mb-4 opacity-80 leading-relaxed overflow-hidden line-clamp-4">{MODULES_DATA[5].longDesc}</p>
                  <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-full flex justify-center px-8">
                     <button className="w-full max-w-[240px] py-5 bg-[#0a1528]/80 border-2 border-red-500/40 text-white font-anton tracking-[0.3em] text-sm rounded-[2.5rem] hover:bg-red-500 hover:border-red-500 transition-all duration-300 shadow-[0_0_30px_rgba(239,68,68,0.2)] uppercase">
                       FILL_FORM
                     </button>
                  </div>
                  <button onClick={handleNextPage} className="absolute bottom-4 right-4 w-12 h-12 flex items-center justify-center bg-white/5 border border-white/10 rounded-full hover:bg-fuchsia-500 hover:text-white transition-all shadow-lg group">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
               </div>
            </div>
            {/* Back: Back Cover (Archive Secured) */}
            <div className="page-back bg-[#0a1528] border-y border-l border-white/20 shadow-[5px_0_15px_rgba(0,0,0,0.5)]">
               <div className="w-full h-full flex flex-col items-center justify-center p-10 relative">
                  <div className="flex flex-col items-center gap-6 text-center">
                     <div className="w-20 h-20 border-2 border-fuchsia-500/30 rounded-full flex items-center justify-center mb-4">
                        <svg className="w-10 h-10 text-fuchsia-500/60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2L2 7L12 12L22 7L12 2Z" /><path d="M2 17L12 22L22 17" /><path d="M2 12L17L22 12" /></svg>
                     </div>
                     <h4 className="text-white font-anton text-4xl tracking-[0.2em] uppercase opacity-70 leading-none">ARCHIVE<br/>SECURED</h4>
                     <div className="flex gap-1 h-12 items-end mb-4 opacity-40">
                       {[...Array(16)].map((_, i) => (
                         <div key={i} className="bg-white" style={{ width: `${Math.random() * 3 + 1}px`, height: `${Math.random() * 40 + 40}%` }}></div>
                       ))}
                     </div>
                  </div>
                  <button onClick={handlePrevPage} className="absolute bottom-4 left-4 w-12 h-12 flex items-center justify-center bg-white/10 border border-white/20 rounded-full hover:bg-cyan-500 hover:text-white transition-all shadow-xl group">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                  </button>
               </div>
            </div>
          </div>

          {/* SHEETS 1-5: Front = Module N Details, Back = Module N+1 Image */}
          {[1, 2, 3, 4, 5].slice().reverse().map((sheetId) => {
            const moduleIndex = sheetId - 1; // 0..4
            const module = MODULES_DATA[moduleIndex];
            const nextModule = MODULES_DATA[moduleIndex + 1];
            const isFlipped = activePage >= sheetId;
            const zIndex = isFlipped ? (sheetId + 50) : (100 - sheetId);
            const canInteract = (activePage === moduleIndex || activePage === sheetId);

            return (
              <div 
                key={`sheet-${sheetId}`}
                className={`book-page ${isFlipped ? 'flipped' : ''}`}
                style={{ zIndex, pointerEvents: canInteract ? 'auto' : 'none' }}
              >
                {/* Front face: Current Module Details */}
                <div className="page-front bg-[#0d1b31] border-y border-r border-white/5 shadow-[-5px_0_15px_rgba(0,0,0,0.5)]">
                  <div className="page-shadow"></div>
                  <div className="w-full h-full flex flex-col items-center p-8 text-center relative pt-16">
                     <div className={`w-20 h-20 mb-6 bg-${module.color}-500/5 rounded-full p-4 flex items-center justify-center shadow-[0_0_20px_rgba(0,0,0,0.1)]`}>
                        <ModuleIcon type={module.icon} color={module.color} className="w-full h-full" />
                     </div>
                     <h3 className="text-3xl font-anton text-white mb-2 tracking-widest uppercase shrink-0">{module.name}</h3>
                     <p className="text-gray-400 text-sm font-space max-w-xs mb-4 opacity-80 leading-relaxed overflow-hidden line-clamp-4">{module.longDesc}</p>
                     <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-full flex justify-center px-8">
                        <button className="w-full max-w-[240px] py-5 bg-[#0a1528]/80 border-2 border-fuchsia-500/40 text-white font-anton tracking-[0.3em] text-sm rounded-[2.5rem] hover:bg-fuchsia-500 hover:border-fuchsia-500 transition-all duration-300 shadow-[0_0_30px_rgba(217,70,239,0.2)] uppercase">
                          FILL_FORM
                        </button>
                     </div>
                     <button onClick={handleNextPage} className="absolute bottom-4 right-4 w-12 h-12 flex items-center justify-center bg-white/5 border border-white/10 rounded-full hover:bg-fuchsia-500 hover:text-white transition-all shadow-lg group">
                       <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                     </button>
                  </div>
                </div>

                {/* Back face: Next Module Image */}
                <div className="page-back bg-[#0a1e3d] border-y border-l border-white/5 shadow-[5px_0_15px_rgba(0,0,0,0.5)]">
                  <div className="w-full h-full flex items-center justify-center p-8 relative">
                    <div className="relative w-full aspect-square bg-white p-4 shadow-2xl transform rotate-[-3deg]">
                       <div className="w-full h-[85%] bg-gray-200 overflow-hidden mb-2">
                         <img src={nextModule.imageUrl} className="w-full h-full object-cover grayscale-[0.2]" alt="Module Visual" />
                       </div>
                       <div className="font-space text-black text-[10px] font-bold text-center opacity-70 uppercase tracking-widest">{nextModule.name}</div>
                    </div>
                    <button onClick={handlePrevPage} className="absolute bottom-4 left-4 w-12 h-12 flex items-center justify-center bg-white/10 border border-white/20 rounded-full hover:bg-cyan-500 hover:text-white transition-all shadow-xl group">
                       <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {/* SHEET 0: Front = Cover UI, Back = Module 1 Image */}
          <div className={`book-page ${activePage >= 0 ? 'flipped' : ''}`} style={{ zIndex: activePage >= 0 ? 50 : 200, pointerEvents: activePage === -1 || activePage === 0 ? 'auto' : 'none' }}>
            {/* Front: Technical Modules Cover */}
            <div onClick={handleOpenBook} className="page-front bg-gradient-to-br from-[#1a3a6c] to-[#0a1528] flex flex-col items-center justify-center border-y border-r border-white/20 cursor-pointer group shadow-[10px_0_30px_rgba(0,0,0,0.5)]">
              <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
              <div className="relative z-10 flex flex-col items-center gap-6 text-center">
                  <div className="w-24 h-24 border-2 border-fuchsia-500/50 rounded-full flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(217,70,239,0.3)] animate-pulse">
                     <svg className="w-12 h-12 text-fuchsia-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2L2 7L12 12L22 7L12 2Z" /><path d="M2 17L12 22L22 17" /><path d="M2 12L17L22 12" /></svg>
                  </div>
                  <h2 className="text-white font-anton text-4xl tracking-[0.2em] px-10 leading-tight uppercase">TECHNICAL<br/><span className="text-fuchsia-500 drop-shadow-[0_0_10px_rgba(217,70,239,0.5)]">MODULES</span></h2>
                  <div className="h-px w-20 bg-white/20 my-4"></div>
                  <p className="text-fuchsia-400 font-mono text-[10px] tracking-[0.4em] uppercase opacity-70 group-hover:opacity-100 transition-opacity">Click to view modules</p>
              </div>
              <div className="absolute left-0 top-0 bottom-0 w-6 bg-black/40 shadow-inner"></div>
            </div>
            
            {/* Back: Module 1 Image (Visible on LEFT stack once opened) */}
            <div className="page-back bg-[#0a1e3d] border-y border-l border-white/5 shadow-[5px_0_15px_rgba(0,0,0,0.5)]">
              <div className="w-full h-full flex items-center justify-center p-8 relative">
                <div className="relative w-full aspect-square bg-white p-4 shadow-2xl transform rotate-[2deg]">
                   <div className="w-full h-[85%] bg-gray-200 overflow-hidden mb-2">
                     <img src={MODULES_DATA[0].imageUrl} className="w-full h-full object-cover grayscale-[0.2]" alt="Module 1 Visual" />
                   </div>
                   <div className="font-space text-black text-[10px] font-bold text-center opacity-70 uppercase tracking-widest">{MODULES_DATA[0].name}</div>
                </div>
                <button onClick={handlePrevPage} className="absolute bottom-4 left-4 w-12 h-12 flex items-center justify-center bg-white/10 border border-white/20 rounded-full hover:bg-cyan-500 hover:text-white transition-all shadow-xl group">
                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* INTERFACE DECORATION */}
        <div className="mt-20 flex flex-col items-center gap-2 opacity-30 pointer-events-none">
            <div className="flex gap-2">
              {[...Array(3)].map((_, i) => <div key={i} className="w-1 h-1 bg-fuchsia-500 rounded-full animate-pulse" style={{ animationDelay: `${i * 0.3}s` }}></div>)}
            </div>
            <span className="text-[8px] font-mono tracking-[1em] text-white uppercase">DIGITAL_BOOK_INTERFACE_v4.2</span>
        </div>
      </div>
    </div>
  );
};

export default Modules;
