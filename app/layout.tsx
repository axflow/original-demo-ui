import '@/styles/globals.css';
import { Metadata } from 'next';

import { siteConfig } from '@/config/site';
import { fontSans } from '@/lib/fonts';
import { cn } from '@/lib/utils';
import { SiteHeader } from '@/components/site-header';
import { ThemeProvider } from '@/components/theme-provider';
import Sidebar from './sidebar';

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
  },
};

interface RootLayoutProps {
  children: React.ReactNode;
  params: Record<string, string>;
  pathname: string;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <>
      <html lang="en" suppressHydrationWarning>
        <head />
        <body className={cn('min-h-screen bg-background font-sans antialiased', fontSans.variable)}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <main className="flex h-screen flex-col">
              <div className="flex flex-1 overflow-hidden">
                <div className="flex w-[300px]">
                  <Sidebar />
                </div>
                <div className="flex flex-1 flex-col">
                  <div className="flex h-16 bg-gray-300">
                    <SiteHeader />
                  </div>
                  <div className="paragraph flex flex-1 overflow-y-auto px-4">{children}</div>
                </div>
              </div>
              <div className="flex">Footer</div>
            </main>
          </ThemeProvider>
        </body>
      </html>
    </>
  );
}
