'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useShop } from '@/lib/context/shop-context';
import { ShieldCheck, Lock, ArrowRight, KeyRound } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const { loginAdmin } = useShop();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginAdmin(password)) {
      router.push('/admin');
    } else {
      setError('Invalid password. Demo password is "admin".');
    }
  };

  const handleQuickDemoLogin = () => {
    loginAdmin('admin');
    router.push('/admin');
  };

  return (
    <div className="max-w-md mx-auto py-12 sm:py-20">
      <div className="bg-white p-8 rounded-3xl border border-[#E5DBD0] shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-[#6B4F3A] text-white flex items-center justify-center mx-auto shadow-md">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold font-serif text-[#3E2C20]">
            Shop Admin Portal
          </h1>
          <p className="text-xs text-[#75675C]">
            Sign in to manage products, categories, stock inventory, and orders.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#3E2C20] mb-1">
              Admin Password
            </label>
            <div className="relative">
              <input
                type="password"
                placeholder="Enter admin password..."
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E5DBD0] text-sm text-[#2B2521] bg-[#FAF7F2] focus:outline-none focus:ring-2 focus:ring-[#6B4F3A]"
              />
              <Lock className="w-4 h-4 text-[#75675C] absolute left-3 top-3" />
            </div>
            {error && <p className="text-[11px] text-red-500 mt-1">{error}</p>}
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-[#6B4F3A] hover:bg-[#3E2C20] text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 shadow-md transition-all"
          >
            Access Dashboard <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Demo Shortcut */}
        <div className="pt-4 border-t border-[#E5DBD0] text-center">
          <button
            onClick={handleQuickDemoLogin}
            className="w-full py-2.5 bg-[#FAF7F2] hover:bg-[#E8DED2]/60 text-[#6B4F3A] border border-[#E5DBD0] rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
          >
            <KeyRound className="w-4 h-4" /> Quick Demo Admin Access
          </button>
          <span className="text-[10px] text-[#75675C] mt-2 block">
            Demo credentials pre-filled (`password: admin`)
          </span>
        </div>
      </div>
    </div>
  );
}
