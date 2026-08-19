'use client';

import React from 'react';
import Link from 'next/link';
import { Users, SearchX, ArrowRight, Compass } from 'lucide-react';

interface EmptyStateProps {
  type?: 'empty-network' | 'no-results' | 'custom';
  title: string;
  description: string;
  primaryActionText?: string;
  primaryActionHref?: string;
  onPrimaryAction?: () => void;
  secondaryActionText?: string;
  secondaryActionHref?: string;
  onSecondaryAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  type = 'empty-network',
  title,
  description,
  primaryActionText,
  primaryActionHref,
  onPrimaryAction,
  secondaryActionText,
  secondaryActionHref,
  onSecondaryAction,
}) => {
  return (
    <div className="w-full max-w-xl mx-auto text-center py-16 px-6 surface-card rounded-3xl border border-slate-200 bg-white shadow-xs relative overflow-hidden my-8">
      <div className="relative z-10 flex flex-col items-center">
        {/* Icon Container */}
        <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-200 text-brand-600 flex items-center justify-center mb-5">
          {type === 'empty-network' ? (
            <Compass className="w-7 h-7 text-brand-600" />
          ) : type === 'no-results' ? (
            <SearchX className="w-7 h-7 text-slate-500" />
          ) : (
            <Users className="w-7 h-7 text-brand-600" />
          )}
        </div>

        <h3 className="font-display font-bold text-2xl text-slate-900 mb-2.5 tracking-tight">
          {title}
        </h3>

        <p className="text-sm text-slate-500 leading-relaxed max-w-md mb-8">
          {description}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          {primaryActionText && (
            primaryActionHref ? (
              <Link
                href={primaryActionHref}
                className="btn-primary px-6 py-3 rounded-xl text-xs font-bold inline-flex items-center gap-2"
              >
                <span>{primaryActionText}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <button
                onClick={onPrimaryAction}
                className="btn-primary px-6 py-3 rounded-xl text-xs font-bold inline-flex items-center gap-2"
              >
                <span>{primaryActionText}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )
          )}

          {secondaryActionText && (
            secondaryActionHref ? (
              <Link
                href={secondaryActionHref}
                className="btn-secondary px-5 py-3 rounded-xl text-xs font-semibold"
              >
                {secondaryActionText}
              </Link>
            ) : (
              <button
                onClick={onSecondaryAction}
                className="btn-secondary px-5 py-3 rounded-xl text-xs font-semibold"
              >
                {secondaryActionText}
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
};
