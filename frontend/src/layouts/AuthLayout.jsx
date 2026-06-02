import React from 'react';
import CommunityHealthIllustration from '../components/CommunityHealthIllustration';

/**
 * AuthLayout — Minimal wrapper for the login/authentication screens.
 * Provides animated background, gradient orbs, and the ECG heart illustration.
 */
export default function AuthLayout({ children, theme }) {
  const isLight = theme === 'light';

  return (
    <div
      className={`min-h-screen flex flex-col justify-center items-center p-4 relative font-sans overflow-hidden theme-transition ${isLight ? 'text-slate-800' : 'text-slate-100'}`}
      style={{
        backgroundColor: isLight ? '#eef6fa' : '#020c14',
        backgroundImage: isLight
          ? 'url(/login-bg-new.png)'
          : 'linear-gradient(rgba(2, 12, 20, 0.75), rgba(2, 12, 20, 0.75)), url(/login-bg-new.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Dot grid overlay */}
      <div className="med-grid" />

      {/* Animated glow orbs */}
      <div className="pulse-orb pulse-orb-1" />
      <div className="pulse-orb pulse-orb-2" />
      <div className="pulse-orb pulse-orb-3" />

      {/* Page content */}
      <div className="w-full max-w-md flex flex-col items-center gap-6 relative z-10 px-4">
        {children}
      </div>

      {/* Pulsing heart ECG illustration */}
      <div className="w-screen h-[180px] flex justify-center items-center relative z-10 mt-4 overflow-hidden pointer-events-none">
        <CommunityHealthIllustration theme={theme} />
      </div>
    </div>
  );
}
