import type { Metadata, Viewport } from 'next';
import './globals.css';
import { LanguageProvider } from '@/context/LanguageContext';
import { AuthProvider } from '@/context/AuthContext';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: 'KoicaKonnect — Discover People Before You Network',
  description:
    'A modern, global people-discovery and professional identity platform. Search and discover professionals, researchers, entrepreneurs, and experts by skill, industry, and location.',
  keywords: [
    'people discovery',
    'professional identity',
    'talent directory',
    'skills search',
    'expert discovery',
    'professional networking',
    'digital business card',
    'QR profile',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased flex flex-col min-h-screen selection:bg-brand-500 selection:text-white bg-[#FAFBFF]">
        <LanguageProvider>
          <AuthProvider>
            <Navbar />
            <main className="flex-1 relative flex flex-col">
              {children}
            </main>
            <Footer />
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
