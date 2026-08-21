import './globals.css';
import type { Metadata } from 'next';
import { AppProvider } from '@/context/AppContext';
import { LiveChatWidget } from '@/components/LiveChatWidget';

export const metadata = {
  title: 'EthioParts - Ethiopian Auto Parts E-Commerce Platform',
  description: 'Genuine Auto Parts for Ethiopian Roads - Toyota, Isuzu, Hyundai, Bajaj & More with Telebirr, CBE and 10 Offline Payment Gateways',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-slate-950 text-slate-100 min-h-screen font-sans antialiased">
        <AppProvider>
          {children}
          <LiveChatWidget />
        </AppProvider>
      </body>
    </html>
  );
}
