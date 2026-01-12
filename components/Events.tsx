import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";

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

const AIAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{role: 'user' | 'ai', content: string}[]>([]);
  const [isThinking, setIsThinking] = useState(false);

  const handleAsk = async () => {
    if (!input.trim() || isThinking) return;
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, {role: 'user', content: userMsg}]);
    setIsThinking(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-pro-preview",
        contents: userMsg,
        config: {
          thinkingConfig: { thinkingBudget: 32768 },
          systemInstruction: "You are the Yantraksh Logic Processor. Answer complex technical queries about the techfest, robotics, and coding events professionally and concisely."
        }
      });
      setMessages(prev => [...prev, {role: 'ai', content: response.text || "I'm having trouble processing that right now."}]);
    } catch (err) {
      setMessages(prev => [...prev, {role: 'ai', content: "Connection uplink failed. Please try again later."}]);
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div className={`fixed bottom-10 right-10 z-[1000] flex flex-col items-end gap-4`}>
      {isOpen && (
        <div className="w-[350px] h-[500px] bg-[#0c0c0c] border border-fuchsia-500/30 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-fade-in backdrop-blur-xl">
          <div className="p-6 bg-fuchsia-600/10 border-b border-fuchsia-500/20 flex justify-between items-center">
            <span className="font-anton tracking-widest text-white uppercase">LOGIC PROCESSOR</span>
            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white">✕</button>
          </div>
          <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-4 rounded-2xl text-sm font-space ${m.role === 'user' ? 'bg-fuchsia-600 text-white' : 'bg-white/5 text-gray-300 border border-white/10'}`}>
                  {m.content}
                </div>
              </div>
            ))}
            {isThinking && (
              <div className="flex justify-start">
                <div className="bg-white/5 p-4 rounded-2xl text-xs font-mono text-fuchsia-400 animate-pulse uppercase">
                  THINKING...
                </div>
              </div>
            )}
          </div>
          <div className="p-4 border-t border-white/5 bg-black/40 flex gap-2">
            <input 
              value={input} 
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAsk()}
              placeholder="Ask the Logic Processor..." 
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-fuchsia-500/50"
            />
            <button onClick={handleAsk} className="p-2 bg-fuchsia-600 rounded-xl text-white hover:bg-fuchsia-500 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </button>
          </div>
        </div>
      )}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 bg-fuchsia-600 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(217,70,239,0.5)] hover:scale-110 transition-transform group"
      >
        <svg className="w-8 h-8 text-white group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      </button>
    </div>
  );
};

const Events: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const timerRef = useRef<number | null>(null);
  const megaSectionRef = useRef<HTMLDivElement>(null);

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

  const handlePanelClick = (index: number) => {
    setActiveIndex(index);
    startAutoRotation();
  };

  return (
    <div className="w-full h-full bg-transparent overflow-y-auto scroll-smooth no-scrollbar select-none relative">
      <style>{`
        @keyframes panel-glow {
          0%, 100% { border-color: rgba(217, 70, 239, 0.05); box-shadow: 0 0 10px rgba(217, 70, 239, 0.05); }
          50% { border-color: rgba(217, 70, 239, 0.3); box-shadow: 0 0 25px rgba(217, 70, 239, 0.15); }
        }
        .animate-panel-glow { animation: panel-glow 4s infinite ease-in-out; }
        .perspective-box { perspective: 2500px; transform-style: preserve-3d; }
        .blade-transition { transition: all 1.1s cubic-bezier(0.19, 1, 0.22, 1); }
        .mega-card-glow:hover { box-shadow: 0 0 40px rgba(217, 70, 239, 0.08); }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(217, 70, 239, 0.3); border-radius: 10px; }
        
        .flip-card { perspective: 1000px; cursor: pointer; }
        .flip-card-inner { position: relative; width: 100%; height: 100%; transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1); transform-style: preserve-3d; }
        .flip-card:hover .flip-card-inner { transform: rotateY(180deg); }
        .flip-card-front, .flip-card-back { position: absolute; width: 100%; height: 100%; -webkit-backface-visibility: hidden; backface-visibility: hidden; display: flex; items-center justify-center rounded-2xl overflow-hidden; }
        .flip-card-back { transform: rotateY(180deg); }

        .logo-hover-reveal { opacity: 0; transform: scale(0.9); transition: all 0.6s cubic-bezier(0.19, 1, 0.22, 1); }
        .group:hover .logo-hover-reveal { opacity: 1; transform: scale(1.1); filter: brightness(1.2) contrast(1.1); }
      `}</style>

      <AIAssistant />

      {/* HEADER SECTION - Increased spacing to provide the requested space */}
      <section className="min-h-screen w-full flex flex-col items-center justify-start relative px-6 md:px-16 pt-12 md:pt-16">
        <div className="text-center z-10 mb-20 md:mb-24 transition-all duration-700">
          <h2 className="text-5xl md:text-8xl font-anton tracking-[0.05em] text-white uppercase opacity-95 leading-tight">
            YANTRAKSH <span className="text-fuchsia-500 drop-shadow-[0_0_15px_#d946ef]">EVENTS</span>
          </h2>
        </div>

        <div className="w-full max-w-7xl flex flex-col items-center overflow-visible">
            
            {/* Carousel Blades */}
            <div className="relative w-full h-[32vh] md:h-[42vh] flex items-center justify-center perspective-box mb-8 overflow-visible">
              <div className="relative w-full h-full flex items-center justify-center gap-0 overflow-visible">
                {CORE_EVENTS.map((event, idx) => {
                  const isActive = activeIndex === idx;
                  let rotateY = 0, translateZ = 0, translateX = 0, scale = 1, opacity = 1;

                  // Expanded Card Sizes
                  const activeWidthMobile = 256;
                  const activeWidthTablet = 480;
                  const activeWidthDesktop = 650;

                  if (isActive) {
                    translateZ = 180;
                    opacity = 1;
                    scale = 0.95;
                  } else {
                    const offset = idx - activeIndex;
                    
                    const isMobile = window.innerWidth < 768;
                    const isTablet = window.innerWidth < 1024;
                    
                    const halfWidth = isMobile ? activeWidthMobile / 2 : (isTablet ? activeWidthTablet / 2 : activeWidthDesktop / 2);
                    
                    // generous gap between strips
                    const initialGap = isMobile ? 45 : 85; 
                    const baseOffset = halfWidth + initialGap;
                    
                    // Spacing for closed strips
                    translateX = (offset < 0 ? -baseOffset : baseOffset) + (offset * (isMobile ? 40 : 110));
                    rotateY = (offset < 0 ? 35 : -35);
                    translateZ = -180;
                    opacity = 1; 
                  }

                  return (
                    <div
                      key={event.id}
                      onClick={() => handlePanelClick(idx)}
                      className={`blade-transition absolute h-full cursor-pointer rounded-2xl border border-white/5 overflow-hidden bg-black/50 backdrop-blur-xl pointer-events-auto ${isActive ? `animate-panel-glow w-64 md:w-[480px] lg:w-[650px] z-50` : 'w-10 md:w-16 lg:w-24 z-10'}`}
                      style={{
                        transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                        opacity,
                      }}
                    >
                      <img src={event.img} className={`absolute inset-0 w-full h-full object-cover transition-all duration-[2s] ${isActive ? 'grayscale-0 scale-100 opacity-100' : 'opacity-40 hover:opacity-100 grayscale-0'}`} alt={event.title} />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-95"></div>
                      
                      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-[-90deg] whitespace-nowrap transition-all duration-500 ${isActive ? 'opacity-0 scale-50' : 'opacity-100'}`}>
                        <span className="text-[12px] md:text-xl font-anton tracking-[0.2em] text-white/60 uppercase">{event.category}</span>
                      </div>

                      <div className={`absolute bottom-0 left-0 w-full p-6 md:p-10 transition-all duration-1000 ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                        <h3 className="text-2xl md:text-4xl font-anton text-white uppercase leading-none mb-3 tracking-tight">{event.title}</h3>
                        <p className="text-gray-300 text-[10px] md:text-xs font-space max-w-md opacity-80 leading-relaxed">
                          {event.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
        </div>

        {/* Bounce arrow moved up significantly by using negative margin/reduced top margin */}
        <div className="mt-2 md:mt-4 mb-12 animate-bounce opacity-40 cursor-pointer z-20 hover:opacity-100 transition-opacity" onClick={() => megaSectionRef.current?.scrollIntoView({ behavior: 'smooth' })}>
          <svg className="w-10 h-10 drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
        </div>
      </section>

      {/* MEGA EVENTS SECTION */}
      <section ref={megaSectionRef} className="min-h-screen w-full bg-[#050505] py-24 px-6 md:px-20 relative border-t border-fuchsia-500/10">
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
                        {event.id === 'H_01' ? (
                          <>
                            <span className="text-white">SOT</span>{' '}
                            <span className="text-red-600">X</span>
                          </>
                        ) : (
                          <>
                            <span className="text-white opacity-40">{event.hoverTextPrefix}</span>{' '}
                            <span className={`${event.id === 'H_02' ? 'text-purple-500' : 'text-pink-500'}`}>{event.hoverTextSuffix}</span>
                          </>
                        )}
                    </div>
                </div>

                <div className="absolute inset-0 p-10 flex flex-col justify-end">
                   <div className="mb-4">
                      <h4 className="text-3xl md:text-4xl font-anton text-white uppercase leading-none transition-colors tracking-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
                        {event.title}
                      </h4>
                   </div>
                   
                   <p className="text-gray-200 text-xs font-space leading-relaxed opacity-100 transition-all duration-700 drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]">
                     {event.desc}
                   </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-24 p-12 md:p-14 w-full rounded-[2.5rem] bg-gradient-to-br from-emerald-950/20 to-transparent border border-emerald-500/20 flex flex-col md:flex-row items-center justify-between gap-10 backdrop-blur-md relative overflow-hidden group/whatsapp shadow-[0_0_80px_rgba(16,185,129,0.05)]">
             <div className="absolute inset-0 bg-emerald-500/[0.02] pointer-events-none"></div>
             <div className="max-w-xl relative z-10">
                <h5 className="text-3xl md:text-5xl font-anton text-white uppercase mb-4 tracking-tight group-hover/whatsapp:text-emerald-400 transition-colors">JOIN US ON WHATSAPP</h5>
                <p className="text-gray-400 font-space text-lg leading-relaxed opacity-80">Connect with the official Yantraksh comms for high-priority updates and event protocols.</p>
             </div>
             
             <div className="flip-card shrink-0 w-36 h-36 md:w-44 md:h-44 relative z-10">
                <div className="flip-card-inner">
                    <div className="flip-card-front bg-white p-2 shadow-[0_0_30px_rgba(255,255,255,0.05)] border border-white/10 flex items-center justify-center rounded-2xl">
                        <img 
                            src="https://scontent.whatsapp.net/v/t39.8562-34/495571915_2950553458455166_4924198993047220200_n.png?ccb=1-7&_nc_sid=73b08c&_nc_ohc=NzqcShHh2_YQ7kNvwFO58-b&_nc_ohc=NzqcShHh2_YQ7kNvwFO58-b&_nc_oc=Adks2OXcuBUtk4nvCoQR4WsKYIfByIRGwmtdAum9bJNSkloGWHcoPzfXQTlSJ4ehkag&_nc_zt=3&_nc_ht=scontent.whatsapp.net&_nc_gid=G6Oo3GmRUHiWQ9eyUq2Oiw&oh=01_Q5Aa3gF1cbaP46DoHQo69ob4uAwLveYhb3S0Q0TQyRRo_zRFgw&oe=696AA80D" 
                            className="w-[90%] h-[90%] object-contain" 
                            alt="WhatsApp Group QR"
                        />
                    </div>
                    <div className="flip-card-back bg-white p-2 shadow-[0_0_40px_rgba(255,255,255,0.1)] border border-white/10 flex items-center justify-center rounded-2xl">
                        <div className="w-[85%] h-[85%] bg-white rounded-[32%] flex items-center justify-center overflow-hidden">
                           <img 
                              src="https://tse2.mm.bing.net/th/id/OIP.rRLn1-_cydtipYrijT8A5gHaFQ?w=1600&h=1136&rs=1&pid=ImgDetMain&o=7&rm=3" 
                              className="w-full h-full object-contain" 
                              alt="WhatsApp Official Link"
                           />
                        </div>
                    </div>
                </div>
             </div>

             <button className="px-16 py-6 bg-transparent border-2 border-emerald-500 text-emerald-500 font-anton text-xl tracking-[0.2em] rounded-[1.5rem] hover:bg-emerald-500 hover:text-white transition-all shadow-[0_0_30px_rgba(16,185,129,0.15)] relative z-10">
               JOIN GROUP
             </button>
          </div>
        </div>
      </section>

      <div className="w-full py-12 text-center opacity-10">
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

export default Events;