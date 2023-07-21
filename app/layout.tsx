import '@/styles/globals.css';
import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';

import { siteConfig } from '@/config/site';
import { fontSans } from '@/lib/fonts';
import { cn } from '@/lib/utils';
import { ThemeProvider } from '@/components/theme-provider';
import Sidebar from '@/app/components/sidebar';
import { Toaster } from '@/components/ui/toaster';
import { ConfigProvider } from '@/app/components/config-context';

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
            <ConfigProvider>
              <main className="flex h-screen flex-col">
                <div className="flex items-center justify-between border border-border bg-background px-4 py-2">
                  <Image
                    src="/axilla-logo-text-white.png"
                    height={30}
                    width={90}
                    alt="Axilla logo"
                  />
                  <Link href="https://github.com/axilla-io/axgen">
                    <div className="flex items-center gap-4">
                      <p className="font-mono">UI demo made with axgen</p>
                      <Image
                        src="/github-mark-white.png"
                        width={32}
                        height={32}
                        alt="GitHub logo"
                      />
                    </div>
                  </Link>
                </div>
                <div className="flex flex-1">
                  <div className="flex w-[400px] overflow-y-auto">
                    <Sidebar />
                  </div>
                  <div className="flex flex-1 flex-col">
                    <div className="paragraph flex flex-1 overflow-y-auto px-4">{children}</div>
                    <Toaster />
                  </div>
                </div>
              </main>
            </ConfigProvider>
          </ThemeProvider>
        </body>
      </html>
    </>
  );
}
