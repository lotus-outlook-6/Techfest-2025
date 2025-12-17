import React, { useEffect, useRef } from 'react';

interface MatrixRainProps {
  active: boolean;
}

const MatrixRain: React.FC<MatrixRainProps> = ({ active }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const activeRef = useRef(active);

  // Keep track of active state in a ref to use inside the animation loop
  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const fontSize = 14;
    const columns = Math.ceil(width / fontSize);
    
    // Initialize drops below the screen so they are "ready" but invisible.
    const drops: number[] = [];
    for (let i = 0; i < columns; i++) {
        drops[i] = height + 100;
    }

    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()_+-=[]{}|;:,.<>/?アィイウェエオカガキギクグケゲコゴサザシジスズセゼソゾタダチヂッツヅテデトドナニヌネノハバパヒビピフブプヘベペホボポマミムメモャヤュユョヨラリルレロヮワヰヱヲンヴヵヶ";

    let animationId: number;
    let lastTime = 0;

    const draw = (timeStamp: number) => {
        // Throttle to ~20fps for the retro feel
        if (timeStamp - lastTime < 50) { 
            animationId = requestAnimationFrame(draw);
            return;
        }
        lastTime = timeStamp;

        // FADE OUT EFFECT
        // Instead of painting semi-transparent black (which accumulates to opaque black),
        // we use 'destination-out' to fade existing pixels towards transparency.
        ctx.globalCompositeOperation = 'destination-out';
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'; 
        ctx.fillRect(0, 0, width, height);

        // Reset composition for drawing new text
        ctx.globalCompositeOperation = 'source-over';
        ctx.fillStyle = '#d946ef'; // Fuchsia-500
        ctx.font = `${fontSize}px monospace`;

        for (let i = 0; i < drops.length; i++) {
            // Draw current character if it's visible on screen
            const x = i * fontSize;
            const y = drops[i];

            if (y > -50 && y < height) {
                const text = chars[Math.floor(Math.random() * chars.length)];
                ctx.fillText(text, x, y);
            }

            // Move drop down
            drops[i] += fontSize;

            // Reset logic
            if (drops[i] > height) {
                if (activeRef.current) {
                    // If active, randomly respawn at the top
                    if (Math.random() > 0.975) {
                        drops[i] = 0;
                    }
                } else {
                    // If inactive, keep it off screen
                    if (drops[i] > height + 200) {
                        drops[i] = height + 200;
                    }
                }
            }
        }
        
        animationId = requestAnimationFrame(draw);
    };

    const handleResize = () => {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
        // Expand drops array if width increased
        const newColumns = Math.ceil(width / fontSize);
        if (newColumns > drops.length) {
            for (let i = drops.length; i < newColumns; i++) {
                drops[i] = height + 100;
            }
        }
    };
    window.addEventListener('resize', handleResize);

    animationId = requestAnimationFrame(draw);

    return () => {
        window.removeEventListener('resize', handleResize);
        cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas 
        ref={canvasRef} 
        className="fixed inset-0 z-0 pointer-events-none opacity-40 mix-blend-screen"
    />
  );
};

export default MatrixRain;