'use client';

import React from 'react';
import Link from 'next/link';
import { BookOpen, Heart, MapPin, Phone, Mail, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#3E2C20] text-[#E8DED2] border-t border-[#6B4F3A]/40 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand Info */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-[#6B4F3A] flex items-center justify-center text-white">
                <BookOpen className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold font-serif text-white tracking-wide">
                SACHI
              </span>
            </div>
            <p className="text-xs text-[#E8DED2]/80 leading-relaxed font-light">
              Crafted for writers, artists, students, and stationery enthusiasts. Discover warm aesthetic journals, fountain pens, and desk essentials.
            </p>
          </div>

          {/* Shop Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-white font-serif tracking-wider uppercase mb-3">
              Explore Shop
            </h4>
            <ul className="space-y-2 text-xs font-light">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/shop" className="hover:text-white transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/cart" className="hover:text-white transition-colors">
                  Shopping Cart
                </Link>
              </li>
              <li>
                <Link href="/checkout" className="hover:text-white transition-colors">
                  Checkout Order
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-sm font-bold text-white font-serif tracking-wider uppercase mb-3">
              Store Contact
            </h4>
            <ul className="space-y-2.5 text-xs font-light text-[#E8DED2]/90">
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#C86D51] shrink-0" />
                <span>Chanayethazan, Mandalay, Myanmar</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#C86D51] shrink-0" />
                <span>+95 9 971 234 567</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#C86D51] shrink-0" />
                <span>hello@sachi.shop</span>
              </li>
            </ul>
          </div>

          {/* Admin / Shop Owner Info */}
          <div>
            <h4 className="text-sm font-bold text-white font-serif tracking-wider uppercase mb-3">
              Shop Management
            </h4>
            <p className="text-xs text-[#E8DED2]/80 mb-3 font-light">
              Shop owners can manage products, check incoming orders, and update inventory in real-time.
            </p>
            <Link
              href="/admin/login"
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#6B4F3A] hover:bg-[#C86D51] text-white text-xs font-semibold rounded-lg transition-colors shadow-xs"
            >
              <ShieldCheck className="w-4 h-4" />
              Admin Portal
            </Link>
          </div>
        </div>

        <div className="pt-6 border-t border-[#6B4F3A]/40 flex flex-col sm:flex-row items-center justify-between text-xs text-[#E8DED2]/60 gap-3">
          <p>© 2026 Sachi Stationery Shop. All rights reserved.</p>
          <div className="flex items-center gap-1 text-[11px]">
            <span>Designed with</span>
            <Heart className="w-3.5 h-3.5 text-[#C86D51] fill-current" />
            <span>for stationery lovers</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
