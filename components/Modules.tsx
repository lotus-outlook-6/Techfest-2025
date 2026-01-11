
import React, { useState, useRef } from 'react';

interface ModuleData {
  id: string;
  name: string;
  shortDesc: string;
  longDesc: string;
  status: 'ACTIVE' | 'STABLE' | 'INIT' | 'ENCRYPTED';
  color: string;
  icon: string;
}

const MODULES_DATA: ModuleData[] = [
  {
    id: "M_01",
    name: "COMPETITIVE CODING",
    shortDesc: "Algorithmic showdowns and logic optimization.",
    longDesc: "The ultimate test of speed and efficiency. Solve complex algorithmic challenges under tight constraints using C++, Python, or Java.",
    status: "ACTIVE",
    color: "cyan",
    icon: "code"
  },
  {
    id: "M_02",
    name: "ROBO WAR/RACE",
    shortDesc: "Mechanical combat and high-speed kinetics.",
    longDesc: "Enter the arena where steel meets speed. From heavy-duty combat robots to agile racers traversing treacherous obstacle courses.",
    status: "ACTIVE",
    color: "fuchsia",
    icon: "robot"
  },
  {
    id: "M_03",
    name: "IMAGE PROMPTING",
    shortDesc: "Generative AI and creative directives.",
    longDesc: "Master the art of the prompt. Use cutting-edge generative models to synthesize visual masterpieces from textual instructions.",
    status: "STABLE",
    color: "orange",
    icon: "image"
  },
  {
    id: "M_04",
    name: "CYBER ESCAPE ROOM",
    shortDesc: "Cryptography puzzles and network infiltration.",
    longDesc: "A race against the clock. Decrypt files, bypass firewalls, and solve digital riddles to secure your exit from a locked virtual environment.",
    status: "INIT",
    color: "blue",
    icon: "security"
  },
  {
    id: "M_05",
    name: "SUSTAINABLE AGRI",
    shortDesc: "Sustainable tech for the future of farming.",
    longDesc: "Precision and Sustainable Agriculture. Explore IOT sensors, drone mapping, and automated systems designed to revolutionize modern food production.",
    status: "STABLE",
    color: "lime",
    icon: "leaf"
  },
  {
    id: "M_06",
    name: "TECH DEBATE",
    shortDesc: "Discourse on the ethics of innovation.",
    longDesc: "The clash of ideas. Defend or challenge the socio-economic impacts of emerging technologies like AGI, Bio-hacking, and Space Privatization.",
    status: "ENCRYPTED",
    color: "red",
    icon: "debate"
  }
];

