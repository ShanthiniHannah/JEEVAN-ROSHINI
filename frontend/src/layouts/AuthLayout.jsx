import React from 'react';

/**
 * AuthLayout — Full-width wrapper for the authentication screen.
 * Consumes theme and renders children in a full-height container.
 */
export default function AuthLayout({ children, theme }) {
  return (
    <div
      className="min-h-screen w-full flex flex-col font-sans overflow-x-hidden transition-colors duration-300 bg-[var(--bg-page)] text-[var(--text-primary)]"
    >
      {/* Dot grid overlay */}
      <div className="med-grid" />

      {/* Content wrapper */}
      <div className="w-full min-h-screen flex flex-col relative z-10">
        {children}
      </div>
    </div>
  );
}
