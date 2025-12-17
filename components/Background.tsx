import React, { useEffect, useRef } from 'react';

// Classes defined outside to be reusable across effects
class Blob {
  x: number;
  y: number;
  radius: number;
  vx: number;
  vy: number;
  color: string;
  alpha: number;
  t: number;

  constructor(width: number, height: number) {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.radius = Math.random() * 250 + 150; // Large soft blobs
    this.vx = (Math.random() - 0.5) * 0.5; // Slow drift
    this.vy = (Math.random() - 0.5) * 0.5;
    // Pink/Purple palette
    const colors = [
      '217, 70, 239', // fuchsia-500
      '168, 85, 247', // purple-500
      '236, 72, 153', // pink-500
      '192, 38, 211', // fuchsia-700
      '255, 0, 255'   // magenta
    ];
    this.color = colors[Math.floor(Math.random() * colors.length)];
    // Random initial phase
    this.t = Math.random() * Math.PI * 2;
    this.alpha = 0.3; 
  }

  update(width: number, height: number) {
    this.x += this.vx;
    this.y += this.vy;
    
    // Wrap around screen
    if (this.x < -this.radius * 2) this.x = width + this.radius;
    if (this.x > width + this.radius * 2) this.x = -this.radius;
    if (this.y < -this.radius * 2) this.y = height + this.radius;
    if (this.y > height + this.radius * 2) this.y = -this.radius;

    // Subtle alpha pulsing
    this.t += 0.005;
    // Range 0.2 - 0.45
    this.alpha = 0.325 + Math.sin(this.t) * 0.125;
  }

  draw(ctx: CanvasRenderingContext2D) {
    const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius);
    gradient.addColorStop(0, `rgba(${this.color}, ${this.alpha})`);
    gradient.addColorStop(0.5, `rgba(${this.color}, ${this.alpha * 0.6})`);
    gradient.addColorStop(1, `rgba(${this.color}, 0)`);
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
  }
}

class Particle {
  x: number;
  y: number;
  size: number;
  vx: number;
  vy: number;
  color: string;
  alpha: number;

  constructor(width: number, height: number) {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.size = Math.random() * 2 + 0.5;
    this.vx = (Math.random() - 0.5) * 0.8; 
    this.vy = (Math.random() - 0.5) * 0.8;
    this.color = Math.random() > 0.5 ? '255, 255, 255' : '236, 72, 153';
    this.alpha = Math.random() * 0.5 + 0.3;
  }

  update(width: number, height: number) {
    this.x += this.vx;
    this.y += this.vy;

    if (this.x < 0) this.x = width;
    if (this.x > width) this.x = 0;
    if (this.y < 0) this.y = height;
    if (this.y > height) this.y = 0;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = `rgba(${this.color}, ${this.alpha})`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

interface BackgroundProps {
  burstTrigger?: number;
}

const Background: React.FC<BackgroundProps> = ({ burstTrigger = 0 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const blobsRef = useRef<Blob[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const dimsRef = useRef({ width: 0, height: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const init = () => {
        const width = window.innerWidth || document.documentElement.clientWidth || 1024;
        const height = window.innerHeight || document.documentElement.clientHeight || 768;
        dimsRef.current = { width, height };
        canvas.width = width;
        canvas.height = height;
        
        if (blobsRef.current.length === 0) {
            for (let i = 0; i < 15; i++) {
                blobsRef.current.push(new Blob(width, height));
            }
            for (let i = 0; i < 80; i++) {
                particlesRef.current.push(new Particle(width, height));
            }
        }
    };
    init();

    const handleResize = () => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        dimsRef.current = { width, height };
        canvas.width = width;
        canvas.height = height;
    };
    window.addEventListener('resize', handleResize);

    const animate = () => {
      const { width, height } = dimsRef.current;
      if (!ctx || width === 0) return;
      
      // Clear the canvas fully to transparent before drawing the frame
      ctx.clearRect(0, 0, width, height);
      
      // Draw Base Background Color
      // Explicitly using source-over to ensure base color is solid
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = '#050205'; 
      ctx.fillRect(0, 0, width, height);

      // Draw Blobs (Background glow)
      // Use 'screen' or 'lighter' to make them glow against the dark background
      ctx.globalCompositeOperation = 'screen';
      blobsRef.current.forEach(b => {
        b.update(width, height);
        b.draw(ctx);
      });

      // Draw Particles (Foreground dust)
      ctx.globalCompositeOperation = 'source-over';
      particlesRef.current.forEach(p => {
        p.update(width, height);
        p.draw(ctx);
      });

      requestAnimationFrame(animate);
    };

    const animationId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  useEffect(() => {
    if (burstTrigger > 0) {
        const { width, height } = dimsRef.current;
        if (width > 0) {
            for (let i = 0; i < 3; i++) {
                const b = new Blob(width, height);
                b.t = Math.PI * 1.5; 
                blobsRef.current.push(b);
            }
        }
    }
  }, [burstTrigger]);

  return <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none" />;
};

export default Background;