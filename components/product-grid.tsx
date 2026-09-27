'use client';

import React from 'react';
import { Product } from '@/types/shop';
import { ProductCard } from '@/components/product-card';
import { SearchX } from 'lucide-react';

interface ProductGridProps {
  products: Product[];
  title?: string;
  subtitle?: string;
}

export const ProductGrid: React.FC<ProductGridProps> = ({ products, title, subtitle }) => {
  if (products.length === 0) {
    return (
      <div className="py-16 text-center bg-white rounded-2xl border border-[#E5DBD0] p-8 max-w-md mx-auto my-8">
        <div className="w-14 h-14 rounded-full bg-[#FAF7F2] text-[#75675C] flex items-center justify-center mx-auto mb-3">
          <SearchX className="w-7 h-7" />
        </div>
        <h3 className="text-base font-bold text-[#3E2C20]">No stationery items found</h3>
        <p className="text-xs text-[#75675C] mt-1">
          Try searching for something else or clear selected category filters.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {(title || subtitle) && (
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-[#E5DBD0] pb-3 mb-6">
          <div>
            {title && (
              <h2 className="text-xl sm:text-2xl font-bold text-[#3E2C20] font-serif tracking-tight">
                {title}
              </h2>
            )}
            {subtitle && <p className="text-xs text-[#75675C] mt-0.5">{subtitle}</p>}
          </div>
          <span className="text-xs font-semibold text-[#75675C] mt-2 md:mt-0">
            Showing {products.length} products
          </span>
        </div>
      )}

      {/* Grid: 2 columns on Mobile, 3 on Tablet, 4 on Desktop (PRD Section 7) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};
