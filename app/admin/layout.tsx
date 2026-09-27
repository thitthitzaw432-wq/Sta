'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useShop } from '@/lib/context/shop-context';
import { LayoutDashboard, Package, FolderTree, ShoppingCart, LogOut, Store } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAdminLoggedIn, logoutAdmin } = useShop();

  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    if (!isLoginPage && !isAdminLoggedIn) {
      router.push('/admin/login');
    }
  }, [isAdminLoggedIn, isLoginPage, router]);

  if (isLoginPage) return <>{children}</>;
  if (!isAdminLoggedIn) return null;

  const navItems = [
    { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { label: 'Products', href: '/admin/products', icon: Package },
    { label: 'Categories', href: '/admin/categories', icon: FolderTree },
    { label: 'Orders', href: '/admin/orders', icon: ShoppingCart },
  ];

  return (
    <div className="space-y-6">
      {/* Admin Top Navigation Header */}
      <div className="bg-[#3E2C20] text-white p-4 rounded-2xl shadow-md flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#6B4F3A] flex items-center justify-center font-bold font-serif text-white">
            P&I
          </div>
          <div>
            <h2 className="text-base font-bold font-serif leading-tight">Admin Dashboard</h2>
            <span className="text-[10px] text-[#E8DED2]/80 uppercase tracking-widest block font-medium">
              Stationery Shop Management
            </span>
          </div>
        </div>

        {/* Links */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  isActive
                    ? 'bg-[#6B4F3A] text-white shadow-xs'
                    : 'text-[#E8DED2]/80 hover:text-white hover:bg-[#6B4F3A]/40'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {item.label}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="px-2.5 py-1 rounded-md text-xs font-medium text-[#E8DED2] hover:text-white bg-white/10 hover:bg-white/20 transition-colors flex items-center gap-1"
          >
            <Store className="w-3.5 h-3.5" /> Storefront
          </Link>
          <button
            onClick={() => {
              logoutAdmin();
              router.push('/admin/login');
            }}
            className="px-2.5 py-1 rounded-md text-xs font-semibold bg-red-900/40 hover:bg-red-900/60 text-red-200 transition-colors flex items-center gap-1"
          >
            <LogOut className="w-3.5 h-3.5" /> Logout
          </button>
        </div>
      </div>

      {children}
    </div>
  );
}
