'use client';

import React, { useEffect, useState } from 'react';

interface FlagItem {
  id: string;
  name: string;
  code: string;
  src: string;
  desktop: {
    top?: string;
    bottom?: string;
    left?: string;
    right?: string;
    rotation: number;
    scale?: number;
    depth: number;
    animClass: string;
    delay: string;
  };
  mobile: {
    top?: string;
    bottom?: string;
    left?: string;
    right?: string;
    rotation: number;
    scale?: number;
    animClass: string;
  };
}

const FLAGS: FlagItem[] = [
  {
    id: 'senegal',
    name: 'Senegal',
    code: 'SN',
    src: '/flags/senegal.jpg',
    desktop: {
      top: '4%',
      left: '3%',
      rotation: -6,
      depth: 0.04,
      animClass: 'animate-float-1',
      delay: '0.1s',
    },
    mobile: {
      top: '1%',
      left: '2%',
      rotation: -5,
      scale: 0.65,
      animClass: 'animate-float-1',
    },
  },
  {
    id: 'ghana',
    name: 'Ghana',
    code: 'GH',
    src: '/flags/ghana.png',
    desktop: {
      top: '6%',
      right: '4%',
      rotation: 6,
      depth: 0.05,
      animClass: 'animate-float-2',
      delay: '0.25s',
    },
    mobile: {
      top: '1%',
      right: '2%',
      rotation: 5,
      scale: 0.65,
      animClass: 'animate-float-2',
    },
  },
  {
    id: 'cameroon',
    name: 'Cameroon',
    code: 'CM',
    src: '/flags/cameroon.jpg',
    desktop: {
      top: '52%',
      left: '2%',
      rotation: 5,
      depth: 0.035,
      animClass: 'animate-float-3',
      delay: '0.4s',
    },
    mobile: {
      top: '44%',
      left: '1%',
      rotation: 4,
      scale: 0.55,
      animClass: 'animate-float-3',
    },
  },
  {
    id: 'nigeria',
    name: 'Nigeria',
    code: 'NG',
    src: '/flags/nigeria.jpg',
    desktop: {
      top: '48%',
      right: '2%',
      rotation: -5,
      depth: 0.045,
      animClass: 'animate-float-4',
      delay: '0.55s',
    },
    mobile: {
      top: '44%',
      right: '1%',
      rotation: -4,
      scale: 0.55,
      animClass: 'animate-float-4',
    },
  },
  {
    id: 'cotedivoire',
    name: "Côte d'Ivoire",
    code: 'CI',
    src: '/flags/cote-divoire.svg',
    desktop: {
      bottom: '-2%',
      left: '12%',
      rotation: 3,
      depth: 0.03,
      animClass: 'animate-float-5',
      delay: '0.7s',
    },
    mobile: {
      bottom: '2%',
      left: '4%',
      rotation: 2,
      scale: 0.55,
      animClass: 'animate-float-5',
    },
  },
];

interface FloatingFlagsProps {
  mousePos: { x: number; y: number };
}

export const FloatingFlags: React.FC<FloatingFlagsProps> = ({ mousePos }) => {
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setMounted(true);
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (!mounted) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
      {FLAGS.map((flag) => {
        const config = isMobile ? flag.mobile : flag.desktop;
        
        // Calculate smooth cursor parallax offset (desktop only)
        const parallaxX = isMobile ? 0 : mousePos.x * flag.desktop.depth * 30;
        const parallaxY = isMobile ? 0 : mousePos.y * flag.desktop.depth * 30;

        return (
          <div
            key={flag.id}
            className={`absolute transition-transform duration-300 ease-out ${config.animClass}`}
            style={{
              top: config.top,
              bottom: config.bottom,
              left: config.left === '50%' ? '50%' : config.left,
              right: config.right,
              transform: `translate3d(${parallaxX}px, ${parallaxY}px, 0) rotate(${config.rotation}deg) scale(${config.scale || 1}) ${
                config.left === '50%' ? 'translateX(-50%)' : ''
              }`,
              animationDelay: flag.desktop.delay,
            }}
          >
            {/* Pure Floating Flag with Soft 3D Shadow */}
            <div
              className="pointer-events-auto w-14 sm:w-20 md:w-24 lg:w-28 h-9 sm:h-13 md:h-16 lg:h-18 rounded-xl sm:rounded-2xl lg:rounded-3xl overflow-hidden transition-all duration-300 hover:scale-110 group cursor-default"
              style={{
                boxShadow:
                  '0 20px 40px -8px rgba(0, 114, 254, 0.26), 0 10px 20px -4px rgba(15, 23, 42, 0.14), 0 0 1px rgba(0,0,0,0.15)',
              }}
            >
              <img
                src={flag.src}
                alt={`${flag.name} Flag`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};
