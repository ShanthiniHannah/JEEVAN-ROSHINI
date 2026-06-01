import React, { useRef, useEffect, useCallback } from 'react';

/**
 * InteractiveBackground — Community Health Ecosystem
 *
 * Instead of medical crosses and hexagons, this canvas renders a
 * living "healthcare ecosystem" with connected care nodes:
 *   Village • Family • Pregnancy • Vaccination • Nutrition
 *   Mental Health • Elderly • Training • Wellness
 *
 * Particles are labeled care nodes with glowing connections.
 * Mouse interaction creates a "care pathway" effect.
 */
export default function InteractiveBackground({ theme = 'dark' }) {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const particlesRef = useRef([]);
  const animFrameRef = useRef(null);

  const isLight = theme === 'light';

  // Community health node types with colors
  const nodeTypes = [
    { icon: '🏘️', label: 'Village',      color: isLight ? [14,116,144] : [34,211,238] },
    { icon: '👨‍👩‍👧‍👦', label: 'Family',       color: isLight ? [5,150,105]  : [52,211,153] },
    { icon: '🤰', label: 'Maternal',     color: isLight ? [124,58,237] : [167,139,250] },
    { icon: '💉', label: 'Vaccination',  color: isLight ? [14,116,144] : [34,211,238] },
    { icon: '🍎', label: 'Nutrition',    color: isLight ? [217,119,6]  : [251,191,36] },
    { icon: '🧠', label: 'Wellness',     color: isLight ? [124,58,237] : [167,139,250] },
    { icon: '👴', label: 'Elderly',      color: isLight ? [5,150,105]  : [52,211,153] },
    { icon: '📋', label: 'Training',     color: isLight ? [14,116,144] : [34,211,238] },
    { icon: '❤️', label: 'Care',         color: isLight ? [225,29,72]  : [251,113,133] },
    { icon: '🏥', label: 'PHC',          color: isLight ? [5,150,105]  : [52,211,153] },
    { icon: '🌿', label: 'Wellbeing',    color: isLight ? [13,148,136] : [45,212,191] },
    { icon: '👶', label: 'Child',        color: isLight ? [217,119,6]  : [251,191,36] },
    { icon: '💧', label: 'Water',        color: isLight ? [14,116,144] : [103,232,249] },
    { icon: '🩺', label: 'Screening',    color: isLight ? [14,116,144] : [34,211,238] },
  ];

  const initParticles = useCallback((width, height) => {
    const area = width * height;
    const count = Math.min(Math.max(Math.floor(area / 22000), 20), 60);
    const particles = [];

    for (let i = 0; i < count; i++) {
      const nodeType = nodeTypes[i % nodeTypes.length];

      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        size: 3 + Math.random() * 3,
        nodeType,
        opacity: 0.12 + Math.random() * 0.25,
        pulsePhase: Math.random() * Math.PI * 2,
        pulseSpeed: 0.004 + Math.random() * 0.01,
        showLabel: Math.random() > 0.5, // Only some nodes show labels
      });
    }
    return particles;
  }, [isLight]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w, h;

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w;
      canvas.height = h;
      particlesRef.current = initParticles(w, h);
    };

    resize();
    window.addEventListener('resize', resize);

    const handleMouse = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    const handleMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 };
    };
    window.addEventListener('mousemove', handleMouse);
    window.addEventListener('mouseleave', handleMouseLeave);

    const CONNECTION_DIST = 160;
    const CURSOR_DIST = 200;

    const animate = () => {
      ctx.clearRect(0, 0, w, h);
      const particles = particlesRef.current;
      const mouse = mouseRef.current;

      // Update & draw particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const [r, g, b] = p.nodeType.color;

        // Move
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around edges
        if (p.x < -30) p.x = w + 30;
        if (p.x > w + 30) p.x = -30;
        if (p.y < -30) p.y = h + 30;
        if (p.y > h + 30) p.y = -30;

        // Pulse opacity
        p.pulsePhase += p.pulseSpeed;
        const pulsedOpacity = p.opacity * (0.6 + 0.4 * Math.sin(p.pulsePhase));

        // Draw node — outer glow
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${b},${pulsedOpacity * 0.15})`;
        ctx.fill();

        // Inner circle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${b},${pulsedOpacity * 0.6})`;
        ctx.fill();

        // Core dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 0.4, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${b},${pulsedOpacity * 1.2})`;
        ctx.fill();

        // Draw label for some nodes
        if (p.showLabel && pulsedOpacity > 0.15) {
          ctx.font = `600 7px Inter, sans-serif`;
          ctx.fillStyle = `rgba(${r},${g},${b},${pulsedOpacity * 0.8})`;
          ctx.textAlign = 'center';
          ctx.fillText(p.nodeType.label, p.x, p.y + p.size + 12);
        }

        // Connect nearby particles — healthcare network lines
        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const dx = p.x - q.x;
          const dy = p.y - q.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONNECTION_DIST) {
            const lineOpacity = (1 - dist / CONNECTION_DIST) * Math.min(pulsedOpacity, 0.3);
            const [r2, g2, b2] = q.nodeType.color;
            // Gradient-like line between two node colors
            const mr = (r + r2) / 2;
            const mg = (g + g2) / 2;
            const mb = (b + b2) / 2;
            ctx.strokeStyle = `rgba(${mr},${mg},${mb},${lineOpacity * 0.5})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.stroke();
          }
        }

        // Connect to cursor — care pathway effect
        const cdx = p.x - mouse.x;
        const cdy = p.y - mouse.y;
        const cDist = Math.sqrt(cdx * cdx + cdy * cdy);
        if (cDist < CURSOR_DIST) {
          const cursorOpacity = (1 - cDist / CURSOR_DIST);

          // Glowing line to cursor
          ctx.strokeStyle = `rgba(${r},${g},${b},${cursorOpacity * 0.5})`;
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();

          // Attract gently
          p.vx += (mouse.x - p.x) * 0.00005;
          p.vy += (mouse.y - p.y) * 0.00005;
        }

        // Speed limit
        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        if (speed > 0.5) {
          p.vx *= 0.97;
          p.vy *= 0.97;
        }
      }

      // Cursor glow — warm care glow
      if (mouse.x > 0 && mouse.y > 0) {
        const gradient = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 100);
        if (isLight) {
          gradient.addColorStop(0, 'rgba(14, 116, 144, 0.06)');
          gradient.addColorStop(0.5, 'rgba(5, 150, 105, 0.03)');
          gradient.addColorStop(1, 'rgba(14, 116, 144, 0)');
        } else {
          gradient.addColorStop(0, 'rgba(34, 211, 238, 0.05)');
          gradient.addColorStop(0.5, 'rgba(52, 211, 153, 0.025)');
          gradient.addColorStop(1, 'rgba(34, 211, 238, 0)');
        }
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 100, 0, Math.PI * 2);
        ctx.fill();
      }

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouse);
      window.removeEventListener('mouseleave', handleMouseLeave);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isLight, initParticles]);

  return (
    <div className="interactive-bg-container" style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>
      <canvas
        ref={canvasRef}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'auto' }}
      />

      {/* Soft flowing waves (kept — represents flowing health data) */}
      <svg
        className="wave-svg wave-1"
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
        style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '180px', opacity: isLight ? 0.1 : 0.05, pointerEvents: 'none' }}
      >
        <path
          className="wave-path-1"
          fill="none"
          stroke={isLight ? '#0e7490' : '#06b6d4'}
          strokeWidth="1.5"
          d="M0,160 C320,260 420,60 720,160 C1020,260 1120,60 1440,160"
        />
        <path
          className="wave-path-2"
          fill="none"
          stroke={isLight ? '#059669' : '#34d399'}
          strokeWidth="1"
          d="M0,200 C360,100 480,300 780,200 C1080,100 1200,300 1440,200"
        />
      </svg>
    </div>
  );
}
