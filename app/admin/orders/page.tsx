'use client';

import React, { useState } from 'react';
import { useShop } from '@/lib/context/shop-context';
import { OrderStatus } from '@/types/shop';
import { ShoppingCart, Phone, MapPin, User, Clock, CheckCircle2, Truck, Package, XCircle } from 'lucide-react';

export default function AdminOrdersPage() {
  const { orders, updateOrderStatus } = useShop();
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredOrders = orders.filter((o) => {
    if (filterStatus === 'all') return true;
    return o.status === filterStatus;
  });

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case 'Pending':
        return <Clock className="w-3.5 h-3.5 text-amber-600" />;
      case 'Confirmed':
        return <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />;
      case 'Shipped':
        return <Truck className="w-3.5 h-3.5 text-purple-600" />;
      case 'Delivered':
        return <Package className="w-3.5 h-3.5 text-emerald-600" />;
      default:
        return <XCircle className="w-3.5 h-3.5 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5DBD0] pb-4">
        <div>
          <h1 className="text-2xl font-bold font-serif text-[#3E2C20]">Order Management</h1>
          <p className="text-xs text-[#75675C] mt-0.5">
            Review incoming customer orders, inspect delivery addresses, and update fulfillment status.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {['all', 'Pending', 'Confirmed', 'Shipped', 'Delivered'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize whitespace-nowrap transition-colors ${
                filterStatus === st
                  ? 'bg-[#6B4F3A] text-white'
                  : 'bg-white text-[#75675C] border border-[#E5DBD0] hover:bg-[#FAF7F2]'
              }`}
            >
              {st} {st !== 'all' && `(${orders.filter((o) => o.status === st).length})`}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List Cards */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="bg-white p-8 rounded-3xl border border-[#E5DBD0] text-center text-[#75675C]">
            <ShoppingCart className="w-10 h-10 mx-auto mb-2 opacity-50" />
            <h3 className="text-sm font-bold text-[#3E2C20]">No orders found</h3>
            <p className="text-xs">No customer orders matching status &quot;{filterStatus}&quot;.</p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white p-6 rounded-3xl border border-[#E5DBD0] shadow-xs space-y-4 hover:shadow-md transition-shadow"
            >
              {/* Card Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F7F3ED] pb-3">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-extrabold text-[#3E2C20] font-serif">
                    Order #{order.order_number}
                  </span>
                  <span className="text-xs text-[#75675C]">
                    {new Date(order.created_at).toLocaleString()}
                  </span>
                </div>

                {/* Status Update Selector */}
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-[#75675C]">Status:</span>
                  <div className="flex items-center gap-1.5 bg-[#FAF7F2] px-2.5 py-1 rounded-xl border border-[#E5DBD0]">
                    {getStatusIcon(order.status)}
                    <select
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                      className="text-xs font-bold text-[#3E2C20] bg-transparent focus:outline-none cursor-pointer"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Order Info & Items */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
                {/* Customer Details */}
                <div className="space-y-2 bg-[#FAF7F2] p-4 rounded-2xl border border-[#E5DBD0]">
                  <h4 className="font-bold text-[#3E2C20] font-serif mb-2">Customer & Shipping</h4>
                  <div className="flex items-center gap-2 text-[#2B2521]">
                    <User className="w-3.5 h-3.5 text-[#6B4F3A]" />
                    <span className="font-semibold">{order.customer_name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#75675C]">
                    <Phone className="w-3.5 h-3.5 text-[#6B4F3A]" />
                    <span>{order.phone}</span>
                  </div>
                  <div className="flex items-start gap-2 text-[#75675C]">
                    <MapPin className="w-3.5 h-3.5 text-[#6B4F3A] shrink-0 mt-0.5" />
                    <span>{order.address}</span>
                  </div>
                  {order.note && (
                    <p className="text-[11px] text-[#6B4F3A] italic pt-1">
                      &quot;{order.note}&quot;
                    </p>
                  )}
                </div>

                {/* Ordered Items List */}
                <div className="md:col-span-2 space-y-3">
                  <h4 className="font-bold text-[#3E2C20] font-serif">Items Purchased</h4>
                  <div className="space-y-2">
                    {order.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-2 rounded-xl bg-[#FAF7F2]/50 border border-[#F7F3ED]"
                      >
                        <div className="flex items-center gap-2.5">
                          {item.image_url && (
                            <img
                              src={item.image_url}
                              alt={item.product_name}
                              className="w-9 h-9 rounded-lg object-cover bg-white border border-[#E5DBD0]"
                            />
                          )}
                          <div>
                            <span className="font-bold text-[#2B2521] block">
                              {item.product_name}
                            </span>
                            <span className="text-[11px] text-[#75675C]">
                              Qty: {item.quantity} × {item.price.toLocaleString()} MMK
                            </span>
                          </div>
                        </div>
                        <span className="font-bold text-[#3E2C20]">
                          {(item.price * item.quantity).toLocaleString()} MMK
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t border-[#F7F3ED] text-xs">
                    <span className="text-[#75675C]">
                      Subtotal: {order.subtotal.toLocaleString()} + Delivery: {order.delivery_fee.toLocaleString()} MMK
                    </span>
                    <span className="text-sm font-extrabold text-[#6B4F3A]">
                      Total: {order.total.toLocaleString()} MMK
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
