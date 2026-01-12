
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
    img: "https://images.unsplash.com/photo-1514525253348-8d9407c52025?q=80&w=1470&auto=format&fit=crop"
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
    color: "fuchsia",
    img: "https://images.unsplash.com/photo-1475721027785-f74dea327912?q=80&w=1470&auto=format&fit=crop"
  },
  {
    id: "H_02",
    category: "Yantraksh Night",
    title: "STARLIT GALA",
    desc: "An electric evening featuring open mic standup, professional artists, and live bands.",
    items: ["Standup Comedy", "Live Band Performances", "Celebrity DJ Sets"],
    color: "purple",
    img: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1470&auto=format&fit=crop"
  },
  {
    id: "H_03",
    category: "SunBurn",
    title: "MUSICAL INFERNO",
    desc: "A massive cultural music fest featuring unparalleled energy, light shows, and the hottest tracks.",
    items: ["EDM Festival", "Cultural Extravaganza", "Laser Light Show"],
    color: "pink",
    img: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1470&auto=format&fit=crop"
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
            <span className="font-anton tracking-widest text-white">LOGIC_PROCESSOR</span>
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
                <div className="bg-white/5 p-4 rounded-2xl text-xs font-mono text-fuchsia-400 animate-pulse">
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
            <button onClick={handleAsk} className="p-2 bg-fuchsia-600 rounded-xl text-white">
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
  const [isLocked, setIsLocked] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const megaSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isLocked) return;
    const timer = setInterval(() => {
      setActiveIndex(prev => (prev + 1) % CORE_EVENTS.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [isLocked]);

  const handlePanelClick = (index: number) => {
    setActiveIndex(index);
    setIsLocked(true);
    setTimeout(() => setIsLocked(false), 15000);
  };

  return (
    <div ref={scrollRef} className="w-full h-full bg-transparent overflow-y-auto scroll-smooth no-scrollbar select-none relative">
      <style>{`
        @keyframes panel-glow {
          0%, 100% { border-color: rgba(217, 70, 239, 0.1); box-shadow: 0 0 15px rgba(217, 70, 239, 0.1); }
          50% { border-color: rgba(217, 70, 239, 0.5); box-shadow: 0 0 35px rgba(217, 70, 239, 0.2); }
        }
        .animate-panel-glow { animation: panel-glow 4s infinite ease-in-out; }
        .perspective-box { perspective: 2500px; transform-style: preserve-3d; }
        .blade-transition { transition: all 1.1s cubic-bezier(0.19, 1, 0.22, 1); }
        .mega-card-glow:hover { box-shadow: 0 0 60px rgba(217, 70, 239, 0.1); }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(217, 70, 239, 0.3); border-radius: 10px; }
      `}</style>

      <AIAssistant />

      {/* HEADER SECTION */}
      <section className="min-h-screen w-full flex flex-col items-center justify-center relative px-6 md:px-16 pt-10">
        <div className="text-center z-10 mb-16 transition-all duration-700">
          <h2 className="text-6xl md:text-9xl font-anton tracking-[0.05em] text-white uppercase opacity-95">
            YANTRAKSH <span className="text-fuchsia-500 drop-shadow-[0_0_20px_#d946ef]">EVENTS</span>
          </h2>
        </div>

        {/* 3D CAROUSEL */}
        <div className="relative w-full max-w-7xl h-[40vh] md:h-[50vh] flex items-center justify-center perspective-box mb-20">
          <div className="relative w-full h-full flex items-center justify-center gap-2 md:gap-4 overflow-visible">
            {CORE_EVENTS.map((event, idx) => {
              const isActive = activeIndex === idx;
              let rotateY = 0, translateZ = 0, translateX = 0, scale = 1, opacity = 0.3;

              if (isActive) {
                translateZ = 250;
                opacity = 1;
                scale = 1.05;
              } else {
                rotateY = (idx < activeIndex ? 35 : -35);
                translateX = (idx < activeIndex ? -60 : 60);
                translateZ = -200;
                opacity = 0.35;
              }

              return (
                <div
                  key={event.id}
                  onClick={() => handlePanelClick(idx)}
                  className={`blade-transition relative w-10 md:w-20 lg:w-28 h-full cursor-pointer rounded-3xl border border-white/5 overflow-hidden bg-black/50 backdrop-blur-xl ${isActive ? 'animate-panel-glow !w-64 md:!w-[450px] lg:!w-[600px]' : ''}`}
                  style={{
                    transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                    opacity,
                    zIndex: isActive ? 100 : 50 - Math.abs(activeIndex - idx),
                  }}
                >
                  <img src={event.img} className={`absolute inset-0 w-full h-full object-cover grayscale-[0.5] transition-all duration-[2.5s] ${isActive ? 'grayscale-0 scale-100' : 'opacity-20'}`} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-95"></div>
                  
                  {/* Category Side Label */}
                  <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-[-90deg] whitespace-nowrap transition-all duration-500 ${isActive ? 'opacity-0 scale-50' : 'opacity-100'}`}>
                    <span className="text-xl md:text-3xl font-anton tracking-[0.2em] text-white/30 uppercase">{event.category}</span>
                  </div>

                  {/* Active Text Content */}
                  <div className={`absolute bottom-0 left-0 w-full p-10 md:p-14 transition-all duration-1000 ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                    <h3 className="text-4xl md:text-7xl font-anton text-white uppercase leading-none mb-6 tracking-tight">{event.title}</h3>
                    <p className="text-gray-300 text-sm md:text-base font-space max-w-lg opacity-80 leading-relaxed">
                      {event.desc}
                    </p>
                    <div className="mt-8 flex gap-4">
                      <button className="px-10 py-4 bg-fuchsia-600 hover:bg-fuchsia-500 text-white font-anton tracking-widest rounded-2xl transition-all shadow-[0_0_20px_rgba(217,70,239,0.3)]">
                        REGISTER_NOW
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex gap-3 mb-20">
          {CORE_EVENTS.map((_, i) => (
            <div 
              key={i} 
              onClick={() => handlePanelClick(i)}
              className={`h-1.5 transition-all duration-700 rounded-full cursor-pointer ${activeIndex === i ? 'w-16 bg-fuchsia-500 shadow-[0_0_15px_#d946ef]' : 'w-4 bg-white/10 hover:bg-white/20'}`}
            ></div>
          ))}
        </div>

        <div className="animate-bounce cursor-pointer flex flex-col items-center opacity-30 hover:opacity-100 transition-opacity" onClick={() => megaSectionRef.current?.scrollIntoView()}>
          <span className="text-[10px] font-mono tracking-widest uppercase mb-2">Discovery Mega Events</span>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
        </div>
      </section>

      {/* MEGA EVENTS SECTION */}
      <section ref={megaSectionRef} className="min-h-screen w-full bg-[#050505] py-40 px-6 md:px-20 relative border-t border-fuchsia-500/10">
        <div className="max-w-7xl mx-auto flex flex-col items-center">
          <div className="text-center mb-32">
            <h3 className="text-6xl md:text-[10rem] font-anton tracking-tighter text-white uppercase opacity-95">
              MEGA <span className="text-fuchsia-500">HEADLINERS</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 w-full">
            {MEGA_EVENTS.map((event) => (
              <div key={event.id} className="group relative h-[650px] rounded-[3rem] overflow-hidden border border-white/5 bg-[#0a0a0a] mega-card-glow transition-all duration-1000 hover:-translate-y-6">
                <img src={event.img} className="absolute inset-0 w-full h-full object-cover transition-transform duration-[4s] group-hover:scale-110 grayscale-[0.4] group-hover:grayscale-0 opacity-60" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent"></div>
                
                <div className="absolute inset-0 p-14 flex flex-col justify-end">
                   <div className="mb-8">
                      <span className={`inline-block px-5 py-2 rounded-full border border-${event.color}-500/20 bg-black/60 backdrop-blur-xl text-[10px] font-mono text-fuchsia-400 font-bold tracking-[0.5em] uppercase mb-6`}>
                        {event.category}
                      </span>
                      <h4 className="text-4xl md:text-5xl font-anton text-white uppercase leading-none group-hover:text-fuchsia-400 transition-colors tracking-tight">
                        {event.title}
                      </h4>
                   </div>
                   
                   <p className="text-gray-400 text-base font-space leading-relaxed opacity-0 group-hover:opacity-100 translate-y-6 group-hover:translate-y-0 transition-all duration-1000">
                     {event.desc}
                   </p>
                </div>

                <div className="absolute top-10 right-10 w-16 h-16 border-t border-r border-white/10 group-hover:border-fuchsia-500/40 transition-colors"></div>
                <div className="absolute bottom-10 left-10 w-16 h-16 border-b border-l border-white/10 group-hover:border-fuchsia-500/40 transition-colors"></div>
              </div>
            ))}
          </div>

          <div className="mt-40 p-20 w-full rounded-[4rem] bg-gradient-to-br from-fuchsia-950/10 to-transparent border border-fuchsia-500/10 flex flex-col md:flex-row items-center justify-between gap-12 backdrop-blur-md">
             <div className="max-w-2xl">
                <h5 className="text-4xl md:text-6xl font-anton text-white uppercase mb-6 tracking-tight">JOIN THE <span className="text-fuchsia-500">COLLECTIVE_</span></h5>
                <p className="text-gray-400 font-space text-xl leading-relaxed">Connect with the official Yantraksh comms for high-priority updates and event protocols.</p>
             </div>
             <button className="px-20 py-8 bg-transparent border-2 border-fuchsia-500 text-fuchsia-500 font-anton text-2xl tracking-[0.3em] rounded-[2rem] hover:bg-fuchsia-500 hover:text-white transition-all shadow-[0_0_40px_rgba(217,70,239,0.2)]">
               JOIN_COMMUNITY
             </button>
          </div>
        </div>
      </section>

      <div className="w-full py-16 text-center opacity-10">
        <span className="text-[10px] font-mono tracking-[2em] text-white uppercase">YANTRAKSH // END_OF_TRANSMISSION</span>
      </div>

      {/* AMBIENT BG */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-10">
        <div className="absolute top-[-20%] left-[-20%] w-[1200px] h-[1200px] bg-fuchsia-900/10 blur-[200px] rounded-full"></div>
        <div className="absolute bottom-[-20%] right-[-20%] w-[1200px] h-[1200px] bg-blue-900/10 blur-[200px] rounded-full"></div>
      </div>
    </div>
  );
};

export default Events;
