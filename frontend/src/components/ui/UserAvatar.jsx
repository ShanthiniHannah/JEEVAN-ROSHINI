import React from 'react';
import { useProfile } from '../../context/ProfileContext';

/**
 * UserAvatar — Shows profile photo or coloured initials badge.
 * Used in AppShell header + anywhere a user thumbnail is needed.
 *
 * Props:
 *   user        — { name, role }
 *   size        — Tailwind size class for w/h (default: 'w-8 h-8')
 *   textSize    — Tailwind text size (default: 'text-xs')
 *   onClick     — optional click handler
 *   className   — extra classes
 */
export default function UserAvatar({ user, size = 'w-8 h-8', textSize = 'text-xs', onClick, className = '' }) {
  const { profile } = useProfile();

  const initials = (user?.name || 'U')
    .split(' ')
    .map(w => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  // Colour derived from first char
  const PALETTE = [
    ['#0057B8','#EBF4FF'], ['#0d9488','#F0FDFA'], ['#7c3aed','#F5F3FF'],
    ['#db2777','#FDF2F8'], ['#d97706','#FFFBEB'], ['#16a34a','#F0FDF4'],
  ];
  const idx = (user?.name?.charCodeAt(0) ?? 0) % PALETTE.length;
  const [bg, text] = PALETTE[idx];

  const base = `${size} rounded-full flex items-center justify-center shrink-0 overflow-hidden ring-2 ring-white/20 transition-all duration-200 ${className}`;

  if (profile?.photoDataUrl) {
    return (
      <button type="button" onClick={onClick} className={`${base} cursor-pointer hover:ring-white/50`}>
        <img
          src={profile.photoDataUrl}
          alt={user?.name}
          className="w-full h-full object-cover"
        />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={`${base} font-black cursor-pointer hover:ring-white/50 hover:brightness-110`}
      style={{ background: bg, color: text }}
    >
      <span className={textSize}>{initials}</span>
    </button>
  );
}
