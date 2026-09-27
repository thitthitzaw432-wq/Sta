import type { Metadata } from 'next';
import './globals.css';
import { ShopProvider } from '@/lib/context/shop-context';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';

export const metadata: Metadata = {
  title: 'Sachi — Warm & Minimalist Stationery Online Shop',
  description: 'Discover handcrafted leather journals, solid brass gel pens, aesthetic highlighters, and fine paper supplies.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-[#F7F3ED] text-[#2B2521] antialiased">
        <ShopProvider>
          <Navbar />
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            {children}
          </main>
          <Footer />
        </ShopProvider>
      </body>
    </html>
  );
}
