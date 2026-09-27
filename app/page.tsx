'use client';

import React from 'react';
import Link from 'next/link';
import { useShop } from '@/lib/context/shop-context';
import { ProductGrid } from '@/components/product-grid';
import { CategoryCard } from '@/components/category-card';
import { Sparkles, ArrowRight, Truck, ShieldCheck, RefreshCw, PenTool, BookOpen } from 'lucide-react';

export default function HomePage() {
  const { products, categories, setSelectedCategory } = useShop();

  const featuredProducts = products.filter((p) => p.featured);
  const newArrivals = [...products].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  ).slice(0, 4);

  return (
    <div className="space-y-12 sm:space-y-16">
      {/* Hero Banner (PRD Section 6.1) */}
      <section className="relative rounded-3xl bg-[#3E2C20] text-white overflow-hidden p-6 sm:p-12 shadow-xl border border-[#6B4F3A]/40">
        <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-[#6B4F3A]/30 blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-80 h-80 rounded-full bg-[#C86D51]/20 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#6B4F3A]/60 border border-[#E8DED2]/30 backdrop-blur-xs text-xs font-semibold text-[#E8DED2]">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Handpicked Stationery Collection</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold font-serif tracking-tight leading-tight">
            Find your next favorite <span className="text-[#E8DED2] underline decoration-[#C86D51]/80">notebook & pen ✨</span>
          </h1>

          <p className="text-sm sm:text-base text-[#E8DED2]/90 leading-relaxed font-light">
            Crafted for creative thinkers, journalers, and students. Discover premium cloth-bound journals, solid brass pens, and soft pastel highlighters.
          </p>

          <div className="pt-2 flex flex-wrap gap-3">
            <Link
              href="/shop"
              className="px-6 py-3 bg-[#6B4F3A] hover:bg-[#C86D51] text-white rounded-xl text-sm font-bold flex items-center gap-2 transition-all shadow-md active:scale-95"
            >
              Explore Shop Catalog
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/admin/login"
              className="px-5 py-3 bg-white/10 hover:bg-white/20 text-[#E8DED2] rounded-xl text-sm font-semibold border border-white/20 backdrop-blur-xs transition-colors"
            >
              Shop Owner Portal
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Grid Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-[#E5DBD0] pb-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold font-serif text-[#3E2C20]">
              Shop by Category
            </h2>
            <p className="text-xs text-[#75675C] mt-0.5">
              Browse our curated stationery selections
            </p>
          </div>
          <Link
            href="/shop"
            className="text-xs font-bold text-[#6B4F3A] hover:text-[#3E2C20] flex items-center gap-1"
          >
            View All Categories <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {categories.slice(0, 4).map((category) => (
            <Link
              key={category.id}
              href={`/shop?category=${category.id}`}
              onClick={() => setSelectedCategory(category.id)}
            >
              <CategoryCard category={category} />
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section>
        <ProductGrid
          products={featuredProducts}
          title="Featured Products"
          subtitle="Top recommendations loved by our customers"
        />
      </section>

      {/* New Arrivals */}
      <section>
        <ProductGrid
          products={newArrivals}
          title="New Arrivals"
          subtitle="Freshly stocked notebooks, pens, and art supplies"
        />
      </section>

      {/* Value Proposition Badges */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-[#E5DBD0]">
        <div className="p-5 rounded-2xl bg-white border border-[#E5DBD0] flex items-start gap-4 shadow-xs">
          <div className="p-3 rounded-xl bg-[#FAF7F2] text-[#6B4F3A] shrink-0">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-[#3E2C20] font-serif">Fast Doorstep Delivery</h4>
            <p className="text-xs text-[#75675C] mt-1">
              Standard 2,000 MMK delivery fee for all orders across towns.
            </p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#E5DBD0] flex items-start gap-4 shadow-xs">
          <div className="p-3 rounded-xl bg-[#FAF7F2] text-[#6B4F3A] shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-[#3E2C20] font-serif">Cash on Delivery</h4>
            <p className="text-xs text-[#75675C] mt-1">
              Pay upon order receipt directly at your doorstep without worry.
            </p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#E5DBD0] flex items-start gap-4 shadow-xs">
          <div className="p-3 rounded-xl bg-[#FAF7F2] text-[#6B4F3A] shrink-0">
            <PenTool className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-[#3E2C20] font-serif">Premium Quality</h4>
            <p className="text-xs text-[#75675C] mt-1">
              Thick 120gsm fountain-pen friendly paper and durable brass materials.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
