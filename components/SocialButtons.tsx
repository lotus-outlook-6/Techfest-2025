
import React from 'react';

const SocialButtons: React.FC = () => {
  return (
    <>
      <div className="fixed bottom-12 left-8 md:left-[192px] z-50 pointer-events-auto">
        <a 
          href="https://www.instagram.com/_yantraksh_" 
          target="_blank" 
          rel="noopener noreferrer"
          className="group relative flex items-center justify-center w-14 h-14 md:w-16 md:h-16 transition-all duration-300 hover:scale-110 active:scale-95"
        >
          {/* Squircle Background with Softer Glow */}
          <div className="absolute inset-0 bg-[#0c0c0c]/80 border border-fuchsia-500/20 rounded-[38%] shadow-[0_0_10px_rgba(217,70,239,0.2)] group-hover:shadow-[0_0_20px_rgba(217,70,239,0.5)] group-hover:border-fuchsia-500/40 transition-all duration-300"></div>
          
          {/* Instagram Icon (SVG) */}
          <svg 
            className="w-7 h-7 md:w-8 md:h-8 text-fuchsia-500/90 drop-shadow-[0_0_4px_rgba(217,70,239,0.6)] z-10" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
          </svg>
        </a>
      </div>

      <div className="fixed bottom-12 right-8 md:right-[192px] z-50 pointer-events-auto">
        <a 
          href="https://www.facebook.com/share/17egUW6dfC/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="group relative flex items-center justify-center w-14 h-14 md:w-16 md:h-16 transition-all duration-300 hover:scale-110 active:scale-95"
        >
          {/* Squircle Background with Softer Glow */}
          <div className="absolute inset-0 bg-[#0c0c0c]/80 border border-fuchsia-500/20 rounded-[38%] shadow-[0_0_10px_rgba(217,70,239,0.2)] group-hover:shadow-[0_0_20px_rgba(217,70,239,0.5)] group-hover:border-fuchsia-500/40 transition-all duration-300"></div>
          
          {/* Facebook Icon (SVG) */}
          <svg 
            className="w-7 h-7 md:w-8 md:h-8 text-fuchsia-500/90 drop-shadow-[0_0_4px_rgba(217,70,239,0.6)] z-10" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
          </svg>
        </a>
      </div>
    </>
  );
};

export default SocialButtons;
