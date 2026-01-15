
import React, { useEffect, useRef } from 'react';

// Boosted intensity palette: Fuchsia, Purple, Navy Blue, Deep Green
const NEON_COLORS = [
  'rgba(217, 70, 239, 0.25)', // 0: Fuchsia
  'rgba(168, 85, 247, 0.25)', // 1: Purple
  'rgba(30, 58, 138, 0.22)',  // 2: Navy Blue
  'rgba(6, 78, 59, 0.25)',    // 3: Deep Green
];

class Particle {
  x: number;
  y: number;
  size: number;
  vx: number;
  vy: number;
  color: string;
  alpha: number;
  twinkleSpeed: number;

  constructor(width: number, height: number) {
    this.x = Math.random() * (width || 1920);
    this.y = Math.random() * (height || 1080);
    this.size = Math.random() * Math.random() * 2.2 + 0.3;
    this.vx = (Math.random() - 0.5) * 0.25; 
    this.vy = (Math.random() - 0.5) * 0.25;
    
    const palette = ['255, 255, 255', '255, 255, 255', '217, 70, 239', '30, 58, 138', '200, 200, 255'];
    this.color = palette[Math.floor(Math.random() * palette.length)];
    this.alpha = Math.random() * 0.5 + 0.1;
    this.twinkleSpeed = Math.random() * 0.01;
  }

  update(width: number, height: number) {
    this.x += this.vx;
    this.y += this.vy;

    if (this.x < -20) this.x = width + 20;
    if (this.x > width + 20) this.x = -20;
    if (this.y < -20) this.y = height + 20;
    if (this.y > height + 20) this.y = -20;
    
    this.alpha += Math.sin(Date.now() * this.twinkleSpeed) * 0.005;
    if (this.alpha < 0.1) this.alpha = 0.1;
    if (this.alpha > 0.7) this.alpha = 0.7;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = `rgba(${this.color}, ${this.alpha})`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    
    if (this.size > 1.8) {
        ctx.shadowBlur = 4;
        ctx.shadowColor = `rgba(${this.color}, ${this.alpha})`;
        ctx.fill();
        ctx.shadowBlur = 0;
    }
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
  fadeSpeed: number = 0.003;

  constructor(width: number, height: number, startInstant = false, forcedColor?: string, forcedX?: number, forcedY?: number) {
    const isMobile = width < 768;
    // Increased mobile radius to match desktop vibrancy relative to screen
    const baseRadius = isMobile ? width * 0.8 : 450;
    const varRadius = isMobile ? width * 0.4 : 400;
    this.radius = Math.random() * varRadius + baseRadius;
    
    this.x = forcedX !== undefined ? forcedX : Math.random() * width;
    this.y = forcedY !== undefined ? forcedY : Math.random() * height;
    
    const velScale = forcedColor ? (isMobile ? 0.04 : 0.06) : 0.12;
    this.vx = (Math.random() - 0.5) * velScale;
    this.vy = (Math.random() - 0.5) * velScale;
    
    this.color = forcedColor || NEON_COLORS[Math.floor(Math.random() * NEON_COLORS.length)];
    
    if (startInstant) {
      this.state = 'stable';
      this.alpha = this.targetAlpha;
    } else {
      this.state = 'appearing';
      this.alpha = 0;
    }
    
    this.lifeTimer = (forcedColor ? 999999 : (15 + Math.random() * 20)) * 60; 
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
    gradient.addColorStop(0.4, this.color.replace('0.25', '0.08').replace('0.22', '0.06'));
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
      // Allow bursts on all devices now
      const burstCount = width < 768 ? 2 : 3;
      for (let i = 0; i < burstCount; i++) {
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
        
        const isMobile = width < 768;

        if (particlesRef.current.length === 0) {
            // Increased particle count for mobile to match vibrancy
            const count = isMobile ? 250 : 380;
            for (let i = 0; i < count; i++) {
                particlesRef.current.push(new Particle(width, height));
            }
        }

        if (blobsRef.current.length === 0) {
            // Corner anchors - Fuchsia, Purple, Navy, Green
            blobsRef.current.push(new Blob(width, height, true, NEON_COLORS[2], 0, 0));
            blobsRef.current.push(new Blob(width, height, true, NEON_COLORS[3], width, 0));
            blobsRef.current.push(new Blob(width, height, true, NEON_COLORS[0], 0, height));
            blobsRef.current.push(new Blob(width, height, true, NEON_COLORS[1], width, height));

            // Added random blobs for mobile to fix the "drastic change" in center intensity
            const randomCount = isMobile ? 3 : 6;
            for (let i = 0; i < randomCount; i++) {
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
      const isMobile = width < 768;
      const maxBlobs = isMobile ? 8 : 12;
      
      if (width > 0 && blobsRef.current.filter(b => b.state !== 'disappearing').length < maxBlobs) {
          blobsRef.current.push(new Blob(width, height));
      }
    }, 3500); 

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
