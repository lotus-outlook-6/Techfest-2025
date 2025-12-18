import React, { useState, useEffect, useMemo } from 'react';

const LoadingScreen: React.FC = () => {
  const [progress, setProgress] = useState(0);
  
  const messages = useMemo(() => [
    "Building the site!",
    "Building the page...",
    "Initializing core systems...",
    "Parsing logic gates...",
    "Constructing the digital realm...",
    "Syncing neural pathways...",
    "Fetching data fragments...",
    "Assembling YANTRAKSH..."
  ], []);

  const message = useMemo(() => {
    return messages[Math.floor(Math.random() * messages.length)];
  }, [messages]);

  useEffect(() => {
    const duration = 3000; // 3 seconds
    const intervalTime = 30; // Update every 30ms
    const totalSteps = duration / intervalTime;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const nextProgress = Math.min(100, (currentStep / totalSteps) * 100);
      setProgress(nextProgress);

      if (currentStep >= totalSteps) {
        clearInterval(timer);
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-[200] bg-[#050505] flex flex-col items-center justify-center font-mono">
      <div className="w-full max-w-md px-8 text-center">
        <div className="mb-4 text-white text-lg tracking-widest font-bold animate-pulse">
          {message}
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
      
      {/* Subtle background flair */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-fuchsia-900/10 blur-[120px] rounded-full pointer-events-none"></div>
    </div>
  );
};

export default LoadingScreen;