
import React, { useState, useRef, useEffect } from 'react';

interface EventItem {
  id: string;
  category: string;
  title: string;
  desc: string;
  items: string[];
  color: string;
  img: string;
  hoverTextPrefix?: string;
  hoverTextSuffix?: string;
}

const CORE_EVENTS: EventItem[] = [
  {
    id: "E_02",
    category: "TechExpo",
    title: "PROJECT HUB",
    desc: "A showcase of engineering ingenuity. Witness prototypes that bridge the gap between imagination and reality.",
    items: ["Poster Presentation", "Project Exhibition", "Prototyping Arena"],
    color: "cyan",
    img: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1470&auto=format&fit=crop"
  },
  {
    id: "E_03",
    category: "E-Sports",
    title: "GAMING ARENA",
    desc: "The battlefield for digital warriors. High-stakes competition across the most popular titles.",
    items: ["BGMI Tournament", "FIFA 25 Cup", "MOBA Legends 5v5"],
    color: "red",
    img: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1470&auto=format&fit=crop"
  },
  {
    id: "E_04",
    category: "Cultural",
    title: "STAGE WARS",
    desc: "Where rhythm meets raw talent. A celebration of dance, music, and the creative spirit.",
    items: ["Singing Battle", "Dance Battle", "Band Battle", "Meme Craft"],
    color: "orange",
    img: "https://images.unsplash.com/photo-1688820661462-a44e4b2770e8?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  },
  {
    id: "E_05",
    category: "School Maestro",
    title: "YOUTH CHALLENGE",
    desc: "Inspiring the next generation. A dedicated platform for budding talent from schools across the region.",
    items: ["Tech Quiz", "Drawing Master", "Taal Tarang", "Sur Sangam"],
    color: "lime",
    img: "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1470&auto=format&fit=crop"
  },
  {
    id: "E_06",
    category: "Community",
    title: "SOCIAL REACH",
    desc: "Tech for good. Projects and initiatives focused on sustainability, awareness, and community growth.",
    items: ["Cyber Awareness", "Career Counselling", "Cleanliness Drive", "Mental Health"],
    color: "blue",
    img: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1484&auto=format&fit=crop"
  }
];

const MEGA_EVENTS: EventItem[] = [
  {
    id: "H_01",
    category: "SOTx",
    title: "THE FUTURE TALKS",
    desc: "High-level technical symposium featuring visionary lectures from industry veterans in CSE, ECE, and AE.",
    items: ["Cloud Architecture", "Quantum Computing", "Next-Gen Aerospace"],
    color: "red",
    img: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=1412&auto=format&fit=crop",
    hoverTextPrefix: "SOT",
    hoverTextSuffix: "X"
  },
  {
    id: "H_02",
    category: "Yantraksh Night",
    title: "STARLIT GALA",
    desc: "An electric evening featuring open mic standup, professional artists, and live bands.",
    items: ["Standup Comedy", "Live Band Performances", "Celebrity DJ Sets"],
    color: "purple",
    img: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1470&auto=format&fit=crop",
    hoverTextPrefix: "STARLIT",
    hoverTextSuffix: "GALA"
  },
  {
    id: "H_03",
    category: "SunBurn",
    title: "MUSICAL INFERNO",
    desc: "A massive cultural music fest featuring unparalleled energy, light shows, and the hottest tracks.",
    items: ["EDM Festival", "Cultural Extravaganza", "Laser Light Show"],
    color: "pink",
    img: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1470&auto=format&fit=crop",
    hoverTextPrefix: "SUN",
    hoverTextSuffix: "BURN"
  }
];

const Events: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const timerRef = useRef<number | null>(null);
  const megaSectionRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLElement>(null);
  
  const [isYearForward, setIsYearForward] = useState(false);
  const yearResetTimer = useRef<number | null>(null);

  const startAutoRotation = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = window.setInterval(() => {
      setActiveIndex(prev => (prev + 1) % CORE_EVENTS.length);
    }, 4500);
  };

  useEffect(() => {
    startAutoRotation();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

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

  const handlePanelClick = (index: number) => {
    setActiveIndex(index);
    startAutoRotation();
  };

  return (
    <div className="w-full h-full bg-transparent overflow-y-auto overflow-x-hidden scroll-smooth select-none relative">
      <style>{`
        @keyframes panel-glow {
          0%, 100% { border-color: rgba(217, 70, 239, 0.05); box-shadow: 0 0 10px rgba(217, 70, 239, 0.05); }
          50% { border-color: rgba(217, 70, 239, 0.3); box-shadow: 0 0 25px rgba(217, 70, 239, 0.15); }
        }
        .animate-panel-glow { animation: panel-glow 4s infinite ease-in-out; }
        .perspective-box { perspective: 2500px; transform-style: preserve-3d; }
        .blade-transition { transition: all 1.1s cubic-bezier(0.19, 1, 0.22, 1); }
        .mega-card-glow:hover { box-shadow: 0 0 40px rgba(217, 70, 239, 0.08); }
        
        .flip-card { perspective: 1000px; cursor: pointer; }
        .flip-card-inner { position: relative; width: 100%; height: 100%; transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1); transform-style: preserve-3d; }
        .flip-card:hover .flip-card-inner { transform: rotateY(180deg); }
        .flip-card-front, .flip-card-back { position: absolute; width: 100%; height: 100%; -webkit-backface-visibility: hidden; backface-visibility: hidden; display: flex; items-center justify-center rounded-2xl overflow-hidden; }
        .flip-card-back { transform: rotateY(180deg); }

        .logo-hover-reveal { opacity: 0; transform: scale(0.9); transition: all 0.6s cubic-bezier(0.19, 1, 0.22, 1); }
        .group:hover .logo-hover-reveal { opacity: 1; transform: scale(1.1); filter: brightness(1.2) contrast(1.1); }

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

      <section className="min-h-screen w-full shrink-0 flex flex-col items-center justify-start relative px-6 md:px-16 pt-12 md:pt-16 overflow-x-hidden">
        <div className="text-center z-10 mb-16 md:mb-24 transition-all duration-700">
          <h2 className="text-5xl md:text-8xl font-anton tracking-[0.05em] text-white uppercase opacity-95 leading-tight">
            YANTRAKSH <span className="text-fuchsia-500 drop-shadow-[0_0_15px_#d946ef]">EVENTS</span>
          </h2>
        </div>

        <div className="w-full max-w-7xl flex flex-col items-center overflow-visible">
            {/* Height optimized for mobile to prevent text clipping */}
            <div className="relative w-full h-[48vh] md:h-[42vh] flex items-center justify-center perspective-box mb-12 overflow-visible">
              <div className="relative w-full h-full flex items-center justify-center gap-0 overflow-visible max-w-[100vw]">
                {CORE_EVENTS.map((event, idx) => {
                  const isActive = activeIndex === idx;
                  const isMobile = window.innerWidth < 768;
                  const isTablet = window.innerWidth < 1024;
                  
                  let rotateY = 0, translateZ = 0, translateX = 0, scale = 1, opacity = 1;
                  const activeWidthMobile = 290; // Increased from 256 for better mobile fit
                  const activeWidthTablet = 480;
                  const activeWidthDesktop = 650;
                  
                  if (isActive) {
                    translateZ = isMobile ? 120 : 180;
                    opacity = 1;
                    scale = 0.98;
                  } else {
                    const offset = idx - activeIndex;
                    const halfWidth = isMobile ? activeWidthMobile / 2 : (isTablet ? activeWidthTablet / 2 : activeWidthDesktop / 2);
                    const initialGap = isMobile ? 35 : 85; 
                    const baseOffset = halfWidth + initialGap;
                    translateX = (offset < 0 ? -baseOffset : baseOffset) + (offset * (isMobile ? 25 : 110));
                    rotateY = (offset < 0 ? (isMobile ? 45 : 35) : (isMobile ? -45 : -35));
                    translateZ = isMobile ? -120 : -180;
                    opacity = isMobile ? 0.6 : 1; 
                  }
                  
                  return (
                    <div
                      key={event.id}
                      onClick={() => handlePanelClick(idx)}
                      className={`blade-transition absolute h-full cursor-pointer rounded-2xl border border-white/5 overflow-hidden bg-black/50 backdrop-blur-xl pointer-events-auto ${isActive ? `animate-panel-glow w-[290px] md:w-[480px] lg:w-[650px] z-50` : 'w-12 md:w-16 lg:w-24 z-10'}`}
                      style={{ transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`, opacity }}
                    >
                      <img src={event.img} className={`absolute inset-0 w-full h-full object-cover transition-all duration-[2s] ${isActive ? 'grayscale-0 scale-100 opacity-100' : 'opacity-40 hover:opacity-100 grayscale-0'}`} alt={event.title} />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-95"></div>
                      
                      {/* Vertical Side Category Tag */}
                      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-[-90deg] whitespace-nowrap transition-all duration-500 ${isActive ? 'opacity-0 scale-50' : 'opacity-100'}`}>
                        <span className="text-[14px] md:text-xl font-anton tracking-[0.2em] text-white/60 uppercase">{event.category}</span>
                      </div>

                      {/* Content Container - Optimized for mobile padding and scale */}
                      <div className={`absolute bottom-0 left-0 w-full p-8 md:p-10 transition-all duration-1000 ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                        <h3 className="text-3xl md:text-4xl font-anton text-white uppercase leading-none mb-3 tracking-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">{event.title}</h3>
                        <p className="text-gray-300 text-xs md:text-sm font-space max-w-md opacity-90 leading-relaxed drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">
                          {event.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
        </div>
        <div className="mt-4 mb-12 animate-bounce opacity-40 cursor-pointer z-20 hover:opacity-100 transition-opacity" onClick={() => megaSectionRef.current?.scrollIntoView({ behavior: 'smooth' })}>
          <svg className="w-10 h-10 drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
        </div>
      </section>

      <section ref={megaSectionRef} className="min-h-screen w-full shrink-0 bg-[#050505] py-24 px-6 md:px-20 relative border-t border-fuchsia-500/10 overflow-x-hidden">
        <div className="max-w-7xl mx-auto flex flex-col items-center">
          <div className="text-center mb-16">
            <h3 className="text-4xl md:text-6xl font-anton tracking-tighter text-white uppercase opacity-95">
              MEGA <span className="text-fuchsia-500">HEADLINERS</span>
            </h3>
            <div className="h-0.5 w-24 bg-gradient-to-r from-transparent via-fuchsia-500 to-transparent mx-auto mt-4 opacity-40"></div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 w-full">
            {MEGA_EVENTS.map((event) => (
              <div key={event.id} className="group relative h-[500px] rounded-[2.5rem] overflow-hidden border border-white/5 bg-[#0a0a0a] mega-card-glow transition-all duration-1000 hover:-translate-y-4">
                <img src={event.img} className="absolute inset-0 w-full h-full object-cover transition-all duration-[1s] group-hover:scale-110 grayscale-0 group-hover:grayscale-[0.4] opacity-100 group-hover:opacity-30" alt={event.title} />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                    <div className={`logo-hover-reveal font-anton text-center leading-none tracking-tighter uppercase
                        ${event.id === 'H_01' ? 'text-[7.5rem] drop-shadow-[0_0_50px_rgba(220,38,38,0.7)]' : 
                          event.id === 'H_02' ? 'text-[5.5rem] drop-shadow-[0_0_50px_rgba(168,85,247,0.7)]' : 
                          'text-[5.5rem] drop-shadow-[0_0_50px_rgba(236,72,153,0.7)]'}
                    `}>
                        {event.id === 'H_01' ? (<><span className="text-white">SOT</span>{' '}<span className="text-red-600">X</span></>) : (<><span className="text-white opacity-40">{event.hoverTextPrefix}</span>{' '}<span className={`${event.id === 'H_02' ? 'text-purple-500' : 'text-pink-500'}`}>{event.hoverTextSuffix}</span></>)}
                    </div>
                </div>
                <div className="absolute inset-0 p-10 flex flex-col justify-end">
                   <div className="mb-4"><h4 className="text-3xl md:text-4xl font-anton text-white uppercase leading-none transition-colors tracking-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">{event.title}</h4></div>
                   <p className="text-gray-200 text-xs font-space leading-relaxed opacity-100 transition-all duration-700 drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]">{event.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-24 p-12 md:p-14 w-full rounded-[2.5rem] bg-gradient-to-br from-emerald-950/20 to-transparent border border-emerald-500/20 flex flex-col md:flex-row items-center justify-between gap-10 backdrop-blur-md relative overflow-hidden group/whatsapp shadow-[0_0_80px_rgba(16,185,129,0.05)]">
             <div className="absolute inset-0 bg-emerald-500/[0.02] pointer-events-none"></div>
             <div className="max-w-xl relative z-10">
                <h5 className="text-3xl md:text-5xl font-anton text-white uppercase mb-4 tracking-tight group-hover/whatsapp:text-emerald-400 transition-colors">JOIN US ON WHATSAPP</h5>
                <p className="text-gray-300 text-sm md:text-lg font-space opacity-80 leading-relaxed mb-8">Stay updated with real-time announcements, schedule changes, and exclusive insights from the core team.</p>
                <a href="https://whatsapp.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 px-8 py-4 bg-emerald-500 rounded-2xl text-white font-anton text-xl tracking-widest hover:bg-emerald-400 transition-all hover:scale-105 active:scale-95 shadow-[0_10px_30px_rgba(16,185,129,0.3)]">JOIN COMMUNITY<svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.246 2.248 3.484 5.232 3.483 8.413-.003 6.557-5.338 11.892-11.893 11.892-1.997-.001-3.951-.5-5.688-1.448l-6.308 1.654zm6.59-4.819c1.415.84 2.82 1.315 4.509 1.317 5.236 0 9.497-4.258 9.5-9.501 0-2.54-1.04-4.85-2.73-6.54-1.785-1.785-4.13-2.65-6.74-2.65-5.24 0-9.51 4.25-9.51 9.5 0 1.76.51 3.47 1.48 4.95l-.99 3.61 3.73-.98zm11.381-11.62c-.299-.15-1.762-.869-2.035-.968-.273-.099-.472-.148-.671.15-.199.299-.77 1.238-.944 1.437-.174.199-.348.223-.647.074-.3-.15-1.265-.467-2.41-1.485-.89-.795-1.492-1.777-1.666-2.076-.174-.3-.019-.462.13-.611.135-.133.3-.348.45-.522.148-.174.199-.298.299-.497.099-.198.05-.372-.025-.521-.075-.149-.672-1.62-.922-2.224-.243-.584-.492-.505-.672-.514-.174-.009-.373-.01-.572-.01-.199 0-.521.074-.795.372-.273.299-1.044 1.018-1.044 2.483 0 1.464 1.069 2.879 1.218 3.078.149.199 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.762-.719 2.011-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/></svg></a>
             </div>
             <div className="hidden md:flex flex-1 items-center justify-center opacity-40 group-hover/whatsapp:opacity-100 transition-opacity duration-700 group-hover/whatsapp:scale-110">
                <svg className="w-32 h-32 text-emerald-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.964 9.964 0 001.333 4.993L2 22l5.233-1.373a9.921 9.921 0 004.779 1.217h.004c5.505 0 9.988-4.478 9.989-9.984 0-2.669-1.037-5.176-2.922-7.062A9.925 9.925 0 0012.012 2zM12.011 20.29h-.003a8.253 8.253 0 01-4.21-1.156l-.303-.18-3.122.819.833-3.042-.196-.314a8.2 8.2 0 01-1.258-4.431c.001-4.558 3.713-8.27 8.271-8.27 2.209 0 4.286.86 5.848 2.42a8.214 8.214 0 012.42 5.852c-.002 4.558-3.714 8.272-8.272 8.272zm4.536-6.205c-.249-.124-1.472-.726-1.7-.808-.227-.083-.393-.124-.558.124-.165.248-.641.808-.785.972-.144.166-.29.185-.538.061-.248-.124-1.049-.387-1.998-1.234-.738-.658-1.236-1.471-1.381-1.72-.145-.248-.016-.382.109-.507.112-.112.248-.29.373-.435.124-.145.165-.248.248-.414.083-.165.042-.31-.02-.435-.063-.124-.558-1.345-.764-1.842-.2-.486-.404-.42-.558-.428-.145-.008-.31-.01-.476-.01-.165 0-.434.062-.661.31-.228.248-.869.849-.869 2.07 0 1.221.89 2.401 1.013 2.567.124.165 1.751 2.674 4.242 3.744.592.255 1.055.408 1.416.523.595.19 1.136.162 1.564.101.477-.067 1.472-.602 1.679-1.18.207-.579.207-1.076.144-1.181-.062-.103-.228-.165-.477-.289z"/></svg></div>
          </div>
        </div>
      </section>

      <section ref={footerRef} id="footer-banner" className="h-[75vh] w-full shrink-0 relative overflow-hidden flex flex-col items-center justify-center py-4 px-4 transition-all duration-500 bg-black z-[100] border-t border-fuchsia-500/10">
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_40%,rgba(139,92,246,0.15)_0%,transparent_50%),radial-gradient(circle_at_80%_60%,rgba(34,211,238,0.15)_0%,transparent_50%)] opacity-80 animate-nebula-pulse"></div>
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-40"></div>
          <div className="absolute right-[10%] top-1/2 -translate-y-1/2 w-[40vw] h-[40vw] flex items-center justify-center">
            <div className="absolute w-[110%] h-[110%] rounded-full border border-fuchsia-500/10 blur-xl animate-lensing-pulse"></div>
            <div className="absolute w-[105%] h-[105%] rounded-full border border-cyan-400/5 blur-md"></div>
            <div className="absolute w-[140%] h-[35%] bg-gradient-to-r from-transparent via-orange-500/60 to-transparent blur-[40px] rotate-[25deg] animate-accretion-spin"></div>
            <div className="absolute w-[130%] h-[15%] bg-gradient-to-r from-transparent via-white/40 to-transparent blur-[15px] rotate-[25deg] animate-accretion-spin opacity-80"></div>
            <div className="relative w-[18vw] h-[18vw] bg-black rounded-full shadow-[0_0_100px_rgba(0,0,0,1)] z-10"><div className="absolute inset-0 rounded-full shadow-[inset_0_0_30px_rgba(255,165,0,0.4)]"></div></div>
          </div>
        </div>
        <div className="relative z-10 flex flex-col items-center justify-center text-center max-w-full w-full flex-1 group/footer overflow-hidden">
          <div className={`absolute left-1/2 -translate-x-1/2 pointer-events-none select-none transition-all duration-1000 ease-[cubic-bezier(0.19,1,0.22,1)] ${isYearForward ? 'z-20 opacity-100 blur-0 text-fuchsia-400 drop-shadow-[0_0_80px_rgba(217,70,239,1)] scale-[1.15]' : 'z-0 opacity-70 blur-[3px] text-fuchsia-500/70 drop-shadow-[0_0_20px_rgba(217,70,239,0.3)] scale-100'} top-[40%] md:top-[38%] translate-y-0`}><span className="text-[12vw] md:text-[10rem] font-anton tracking-[0.05em] leading-none inline-block scale-x-[1.3] scale-y-[1.8] transform origin-center">2026</span></div>
          <h2 onMouseEnter={handleYearTrigger} className="relative z-10 text-[22vw] md:text-[23vw] font-anton text-white leading-none tracking-[-0.04em] drop-shadow-[0_10px_80px_rgba(0,0,0,0.8)] transition-all duration-1000 hover:scale-[1.03] cursor-default px-6 md:px-12 w-full text-center -translate-y-10 md:-translate-y-20">YANTRAKSH</h2>
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
    </div>
  );
};

export default Events;
