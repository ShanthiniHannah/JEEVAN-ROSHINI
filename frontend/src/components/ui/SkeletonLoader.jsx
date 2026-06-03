import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

/**
 * SkeletonLoader — Loading placeholder card or row list.
 *
 * @param {Object} props
 * @param {number} [props.rows=3] - Number of placeholder rows to render
 * @param {string} [props.className] - Extra Tailwind classes
 */
export function SkeletonLoader({ rows = 3, className = '' }) {
  const shouldReduce = useReducedMotion();

  const animationProps = shouldReduce
    ? { animate: { opacity: [0.5, 1, 0.5] }, transition: { repeat: Infinity, duration: 1.5 } }
    : {
        animate: { backgroundPosition: ['200% 0', '-200% 0'] },
        transition: { repeat: Infinity, duration: 1.5, ease: 'linear' },
      };

  return (
    <div className={`space-y-4 w-full p-4 bg-slate-900/50 border border-slate-800 rounded-xl ${className}`}>
      {Array.from({ length: rows }).map((_, idx) => (
        <div key={idx} className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-800 shrink-0 animate-pulse" />
          <div className="flex-1 space-y-2">
            <motion.div
              {...animationProps}
              className="h-3 w-1/3 rounded bg-slate-800"
              style={
                shouldReduce
                  ? {}
                  : {
                      backgroundImage: 'linear-gradient(90deg, #1e293b 25%, #334155 37%, #1e293b 63%)',
                      backgroundSize: '400% 100%',
                    }
              }
            />
            <motion.div
              {...animationProps}
              className="h-2.5 w-5/6 rounded bg-slate-800"
              style={
                shouldReduce
                  ? {}
                  : {
                      backgroundImage: 'linear-gradient(90deg, #1e293b 25%, #334155 37%, #1e293b 63%)',
                      backgroundSize: '400% 100%',
                    }
              }
            />
          </div>
        </div>
      ))}
    </div>
  );
}
