'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { QRCard } from '@/components/QRCard';
import {
  QrCode,
  CreditCard,
  FileText,
  Monitor,
  Mail,
  ArrowLeft,
} from 'lucide-react';

export default function QRPage() {
  const { user, loading } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] py-20 flex flex-col items-center justify-center text-center px-4">
        <div className="w-8 h-8 border-3 border-brand-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-xs font-semibold text-slate-500">{t.common.loading}</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] py-20 flex flex-col items-center justify-center text-center px-4">
        <div className="surface-card rounded-3xl p-8 max-w-md w-full border border-slate-200 bg-white shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mx-auto mb-4">
            <QrCode className="w-6 h-6" />
          </div>
          <h2 className="font-display font-bold text-xl text-slate-900 mb-2">{t.profileBuilder.signInRequiredTitle}</h2>
          <p className="text-xs text-slate-500 mb-6 leading-relaxed">
            {t.profileBuilder.signInRequiredDesc}
          </p>
          <Link href="/signin" className="btn-primary w-full py-3 rounded-xl text-xs font-bold block text-center shadow-brand-sm">
            {t.profileBuilder.signInToBuilderBtn}
          </Link>
        </div>
      </div>
    );
  }

  const useCases = [
    {
      icon: CreditCard,
      title: t.qrPage.useCase1,
      desc: t.qrPage.useCase1,
    },
    {
      icon: FileText,
      title: t.qrPage.useCase2,
      desc: t.qrPage.useCase2,
    },
    {
      icon: Monitor,
      title: t.qrPage.useCase3,
      desc: t.qrPage.useCase3,
    },
    {
      icon: Mail,
      title: t.qrPage.useCase4,
      desc: t.qrPage.useCase4,
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-10 sm:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Navigation Breadcrumb */}
        <div className="mb-6">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-brand-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t.common.back}</span>
          </Link>
        </div>

        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white text-brand-600 text-xs font-bold mb-3 border border-slate-200 shadow-2xs">
            <QrCode className="w-3.5 h-3.5" />
            <span>{t.qrPage.shareTitle}</span>
          </div>
          <h1 className="font-display font-black text-3xl sm:text-4xl text-slate-900 tracking-tight mb-2">
            {t.qrPage.title}
          </h1>
          <p className="text-sm text-slate-500">
            {t.qrPage.subtitle}
          </p>
        </div>

        {/* Digital Identity Pass Card Display */}
        <div className="mb-14">
          <QRCard profile={user} />
        </div>

        {/* Real-World Use Cases Section */}
        <div className="pt-10 border-t border-slate-200">
          <div className="text-center max-w-xl mx-auto mb-8">
            <h2 className="font-display font-bold text-2xl text-slate-900 mb-2">
              {t.qrPage.useCasesTitle}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {useCases.map((uc, idx) => {
              const Icon = uc.icon;
              return (
                <div
                  key={idx}
                  className="surface-card rounded-2xl p-6 border border-slate-200 bg-white shadow-xs flex items-start gap-4"
                >
                  <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center flex-shrink-0 shadow-2xs border border-brand-100/80">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-sm text-slate-900 mb-1">
                      {uc.title}
                    </h3>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
