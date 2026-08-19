'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { UserProfile } from '@/lib/types';
import {
  MapPin,
  Briefcase,
  ArrowUpRight,
  RotateCcw,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Compass,
  Users,
} from 'lucide-react';

interface SwipeProfileDeckProps {
  profiles: UserProfile[];
}

export const SwipeProfileDeck: React.FC<SwipeProfileDeckProps> = ({ profiles }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isSwipingOut, setIsSwipingOut] = useState<'left' | 'right' | null>(null);
  const [dragStartTime, setDragStartTime] = useState<number>(0);

  const startPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement | null>(null);

  // Keyboard navigation support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        handleSwipe('right');
      } else if (e.key === 'ArrowLeft') {
        handleSwipe('left');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, profiles.length]);

  const handleSwipe = useCallback((direction: 'left' | 'right') => {
    if (profiles.length === 0 || isSwipingOut) return;
    setIsSwipingOut(direction);

    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1 < profiles.length ? prev + 1 : profiles.length));
      setIsSwipingOut(null);
      setDragOffset({ x: 0, y: 0 });
    }, 280);
  }, [profiles.length, isSwipingOut]);

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setDragOffset({ x: 0, y: 0 });
    }
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setDragOffset({ x: 0, y: 0 });
    setIsSwipingOut(null);
  };

  // Universal pointer drag events for mouse and touch
  const handlePointerDown = (e: React.PointerEvent) => {
    if (isSwipingOut) return;
    setIsDragging(true);
    setDragStartTime(Date.now());
    startPosRef.current = { x: e.clientX, y: e.clientY };
    if (cardRef.current) {
      cardRef.current.setPointerCapture(e.pointerId);
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || isSwipingOut) return;
    const deltaX = e.clientX - startPosRef.current.x;
    const deltaY = (e.clientY - startPosRef.current.y) * 0.2;
    setDragOffset({ x: deltaX, y: deltaY });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setIsDragging(false);
    if (cardRef.current && cardRef.current.hasPointerCapture(e.pointerId)) {
      cardRef.current.releasePointerCapture(e.pointerId);
    }

    const elapsed = Date.now() - dragStartTime;
    const velocity = Math.abs(dragOffset.x) / Math.max(elapsed, 1);
    const threshold = 85;

    if (dragOffset.x > threshold || (velocity > 0.45 && dragOffset.x > 30)) {
      handleSwipe('right');
    } else if (dragOffset.x < -threshold || (velocity > 0.45 && dragOffset.x < -30)) {
      handleSwipe('left');
    } else {
      setDragOffset({ x: 0, y: 0 });
    }
  };

  if (!profiles || profiles.length === 0) {
    return null;
  }

  const isDeckFinished = currentIndex >= profiles.length;
  const visibleCards = profiles.slice(currentIndex, currentIndex + 3);
  const activeProfile = profiles[currentIndex];

  const getInitials = (name: string) => {
    const parts = (name || '').trim().split(/\s+/);
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return (name || 'U').slice(0, 2).toUpperCase();
  };

  return (
    <div className="relative w-full max-w-sm sm:max-w-md mx-auto flex flex-col items-center select-none">
      
      {/* Top Deck Counter */}
      <div className="w-full flex items-center justify-between mb-4 px-2">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
          <Users className="w-4 h-4 text-brand-600" />
          <span>Recently Joined Directory</span>
        </div>

        <div className="flex items-center gap-2">
          {!isDeckFinished && (
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-brand-50 text-brand-600 border border-brand-100">
              {currentIndex + 1} of {profiles.length}
            </span>
          )}
        </div>
      </div>

      {/* Card Stack Container */}
      <div className="relative w-full h-[490px] sm:h-[530px] flex items-center justify-center">
        {isDeckFinished ? (
          /* End of Deck State */
          <div className="w-full h-full surface-card rounded-3xl p-8 flex flex-col items-center justify-center text-center border border-slate-200 bg-white shadow-lg animate-in zoom-in-95 duration-200">
            <div className="w-14 h-14 rounded-2xl bg-brand-50 text-brand-600 border border-brand-100 flex items-center justify-center mb-4">
              <Compass className="w-7 h-7" />
            </div>
            <h3 className="font-display font-extrabold text-xl sm:text-2xl text-slate-900 mb-2">
              You've explored all recently joined leaders
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-xs mb-6 leading-relaxed">
              Explore our full directory to filter by country, skill, and focus discipline.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={handleReset}
                className="btn-primary py-2.5 px-6 rounded-xl text-xs font-bold flex items-center gap-2 shadow-brand-sm"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Start Over</span>
              </button>
            </div>
          </div>
        ) : (
          /* Visible Cards in Stack */
          visibleCards.map((profile, i) => {
            const isTop = i === 0;
            const isSecond = i === 1;
            const isThird = i === 2;

            let transform = '';
            let zIndex = 30 - i * 10;
            let opacity = 1 - i * 0.15;

            if (isTop) {
              if (isSwipingOut) {
                const exitX = isSwipingOut === 'right' ? 600 : -600;
                const exitRotate = isSwipingOut === 'right' ? 24 : -24;
                transform = `translate3d(${exitX}px, ${dragOffset.y}px, 0) rotate(${exitRotate}deg)`;
                opacity = 0;
              } else if (isDragging) {
                const rotation = dragOffset.x * 0.07;
                transform = `translate3d(${dragOffset.x}px, ${dragOffset.y}px, 0) rotate(${rotation}deg)`;
              } else {
                transform = 'translate3d(0, 0, 0) rotate(0deg) scale(1)';
              }
            } else if (isSecond) {
              const dragProgress = Math.min(Math.abs(dragOffset.x) / 120, 1);
              const scale = 0.94 + dragProgress * 0.06;
              const translateY = 14 - dragProgress * 14;
              const rotation = 2 - dragProgress * 2;
              transform = `translate3d(0, ${translateY}px, 0) scale(${scale}) rotate(${rotation}deg)`;
              opacity = 0.9 + dragProgress * 0.1;
            } else if (isThird) {
              const dragProgress = Math.min(Math.abs(dragOffset.x) / 120, 1);
              const scale = 0.88 + dragProgress * 0.06;
              const translateY = 28 - dragProgress * 14;
              const rotation = -2 + dragProgress * 2;
              transform = `translate3d(0, ${translateY}px, 0) scale(${scale}) rotate(${rotation}deg)`;
              opacity = 0.7 + dragProgress * 0.2;
            }

            return (
              <div
                key={profile.id}
                ref={isTop ? cardRef : null}
                onPointerDown={isTop ? handlePointerDown : undefined}
                onPointerMove={isTop ? handlePointerMove : undefined}
                onPointerUp={isTop ? handlePointerUp : undefined}
                onPointerCancel={isTop ? handlePointerUp : undefined}
                style={{
                  transform,
                  zIndex,
                  opacity,
                  transition: isDragging && isTop ? 'none' : 'transform 0.3s cubic-bezier(0.2, 0.9, 0.3, 1), opacity 0.3s ease',
                  touchAction: 'none',
                }}
                className={`absolute inset-0 rounded-3xl overflow-hidden shadow-xl border border-slate-200/90 bg-slate-900 group ${
                  isTop ? 'cursor-grab active:cursor-grabbing' : 'pointer-events-none'
                }`}
              >
                {/* Full Card Portrait Background Image */}
                {profile.profileImage ? (
                  <img
                    src={profile.profileImage}
                    alt={profile.name}
                    className="w-full h-full object-cover object-center pointer-events-none transition-transform duration-500 group-hover:scale-105"
                    draggable={false}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-brand-600 via-brand-700 to-slate-950 flex flex-col items-center justify-center text-white p-6">
                    <div className="w-24 h-24 rounded-3xl bg-white/20 flex items-center justify-center font-display font-black text-4xl shadow-inner mb-3">
                      {getInitials(profile.name)}
                    </div>
                    <span className="text-xs font-semibold text-brand-200">KOICA CONNECT Professional</span>
                  </div>
                )}

                {/* Top Floating Badges (Location & Verified) */}
                <div className="absolute top-4 inset-x-4 flex items-center justify-between z-10 pointer-events-none">
                  {(profile.city || profile.country) ? (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950/70 border border-white/20 text-white text-xs font-medium shadow-sm">
                      <MapPin className="w-3.5 h-3.5 text-brand-400 flex-shrink-0" />
                      <span className="truncate max-w-[150px]">
                        {[profile.city, profile.country].filter(Boolean).join(', ')}
                      </span>
                    </div>
                  ) : (
                    <div />
                  )}

                  <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-600 text-white text-[11px] font-bold shadow-sm border border-emerald-400/40">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Verified</span>
                  </div>
                </div>

                {/* Drag Hint Overlays */}
                {isTop && Math.abs(dragOffset.x) > 25 && (
                  <div
                    className={`absolute top-1/2 -translate-y-1/2 ${
                      dragOffset.x > 0 ? 'right-6' : 'left-6'
                    } z-20 pointer-events-none transition-opacity duration-150`}
                    style={{ opacity: Math.min(Math.abs(dragOffset.x) / 70, 1) }}
                  >
                    <div
                      className={`px-4 py-2 rounded-2xl text-xs font-black uppercase tracking-wider shadow-xl border ${
                        dragOffset.x > 0
                          ? 'bg-brand-500 text-white border-brand-300'
                          : 'bg-slate-900 text-white border-slate-700'
                      }`}
                    >
                      {dragOffset.x > 0 ? 'Next Profile ➔' : 'Skip ✕'}
                    </div>
                  </div>
                )}

                {/* Bottom Gradient Overlay & Details */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent pt-24 pb-6 px-6 text-white flex flex-col justify-end z-10">
                  
                  {/* Category Pills */}
                  {profile.categories && profile.categories.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {profile.categories.slice(0, 2).map((cat) => (
                        <span
                          key={cat.id}
                          className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-white/20 text-brand-200 border border-white/10"
                        >
                          {cat.name}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Name & Role */}
                  <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-white tracking-tight leading-tight mb-1 truncate">
                    {profile.name}
                  </h2>

                  <p className="text-sm font-semibold text-brand-300 truncate">
                    {profile.role || 'Professional'}
                  </p>

                  {profile.organisation && (
                    <p className="text-xs text-slate-300 truncate flex items-center gap-1.5 mt-1">
                      <Briefcase className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                      <span className="truncate">{profile.organisation}</span>
                    </p>
                  )}

                  {/* Skills Chips */}
                  {profile.skills && profile.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-white/10">
                      {profile.skills.slice(0, 3).map((s) => (
                        <span
                          key={s.id}
                          className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-800 text-slate-200 border border-slate-700"
                        >
                          {s.name}
                        </span>
                      ))}
                      {profile.skills.length > 3 && (
                        <span className="text-[10px] text-slate-400 self-center">
                          +{profile.skills.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Control Bar Below Card */}
      {!isDeckFinished && activeProfile && (
        <div className="w-full flex items-center justify-between gap-3 mt-6 px-2">
          
          {/* Previous Profile Button */}
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentIndex === 0}
            aria-label="Previous profile"
            className="w-12 h-12 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 text-slate-700 hover:text-slate-900 disabled:opacity-40 disabled:hover:border-slate-200 flex items-center justify-center shadow-xs transition-all hover:scale-105 active:scale-95 flex-shrink-0"
            title="Previous profile"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Primary View Profile CTA */}
          <Link
            href={`/profile/${activeProfile.username}`}
            className="flex-1 btn-primary py-3 px-6 rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-brand-sm hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <span>View Full Profile</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>

          {/* Next Profile Button */}
          <button
            type="button"
            onClick={() => handleSwipe('right')}
            aria-label="Next profile"
            className="w-12 h-12 rounded-2xl bg-brand-50 border border-brand-200 hover:bg-brand-500 text-brand-600 hover:text-white flex items-center justify-center shadow-xs transition-all hover:scale-105 active:scale-95 flex-shrink-0 group/next"
            title="Next profile"
          >
            <ChevronRight className="w-5 h-5 transition-transform group-hover/next:translate-x-0.5" />
          </button>
        </div>
      )}

      {/* Progress Indicator Dots */}
      {!isDeckFinished && profiles.length > 1 && (
        <div className="flex items-center gap-1.5 mt-5">
          {profiles.slice(0, 10).map((_, idx) => (
            <span
              key={idx}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === currentIndex
                  ? 'w-6 bg-brand-500'
                  : idx < currentIndex
                  ? 'w-1.5 bg-slate-400'
                  : 'w-1.5 bg-slate-200'
              }`}
            />
          ))}
          {profiles.length > 10 && (
            <span className="text-[10px] text-slate-400 font-medium ml-1">
              +{profiles.length - 10}
            </span>
          )}
        </div>
      )}

    </div>
  );
};
