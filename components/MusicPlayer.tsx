
import React, { useState, useRef, useEffect } from 'react';

interface MusicPlayerProps {
  onPlayChange?: (isPlaying: boolean) => void;
  hideButton?: boolean;
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({ onPlayChange, hideButton = false }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    // Explicitly set loop property on mount to ensure browser acknowledges it
    if (audioRef.current) {
      audioRef.current.loop = true;
      audioRef.current.volume = 0.6; // Set initial volume to 60%
    }
    
    return () => {
        if (fadeIntervalRef.current) {
            clearInterval(fadeIntervalRef.current);
        }
    };
  }, []);

  const togglePlay = () => {
    if (!audioRef.current) return;
    
    // Clear any existing fade interval
    if (fadeIntervalRef.current) {
        clearInterval(fadeIntervalRef.current);
        fadeIntervalRef.current = null;
    }

    if (isPlaying) {
      // -- STOP SEQUENCE --
      // 1. Notify parent immediately so visual effects (Matrix) stop spawning
      setIsPlaying(false);
      if (onPlayChange) onPlayChange(false);
      
      // 2. Start fading out volume slowly (over ~3 seconds)
      fadeIntervalRef.current = window.setInterval(() => {
          if (audioRef.current && audioRef.current.volume > 0.05) {
              audioRef.current.volume -= 0.05;
          } else {
              // Fade complete
              if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
              if (audioRef.current) {
                  audioRef.current.pause();
                  audioRef.current.volume = 0.6; // Reset volume for next play
              }
          }
      }, 250);

    } else {
      // -- START SEQUENCE --
      audioRef.current.volume = 0.6;
      
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.log("Playback prevented:", error);
        });
      }
      
      setIsPlaying(true);
      if (onPlayChange) onPlayChange(true);
    }
  };

  const handleEnded = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    }
  };

  return (
    <>
      <audio
        ref={audioRef}
        loop={true}
        onEnded={handleEnded}
        // Sci-Fi Ambient Background Track
        src="https://cdn.pixabay.com/audio/2025/06/02/audio_4b86d1cc4c.mp3" 
      />
      
      {/* Conditionally render the button based on hideButton prop */}
      {!hideButton && (
        <div className="fixed top-4 right-4 md:top-8 md:right-8 z-50">
          <button
            onClick={togglePlay}
            className={`
                relative group overflow-hidden px-3 py-2 md:px-4 md:py-2.5 
                border transition-all duration-300 ease-out
                font-mono text-xs md:text-sm tracking-widest uppercase
                flex items-center backdrop-blur-sm
                ${isPlaying 
                  ? 'border-fuchsia-500 text-fuchsia-500 bg-black/60 shadow-[0_0_15px_rgba(217,70,239,0.3)]' 
                  : 'border-gray-700 text-gray-500 bg-black/40 hover:border-gray-500 hover:text-gray-300'}
            `}
          >
            {/* Animated Background Scanline on Hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-fuchsia-500/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>

            {/* Icon */}
            <div className="relative flex items-center justify-center w-3 h-3 shrink-0">
              {isPlaying ? (
                 <div className="flex gap-0.5 items-end h-full">
                   <div className="w-0.5 bg-current h-full animate-[bounce_0.5s_infinite]"></div>
                   <div className="w-0.5 bg-current h-2/3 animate-[bounce_0.7s_infinite]"></div>
                   <div className="w-0.5 bg-current h-full animate-[bounce_0.6s_infinite]"></div>
                 </div>
              ) : (
                 <div className="w-0 h-0 border-t-[5px] border-t-transparent border-l-[8px] border-l-current border-b-[5px] border-b-transparent ml-0.5"></div>
              )}
            </div>

            <span className="relative font-bold max-w-0 opacity-0 overflow-hidden whitespace-nowrap group-hover:max-w-[150px] group-hover:opacity-100 group-hover:ml-3 transition-all duration-500 ease-out">
              {isPlaying ? 'SYSTEM_AUDIO' : 'PLAY_MUSIC'}
            </span>
          </button>
        </div>
      )}
    </>
  );
};

export default MusicPlayer;
