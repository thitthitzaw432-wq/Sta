'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useShop } from '@/lib/context/shop-context';
import { ShoppingBag, Search, Store, ShieldCheck, Menu, X, BookOpen, Package } from 'lucide-react';
import { CartDrawer } from '@/components/cart-drawer';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { getCartTotal, searchQuery, setSearchQuery, isAdminLoggedIn, logoutAdmin } = useShop();
  const { itemCount } = getCartTotal();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState(searchQuery);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(localSearch);
    if (pathname !== '/shop') {
      router.push('/shop');
    }
  };

  const isAdminPage = pathname.startsWith('/admin');

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#FAF7F2]/90 backdrop-blur-md border-b border-[#E5DBD0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-2 group">
                <div className="w-10 h-10 rounded-xl bg-[#6B4F3A] flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xl font-bold tracking-tight text-[#3E2C20] block leading-tight font-serif">
                    SACHI
                  </span>
                  <span className="text-[10px] text-[#75675C] tracking-widest uppercase block -mt-1 font-medium">
                    Stationery Shop
                  </span>
                </div>
              </Link>
            </div>

            {/* Search Bar (Desktop) */}
            {!isAdminPage && (
              <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-md mx-8 relative">
                <input
                  type="text"
                  placeholder="Search notebooks, pens, highlighters..."
                  value={localSearch}
                  onChange={(e) => setLocalSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-full bg-white border border-[#E5DBD0] text-sm text-[#2B2521] placeholder-[#75675C] focus:outline-none focus:ring-2 focus:ring-[#6B4F3A]/30 focus:border-[#6B4F3A] transition-all shadow-sm"
                />
                <Search className="w-4 h-4 text-[#75675C] absolute left-3.5 top-3.5" />
                {localSearch && (
                  <button
                    type="button"
                    onClick={() => { setLocalSearch(''); setSearchQuery(''); }}
                    className="absolute right-3 top-3 text-xs text-[#75675C] hover:text-[#3E2C20]"
                  >
                    Clear
                  </button>
                )}
              </form>
            )}

            {/* Nav Controls */}
            <div className="flex items-center gap-3 sm:gap-4">
              <Link
                href="/shop"
                className={`hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                  pathname === '/shop'
                    ? 'bg-[#E8DED2] text-[#3E2C20]'
                    : 'text-[#75675C] hover:text-[#3E2C20] hover:bg-[#E8DED2]/50'
                }`}
              >
                <Store className="w-4 h-4" />
                Shop Catalog
              </Link>

              {/* Admin Button */}
              {isAdminLoggedIn ? (
                <div className="flex items-center gap-2">
                  <Link
                    href="/admin"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#6B4F3A] text-white hover:bg-[#3E2C20] transition-colors shadow-sm"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Admin Portal
                  </Link>
                </div>
              ) : (
                <Link
                  href="/admin/login"
                  className="text-xs text-[#75675C] hover:text-[#3E2C20] px-2.5 py-1.5 rounded border border-[#E5DBD0] transition-colors"
                >
                  Admin Login
                </Link>
              )}

              {/* Cart Button */}
              {!isAdminPage && (
                <button
                  onClick={() => setIsCartOpen(true)}
                  className="relative p-2.5 rounded-full bg-[#6B4F3A] text-white hover:bg-[#3E2C20] transition-transform active:scale-95 shadow-md flex items-center justify-center"
                  aria-label="Open Shopping Cart"
                >
                  <ShoppingBag className="w-5 h-5" />
                  {itemCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-[#C86D51] text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#FAF7F2]">
                      {itemCount}
                    </span>
                  )}
                </button>
              )}

              {/* Mobile menu toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 md:hidden text-[#3E2C20] hover:bg-[#E8DED2]/50 rounded-lg"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Search Bar */}
          {!isAdminPage && (
            <div className="pb-3 md:hidden">
              <form onSubmit={handleSearchSubmit} className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={localSearch}
                  onChange={(e) => setLocalSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-full bg-white border border-[#E5DBD0] text-sm text-[#2B2521] placeholder-[#75675C] focus:outline-none focus:ring-2 focus:ring-[#6B4F3A]"
                />
                <Search className="w-4 h-4 text-[#75675C] absolute left-3 top-2.5" />
              </form>
            </div>
          )}
        </div>

        {/* Mobile menu dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-[#E5DBD0] bg-[#FAF7F2] px-4 py-3 space-y-2">
            <Link
              href="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-sm font-medium text-[#3E2C20] hover:bg-[#E8DED2]/60"
            >
              Home
            </Link>
            <Link
              href="/shop"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-sm font-medium text-[#3E2C20] hover:bg-[#E8DED2]/60"
            >
              Shop Catalog
            </Link>
            <Link
              href="/cart"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-sm font-medium text-[#3E2C20] hover:bg-[#E8DED2]/60"
            >
              View Cart ({itemCount} items)
            </Link>
            <Link
              href="/admin"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-sm font-medium text-[#6B4F3A] hover:bg-[#E8DED2]/60"
            >
              Admin Dashboard
            </Link>
          </div>
        )}
      </header>

      {/* Cart Drawer */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};
