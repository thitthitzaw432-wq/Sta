'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useShop } from '@/lib/context/shop-context';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const { cart, updateCartQuantity, removeFromCart, getCartTotal } = useShop();
  const { subtotal, deliveryFee, total, itemCount } = getCartTotal();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FAF7F2] shadow-2xl flex flex-col border-l border-[#E5DBD0]">
          {/* Header */}
          <div className="p-5 border-b border-[#E5DBD0] flex items-center justify-between bg-white">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#6B4F3A]" />
              <h2 className="text-lg font-bold text-[#3E2C20]">Your Cart</h2>
              <span className="bg-[#E8DED2] text-[#3E2C20] text-xs font-semibold px-2 py-0.5 rounded-full">
                {itemCount} {itemCount === 1 ? 'item' : 'items'}
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-[#75675C] hover:text-[#3E2C20] hover:bg-[#E8DED2]/50 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart items list */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-[#75675C]">
                <div className="w-16 h-16 rounded-full bg-[#E8DED2]/50 flex items-center justify-center mb-4 text-[#6B4F3A]">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-base font-semibold text-[#3E2C20] mb-1">Your cart is empty</h3>
                <p className="text-xs text-[#75675C] max-w-xs mb-6">
                  Discover our minimal journal notebooks, solid brass pens, and fine stationery.
                </p>
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 bg-[#6B4F3A] text-white rounded-lg text-sm font-semibold hover:bg-[#3E2C20] transition-colors"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              cart.map(({ product, quantity }) => (
                <div
                  key={product.id}
                  className="flex gap-3 p-3 bg-white rounded-xl border border-[#E5DBD0] shadow-xs"
                >
                  <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-[#F7F3ED] border border-[#E5DBD0] shrink-0">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h4 className="text-xs font-semibold text-[#2B2521] line-clamp-1">
                          {product.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(product.id)}
                          className="text-[#75675C] hover:text-red-600 transition-colors p-0.5 ml-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-xs font-bold text-[#6B4F3A] mt-0.5">
                        {product.price.toLocaleString()} MMK
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      {/* Quantity Selector */}
                      <div className="flex items-center border border-[#E5DBD0] rounded-md bg-[#FAF7F2]">
                        <button
                          onClick={() => updateCartQuantity(product.id, quantity - 1)}
                          className="p-1 text-[#75675C] hover:text-[#3E2C20]"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2.5 text-xs font-bold text-[#2B2521]">
                          {quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(product.id, quantity + 1)}
                          disabled={quantity >= product.stock}
                          className="p-1 text-[#75675C] hover:text-[#3E2C20] disabled:opacity-30"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="text-xs font-semibold text-[#75675C]">
                        Subtotal: {(product.price * quantity).toLocaleString()} MMK
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Summary */}
          {cart.length > 0 && (
            <div className="p-5 bg-white border-t border-[#E5DBD0] space-y-3">
              <div className="space-y-1.5 text-xs text-[#75675C]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-[#2B2521]">{subtotal.toLocaleString()} MMK</span>
                </div>
                <div className="flex justify-between">
                  <span>Standard Delivery Fee</span>
                  <span className="font-semibold text-[#2B2521]">{deliveryFee.toLocaleString()} MMK</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-[#3E2C20] pt-2 border-t border-[#E5DBD0]">
                  <span>Total Amount</span>
                  <span className="text-[#6B4F3A]">{total.toLocaleString()} MMK</span>
                </div>
              </div>

              <Link
                href="/checkout"
                onClick={onClose}
                className="w-full py-3 bg-[#6B4F3A] hover:bg-[#3E2C20] text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.99]"
              >
                Proceed to Checkout
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
