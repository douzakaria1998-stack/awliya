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
                  var suppressExtensionError = function(e) {
                    var source = (e && (e.filename || (e.error && e.error.stack) || (e.reason && (e.reason.stack || e.reason.message)) || '')) + '';
                    if (source.indexOf('chrome-extension:') !== -1 || source.indexOf('moz-extension:') !== -1 || source.indexOf('M_ID') !== -1) {
                      if (e.stopImmediatePropagation) e.stopImmediatePropagation();
                      if (e.stopPropagation) e.stopPropagation();
                      if (e.preventDefault) e.preventDefault();
                      return true;
                    }
                  };
                  window.addEventListener('error', suppressExtensionError, true);
                  window.addEventListener('unhandledrejection', suppressExtensionError, true);

                  var origConsoleError = console.error;
                  console.error = function() {
                    var args = Array.prototype.slice.call(arguments).join(' ');
                    if (
                      args.indexOf('chrome-extension:') !== -1 ||
                      args.indexOf('moz-extension:') !== -1 ||
                      args.indexOf('M_ID') !== -1 ||
                      args.indexOf('bis_skin_checked') !== -1 ||
                      (args.indexOf('hydrated but some attributes') !== -1 && args.indexOf('bis_skin_checked') !== -1)
                    ) {
                      return;
                    }
                    origConsoleError.apply(console, arguments);
                  };

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
