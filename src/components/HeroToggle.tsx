'use client';

import React from 'react';

interface HeroToggleProps {
  state: 'blue' | 'red';
  onToggle: () => void;
  className?: string;
}

export const HeroToggle: React.FC<HeroToggleProps> = ({
  state,
  onToggle,
  className = '',
}) => {
  const isBlue = state === 'blue';

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label="Toggle discovery mood"
      title="Click to toggle theme"
      className={`relative inline-flex items-center flex-shrink-0 cursor-pointer select-none transition-all duration-500 ease-out focus:outline-none focus:ring-4 ${
        isBlue ? 'focus:ring-brand-400/30' : 'focus:ring-rose-400/30'
      } ${className}`}
      style={{
        width: 'clamp(58px, 6.5vw, 84px)',
        height: 'clamp(32px, 3.8vw, 48px)',
        borderRadius: '9999px',
        background: isBlue
          ? 'linear-gradient(135deg, #0072FE 0%, #00AFFF 100%)'
          : 'linear-gradient(135deg, #E11D48 0%, #FB7185 100%)',
        boxShadow: isBlue
          ? '0 0 28px rgba(0, 114, 254, 0.45), 0 4px 12px rgba(0, 114, 254, 0.35), inset 0 2px 4px rgba(255, 255, 255, 0.4)'
          : '0 0 28px rgba(225, 29, 72, 0.45), 0 4px 12px rgba(225, 29, 72, 0.35), inset 0 2px 4px rgba(255, 255, 255, 0.4)',
        padding: '3px',
      }}
    >
      {/* Track internal glow */}
      <span
        className={`absolute inset-0 rounded-full transition-opacity duration-500 ${
          isBlue ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          background: 'radial-gradient(circle at 75% 50%, rgba(255,255,255,0.3) 0%, transparent 60%)',
        }}
      />
      <span
        className={`absolute inset-0 rounded-full transition-opacity duration-500 ${
          !isBlue ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          background: 'radial-gradient(circle at 25% 50%, rgba(255,255,255,0.3) 0%, transparent 60%)',
        }}
      />

      {/* Sliding Knob */}
      <span
        className={`relative rounded-full bg-white transition-transform duration-500 cubic-bezier(0.16, 1, 0.3, 1) flex items-center justify-center shadow-md`}
        style={{
          width: 'clamp(26px, 3.1vw, 42px)',
          height: 'clamp(26px, 3.1vw, 42px)',
          transform: isBlue
            ? 'translateX(calc(clamp(58px, 6.5vw, 84px) - clamp(26px, 3.1vw, 42px) - 6px))'
            : 'translateX(0px)',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.18), inset 0 -1px 2px rgba(0,0,0,0.06)',
        }}
      >
        {/* Center indicator dot */}
        <span
          className={`w-2 h-2 rounded-full transition-colors duration-500 ${
            isBlue ? 'bg-brand-500' : 'bg-rose-500'
          }`}
        />
      </span>
    </button>
  );
};
