import React, { useMemo, useState, useEffect } from 'react';

/**
 * CommunityHealthIllustration
 * 
 * A clean, professional medical animation.
 * Features a 3D pulsing heart with a double-beat heartbeat animation,
 * and a glowing neon ECG pulse line that passes *on top* of the heart.
 * The ECG line runs dynamically from end-to-end of the screen.
 */
export default function CommunityHealthIllustration({ theme = 'dark' }) {
  const isLight = theme === 'light';

  // State to track screen/window width to run the ECG line end-to-end
  const [width, setWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Palette matching light/dark theme
  const colors = useMemo(() => ({
    heartGradStart: '#ff6b8b',
    heartGradMid:   '#e0115f',
    heartGradEnd:   '#800020',
    ecgFaint:    isLight ? 'rgba(14, 116, 144, 0.12)' : 'rgba(34, 211, 238, 0.08)',
    ecgGlow:     isLight ? '#0891b2' : '#22d3ee',
  }), [isLight]);

  const centerY = 90;
  const centerX = width / 2;

  // Path data for the ECG line running end-to-end
  const ecgPathData = `M 0,${centerY} H ${centerX - 90} L ${centerX - 75},${centerY + 15} L ${centerX - 65},${centerY - 35} L ${centerX - 50},${centerY + 55} L ${centerX - 35},${centerY - 10} L ${centerX - 25},${centerY + 8} L ${centerX - 15},${centerY} H ${centerX + 15} L ${centerX + 25},${centerY + 8} L ${centerX + 35},${centerY - 10} L ${centerX + 50},${centerY + 55} L ${centerX + 65},${centerY - 35} L ${centerX + 75},${centerY + 15} L ${centerX + 90},${centerY} H ${width}`;

  return (
    <div className="w-full h-full relative overflow-hidden flex items-center justify-center select-none">
      {/* Stylesheet for Keyframe Animations */}
      <style>{`
        @keyframes lubDub {
          0% { transform: scale(1); }
          14% { transform: scale(1.12); }
          28% { transform: scale(1); }
          42% { transform: scale(1.15); }
          70% { transform: scale(1); }
          100% { transform: scale(1); }
        }

        .animated-heart {
          transform-origin: 0px 0px;
          animation: lubDub 1.8s infinite ease-in-out;
        }

        @keyframes ecgFlow {
          0% { stroke-dashoffset: 1200; }
          100% { stroke-dashoffset: 0; }
        }

        .ecg-line-glow {
          stroke-dasharray: 200 1000;
          animation: ecgFlow 4.5s infinite linear;
        }
      `}</style>

      {/* SVG Canvas */}
      <svg
        viewBox={`0 0 ${width} 180`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full relative z-10"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {/* Fading Radial Highlight behind the heart (No sharp borders) */}
          <radialGradient id="radialGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={isLight ? 'rgba(56, 189, 248, 0.25)' : 'rgba(34, 211, 238, 0.14)'} />
            <stop offset="65%" stopColor={isLight ? 'rgba(56, 189, 248, 0.05)' : 'rgba(34, 211, 238, 0.02)'} />
            <stop offset="100%" stopColor="rgba(0,0,0,0)" />
          </radialGradient>

          {/* 3D Heart Gradient */}
          <radialGradient id="heart3DGrad" cx="35%" cy="30%" r="65%">
            <stop offset="0%" stopColor={colors.heartGradStart} />
            <stop offset="60%" stopColor={colors.heartGradMid} />
            <stop offset="100%" stopColor={colors.heartGradEnd} />
          </radialGradient>

          {/* Soft Drop Shadows */}
          <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="5" stdDeviation="4" floodColor="#000" floodOpacity="0.2" />
          </filter>
          <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          {/* Gloss Highlight Path */}
          <linearGradient id="glossGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fff" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* ═══ SOFT GLOW BACKGROUND ═══ */}
        <circle cx={centerX} cy={centerY} r="100" fill="url(#radialGlow)" />

        {/* ═══ CENTRAL PULSING 3D HEART ═══ */}
        {/* Heart shadow (Centered inside scale group) */}
        <g transform={`translate(${centerX}, ${centerY})`}>
          <g className="animated-heart">
            <path
              d="M 0, -32 C 0,-63 -43,-63 -43,-32 C -43,2 -1,29 0,46 C 1,29 43,2 43,-32 C 43,-63 0,-63 0,-32 Z"
              fill="#000"
              opacity="0.18"
              transform="translate(0, 8) scale(1.2)"
              filter="url(#softShadow)"
            />
          </g>
        </g>

        {/* Main 3D Heart */}
        <g transform={`translate(${centerX}, ${centerY})`}>
          <g className="animated-heart">
            {/* Main Body with Radial 3D Gradient */}
            <path
              d="M 0, -32 C 0,-63 -43,-63 -43,-32 C -43,2 -1,29 0,46 C 1,29 43,2 43,-32 C 43,-63 0,-63 0,-32 Z"
              fill="url(#heart3DGrad)"
              transform="scale(1.2)"
            />

            {/* Top-Left Gloss Highlight for 3D realism */}
            <path
              d="M -22, -35 C -35,-30 -35,-15 -25,-12 C -18,-10 -15,-20 -22,-35 Z"
              fill="url(#glossGrad)"
              transform="scale(1.15)"
              opacity="0.8"
            />

            {/* Tiny Inner glow overlay */}
            <path
              d="M 0, -32 C 0,-63 -43,-63 -43,-32 C -43,2 -1,29 0,46 C 1,29 43,2 43,-32 C 43,-63 0,-63 0,-32 Z"
              stroke="rgba(255,255,255,0.18)"
              strokeWidth="0.8"
              fill="none"
              transform="scale(1.18)"
            />
          </g>
        </g>

        {/* ═══ ANIMATED ECG PULSE LINE ═══ */}
        {/* Faint background static ECG path */}
        <path
          d={ecgPathData}
          stroke={colors.ecgFaint}
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Glowing running ECG line */}
        <path
          d={ecgPathData}
          stroke={colors.ecgGlow}
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="ecg-line-glow"
          filter="url(#neonGlow)"
        />
      </svg>
    </div>
  );
}
