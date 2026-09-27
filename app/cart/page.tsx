'use client';

import React from 'react';
import Link from 'next/link';
import { useShop } from '@/lib/context/shop-context';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, ArrowLeft } from 'lucide-react';

export default function CartPage() {
  const { cart, updateCartQuantity, removeFromCart, getCartTotal } = useShop();
  const { subtotal, deliveryFee, total, itemCount } = getCartTotal();

  if (cart.length === 0) {
    return (
      <div className="py-20 text-center max-w-md mx-auto bg-white p-8 rounded-3xl border border-[#E5DBD0] shadow-sm">
        <div className="w-16 h-16 rounded-full bg-[#FAF7F2] text-[#6B4F3A] flex items-center justify-center mx-auto mb-4">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold font-serif text-[#3E2C20]">Your Cart is Empty</h2>
        <p className="text-xs text-[#75675C] mt-2 mb-6">
          Explore our stationery catalog and add notebooks, pens, or art supplies.
        </p>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#6B4F3A] hover:bg-[#3E2C20] text-white text-xs font-bold rounded-xl shadow-md transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between border-b border-[#E5DBD0] pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#3E2C20]">Shopping Cart</h1>
          <p className="text-xs text-[#75675C] mt-0.5">
            Review your selected stationery items before placing order.
          </p>
        </div>
        <span className="text-xs font-bold bg-[#E8DED2] text-[#3E2C20] px-3 py-1 rounded-full">
          {itemCount} {itemCount === 1 ? 'item' : 'items'}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map(({ product, quantity }) => (
            <div
              key={product.id}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-white rounded-2xl border border-[#E5DBD0] shadow-xs"
            >
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-xl overflow-hidden bg-[#FAF7F2] border border-[#E5DBD0] shrink-0">
                  <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#2B2521] font-serif">{product.name}</h3>
                  <p className="text-xs font-semibold text-[#6B4F3A] mt-1">
                    {product.price.toLocaleString()} MMK
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between w-full sm:w-auto gap-6 border-t sm:border-t-0 pt-3 sm:pt-0 border-[#F7F3ED]">
                {/* Quantity adjustment */}
                <div className="flex items-center border border-[#E5DBD0] rounded-lg bg-[#FAF7F2]">
                  <button
                    onClick={() => updateCartQuantity(product.id, quantity - 1)}
                    className="p-1.5 text-[#75675C] hover:text-[#3E2C20]"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-3 text-xs font-bold text-[#2B2521]">{quantity}</span>
                  <button
                    onClick={() => updateCartQuantity(product.id, quantity + 1)}
                    disabled={quantity >= product.stock}
                    className="p-1.5 text-[#75675C] hover:text-[#3E2C20] disabled:opacity-30"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="text-right">
                  <span className="text-xs text-[#75675C] block">Subtotal</span>
                  <span className="text-xs font-bold text-[#3E2C20]">
                    {(product.price * quantity).toLocaleString()} MMK
                  </span>
                </div>

                <button
                  onClick={() => removeFromCart(product.id)}
                  className="p-2 text-[#75675C] hover:text-red-600 transition-colors"
                  title="Remove item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Summary Card */}
        <div className="bg-white p-6 rounded-2xl border border-[#E5DBD0] shadow-sm space-y-4">
          <h2 className="text-base font-bold font-serif text-[#3E2C20] border-b border-[#E5DBD0] pb-3">
            Order Summary
          </h2>

          <div className="space-y-2 text-xs text-[#75675C]">
            <div className="flex justify-between">
              <span>Items Subtotal</span>
              <span className="font-semibold text-[#2B2521]">{subtotal.toLocaleString()} MMK</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Fee</span>
              <span className="font-semibold text-[#2B2521]">{deliveryFee.toLocaleString()} MMK</span>
            </div>
            <div className="flex justify-between text-sm font-bold text-[#3E2C20] pt-3 border-t border-[#E5DBD0]">
              <span>Total Amount</span>
              <span className="text-[#6B4F3A] text-base">{total.toLocaleString()} MMK</span>
            </div>
          </div>

          <Link
            href="/checkout"
            className="w-full py-3.5 bg-[#6B4F3A] hover:bg-[#3E2C20] text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.99]"
          >
            Proceed to Checkout
            <ArrowRight className="w-4 h-4" />
          </Link>

          <p className="text-[11px] text-[#75675C] text-center italic">
            Payment will be collected via Cash on Delivery upon receiving package.
          </p>
        </div>
      </div>
    </div>
  );
}
