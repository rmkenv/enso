import type { Metadata } from 'next';
import './globals.css';
import { SharedNav } from '@/components/SharedNav';

export const metadata: Metadata = {
  title: 'ENSODesk · Climate Signal · Commodity Intelligence',
  description: 'Real-time ENSO monitoring for agricultural and energy commodity traders',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SharedNav />
        {children}
      </body>
    </html>
  );
}