const ModuleIcon: React.FC<{ type: string; color: string }> = ({ type, color }) => {
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
      return (
        <svg className={`w-full h-full ${c}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="3" y="11" width="18" height="10" rx="2" />
          <circle cx="12" cy="5" r="2" />
          <path d="M12 7v4M8 15h.01M16 15h.01" strokeLinecap="round" />
        </svg>
      );
    case 'code':
      return (
        <svg className={`w-full h-full ${c}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <polyline points="16 18 22 12 16 6" />
          <polyline points="8 6 2 12 8 18" />
          <line x1="14" y1="4" x2="10" y2="20" />
        </svg>
      );
    case 'image':
      return (
        <svg className={`w-full h-full ${c}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21 15 16 10 5 21" />
        </svg>
      );
    case 'security':
      return (
        <svg className={`w-full h-full ${c}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      );
    case 'leaf':
      return (
        <svg className={`w-full h-full ${c}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8h-5a7 7 0 0 1-7 7Z" />
          <path d="M7 22c0-2.7 .67-5.13 2-7" />
        </svg>
      );
    case 'debate':
      return (
        <svg className={`w-full h-full ${c}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          <path d="M8 9h8" />
          <path d="M8 13h6" />
        </svg>
      );
    default:
      return null;
  }
};

const ModuleCard: React.FC<{ module: ModuleData }> = ({ module }) => {
  const [isHovered, setIsHovered] = useState(false);

  const colorStyles: Record<string, string> = {
    fuchsia: 'border-fuchsia-500/30 group-hover:border-fuchsia-500 shadow-fuchsia-900/10 group-hover:shadow-fuchsia-500/20',
    cyan: 'border-cyan-500/30 group-hover:border-cyan-500 shadow-cyan-900/10 group-hover:shadow-cyan-500/20',
    lime: 'border-lime-500/30 group-hover:border-lime-500 shadow-lime-900/10 group-hover:shadow-lime-500/20',
    orange: 'border-orange-500/30 group-hover:border-orange-500 shadow-orange-900/10 group-hover:shadow-orange-500/20',
    blue: 'border-blue-500/30 group-hover:border-blue-500 shadow-blue-900/10 group-hover:shadow-blue-500/20',
    red: 'border-red-500/30 group-hover:border-red-500 shadow-red-900/10 group-hover:shadow-red-500/20',
  };

  const glowStyles: Record<string, string> = {
    fuchsia: 'bg-fuchsia-500',
    cyan: 'bg-cyan-500',
    lime: 'bg-lime-500',
    orange: 'bg-orange-500',
    blue: 'bg-blue-500',
    red: 'bg-red-500',
  };

  return (
    <div 
      className={`group relative h-[400px] w-full max-w-[320px] bg-[#0c0c0c]/80 backdrop-blur-xl border rounded-[2.5rem] p-6 transition-all duration-700 flex flex-col items-center justify-between overflow-hidden cursor-default ${colorStyles[module.color]}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(circle_at_center,_#ffffff_1px,_transparent_1px)] bg-[size:12px_12px]"></div>
      <div className={`absolute top-4 left-4 w-4 h-4 border-t border-l transition-all duration-500 ${isHovered ? 'scale-110 opacity-100' : 'opacity-20'}`}></div>
      <div className={`absolute bottom-4 right-4 w-4 h-4 border-b border-r transition-all duration-500 ${isHovered ? 'scale-110 opacity-100' : 'opacity-20'}`}></div>

      <div className="w-full flex justify-between items-start mb-4">
        <span className="text-[10px] font-mono text-gray-500 tracking-[0.3em]">{module.id}</span>
        <div className="flex items-center gap-2">
          <span className={`w-1.5 h-1.5 rounded-full ${module.status === 'ACTIVE' ? 'bg-green-500 shadow-[0_0_8px_#22c55e]' : 'bg-yellow-500'} animate-pulse`}></span>
          <span className="text-[8px] font-bold text-gray-400 tracking-widest uppercase">{module.status}</span>
        </div>
      </div>

      <div className="relative flex-1 flex flex-col items-center justify-center w-full">
        <div className={`w-24 h-24 mb-6 transition-all duration-700 ${isHovered ? 'scale-110 rotate-[10deg]' : 'scale-100 rotate-0'}`}>
          <div className={`absolute inset-0 rounded-full blur-2xl opacity-10 transition-opacity duration-700 ${isHovered ? 'opacity-30' : 'opacity-10'} ${glowStyles[module.color]}`}></div>
          <ModuleIcon type={module.icon} color={module.color} />
        </div>
        
        <h4 className="text-2xl md:text-3xl font-anton tracking-tight text-white mb-2 uppercase group-hover:text-fuchsia-400 transition-colors text-center">{module.name}</h4>
        <p className="text-gray-400 text-center text-xs font-space leading-relaxed opacity-70 group-hover:opacity-100 px-2 h-12 overflow-hidden line-clamp-2">
          {module.shortDesc}
        </p>
      </div>

      <div className="w-full mt-6 pt-6 border-t border-white/5 flex flex-col items-center">
        <button className="text-[10px] font-anton text-white tracking-[0.2em] border border-white/10 hover:border-fuchsia-500/50 hover:bg-fuchsia-500/5 px-6 py-2 rounded-full transition-all duration-300 uppercase">
          EXPLORE_MODULE
        </button>
      </div>
      
      <div className={`absolute left-0 right-0 h-px bg-white/20 blur-[1px] pointer-events-none transition-all duration-[4s] linear infinite ${isHovered ? 'animate-scanner' : 'opacity-0'}`}></div>
    </div>
  );
};

const Modules: React.FC = () => {
  const contentRef = useRef<HTMLDivElement>(null);

  const scrollToContent = () => {
    contentRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="w-full h-full flex flex-col items-center overflow-y-auto overflow-x-hidden no-scrollbar scroll-smooth">
      <style>{`
        @keyframes scanner {
          0% { top: 0; opacity: 0; }
          10% { opacity: 0.5; }
          90% { opacity: 0.5; }
          100% { top: 100%; opacity: 0; }
        }
        .animate-scanner {
          animation: scanner 4s linear infinite;
        }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
      
      {/* HERO SECTION - CLEAN & MINIMAL */}
      <section className="min-h-screen w-full flex flex-col items-center justify-center relative shrink-0">
        <div className="text-center animate-fade-in px-6 -translate-y-20 md:-translate-y-24">
          <h2 className="text-6xl md:text-9xl font-anton tracking-tighter text-white uppercase leading-[0.85] drop-shadow-[0_0_20px_rgba(255,255,255,0.15)]">
            YANTRAKSH <br/> 
            <span className="text-fuchsia-500 drop-shadow-[0_0_15px_rgba(217,70,239,0.5)]">MODULES</span>
          </h2>
        </div>

        {/* Scroll Arrow - Standard size matched to other sections */}
        <div 
          className="absolute bottom-16 left-1/2 -translate-x-1/2 animate-bounce opacity-40 cursor-pointer z-20 hover:opacity-100 transition-opacity"
          onClick={scrollToContent}
        >
          <svg className="w-10 h-10 drop-shadow-[0_0_10px_rgba(217,70,239,0.5)] text-fuchsia-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* GRID CONTENT SECTION */}
      <div id="module-grid-content" ref={contentRef} className="max-w-7xl w-full flex flex-col items-center pt-20 pb-40 px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 w-full justify-items-center">
          {MODULES_DATA.map((module) => (
            <ModuleCard key={module.id} module={module} />
          ))}
        </div>

        {/* Global Footer Decoration */}
        <div className="flex flex-col items-center gap-4 opacity-30 mt-32">
          <div className="flex gap-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-1.5 h-1.5 bg-fuchsia-500 rounded-full animate-pulse" style={{ animationDelay: `${i * 0.2}s` }}></div>
            ))}
          </div>
          <span className="text-[9px] font-mono tracking-[1em] text-white">SYSTEM_IDLE_READY</span>
        </div>
      </div>
    </div>
  );
};

export default Modules;
