
import React, { useState, useEffect, useMemo } from 'react';

interface LoadingScreenProps {
  isTransition?: boolean;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ isTransition = false }) => {
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  
  const bootMessages = useMemo(() => [
    "Building the site!",
    "Building the page...",
    "Initializing core systems...",
    "Parsing logic gates...",
    "Constructing the digital realm...",
    "Syncing neural pathways...",
    "Fetching data fragments...",
    "Assembling YANTRAKSH..."
  ], []);

  const transitionMessages = useMemo(() => [
    "[INFO] Establishing secure tunnel...",
    "[INFO] Initializing handshake...",
    "[LOAD] core_engine.pak",
    "[LOAD] interface_assets.bin",
    "[SYNC] Neural link active",
    "[INFO] Allocating memory...",
    "[OK] Handshake successful",
    "[EXEC] Transitioning interface..."
  ], []);

  const bootMessage = useMemo(() => {
    return bootMessages[Math.floor(Math.random() * bootMessages.length)];
  }, [bootMessages]);

  useEffect(() => {
    const duration = isTransition ? 5500 : 3000;
    const intervalTime = 50;
    const totalSteps = duration / intervalTime;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const nextProgress = Math.min(100, (currentStep / totalSteps) * 100);
      setProgress(nextProgress);

      if (isTransition) {
        const logIdx = Math.floor((nextProgress / 100) * transitionMessages.length);
        setLogs(prev => {
          const currentMsg = transitionMessages[logIdx];
          if (logIdx < transitionMessages.length && !prev.includes(currentMsg)) {
            return [...prev, currentMsg];
          }
          return prev;
        });
      }

      if (currentStep >= totalSteps) {
        clearInterval(timer);
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, [isTransition, transitionMessages]);

  return (
    <div className="fixed inset-0 z-[10000] bg-[#050505] flex flex-col items-center justify-center font-mono overflow-hidden">
      {/* Scanline Overlay Effect */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,20,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-[10001] bg-[length:100%_2px,3px_100%] opacity-20"></div>
      
      {isTransition ? (
        <div className="w-full max-w-xl px-10 relative z-10 animate-fade-in">
          <div className="flex justify-between items-end mb-6">
            <div className="text-left">
              <h2 className="text-white text-3xl font-anton tracking-widest uppercase mb-1 drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]">
                {progress < 100 ? "Syncing_Data" : "Link_Established"}
              </h2>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-fuchsia-500 rounded-full animate-pulse"></span>
                <span className="text-fuchsia-400 text-[10px] tracking-[0.4em] font-bold uppercase">System Active</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-5xl font-anton text-white tabular-nums drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">{Math.floor(progress)}%</span>
            </div>
          </div>

          <div className="w-full h-40 bg-black/80 border border-fuchsia-900/20 p-5 mb-10 overflow-hidden flex flex-col justify-end rounded-xl shadow-[inset_0_0_20px_rgba(0,0,0,0.8)]">
            <div className="space-y-2">
              {logs.map((log, i) => (
                <div key={i} className="text-[11px] md:text-xs flex gap-4 animate-fade-in font-medium tracking-wider">
                  <span className="text-fuchsia-500/80 shrink-0 font-bold">
                    [{new Date().toLocaleTimeString([], {hour12: false})}]
                  </span>
                  <span className={`
                    ${log.includes('[OK]') ? 'text-green-400' : 'text-fuchsia-100'}
                    ${log.includes('[INFO]') ? 'text-blue-300' : ''}
                    drop-shadow-[0_0_8px_rgba(217,70,239,0.3)]
                  `}>
                    {log}
                  </span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="relative w-full h-3.5 bg-[#0a0a0a] rounded-full overflow-hidden shadow-[0_0_30px_rgba(217,70,239,0.1)] border border-fuchsia-950/20">
            <div 
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-fuchsia-700 via-fuchsia-500 to-fuchsia-400 transition-all duration-300 ease-out rounded-full shadow-[0_0_25px_#d946ef,0_0_50px_rgba(217,70,239,0.6)]"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.15),transparent)] animate-[shimmer_3s_infinite] rounded-full"></div>
              <div className="absolute top-0 right-0 h-full w-8 bg-white/20 blur-md rounded-full"></div>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full max-w-md px-8 text-center relative z-10">
          <div className="mb-4 text-white text-lg tracking-widest font-bold animate-pulse drop-shadow-[0_0_10px_rgba(217,70,239,0.5)]">
            {bootMessage}
          </div>
          
          <div className="relative w-full h-1.5 bg-gray-900 overflow-hidden rounded-full shadow-[0_0_15px_rgba(217,70,239,0.1)] border border-white/5">
            <div 
              className="absolute top-0 left-0 h-full bg-fuchsia-600 transition-all duration-300 ease-out rounded-full shadow-[0_0_15px_#d946ef]"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          
          <div className="mt-4 text-fuchsia-500 font-bold text-sm tracking-widest">
            {Math.floor(progress)}%
          </div>
        </div>
      )}

      {/* Ambient Background Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-fuchsia-950/10 blur-[200px] rounded-full pointer-events-none"></div>

      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}</style>
    </div>
  );
};

export default LoadingScreen;
