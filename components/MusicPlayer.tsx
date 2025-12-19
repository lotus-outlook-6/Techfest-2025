
import React, { useState, useRef, useEffect } from 'react';

interface MusicPlayerProps {
  onPlayChange?: (isPlaying: boolean) => void;
  hideButton?: boolean;
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({ onPlayChange, hideButton = false }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(() => {
    const saved = localStorage.getItem('musicVolume');
    return saved !== null ? parseFloat(saved) : 0.6;
  });
  
  const [isHovered, setIsHovered] = useState(false);
  const [isExtended, setIsExtended] = useState(false);
  const [isChanging, setIsChanging] = useState(false);
  
  const hoverTimerRef = useRef<number | null>(null);
  const changingTimerRef = useRef<number | null>(null);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.loop = true;
      audioRef.current.volume = volume;
    }
    
    return () => {
        if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
        if (hoverTimerRef.current) window.clearTimeout(hoverTimerRef.current);
        if (changingTimerRef.current) window.clearTimeout(changingTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (audioRef.current && !fadeIntervalRef.current) {
      audioRef.current.volume = volume;
    }
    localStorage.setItem('musicVolume', volume.toString());

    // Transition effect for the volume number color
    setIsChanging(true);
    if (changingTimerRef.current) window.clearTimeout(changingTimerRef.current);
    changingTimerRef.current = window.setTimeout(() => {
      setIsChanging(false);
    }, 1500); 
  }, [volume]);

