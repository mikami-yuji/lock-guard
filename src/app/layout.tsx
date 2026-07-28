import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Lock Guard Panel - Space Black Edition',
  description: 'NumLock, CapsLock, ScrollLock, Insertキーの誤押下防止ミニマル制御パネル',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): React.ReactElement {
  return (
    <html lang="ja">
      <body className="antialiased h-screen w-screen overflow-hidden bg-[#0c0c0e] text-zinc-100 selection:bg-zinc-100 selection:text-zinc-950">
        {children}
      </body>
    </html>
  );
}
