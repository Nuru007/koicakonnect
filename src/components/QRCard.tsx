'use client';

import React, { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { Download, Copy, Check, Share2, Sparkles, Shield, ArrowUpRight, ExternalLink } from 'lucide-react';
import { UserProfile } from '@/lib/types';
import { useLanguage } from '@/context/LanguageContext';

interface QRCardProps {
  profile: UserProfile;
  compact?: boolean;
}

export const QRCard: React.FC<QRCardProps> = ({ profile, compact = false }) => {
  const { t } = useLanguage();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [copied, setCopied] = useState(false);
  const [origin, setOrigin] = useState('https://koicakonnect.com');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setOrigin(window.location.origin);
    }
  }, []);

  const profileUrl = `${origin}/profile/${profile.username}`;

  useEffect(() => {
    if (canvasRef.current) {
      QRCode.toCanvas(
        canvasRef.current,
        profileUrl,
        {
          width: compact ? 160 : 220,
          margin: 1.5,
          color: {
            dark: '#0072FE',
            light: '#FFFFFF',
          },
          errorCorrectionLevel: 'H',
        },
        (error) => {
          if (error) console.error('QR generation error:', error);
        }
      );
    }
  }, [profileUrl, compact]);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(profileUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Failed to copy URL:', err);
    }
  };

  const handleDownloadPNG = () => {
    if (!canvasRef.current) return;
    const url = canvasRef.current.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `koicakonnect-qr-${profile.username}.png`;
    link.href = url;
    link.click();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${profile.name} - KoicaKonnect Profile`,
          text: `Discover ${profile.name} (${profile.role || 'Professional'}) on KoicaKonnect`,
          url: profileUrl,
        });
      } catch {
        handleCopyLink();
      }
    } else {
      handleCopyLink();
    }
  };

  if (compact) {
    return (
      <div className="glass-card rounded-2xl p-5 border border-brand-200/60 flex flex-col items-center text-center bg-white/95 shadow-sm">
        <div className="p-3 bg-white rounded-2xl shadow-inner border border-slate-100 mb-3">
          <canvas ref={canvasRef} className="rounded-lg" />
        </div>
        <p className="text-xs font-bold text-slate-800 mb-1">Scan to view KoicaKonnect profile</p>
        <p className="text-[11px] text-slate-400 font-mono truncate max-w-[200px] mb-3">
          koicakonnect.com/profile/{profile.username}
        </p>
        <div className="flex gap-2 w-full">
          <button
            onClick={handleCopyLink}
            className="flex-1 btn-secondary py-1.5 px-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
          <button
            onClick={handleDownloadPNG}
            className="btn-primary py-1.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1"
          >
            <Download className="w-3.5 h-3.5" />
            <span>QR</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Digital NFC Pass Card */}
      <div
        ref={cardRef}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-950 to-brand-950 text-white p-7 shadow-2xl border border-white/10"
      >
        {/* Glow ambient spots */}
        <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-brand-500/25 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 rounded-full bg-brand-400/20 blur-3xl pointer-events-none" />

        {/* Card Header: Brand & Chip */}
        <div className="flex items-center justify-between mb-6 relative z-10">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-brand-500 to-brand-400 flex items-center justify-center shadow-brand-sm">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-display font-extrabold text-sm tracking-wide uppercase text-white/90">
              KoicaKonnect Identity
            </span>
          </div>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-brand-500/20 text-brand-300 border border-brand-400/30">
            Digital Card
          </span>
        </div>

        {/* User Identity Info */}
        <div className="flex items-center gap-4 mb-6 relative z-10">
          {profile.profileImage ? (
            <img
              src={profile.profileImage}
              alt={profile.name}
              className="w-16 h-16 rounded-2xl object-cover ring-2 ring-brand-400/50 shadow-lg"
            />
          ) : (
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-500 to-brand-400 text-white flex items-center justify-center font-display font-bold text-2xl shadow-brand-md">
              {profile.name.charAt(0).toUpperCase()}
            </div>
          )}

          <div className="min-w-0">
            <h3 className="font-display font-bold text-xl text-white truncate">
              {profile.name}
            </h3>
            <p className="text-xs text-brand-300 font-medium truncate">
              {profile.role || 'Professional'}
            </p>
            {profile.organisation && (
              <p className="text-xs text-slate-400 truncate">
                {profile.organisation}
              </p>
            )}
          </div>
        </div>

        {/* QR Code Canvas container */}
        <div className="bg-white rounded-2xl p-4 shadow-xl flex flex-col items-center justify-center relative z-10 my-4">
          <canvas ref={canvasRef} className="rounded-lg shadow-sm" />
          <p className="text-[11px] font-mono text-slate-500 mt-2 truncate max-w-xs">
            {profileUrl}
          </p>
        </div>

        {/* Card Footer */}
        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-white/10 relative z-10">
          <span className="flex items-center gap-1">
            <Shield className="w-3.5 h-3.5 text-brand-400" />
            Verified Discovery Profile
          </span>
          <span className="font-mono text-slate-500">@{profile.username}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-2.5 mt-5">
        <button
          onClick={handleCopyLink}
          className="btn-secondary py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
          <span>{copied ? t.profile.copied : t.profile.copyLink}</span>
        </button>

        <button
          onClick={handleDownloadPNG}
          className="btn-primary py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5"
        >
          <Download className="w-4 h-4" />
          <span>{t.qrPage.downloadPng}</span>
        </button>

        <button
          onClick={handleShare}
          className="btn-secondary py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm"
        >
          <Share2 className="w-4 h-4 text-brand-500" />
          <span>Share</span>
        </button>
      </div>
    </div>
  );
};
