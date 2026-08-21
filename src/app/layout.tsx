import type { Metadata, Viewport } from 'next';
import { Cairo } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/context/ThemeContext';
import { AuthProvider } from '@/context/AuthContext';
import { StudentProvider } from '@/context/StudentContext';
import { LanguageProvider } from '@/context/LanguageContext';

const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-cairo',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Awliya Parent Portal | بوابة أولياء الأمور | Portail Parents',
  description: 'Smart academic tracking platform with dynamic level themes, multi-student management, and trilingual support (Arabic, English, French).',
  keywords: ['Parent Portal', 'بوابة أولياء الأمور', 'Portail Parents', 'Quran', 'Tajweed', 'Education'],
  authors: [{ name: 'Awliya Platform' }],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#E11D48',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className={cairo.variable} suppressHydrationWarning>
      <body
        className="font-sans antialiased select-none selection:bg-rose-500 selection:text-white"
        suppressHydrationWarning
      >
        <LanguageProvider>
          <ThemeProvider>
            <AuthProvider>
              <StudentProvider>{children}</StudentProvider>
            </AuthProvider>
          </ThemeProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