  const handleMouseEnter = () => {
    setIsHovered(true);
    // 5-second hover before extending vertically
    hoverTimerRef.current = window.setTimeout(() => {
      setIsExtended(true);
    }, 5000);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setIsExtended(false);
    if (hoverTimerRef.current) {
      window.clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }
  };

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!audioRef.current) return;
    
    if (fadeIntervalRef.current) {
        clearInterval(fadeIntervalRef.current);
        fadeIntervalRef.current = null;
    }

    if (isPlaying) {
      setIsPlaying(false);
      if (onPlayChange) onPlayChange(false);
      
      const startVol = audioRef.current.volume;
      const steps = 15;
      const stepValue = startVol / steps;
      
      fadeIntervalRef.current = window.setInterval(() => {
          if (audioRef.current && audioRef.current.volume > stepValue) {
              audioRef.current.volume -= stepValue;
          } else {
              if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
              fadeIntervalRef.current = null;
              if (audioRef.current) {
                  audioRef.current.pause();
                  audioRef.current.volume = volume;
              }
          }
      }, 100);
    } else {
      audioRef.current.volume = volume;
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => console.log("Playback blocked:", error));
      }
      setIsPlaying(true);
      if (onPlayChange) onPlayChange(true);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(parseFloat(e.target.value));
  };

  return (
    <>
      <audio
        ref={audioRef}
        loop={true}
        src="https://www.tecnoesis.co.in/bgm.mp3"
      />
      
      {!hideButton && (
        <div 
          className={`
            fixed top-8 right-8 z-[150] flex flex-col items-center
            bg-[#0c0c0c] border border-fuchsia-500/30 overflow-hidden
            transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)]
            shadow-[0_0_25px_rgba(217,70,239,0.2)]
            ${isExtended 
              ? 'w-72 h-40 rounded-[2.5rem] border-fuchsia-500/50' 
              : (isHovered ? 'w-72 h-16 rounded-2xl border-fuchsia-500' : 'w-16 h-16 rounded-[38%]')}
          `}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Top Control Bar - Parent is flex items-center justify-center */}
          <div 
            className="w-full h-16 flex items-center justify-center shrink-0 cursor-pointer relative group/inner"
            onClick={togglePlay}
          >
            {/* Shimmer Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-fuchsia-500/10 to-transparent -translate-x-full group-hover/inner:animate-[shimmer_1.5s_infinite]"></div>

            <div className="flex items-center justify-center shrink-0 z-10">
              {/* Perfectly Centered Icon Container */}
              <div className="relative flex items-center justify-center w-8 h-8 shrink-0">
                {isPlaying ? (
                   <div className="flex gap-1 items-center h-4">
                     <div className="w-1 bg-fuchsia-500 h-full animate-[bounce_0.5s_infinite]"></div>
                     <div className="w-1 bg-fuchsia-500 h-3/4 animate-[bounce_0.7s_infinite]"></div>
                     <div className="w-1 bg-fuchsia-500 h-full animate-[bounce_0.6s_infinite]"></div>
                   </div>
                ) : (
                   <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[12px] border-l-fuchsia-500 border-b-[8px] border-b-transparent ml-1.5 drop-shadow-[0_0_5px_rgba(217,70,239,0.8)]"></div>
                )}
              </div>

              {/* Sliding Text Label Transition - ml-0 when hidden to keep icon perfectly centered */}
              <div className={`
                relative h-6 overflow-hidden transition-all duration-500
                ${isHovered ? 'opacity-100 max-w-[200px] ml-2' : 'opacity-0 max-w-0 ml-0'}
              `}>
                <div 
                  className="flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]"
                  style={{ transform: `translateY(${isPlaying ? '-50%' : '0%'})` }}
                >
                  <span className="h-6 flex items-center font-mono text-xs md:text-sm font-bold tracking-[0.2em] text-fuchsia-500 whitespace-nowrap">
                    PLAY_MUSIC
                  </span>
                  <span className="h-6 flex items-center font-mono text-xs md:text-sm font-bold tracking-[0.2em] text-fuchsia-500 whitespace-nowrap">
                    YANTRAKSH_BGM
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Volume Section */}
          <div className={`
            w-full flex flex-col items-center px-6 transition-all duration-500 ease-out
            ${isExtended ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}
          `}>
             <div className="w-full h-px bg-fuchsia-500/10 mb-6"></div>
             
             <div className="relative w-full flex items-center justify-between gap-4">
                <div className="relative flex-1 h-12 bg-white/5 rounded-2xl flex items-center px-1 overflow-hidden">
                    <input 
                      type="range" 
                      min="0" 
                      max="1" 
                      step="0.01" 
                      value={volume} 
                      onChange={handleVolumeChange}
                      className="material-you-slider w-full h-10 cursor-pointer z-20"
                      style={{
                        '--volume-percent': `${volume * 100}%`
                      } as React.CSSProperties}
                    />
                </div>
                
                {/* Volume Number Display - Fixed width container prevents layout vibration */}
                <div className={`
                    flex flex-col items-end justify-center transition-all duration-700 ease-in-out w-16 shrink-0
                    ${isChanging ? 'text-fuchsia-400 drop-shadow-[0_0_12px_rgba(217,70,239,0.8)]' : 'text-white opacity-40'}
                `}>
                    <span className="text-3xl font-bold tracking-tighter leading-none select-none" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                        {Math.round(volume * 100)}
                    </span>
                </div>
             </div>
          </div>
        </div>
      )}

      <style>{`
        /* Material You Slider Custom Track and Thumb */
        .material-you-slider {
          -webkit-appearance: none;
          background: transparent;
          outline: none;
          position: relative;
        }

        .material-you-slider::-webkit-slider-runnable-track {
          width: 100%;
          height: 40px;
          background: rgba(255, 255, 255, 0.03);
          border-radius: 14px;
          overflow: hidden;
          background: linear-gradient(to right, #d946ef var(--volume-percent), rgba(255,255,255,0.03) var(--volume-percent));
        }

        .material-you-slider::-moz-range-track {
          width: 100%;
          height: 40px;
          background: rgba(255, 255, 255, 0.03);
          border-radius: 14px;
          overflow: hidden;
        }

        .material-you-slider::-moz-range-progress {
          background-color: #d946ef;
          height: 40px;
        }

        .material-you-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          height: 40px;
          width: 6px;
          background: #ffffff;
          border-radius: 3px;
          cursor: pointer;
          box-shadow: -407px 0 0 400px transparent;
          position: relative;
          z-index: 30;
          transition: transform 0.2s ease, width 0.2s ease;
        }
        
        .material-you-slider:active::-webkit-slider-thumb {
          transform: scaleY(0.85) scaleX(1.4);
          background: #ffffff;
        }

        .material-you-slider::-moz-range-thumb {
          height: 40px;
          width: 6px;
          background: #ffffff;
          border-radius: 3px;
          border: none;
          cursor: pointer;
        }
      `}</style>
    </>
  );
};

export default MusicPlayer;
