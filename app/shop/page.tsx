'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useShop } from '@/lib/context/shop-context';
import { ProductGrid } from '@/components/product-grid';
import { Filter, SlidersHorizontal, X, Search } from 'lucide-react';

function ShopContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category');

  const { products, categories, searchQuery, setSearchQuery } = useShop();
  const [selectedCatId, setSelectedCatId] = useState<string | null>(categoryParam || null);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'newest'>('featured');

  useEffect(() => {
    if (categoryParam) {
      setSelectedCatId(categoryParam);
    }
  }, [categoryParam]);

  // Filter products
  let filtered = products.filter((product) => {
    const matchesCategory = selectedCatId ? product.category_id === selectedCatId : true;
    const matchesSearch = searchQuery
      ? product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    return matchesCategory && matchesSearch;
  });

  // Sort products
  filtered.sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    if (sortBy === 'newest') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
  });

  const activeCat = categories.find((c) => c.id === selectedCatId);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#FAF7F2] p-6 sm:p-8 rounded-2xl border border-[#E5DBD0]">
        <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#3E2C20]">
          {activeCat ? activeCat.name : 'All Stationery Products'}
        </h1>
        <p className="text-xs sm:text-sm text-[#75675C] mt-1">
          {activeCat
            ? activeCat.description
            : 'Browse our complete collection of pens, notebooks, sketchbooks, and desk accessories.'}
        </p>

        {/* Category Pill Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pt-4 no-scrollbar">
          <button
            onClick={() => setSelectedCatId(null)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedCatId === null
                ? 'bg-[#6B4F3A] text-white'
                : 'bg-white text-[#75675C] border border-[#E5DBD0] hover:bg-[#E8DED2]/50'
            }`}
          >
            All Items ({products.length})
          </button>

          {categories.map((cat) => {
            const count = products.filter((p) => p.category_id === cat.id).length;
            const isSelected = selectedCatId === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCatId(cat.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                  isSelected
                    ? 'bg-[#6B4F3A] text-white'
                    : 'bg-white text-[#75675C] border border-[#E5DBD0] hover:bg-[#E8DED2]/50'
                }`}
              >
                {cat.name} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter and Sorting Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-[#E5DBD0]">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#6B4F3A]" />
          <span className="text-xs font-bold text-[#3E2C20]">Filter & Active Status</span>
          {(selectedCatId || searchQuery) && (
            <button
              onClick={() => {
                setSelectedCatId(null);
                setSearchQuery('');
              }}
              className="text-[11px] text-[#C86D51] font-semibold hover:underline flex items-center gap-0.5 ml-2"
            >
              <X className="w-3 h-3" /> Clear Filters
            </button>
          )}
        </div>

        {/* Sorting selector */}
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-[#75675C]" />
          <label htmlFor="sort-select" className="text-xs text-[#75675C]">Sort by:</label>
          <select
            id="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="text-xs font-semibold bg-[#FAF7F2] border border-[#E5DBD0] text-[#3E2C20] rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#6B4F3A]"
          >
            <option value="featured">Featured First</option>
            <option value="newest">Newest Arrivals</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Product Grid */}
      <ProductGrid products={filtered} />
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="py-12 text-center text-xs text-[#75675C]">Loading catalog...</div>}>
      <ShopContent />
    </Suspense>
  );
}
