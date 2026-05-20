import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from '@/components/ui/sonner';
import { Providers } from '@/components/providers';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'MobileStudio Admin',
    template: '%s | MobileStudio Admin',
  },
  description: 'Internal operations portal',
  robots: { index: false, follow: false },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={`${inter.className} antialiased`}>
        <Providers>
          {children}
          <Toaster
            richColors
            position="top-center"
            offset={{ top: '1rem' }}
            mobileOffset={{ top: '0.75rem' }}
            duration={2000}
            closeButton
          />
        </Providers>
      </body>
    </html>
  );
}
