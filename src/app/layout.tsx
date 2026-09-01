import type { Metadata, Viewport } from 'next';
import './globals.css';
import { ThemeProvider } from '@/context/ThemeContext';
import { AuthProvider } from '@/context/AuthContext';
import { StudentProvider } from '@/context/StudentContext';
import { LanguageProvider } from '@/context/LanguageContext';

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
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  // Suppress noisy external chrome extension runtime errors from triggering Next.js dev overlay
                  window.addEventListener('error', function(e) {
                    if (e.filename && (e.filename.indexOf('chrome-extension:') !== -1 || e.filename.indexOf('moz-extension:') !== -1)) {
                      e.stopImmediatePropagation();
                      e.preventDefault();
                    }
                  });

                  var mode = localStorage.getItem('awliya_theme_mode_v4');
                  var isDark = mode ? mode === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
                  if (isDark) {
                    document.documentElement.classList.add('dark');
                    document.documentElement.setAttribute('data-theme', 'dark');
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
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
