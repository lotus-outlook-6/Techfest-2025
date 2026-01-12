
import React, { useEffect, useRef, useState } from 'react';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  category: string;
  img: string;
  color: string;
}

const TEAM_MEMBERS: TeamMember[] = [
  { id: '1', name: 'Alex Rivera', role: 'Chief Technical Head', category: 'CORE', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop', color: 'fuchsia' },
  { id: '2', name: 'Sarah Chen', role: 'Logistics Lead', category: 'CORE', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=600&auto=format&fit=crop', color: 'cyan' },
  { id: '3', name: 'Marcus Thorne', role: 'Robotics Coordinator', category: 'TECHNICAL', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=600&auto=format&fit=crop', color: 'lime' },
  { id: '4', name: 'Elena Vance', role: 'Security Architect', category: 'TECHNICAL', img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop', color: 'blue' },
  { id: '5', name: 'David Kim', role: 'AI Specialist', category: 'AI_LABS', img: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=600&auto=format&fit=crop', color: 'orange' },
  { id: '6', name: 'Julia Moss', role: 'Sponsorship Manager', category: 'ADMIN', img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=600&auto=format&fit=crop', color: 'red' },
];

const Team: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLElement>(null);
  const [isYearForward, setIsYearForward] = useState(false);
  const yearResetTimer = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    const hexSize = 48; // Slightly larger for better visual clarity
    const hexHeight = hexSize * 2;
    const hexWidth = Math.sqrt(3) * hexSize;
    const hexGapX = hexWidth;
    const hexGapY = (3 / 4) * hexHeight;

    let mouse = { x: -1000, y: -1000 };
    let frame = 0;

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      // Calculate mouse position relative to the Team section container
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    handleResize();

    const drawHexagon = (x: number, y: number, size: number, opacity: number, color: string) => {
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i - Math.PI / 6;
        const px = x + size * Math.cos(angle);
        const py = y + size * Math.sin(angle);
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      
      // Dynamic color switching
      ctx.strokeStyle = color === 'fuchsia' ? `rgba(217, 70, 239, ${opacity})` : `rgba(34, 211, 238, ${opacity})`;
      ctx.lineWidth = opacity > 0.4 ? 1.5 : 0.8;
      ctx.stroke();
    };

    const render = () => {
      frame++;
      ctx.clearRect(0, 0, width, height);

      const rows = Math.ceil(height / hexGapY) + 2;
      const cols = Math.ceil(width / hexGapX) + 2;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          let cx = c * hexGapX;
          let cy = r * hexGapY;

          if (r % 2 !== 0) cx += hexWidth / 2;

          const dx = cx - mouse.x;
          const dy = cy - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          // Ambient "Gallery-like" breathing pulse
          const ambientPulse = Math.sin(frame * 0.02 + (cx + cy) * 0.005) * 0.08 + 0.12;
          
          // Responsive hover influence
          const mouseInfluence = Math.max(0, 1 - dist / 400);
          const opacity = ambientPulse + mouseInfluence * 0.7;
          
          // Subtle scaling on hover for depth effect
          const sizeOffset = mouseInfluence * 6;
          
          // Patterns of color
          const color = (r + c) % 7 === 0 ? 'cyan' : 'fuchsia';

          if (opacity > 0.05) {
            drawHexagon(cx, cy, hexSize + sizeOffset, opacity, color);
          }
        }
      }
      requestAnimationFrame(render);
    };

    const raf = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) handleYearTrigger();
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

  return (
    <div ref={containerRef} className="w-full h-full bg-transparent overflow-y-auto no-scrollbar scroll-smooth relative select-none">
      <style>{`
        @keyframes float-slow {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(1deg); }
        }
        .animate-float-slow { animation: float-slow 6s ease-in-out infinite; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        
        @keyframes nebula-pulse { 0%, 100% { transform: scale(1); opacity: 0.8; } 50% { transform: scale(1.1); opacity: 1; } }
        @keyframes accretion-spin { from { transform: rotate(25deg) scale(1); } to { transform: rotate(385deg) scale(1); } }
        @keyframes lensing-pulse { 0%, 100% { transform: scale(1); opacity: 0.1; } 50% { transform: scale(1.02); opacity: 0.2; } }
        .animate-nebula-pulse { animation: nebula-pulse 10s ease-in-out infinite; }
        .animate-accretion-spin { animation: accretion-spin 15s linear infinite; }
        .animate-lensing-pulse { animation: lensing-pulse 4s ease-in-out infinite; }
      `}</style>

      {/* HONEYCOMB CANVAS - Changed from fixed to absolute to restrict it to this slide */}
      <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none opacity-40" />

      {/* CONTENT */}
      <section className="relative z-10 pt-16 pb-24 px-6 md:px-12 flex flex-col items-center">
        <div className="text-center mb-24 transition-all duration-700">
          <h2 className="text-5xl md:text-8xl font-anton tracking-[0.05em] text-white uppercase opacity-95 leading-tight">
            MEET THE <span className="text-fuchsia-500 drop-shadow-[0_0_15px_#d946ef]">ARCHITECTS</span>
          </h2>
          <div className="h-0.5 w-32 bg-gradient-to-r from-transparent via-fuchsia-500 to-transparent mx-auto mt-6"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 max-w-7xl w-full mb-40">
          {TEAM_MEMBERS.map((member) => (
            <div key={member.id} className="group relative aspect-[3/4] rounded-[2.5rem] overflow-hidden border border-white/5 bg-[#0a0a0a]/60 backdrop-blur-xl transition-all duration-1000 hover:-translate-y-4 hover:border-fuchsia-500/30 hover:shadow-[0_0_50px_rgba(217,70,239,0.1)]">
              <img src={member.img} className="absolute inset-0 w-full h-full object-cover transition-all duration-[2s] group-hover:scale-110 grayscale-[0.5] group-hover:grayscale-0 opacity-40 group-hover:opacity-100" alt={member.name} />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent opacity-90 group-hover:opacity-60 transition-opacity"></div>
              
              <div className="absolute top-6 left-6 flex items-center gap-2">
                 <div className={`w-2 h-2 rounded-full animate-pulse ${member.color === 'fuchsia' ? 'bg-fuchsia-500' : 'bg-cyan-400'}`}></div>
                 <span className="text-[10px] font-bold tracking-[0.3em] text-white/60 uppercase">{member.category}</span>
              </div>

              <div className="absolute bottom-0 left-0 w-full p-10 translate-y-4 group-hover:translate-y-0 transition-transform duration-700">
                <h3 className="text-3xl font-anton text-white uppercase mb-2 tracking-tight">{member.name}</h3>
                <p className={`text-sm font-space font-bold uppercase tracking-widest ${member.color === 'fuchsia' ? 'text-fuchsia-400' : 'text-cyan-300'}`}>
                  {member.role}
                </p>
                <div className="h-px w-0 group-hover:w-full bg-white/20 mt-6 transition-all duration-1000"></div>
                <div className="flex gap-4 mt-6 opacity-0 group-hover:opacity-100 transition-all duration-1000 delay-200">
                  <span className="text-white/40 hover:text-white cursor-pointer transition-colors text-xs font-mono uppercase tracking-widest">Connect_</span>
                  <span className="text-white/40 hover:text-white cursor-pointer transition-colors text-xs font-mono uppercase tracking-widest">Profile_</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* INTERACTIVE FOOTER BANNER */}
      <section ref={footerRef} id="footer-banner" className="h-[75vh] w-full shrink-0 relative overflow-hidden flex flex-col items-center justify-center py-4 px-4 transition-all duration-500 bg-black z-[100]">
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_40%,rgba(139,92,246,0.15)_0%,transparent_50%),radial-gradient(circle_at_80%_60%,rgba(34,211,238,0.15)_0%,transparent_50%)] opacity-80 animate-nebula-pulse"></div>
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-40"></div>
          <div className="absolute right-[10%] top-1/2 -translate-y-1/2 w-[40vw] h-[40vw] flex items-center justify-center">
            <div className="absolute w-[110%] h-[110%] rounded-full border border-fuchsia-500/10 blur-xl animate-lensing-pulse"></div>
            <div className="absolute w-[105%] h-[105%] rounded-full border border-cyan-400/5 blur-md"></div>
            <div className="absolute w-[140%] h-[35%] bg-gradient-to-r from-transparent via-orange-500/60 to-transparent blur-[40px] rotate-[25deg] animate-accretion-spin"></div>
            <div className="absolute w-[130%] h-[15%] bg-gradient-to-r from-transparent via-white/40 to-transparent blur-[15px] rotate-[25deg] animate-accretion-spin opacity-80"></div>
            <div className="relative w-[18vw] h-[18vw] bg-black rounded-full shadow-[0_0_100px_rgba(0,0,0,1)] z-10">
              <div className="absolute inset-0 rounded-full shadow-[inset_0_0_30px_rgba(255,165,0,0.4)]"></div>
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

      {/* AMBIENT BG */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-5">
        <div className="absolute top-[-10%] left-[-10%] w-[1000px] h-[1000px] bg-emerald-900/10 blur-[180px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[1000px] h-[1000px] bg-fuchsia-900/10 blur-[180px] rounded-full"></div>
      </div>
    </div>
  );
};

export default Team;
