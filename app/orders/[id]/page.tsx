'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useShop } from '@/lib/context/shop-context';
import { CheckCircle2, Package, Truck, Clock, MapPin, Phone, User, ShoppingBag, ArrowRight } from 'lucide-react';
import { OrderStatus } from '@/types/shop';

export default function OrderConfirmationPage() {
  const { id } = useParams<{ id: string }>();
  const { orders } = useShop();

  const order = orders.find((o) => o.id === id || o.order_number === id);

  if (!order) {
    return (
      <div className="py-20 text-center max-w-md mx-auto bg-white p-8 rounded-3xl border border-[#E5DBD0]">
        <h2 className="text-xl font-bold font-serif text-[#3E2C20]">Order Not Found</h2>
        <p className="text-xs text-[#75675C] mt-2 mb-6">
          We couldnt locate an order matching that ID.
        </p>
        <Link
          href="/"
          className="px-5 py-2.5 bg-[#6B4F3A] text-white text-xs font-bold rounded-xl hover:bg-[#3E2C20]"
        >
          Return to Home
        </Link>
      </div>
    );
  }

  // Timeline steps according to PRD Section 15
  const steps: { label: OrderStatus; icon: React.FC<{ className?: string }> }[] = [
    { label: 'Pending', icon: Clock },
    { label: 'Confirmed', icon: CheckCircle2 },
    { label: 'Shipped', icon: Truck },
    { label: 'Delivered', icon: Package },
  ];

  const currentStepIndex = steps.findIndex((s) => s.label === order.status);

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Success Hero Header (PRD Section 14) */}
      <div className="bg-white p-6 sm:p-10 rounded-3xl border border-[#E5DBD0] text-center shadow-sm space-y-4">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#3E2C20]">
            Order Confirmed!
          </h1>
          <p className="text-xs sm:text-sm text-[#75675C] mt-1">
            Thank you for shopping with Paper & Ink Stationery. We have received your order.
          </p>
        </div>

        <div className="inline-block px-4 py-2 bg-[#FAF7F2] rounded-xl border border-[#E5DBD0] text-sm font-extrabold text-[#6B4F3A]">
          Order Number: #{order.order_number}
        </div>
      </div>

      {/* Order Status Timeline (PRD Section 15) */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E5DBD0] shadow-sm space-y-6">
        <h2 className="text-base font-bold font-serif text-[#3E2C20] border-b border-[#E5DBD0] pb-3">
          Order Progress Tracker
        </h2>

        <div className="grid grid-cols-4 gap-2 relative">
          {steps.map((step, idx) => {
            const isCompleted = idx <= currentStepIndex;
            const isCurrent = idx === currentStepIndex;
            const StepIcon = step.icon;

            return (
              <div key={step.label} className="flex flex-col items-center text-center space-y-2 relative z-10">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                    isCompleted
                      ? 'bg-[#6B4F3A] text-white shadow-sm ring-4 ring-[#E8DED2]'
                      : 'bg-[#FAF7F2] text-[#75675C] border border-[#E5DBD0]'
                  }`}
                >
                  <StepIcon className="w-5 h-5" />
                </div>
                <span
                  className={`text-xs font-bold ${
                    isCurrent ? 'text-[#6B4F3A]' : isCompleted ? 'text-[#3E2C20]' : 'text-[#75675C]'
                  }`}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Delivery & Items Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Customer Information */}
        <div className="bg-white p-6 rounded-3xl border border-[#E5DBD0] shadow-sm space-y-3 text-xs">
          <h3 className="text-sm font-bold font-serif text-[#3E2C20] border-b border-[#E5DBD0] pb-2">
            Customer Info
          </h3>
          <div className="flex items-center gap-2 text-[#2B2521]">
            <User className="w-4 h-4 text-[#6B4F3A]" />
            <span className="font-semibold">{order.customer_name}</span>
          </div>
          <div className="flex items-center gap-2 text-[#75675C]">
            <Phone className="w-4 h-4 text-[#6B4F3A]" />
            <span>{order.phone}</span>
          </div>
          <div className="flex items-start gap-2 text-[#75675C]">
            <MapPin className="w-4 h-4 text-[#6B4F3A] shrink-0 mt-0.5" />
            <span>{order.address}</span>
          </div>
          {order.note && (
            <div className="p-2.5 rounded-xl bg-[#FAF7F2] border border-[#E5DBD0] text-[11px] text-[#75675C]">
              <span className="font-bold text-[#3E2C20]">Note:</span> {order.note}
            </div>
          )}
        </div>

        {/* Payment & Breakdown */}
        <div className="bg-white p-6 rounded-3xl border border-[#E5DBD0] shadow-sm space-y-3 text-xs">
          <h3 className="text-sm font-bold font-serif text-[#3E2C20] border-b border-[#E5DBD0] pb-2">
            Payment Summary
          </h3>
          <div className="flex justify-between text-[#75675C]">
            <span>Items Subtotal</span>
            <span className="font-semibold text-[#2B2521]">{order.subtotal.toLocaleString()} MMK</span>
          </div>
          <div className="flex justify-between text-[#75675C]">
            <span>Delivery Fee</span>
            <span className="font-semibold text-[#2B2521]">{order.delivery_fee.toLocaleString()} MMK</span>
          </div>
          <div className="flex justify-between text-sm font-extrabold text-[#3E2C20] pt-2 border-t border-[#E5DBD0]">
            <span>Total Payable</span>
            <span className="text-[#6B4F3A]">{order.total.toLocaleString()} MMK</span>
          </div>
          <p className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 p-2 rounded-lg border border-emerald-200">
            Payment Method: Cash on Delivery
          </p>
        </div>
      </div>

      {/* Ordered Items List */}
      <div className="bg-white p-6 rounded-3xl border border-[#E5DBD0] shadow-sm space-y-4">
        <h3 className="text-sm font-bold font-serif text-[#3E2C20] border-b border-[#E5DBD0] pb-3">
          Items Ordered ({order.items.length})
        </h3>
        <div className="space-y-3">
          {order.items.map((item) => (
            <div key={item.id} className="flex items-center justify-between text-xs py-1">
              <div className="flex items-center gap-3">
                {item.image_url && (
                  <img
                    src={item.image_url}
                    alt={item.product_name}
                    className="w-10 h-10 rounded-lg object-cover bg-[#FAF7F2] border border-[#E5DBD0]"
                  />
                )}
                <div>
                  <h4 className="font-bold text-[#2B2521]">{item.product_name}</h4>
                  <p className="text-[#75675C]">Qty: {item.quantity}</p>
                </div>
              </div>
              <span className="font-bold text-[#3E2C20]">
                {(item.price * item.quantity).toLocaleString()} MMK
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-center pt-2">
        <Link
          href="/shop"
          className="px-8 py-3.5 bg-[#6B4F3A] hover:bg-[#3E2C20] text-white text-sm font-bold rounded-xl shadow-md flex items-center gap-2 transition-all"
        >
          <ShoppingBag className="w-4 h-4" /> Continue Shopping
        </Link>
      </div>
    </div>
  );
}
