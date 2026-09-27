'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useShop } from '@/lib/context/shop-context';
import { ArrowLeft, Plus, Minus, Check, ShoppingBag, Truck, ShieldCheck, AlertTriangle } from 'lucide-react';
import { ProductGrid } from '@/components/product-grid';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { products, categories, addToCart } = useShop();

  const product = products.find((p) => p.id === id || p.slug === id);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  if (!product) {
    return (
      <div className="py-20 text-center max-w-md mx-auto">
        <h2 className="text-xl font-bold text-[#3E2C20]">Product Not Found</h2>
        <p className="text-xs text-[#75675C] mt-2 mb-6">
          The stationery product you are looking for may have been removed or renamed.
        </p>
        <Link
          href="/shop"
          className="px-5 py-2.5 bg-[#6B4F3A] text-white text-xs font-bold rounded-xl hover:bg-[#3E2C20]"
        >
          Back to Shop Catalog
        </Link>
      </div>
    );
  }

  const category = categories.find((c) => c.id === product.category_id);
  const relatedProducts = products
    .filter((p) => p.category_id === product.category_id && p.id !== product.id)
    .slice(0, 4);

  const isLowStock = product.stock > 0 && product.stock <= 5;
  const isOutOfStock = product.stock <= 0;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="space-y-12">
      {/* Back navigation */}
      <button
        onClick={() => router.back()}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#75675C] hover:text-[#3E2C20] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      {/* Main Details Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start bg-white p-6 sm:p-8 rounded-3xl border border-[#E5DBD0] shadow-sm">
        {/* Image Frame */}
        <div className="relative aspect-4/3 w-full bg-[#FAF7F2] rounded-2xl overflow-hidden border border-[#E5DBD0] p-4 flex items-center justify-center">
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover rounded-xl shadow-xs"
          />
          {product.featured && (
            <span className="absolute top-4 left-4 bg-[#6B4F3A] text-white text-xs font-bold px-2.5 py-1 rounded-md">
              Featured Item
            </span>
          )}
        </div>

        {/* Content & Actions */}
        <div className="space-y-6">
          <div>
            {category && (
              <span className="text-xs font-semibold text-[#6B4F3A] tracking-wider uppercase bg-[#E8DED2]/50 px-2.5 py-1 rounded-md border border-[#E5DBD0] inline-block mb-2">
                {category.name}
              </span>
            )}
            <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#3E2C20] leading-tight">
              {product.name}
            </h1>
            <div className="mt-3 flex items-baseline gap-3">
              <span className="text-2xl font-extrabold text-[#6B4F3A]">
                {product.price.toLocaleString()} MMK
              </span>
              {isOutOfStock ? (
                <span className="text-xs font-bold text-red-600 bg-red-50 px-2.5 py-1 rounded-md border border-red-200">
                  Out of Stock
                </span>
              ) : isLowStock ? (
                <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" /> Only {product.stock} left in stock
                </span>
              ) : (
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                  In Stock ({product.stock} available)
                </span>
              )}
            </div>
          </div>

          <p className="text-sm text-[#75675C] leading-relaxed border-t border-b border-[#F7F3ED] py-4">
            {product.description}
          </p>

          {/* Quantity Selector */}
          {!isOutOfStock && (
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#3E2C20] block">Quantity</label>
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-[#E5DBD0] rounded-xl bg-[#FAF7F2] p-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 text-[#75675C] hover:text-[#3E2C20] rounded-lg hover:bg-white transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 text-sm font-bold text-[#2B2521]">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    disabled={quantity >= product.stock}
                    className="p-2 text-[#75675C] hover:text-[#3E2C20] rounded-lg hover:bg-white transition-colors disabled:opacity-30"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <span className="text-xs text-[#75675C]">
                  Total: {(product.price * quantity).toLocaleString()} MMK
                </span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className={`flex-1 py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.99] ${
                isOutOfStock
                  ? 'bg-[#E8DED2] text-[#75675C] cursor-not-allowed'
                  : added
                  ? 'bg-emerald-600 text-white'
                  : 'bg-[#6B4F3A] hover:bg-[#3E2C20] text-white'
              }`}
            >
              {added ? (
                <>
                  <Check className="w-5 h-5" /> Added to Cart!
                </>
              ) : (
                <>
                  <ShoppingBag className="w-5 h-5" /> Add to Shopping Cart
                </>
              )}
            </button>
          </div>

          {/* Guarantee Badges */}
          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-[#F7F3ED] text-xs text-[#75675C]">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#6B4F3A]" />
              <span>Standard Delivery (2,000 MMK)</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#6B4F3A]" />
              <span>Cash on Delivery Supported</span>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="pt-6">
          <ProductGrid
            products={relatedProducts}
            title="You Might Also Like"
            subtitle="More items from this category"
          />
        </section>
      )}
    </div>
  );
}
