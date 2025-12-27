
import React, { useEffect, useRef } from 'react';

// Softened neon palette with slightly higher base opacities for "fat" colors
const NEON_COLORS = [
  'rgba(217, 70, 239, 0.15)', // Soft Fuchsia
  'rgba(162, 28, 175, 0.12)', // Deep Purple
  'rgba(124, 58, 237, 0.12)', // Violet
  'rgba(37, 99, 235, 0.10)',  // Electric Blue
  'rgba(6, 182, 212, 0.10)',  // Cyan
  'rgba(236, 72, 153, 0.15)', // Hot Pink
  'rgba(139, 92, 246, 0.12)', // Lavender
  'rgba(255, 0, 255, 0.10)',  // Neon Magenta
];

class Particle {
  x: number;
  y: number;
  size: number;
  vx: number;
  vy: number;
  color: string;
  alpha: number;

  constructor(width: number, height: number) {
    this.x = Math.random() * (width || 1920);
    this.y = Math.random() * (height || 1080);
    this.size = Math.random() * 2 + 0.5;
    this.vx = (Math.random() - 0.5) * 0.5; 
    this.vy = (Math.random() - 0.5) * 0.5;
    this.color = Math.random() > 0.6 ? '255, 255, 255' : '236, 72, 153';
    this.alpha = Math.random() * 0.5 + 0.2;
  }

  update(width: number, height: number) {
    this.x += this.vx;
    this.y += this.vy;

    if (this.x < -20) this.x = width + 20;
    if (this.x > width + 20) this.x = -20;
    if (this.y < -20) this.y = height + 20;
    if (this.y > height + 20) this.y = -20;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = `rgba(${this.color}, ${this.alpha})`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

type BlobState = 'appearing' | 'stable' | 'disappearing' | 'dead';

class Blob {
  x: number;
  y: number;
  radius: number;
  vx: number;
  vy: number;
  color: string;
  
  state: BlobState;
  alpha: number;
  targetAlpha: number = 1.0;
  lifeTimer: number; 
  fadeSpeed: number = 0.005; // Slightly faster fades

  constructor(width: number, height: number, startInstant = false) {
    this.radius = Math.random() * 450 + 350;
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    
    this.vx = (Math.random() - 0.5) * 0.25;
    this.vy = (Math.random() - 0.5) * 0.25;
    
    this.color = NEON_COLORS[Math.floor(Math.random() * NEON_COLORS.length)];
    
    // If startInstant is true, we skip 'appearing' and go straight to 'stable'
    if (startInstant) {
      this.state = 'stable';
      this.alpha = this.targetAlpha;
    } else {
      this.state = 'appearing';
      this.alpha = 0;
    }
    
    // 20-30 seconds
    this.lifeTimer = (20 + Math.random() * 10) * 60; 
  }

  update(width: number, height: number) {
    this.x += this.vx;
    this.y += this.vy;

    const margin = this.radius;
    if (this.x < -margin) this.x = width + margin;
    if (this.x > width + margin) this.x = -margin;
    if (this.y < -margin) this.y = height + margin;
    if (this.y > height + margin) this.y = -margin;

    switch(this.state) {
      case 'appearing':
        this.alpha += this.fadeSpeed;
        if (this.alpha >= this.targetAlpha) {
          this.alpha = this.targetAlpha;
          this.state = 'stable';
        }
        break;
      case 'stable':
        this.lifeTimer--;
        if (this.lifeTimer <= 0) {
          this.state = 'disappearing';
        }
        break;
      case 'disappearing':
        this.alpha -= this.fadeSpeed;
        if (this.alpha <= 0) {
          this.alpha = 0;
          this.state = 'dead';
        }
        break;
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (this.state === 'dead') return;

    ctx.save();
    ctx.globalAlpha = this.alpha;
    
    const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius);
    gradient.addColorStop(0, this.color);
    gradient.addColorStop(1, 'transparent');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
  }
}

interface BackgroundProps {
  burstTrigger?: number;
}

const Background: React.FC<BackgroundProps> = ({ burstTrigger = 0 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const blobsRef = useRef<Blob[]>([]);
  const dimsRef = useRef({ width: 0, height: 0 });
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const { width, height } = dimsRef.current;
    if (width > 0) {
      for (let i = 0; i < 4; i++) {
        blobsRef.current.push(new Blob(width, height));
      }
    }
  }, [burstTrigger]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    const init = () => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        dimsRef.current = { width, height };
        canvas.width = width;
        canvas.height = height;
        
        if (particlesRef.current.length === 0) {
            for (let i = 0; i < 150; i++) {
                particlesRef.current.push(new Particle(width, height));
            }
        }

        if (blobsRef.current.length === 0) {
            // Spawn initial blobs with 'startInstant' so the screen isn't black
            for (let i = 0; i < 15; i++) {
                const b = new Blob(width, height, true);
                b.lifeTimer = Math.random() * b.lifeTimer;
                blobsRef.current.push(b);
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

    const spawnInterval = setInterval(() => {
      const { width, height } = dimsRef.current;
      // Maintain at least 12 active/stable blobs for that "fat" color look
      if (width > 0 && blobsRef.current.filter(b => b.state !== 'disappearing').length < 12) {
          blobsRef.current.push(new Blob(width, height));
      }
    }, 3000); 

    const animate = () => {
      const { width, height } = dimsRef.current;
      if (!ctx || width === 0) {
          requestAnimationFrame(animate);
          return;
      }
      
      ctx.fillStyle = '#050505';
      ctx.fillRect(0, 0, width, height);
      
      ctx.globalCompositeOperation = 'screen';
      blobsRef.current = blobsRef.current.filter(b => b.state !== 'dead');
      blobsRef.current.forEach(b => {
        b.update(width, height);
        b.draw(ctx);
      });

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
      clearInterval(spawnInterval);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none" />;
};

export default Background;
