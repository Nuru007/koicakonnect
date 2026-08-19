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

  React.useEffect(() => {
    if (!loading && !user) {
      router.push('/signin?redirect=/dashboard/qr');
    }
  }, [loading, user, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] py-16 flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const useCases = [
    {
      icon: CreditCard,
      title: 'Business Cards & Digital Badges',
      desc: 'Print this QR code on physical business cards or digital conference badges for zero-friction discovery.',
    },
    {
      icon: FileText,
      title: 'CVs, Resumes & Portfolios',
      desc: 'Place the QR code in the header of your PDF CV to give recruiters instant access to your verified links and skills.',
    },
    {
      icon: Monitor,
      title: 'Conference Slides & Keynotes',
      desc: 'Embed your KOICA CONNECT QR code on the final Q&A slide during talks to let audiences connect with your work instantly.',
    },
    {
      icon: Mail,
      title: 'Email Signatures & Website Footers',
      desc: 'Add a compact QR pass to your email signature or personal website as your digital proof of professional identity.',
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
            <span>Back to Dashboard</span>
          </Link>
        </div>

        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white text-brand-600 text-xs font-bold mb-3 border border-slate-200 shadow-2xs">
            <QrCode className="w-3.5 h-3.5" />
            <span>Digital Identity Pass</span>
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
            <p className="text-xs sm:text-sm text-slate-500">
              Designed as your global identity pass for seamless offline and online discovery.
            </p>
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
                    <p className="text-xs text-slate-500 leading-relaxed">
                      {uc.desc}
                    </p>
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
