import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, ShieldAlert } from 'lucide-react';

/**
 * ConfirmModal — Destructive action confirmation modal with a 3-second safety delay.
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether the modal is open
 * @param {string} props.title - Modal title
 * @param {string} props.message - Descriptive alert text
 * @param {function} props.onConfirm - Action on confirmation
 * @param {function} props.onCancel - Action on cancel/close
 */
export function ConfirmModal({ isOpen, title, message, onConfirm, onCancel }) {
  const [secondsLeft, setSecondsLeft] = useState(3);

  useEffect(() => {
    if (!isOpen) return;

    setSecondsLeft(3);
    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-55 flex items-center justify-center p-4">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onCancel}
          className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm"
        />

        {/* Modal Panel */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-slate-900 border border-red-500/30 rounded-2xl max-w-sm w-full p-6 shadow-2xl relative z-10 text-center space-y-4"
        >
          <div className="p-3 bg-red-500/10 rounded-full text-red-500 inline-block">
            <ShieldAlert className="w-8 h-8 animate-pulse" />
          </div>

          <div className="space-y-1.5">
            <h3 className="text-base font-black text-white">{title || 'Confirm Destructive Action'}</h3>
            <p className="text-xs text-slate-400 leading-normal">{message || 'Are you absolutely sure you want to perform this action? This operation is permanent.'}</p>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              onClick={onCancel}
              className="flex-1 py-2.5 rounded-xl border border-slate-800 text-xs font-bold text-slate-350 hover:bg-slate-800 hover:text-white transition duration-200"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={secondsLeft > 0}
              className={`flex-1 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider text-white transition duration-200 ${
                secondsLeft > 0
                  ? 'bg-slate-800 border border-slate-700 text-slate-500 cursor-not-allowed'
                  : 'bg-red-650 hover:bg-red-750 active:scale-95'
              }`}
            >
              {secondsLeft > 0 ? `Confirm (${secondsLeft}s)` : 'Confirm Action'}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
