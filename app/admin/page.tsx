'use client';

import React from 'react';
import Link from 'next/link';
import { useShop } from '@/lib/context/shop-context';
import { ShoppingCart, Package, AlertTriangle, Clock, ArrowRight, TrendingUp } from 'lucide-react';
import { OrderStatus } from '@/types/shop';

export default function AdminDashboardPage() {
  const { products, orders, categories } = useShop();

  const totalProducts = products.length;
  const lowStockProducts = products.filter((p) => p.stock <= 5);
  const pendingOrders = orders.filter((o) => o.status === 'Pending');
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'Pending':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Confirmed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Shipped':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Delivered':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Greeting */}
      <div>
        <h1 className="text-2xl font-bold font-serif text-[#3E2C20]">
          Good morning 👋
        </h1>
        <p className="text-xs text-[#75675C] mt-0.5">
          Heres an overview of your stationery shop inventory and order updates.
        </p>
      </div>

      {/* Metrics Cards Grid (PRD Section 16) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Pending Orders */}
        <div className="bg-white p-5 rounded-2xl border border-[#E5DBD0] shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-[#75675C] block font-medium">Pending Orders</span>
            <span className="text-2xl font-extrabold text-[#3E2C20]">{pendingOrders.length}</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-200">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        {/* Metric 2: Total Products */}
        <div className="bg-white p-5 rounded-2xl border border-[#E5DBD0] shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-[#75675C] block font-medium">Total Products</span>
            <span className="text-2xl font-extrabold text-[#3E2C20]">{totalProducts}</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center border border-blue-200">
            <Package className="w-5 h-5" />
          </div>
        </div>

        {/* Metric 3: Low Stock Warning */}
        <div className="bg-white p-5 rounded-2xl border border-[#E5DBD0] shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-[#75675C] block font-medium">Low Stock Alerts</span>
            <span className="text-2xl font-extrabold text-[#3E2C20]">{lowStockProducts.length}</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center border border-red-200">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        {/* Metric 4: Revenue */}
        <div className="bg-white p-5 rounded-2xl border border-[#E5DBD0] shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-[#75675C] block font-medium">Total Sales</span>
            <span className="text-lg font-extrabold text-[#6B4F3A]">
              {totalRevenue.toLocaleString()} <span className="text-xs font-semibold">MMK</span>
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="bg-white rounded-3xl border border-[#E5DBD0] shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-[#E5DBD0] pb-3">
          <h2 className="text-base font-bold font-serif text-[#3E2C20]">
            Recent Customer Orders
          </h2>
          <Link
            href="/admin/orders"
            className="text-xs font-bold text-[#6B4F3A] hover:text-[#3E2C20] flex items-center gap-1"
          >
            Manage All Orders <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#E5DBD0] text-[11px] uppercase font-bold text-[#75675C]">
                <th className="py-2.5 px-3">Order #</th>
                <th className="py-2.5 px-3">Customer</th>
                <th className="py-2.5 px-3">Total (MMK)</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F7F3ED] text-xs">
              {orders.slice(0, 5).map((order) => (
                <tr key={order.id} className="hover:bg-[#FAF7F2] transition-colors">
                  <td className="py-3 px-3 font-bold text-[#3E2C20]">#{order.order_number}</td>
                  <td className="py-3 px-3 text-[#2B2521]">
                    <div className="font-semibold">{order.customer_name}</div>
                    <div className="text-[10px] text-[#75675C]">{order.phone}</div>
                  </td>
                  <td className="py-3 px-3 font-bold text-[#6B4F3A]">
                    {order.total.toLocaleString()} MMK
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`inline-block px-2.5 py-0.5 text-[10px] font-bold rounded-full border ${getStatusBadge(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-[#75675C]">
                    {new Date(order.created_at).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <Link
                      href="/admin/orders"
                      className="px-2.5 py-1 bg-[#FAF7F2] hover:bg-[#E8DED2] text-[#3E2C20] rounded-md font-semibold border border-[#E5DBD0] transition-colors"
                    >
                      View Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
