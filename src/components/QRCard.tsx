'use client';

import React, { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { Download, Copy, Check, Share2, Shield, Network, Loader2 } from 'lucide-react';
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
  const [downloading, setDownloading] = useState(false);
  const [origin, setOrigin] = useState('https://koicakonnect.com');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setOrigin(window.location.origin);
    }
  }, []);

  const profileUrl = `${origin}/profile/${profile.username}`;

  // Generate QR code for on-screen preview canvas
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

  // Helper to load remote image for canvas rendering without breaking
  const loadImage = (src: string): Promise<HTMLImageElement | null> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = () => resolve(null);
      img.src = src;
    });
  };

  // Generate and download the ENTIRE full Digital Pass Card as a high-resolution PNG
  const handleDownloadFullCardPNG = async () => {
    setDownloading(true);
    try {
      const cardWidth = 800;
      const cardHeight = 1040;
      const offscreenCanvas = document.createElement('canvas');
      offscreenCanvas.width = cardWidth;
      offscreenCanvas.height = cardHeight;
      const ctx = offscreenCanvas.getContext('2d');

      if (!ctx) return;

      // 1. Draw Card Background with Rounded Corners
      const r = 40;
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(r, 0);
      ctx.lineTo(cardWidth - r, 0);
      ctx.quadraticCurveTo(cardWidth, 0, cardWidth, r);
      ctx.lineTo(cardWidth, cardHeight - r);
      ctx.quadraticCurveTo(cardWidth, cardHeight, cardWidth - r, cardHeight);
      ctx.lineTo(r, cardHeight);
      ctx.quadraticCurveTo(0, cardHeight, 0, cardHeight - r);
      ctx.lineTo(0, r);
      ctx.quadraticCurveTo(0, 0, r, 0);
      ctx.closePath();
      ctx.clip();

      // Deep sleek dark gradient
      const bgGrad = ctx.createLinearGradient(0, 0, cardWidth, cardHeight);
      bgGrad.addColorStop(0, '#0F172A');
      bgGrad.addColorStop(0.5, '#090E1A');
      bgGrad.addColorStop(1, '#020617');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, cardWidth, cardHeight);

      // Ambient radial glow top right
      const glowTop = ctx.createRadialGradient(cardWidth, 0, 10, cardWidth, 0, 450);
      glowTop.addColorStop(0, 'rgba(0, 114, 254, 0.35)');
      glowTop.addColorStop(1, 'transparent');
      ctx.fillStyle = glowTop;
      ctx.fillRect(0, 0, cardWidth, cardHeight);

      // Ambient radial glow bottom left
      const glowBottom = ctx.createRadialGradient(0, cardHeight, 10, 0, cardHeight, 400);
      glowBottom.addColorStop(0, 'rgba(0, 175, 255, 0.25)');
      glowBottom.addColorStop(1, 'transparent');
      ctx.fillStyle = glowBottom;
      ctx.fillRect(0, 0, cardWidth, cardHeight);

      ctx.restore();

      // Card outer border
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(r, 0);
      ctx.lineTo(cardWidth - r, 0);
      ctx.quadraticCurveTo(cardWidth, 0, cardWidth, r);
      ctx.lineTo(cardWidth, cardHeight - r);
      ctx.quadraticCurveTo(cardWidth, cardHeight, cardWidth - r, cardHeight);
      ctx.lineTo(r, cardHeight);
      ctx.quadraticCurveTo(0, cardHeight, 0, cardHeight - r);
      ctx.lineTo(0, r);
      ctx.quadraticCurveTo(0, 0, r, 0);
      ctx.closePath();
      ctx.lineWidth = 3;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.stroke();
      ctx.restore();

      // 2. Header Brand Section
      // Icon square
      ctx.save();
      const iconX = 50;
      const iconY = 50;
      const iconSize = 46;
      ctx.beginPath();
      ctx.roundRect(iconX, iconY, iconSize, iconSize, 14);
      ctx.fillStyle = '#0072FE';
      ctx.fill();
      ctx.restore();

      // Network Icon lines
      ctx.save();
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.arc(iconX + 15, iconY + 15, 4, 0, Math.PI * 2);
      ctx.arc(iconX + 31, iconY + 23, 4, 0, Math.PI * 2);
      ctx.arc(iconX + 18, iconY + 31, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#FFFFFF';
      ctx.fill();
      ctx.stroke();
      ctx.restore();

      // Brand Title
      ctx.save();
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 22px "Outfit", "Plus Jakarta Sans", sans-serif';
      ctx.fillText('KOICA CONNECT PASS', 110, 82);
      ctx.restore();

      // Digital Identity Pill (Right)
      ctx.save();
      const pillX = 600;
      const pillY = 54;
      const pillW = 150;
      const pillH = 36;
      ctx.beginPath();
      ctx.roundRect(pillX, pillY, pillW, pillH, 18);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.fill();
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.18)';
      ctx.stroke();

      ctx.fillStyle = '#7DD3FC';
      ctx.font = 'bold 12px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('DIGITAL IDENTITY', pillX + pillW / 2, pillY + 23);
      ctx.restore();

      // 3. User Identity Section
      const avatarX = 50;
      const avatarY = 125;
      const avatarSize = 90;

      // Draw Avatar
      let avatarLoaded = false;
      if (profile.profileImage) {
        const avatarImg = await loadImage(profile.profileImage);
        if (avatarImg) {
          ctx.save();
          ctx.beginPath();
          ctx.roundRect(avatarX, avatarY, avatarSize, avatarSize, 22);
          ctx.clip();
          ctx.drawImage(avatarImg, avatarX, avatarY, avatarSize, avatarSize);
          ctx.restore();

          // Avatar ring
          ctx.save();
          ctx.beginPath();
          ctx.roundRect(avatarX, avatarY, avatarSize, avatarSize, 22);
          ctx.lineWidth = 3;
          ctx.strokeStyle = '#0072FE';
          ctx.stroke();
          ctx.restore();
          avatarLoaded = true;
        }
      }

      if (!avatarLoaded) {
        // Fallback Initials Box
        ctx.save();
        ctx.beginPath();
        ctx.roundRect(avatarX, avatarY, avatarSize, avatarSize, 22);
        ctx.fillStyle = '#0072FE';
        ctx.fill();
        ctx.lineWidth = 3;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.stroke();

        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 36px "Outfit", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const initial = profile.name ? profile.name.charAt(0).toUpperCase() : 'U';
        ctx.fillText(initial, avatarX + avatarSize / 2, avatarY + avatarSize / 2);
        ctx.restore();
      }

      // User Name
      ctx.save();
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 30px "Outfit", sans-serif';
      ctx.fillText(profile.name, 160, 160);

      // User Role
      ctx.fillStyle = '#38BDF8';
      ctx.font = '600 18px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(profile.role || 'Professional', 160, 192);

      // Organisation
      if (profile.organisation) {
        ctx.fillStyle = '#94A3B8';
        ctx.font = '15px "Plus Jakarta Sans", sans-serif';
        ctx.fillText(profile.organisation, 160, 218);
      }
      ctx.restore();

      // 4. White Container Box for QR Code
      const qrBoxX = 50;
      const qrBoxY = 245;
      const qrBoxW = 700;
      const qrBoxH = 670;
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(qrBoxX, qrBoxY, qrBoxW, qrBoxH, 32);
      ctx.fillStyle = '#FFFFFF';
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#E2E8F0';
      ctx.stroke();
      ctx.restore();

      // High-Res QR Code inside White Box
      const qrTempCanvas = document.createElement('canvas');
      await QRCode.toCanvas(qrTempCanvas, profileUrl, {
        width: 540,
        margin: 1,
        color: {
          dark: '#0072FE',
          light: '#FFFFFF',
        },
        errorCorrectionLevel: 'H',
      });
      ctx.drawImage(qrTempCanvas, 130, 275, 540, 540);

      // Profile URL below QR code inside box
      ctx.save();
      ctx.fillStyle = '#64748B';
      ctx.font = 'bold 16px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`koicakonnect.com/profile/${profile.username}`, cardWidth / 2, 875);
      ctx.restore();

      // 5. Card Footer
      // Divider line
      ctx.save();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(50, 950);
      ctx.lineTo(750, 950);
      ctx.stroke();
      ctx.restore();

      // Verified text (Left)
      ctx.save();
      ctx.fillStyle = '#38BDF8';
      ctx.font = '600 16px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('✓ Verified Discovery Profile', 50, 990);

      // Username (Right)
      ctx.fillStyle = '#64748B';
      ctx.font = '16px monospace';
      ctx.textAlign = 'right';
      ctx.fillText(`@${profile.username}`, 750, 990);
      ctx.restore();

      // Trigger high-res PNG download
      const pngUrl = offscreenCanvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.download = `koicaconnect-pass-${profile.username}.png`;
      downloadLink.href = pngUrl;
      downloadLink.click();
    } catch (err) {
      console.error('Error generating card image:', err);
    } finally {
      setDownloading(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${profile.name} - KOICA CONNECT Profile`,
          text: `Discover ${profile.name} (${profile.role || 'Professional'}) on KOICA CONNECT`,
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
      <div className="surface-card rounded-2xl p-5 border border-slate-200 flex flex-col items-center text-center bg-white shadow-xs">
        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 mb-3">
          <canvas ref={canvasRef} className="rounded-lg shadow-2xs" />
        </div>
        <p className="text-xs font-bold text-slate-800 mb-0.5">Scan to view profile</p>
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
            onClick={handleDownloadFullCardPNG}
            disabled={downloading}
            className="btn-primary py-1.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 shadow-brand-sm disabled:opacity-50"
          >
            {downloading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Download className="w-3.5 h-3.5" />
            )}
            <span>{downloading ? 'Pass' : 'Download Pass'}</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Digital Pass Card Screen Display */}
      <div
        ref={cardRef}
        className="relative overflow-hidden rounded-3xl bg-slate-950 text-white p-7 shadow-xl border border-slate-800"
      >
        {/* Card Header: Brand & Chip */}
        <div className="flex items-center justify-between mb-6 relative z-10">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-brand-500 flex items-center justify-center text-white shadow-brand-sm">
              <Network className="w-4 h-4 stroke-[2.2]" />
            </div>
            <span className="font-display font-bold text-xs tracking-wider uppercase text-white/90">
              KOICA CONNECT Pass
            </span>
          </div>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-white/10 text-brand-300 border border-white/15">
            {t.qrPage.shareTitle}
          </span>
        </div>

        {/* User Identity Info */}
        <div className="flex items-center gap-4 mb-6 relative z-10">
          {profile.profileImage ? (
            <img
              src={profile.profileImage}
              alt={profile.name}
              className="w-16 h-16 rounded-2xl object-cover ring-2 ring-brand-500 shadow-md"
            />
          ) : (
            <div className="w-16 h-16 rounded-2xl bg-brand-600 text-white flex items-center justify-center font-display font-bold text-2xl shadow-brand-sm">
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
        <div className="bg-white rounded-2xl p-4 shadow-sm flex flex-col items-center justify-center relative z-10 my-4">
          <canvas ref={canvasRef} className="rounded-lg shadow-2xs" />
          <p className="text-[11px] font-mono text-slate-500 mt-2 truncate max-w-xs">
            {profileUrl}
          </p>
        </div>

        {/* Card Footer */}
        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800 relative z-10">
          <span className="flex items-center gap-1">
            <Shield className="w-3.5 h-3.5 text-brand-400" />
            {t.common.verifiedProfile}
          </span>
          <span className="font-mono text-slate-500">@{profile.username}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-2.5 mt-5">
        <button
          onClick={handleCopyLink}
          className="btn-secondary py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
          <span>{copied ? t.profile.copied : t.profile.copyLink}</span>
        </button>

        <button
          onClick={handleDownloadFullCardPNG}
          disabled={downloading}
          className="btn-primary py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 shadow-brand-sm disabled:opacity-50"
        >
          {downloading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Download className="w-4 h-4" />
          )}
          <span>{downloading ? t.common.loading : t.qrPage.downloadPng}</span>
        </button>

        <button
          onClick={handleShare}
          className="btn-secondary py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs"
        >
          <Share2 className="w-4 h-4 text-brand-500" />
          <span>{t.common.share}</span>
        </button>
      </div>
    </div>
  );
};
