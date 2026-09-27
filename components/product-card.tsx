'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Product } from '@/types/shop';
import { useShop } from '@/lib/context/shop-context';
import { Plus, Check, ShoppingBag, AlertTriangle } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, categories } = useShop();
  const [added, setAdded] = useState(false);

  const category = categories.find((c) => c.id === product.category_id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.stock <= 0) return;
    addToCart(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const isLowStock = product.stock > 0 && product.stock <= 5;
  const isOutOfStock = product.stock <= 0;

  return (
    <div className="group bg-white rounded-2xl border border-[#E5DBD0] overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between hover:-translate-y-1">
      <Link href={`/products/${product.id}`} className="block relative">
        {/* Product Photo Container */}
        <div className="relative aspect-4/3 w-full bg-[#FAF7F2] overflow-hidden flex items-center justify-center p-3">
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 rounded-lg"
            loading="lazy"
          />

          {/* Badges */}
          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start">
            {product.featured && (
              <span className="bg-[#6B4F3A] text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md shadow-xs">
                Featured
              </span>
            )}
            {category && (
              <span className="bg-[#FAF7F2]/90 backdrop-blur-xs text-[#75675C] text-[10px] font-semibold px-2 py-0.5 rounded-md border border-[#E5DBD0]">
                {category.name}
              </span>
            )}
          </div>

          {/* Stock Badges */}
          {isOutOfStock ? (
            <span className="absolute bottom-2.5 right-2.5 bg-red-100 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded-md border border-red-200">
              Out of Stock
            </span>
          ) : isLowStock ? (
            <span className="absolute bottom-2.5 right-2.5 bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-md border border-amber-200 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3 text-amber-600" />
              Low Stock ({product.stock})
            </span>
          ) : null}
        </div>

        {/* Content */}
        <div className="p-4 flex-1">
          <h3 className="text-sm font-bold text-[#2B2521] group-hover:text-[#6B4F3A] transition-colors line-clamp-1 font-serif">
            {product.name}
          </h3>
          <p className="text-xs text-[#75675C] mt-1 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>
      </Link>

      {/* Footer / Price & Action */}
      <div className="px-4 pb-4 pt-2 border-t border-[#F7F3ED] flex items-center justify-between mt-auto">
        <div>
          <span className="text-xs text-[#75675C] block font-medium">Price</span>
          <span className="text-sm font-extrabold text-[#3E2C20]">
            {product.price.toLocaleString()} <span className="text-xs font-semibold text-[#6B4F3A]">MMK</span>
          </span>
        </div>

        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs ${
            isOutOfStock
              ? 'bg-[#E8DED2] text-[#75675C] cursor-not-allowed'
              : added
              ? 'bg-emerald-600 text-white'
              : 'bg-[#6B4F3A] hover:bg-[#3E2C20] text-white active:scale-95'
          }`}
        >
          {added ? (
            <>
              <Check className="w-3.5 h-3.5" /> Added
            </>
          ) : (
            <>
              <Plus className="w-3.5 h-3.5" /> Add
            </>
          )}
        </button>
      </div>
    </div>
  );
};
