'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useShop } from '@/lib/context/shop-context';
import { ShieldCheck, Truck, ArrowLeft, CheckCircle2, ShoppingBag } from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, getCartTotal, placeOrder } = useShop();
  const { subtotal, deliveryFee, total, itemCount } = getCartTotal();

  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [note, setNote] = useState('');
  const [errors, setErrors] = useState<{ name?: string; phone?: string; address?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (cart.length === 0) {
    return (
      <div className="py-20 text-center max-w-md mx-auto bg-white p-8 rounded-3xl border border-[#E5DBD0]">
        <h2 className="text-xl font-bold font-serif text-[#3E2C20]">Your Cart is Empty</h2>
        <p className="text-xs text-[#75675C] mt-2 mb-6">
          Add stationery items to your cart before proceeding to checkout.
        </p>
        <Link
          href="/shop"
          className="px-5 py-2.5 bg-[#6B4F3A] text-white text-xs font-bold rounded-xl hover:bg-[#3E2C20]"
        >
          Return to Shop
        </Link>
      </div>
    );
  }

  const validate = () => {
    const errs: { name?: string; phone?: string; address?: string } = {};
    if (!customerName.trim()) errs.name = 'Full name is required';
    if (!phone.trim()) errs.phone = 'Phone number is required';
    if (!address.trim()) errs.address = 'Delivery address is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const order = placeOrder({
        customer_name: customerName,
        phone,
        address,
        note,
      });

      router.push(`/orders/${order.id}`);
    } catch (e) {
      console.error(e);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <Link
          href="/cart"
          className="inline-flex items-center gap-1 text-xs font-bold text-[#75675C] hover:text-[#3E2C20] mb-3"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Cart
        </Link>
        <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#3E2C20]">Checkout</h1>
        <p className="text-xs text-[#75675C] mt-0.5">
          Please enter your contact and delivery details to complete your order.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Customer Information Form */}
        <form onSubmit={handleSubmitOrder} className="lg:col-span-2 space-y-6 bg-white p-6 sm:p-8 rounded-3xl border border-[#E5DBD0] shadow-sm">
          <h2 className="text-lg font-bold font-serif text-[#3E2C20] border-b border-[#E5DBD0] pb-3">
            Customer Information
          </h2>

          {/* Full Name */}
          <div>
            <label className="block text-xs font-bold text-[#3E2C20] mb-1">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Aeris Gainsborough"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className={`w-full px-4 py-2.5 rounded-xl border text-sm text-[#2B2521] bg-[#FAF7F2] focus:outline-none focus:ring-2 focus:ring-[#6B4F3A]/30 ${
                errors.name ? 'border-red-500' : 'border-[#E5DBD0]'
              }`}
            />
            {errors.name && <p className="text-[11px] text-red-500 mt-1">{errors.name}</p>}
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-xs font-bold text-[#3E2C20] mb-1">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              placeholder="e.g. 09971234567"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={`w-full px-4 py-2.5 rounded-xl border text-sm text-[#2B2521] bg-[#FAF7F2] focus:outline-none focus:ring-2 focus:ring-[#6B4F3A]/30 ${
                errors.phone ? 'border-red-500' : 'border-[#E5DBD0]'
              }`}
            />
            {errors.phone && <p className="text-[11px] text-red-500 mt-1">{errors.phone}</p>}
          </div>

          {/* Delivery Address */}
          <div>
            <label className="block text-xs font-bold text-[#3E2C20] mb-1">
              Delivery Address <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={3}
              placeholder="House number, street, township, city"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className={`w-full px-4 py-2.5 rounded-xl border text-sm text-[#2B2521] bg-[#FAF7F2] focus:outline-none focus:ring-2 focus:ring-[#6B4F3A]/30 ${
                errors.address ? 'border-red-500' : 'border-[#E5DBD0]'
              }`}
            />
            {errors.address && <p className="text-[11px] text-red-500 mt-1">{errors.address}</p>}
          </div>

          {/* Order Note (Optional) */}
          <div>
            <label className="block text-xs font-bold text-[#3E2C20] mb-1">
              Order Note <span className="text-xs text-[#75675C] font-normal">(Optional)</span>
            </label>
            <input
              type="text"
              placeholder="Special instructions e.g. Wrap as gift, call upon arrival"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-[#E5DBD0] text-sm text-[#2B2521] bg-[#FAF7F2] focus:outline-none focus:ring-2 focus:ring-[#6B4F3A]/30"
            />
          </div>

          {/* Payment Method Option */}
          <div className="pt-4 border-t border-[#E5DBD0]">
            <h3 className="text-sm font-bold font-serif text-[#3E2C20] mb-3">
              Payment Method
            </h3>
            <div className="p-4 rounded-2xl bg-[#FAF7F2] border-2 border-[#6B4F3A] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#6B4F3A]" />
                <div>
                  <h4 className="text-xs font-bold text-[#3E2C20]">Cash on Delivery (COD)</h4>
                  <p className="text-[11px] text-[#75675C]">Pay cash directly to the courier upon receiving items.</p>
                </div>
              </div>
              <span className="text-xs font-bold text-[#6B4F3A] bg-white px-2.5 py-1 rounded-md border border-[#E5DBD0]">
                Selected
              </span>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 bg-[#6B4F3A] hover:bg-[#3E2C20] text-white font-bold text-sm rounded-xl shadow-lg transition-all active:scale-[0.99] disabled:opacity-50"
          >
            {isSubmitting ? 'Placing Order...' : `PLACE ORDER (${total.toLocaleString()} MMK)`}
          </button>
        </form>

        {/* Order Summary Sidebar */}
        <div className="bg-white p-6 rounded-3xl border border-[#E5DBD0] shadow-sm space-y-4">
          <h2 className="text-base font-bold font-serif text-[#3E2C20] border-b border-[#E5DBD0] pb-3">
            Summary ({itemCount} items)
          </h2>

          <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
            {cart.map(({ product, quantity }) => (
              <div key={product.id} className="flex items-center gap-3 text-xs">
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-12 h-12 rounded-lg object-cover bg-[#FAF7F2] border border-[#E5DBD0] shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-[#2B2521] truncate">{product.name}</h4>
                  <p className="text-[11px] text-[#75675C]">
                    {quantity} × {product.price.toLocaleString()} MMK
                  </p>
                </div>
                <span className="font-bold text-[#3E2C20]">
                  {(product.price * quantity).toLocaleString()}
                </span>
              </div>
            ))}
          </div>

          <div className="space-y-2 text-xs text-[#75675C] pt-3 border-t border-[#E5DBD0]">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-semibold text-[#2B2521]">{subtotal.toLocaleString()} MMK</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Fee</span>
              <span className="font-semibold text-[#2B2521]">{deliveryFee.toLocaleString()} MMK</span>
            </div>
            <div className="flex justify-between text-base font-extrabold text-[#3E2C20] pt-3 border-t border-[#E5DBD0]">
              <span>Total</span>
              <span className="text-[#6B4F3A]">{total.toLocaleString()} MMK</span>
            </div>
          </div>

          <div className="p-3 bg-[#FAF7F2] rounded-xl text-[11px] text-[#75675C] flex items-center gap-2 border border-[#E5DBD0]">
            <Truck className="w-4 h-4 text-[#6B4F3A] shrink-0" />
            <span>Delivering across Mandalay & Yangon regions.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
