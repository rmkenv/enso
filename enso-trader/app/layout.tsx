import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ENSOAgri · Climate Signal · Commodity Intelligence',
  description: 'Real-time ENSO monitoring and agricultural commodity signal matrix for commodity traders',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
