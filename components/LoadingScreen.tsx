
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
    "[INFO] Bitrate: 3.0 MBps",
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
        if (logIdx < transitionMessages.length && !logs.includes(transitionMessages[logIdx])) {
            setLogs(prev => [...prev, transitionMessages[logIdx]]);
        }
      }

      if (currentStep >= totalSteps) {
        clearInterval(timer);
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, [isTransition, transitionMessages, logs]);

  if (isTransition) {
    return (
      <div className="fixed inset-0 z-[500] bg-[#050505] flex flex-col items-center justify-center font-mono">
        <div className="w-full max-w-xl px-10">
          <div className="flex justify-between items-end mb-6">
            <div className="text-left">
              <h2 className="text-white text-2xl font-anton tracking-widest uppercase mb-1">
                {progress < 100 ? "Syncing_Data" : "Link_Established"}
              </h2>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-fuchsia-500 rounded-full animate-pulse"></span>
                <span className="text-fuchsia-400 text-[10px] tracking-[0.4em] font-bold">UPLINK: 3.0 MBPS</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-4xl font-anton text-white">{Math.floor(progress)}%</span>
            </div>
          </div>

          <div className="w-full h-32 bg-black/40 border border-white/5 p-4 mb-6 overflow-hidden flex flex-col justify-end rounded">
            <div className="space-y-1">
              {logs.map((log, i) => (
                <div key={i} className="text-[10px] text-gray-500 flex gap-3 animate-fade-in">
                  <span className="text-fuchsia-900/40 shrink-0">[{new Date().toLocaleTimeString([], {hour12: false})}]</span>
                  <span className={log.includes('[OK]') ? 'text-green-500/50' : ''}>{log}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="relative w-full h-2 bg-gray-900 border border-white/5 rounded-full overflow-hidden">
            <div 
              className="absolute top-0 left-0 h-full bg-fuchsia-600 transition-all duration-300 ease-out shadow-[0_0_15px_#d946ef]"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[200] bg-[#050505] flex flex-col items-center justify-center font-mono">
      <div className="w-full max-w-md px-8 text-center">
        <div className="mb-4 text-white text-lg tracking-widest font-bold animate-pulse">
          {bootMessage}
        </div>
        
        <div className="relative w-full h-1 bg-gray-900 overflow-hidden rounded-full">
          <div 
            className="absolute top-0 left-0 h-full bg-fuchsia-600 transition-all duration-300 ease-out"
            style={{ width: `${progress}%`, boxShadow: '0 0 10px #d946ef' }}
          ></div>
        </div>
        
        <div className="mt-4 text-fuchsia-500 font-bold text-sm tracking-widest">
          {Math.floor(progress)}%
        </div>
      </div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-fuchsia-900/10 blur-[120px] rounded-full pointer-events-none"></div>
    </div>
  );
};

export default LoadingScreen;
