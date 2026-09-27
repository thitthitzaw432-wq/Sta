'use client';

import React, { useState } from 'react';
import { useShop } from '@/lib/context/shop-context';
import { Product } from '@/types/shop';
import { Plus, Edit2, Trash2, Search, X, Check, Star, AlertTriangle, Image as ImageIcon } from 'lucide-react';

export default function AdminProductsPage() {
  const { products, categories, addProduct, updateProduct, deleteProduct } = useShop();

  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [price, setPrice] = useState<number | ''>('');
  const [categoryId, setCategoryId] = useState('');
  const [stock, setStock] = useState<number | ''>('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [featured, setFeatured] = useState(false);

  const resetForm = () => {
    setName('');
    setPrice('');
    setCategoryId(categories[0]?.id || '');
    setStock('');
    setDescription('');
    setImageUrl('');
    setFeatured(false);
    setEditingProduct(null);
  };

  const openAddModal = () => {
    resetForm();
    setIsAddModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setName(product.name);
    setPrice(product.price);
    setCategoryId(product.category_id);
    setStock(product.stock);
    setDescription(product.description);
    setImageUrl(product.image_url);
    setFeatured(product.featured);
    setIsAddModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price || !categoryId || stock === '') return;

    const fallbackImage =
      imageUrl.trim() ||
      'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80';

    if (editingProduct) {
      updateProduct(editingProduct.id, {
        name,
        price: Number(price),
        category_id: categoryId,
        stock: Number(stock),
        description,
        image_url: fallbackImage,
        featured,
      });
    } else {
      addProduct({
        name,
        price: Number(price),
        category_id: categoryId,
        stock: Number(stock),
        description,
        image_url: fallbackImage,
        featured,
      });
    }

    setIsAddModalOpen(false);
    resetForm();
  };

  // Filtered Products
  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCat === 'all' || p.category_id === selectedCat;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5DBD0] pb-4">
        <div>
          <h1 className="text-2xl font-bold font-serif text-[#3E2C20]">Product Management</h1>
          <p className="text-xs text-[#75675C] mt-0.5">
            Add new items, modify product prices, update stock levels, and toggle featured status.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="px-4 py-2.5 bg-[#6B4F3A] hover:bg-[#3E2C20] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-md transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Add New Product
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 bg-white p-4 rounded-2xl border border-[#E5DBD0]">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-[#E5DBD0] text-xs text-[#2B2521] bg-[#FAF7F2] focus:outline-none focus:ring-1 focus:ring-[#6B4F3A]"
          />
          <Search className="w-4 h-4 text-[#75675C] absolute left-3 top-2.5" />
        </div>

        <select
          value={selectedCat}
          onChange={(e) => setSelectedCat(e.target.value)}
          className="px-3 py-2 rounded-xl border border-[#E5DBD0] text-xs font-semibold text-[#3E2C20] bg-[#FAF7F2] focus:outline-none"
        >
          <option value="all">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-3xl border border-[#E5DBD0] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#E5DBD0] text-[11px] uppercase font-bold text-[#75675C] bg-[#FAF7F2]">
                <th className="py-3 px-4">Item</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Stock</th>
                <th className="py-3 px-4">Featured</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F7F3ED] text-xs">
              {filteredProducts.map((product) => {
                const cat = categories.find((c) => c.id === product.category_id);
                const isLow = product.stock <= 5;

                return (
                  <tr key={product.id} className="hover:bg-[#FAF7F2]/60 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="w-10 h-10 rounded-lg object-cover bg-[#FAF7F2] border border-[#E5DBD0]"
                        />
                        <div>
                          <span className="font-bold text-[#3E2C20] block font-serif">
                            {product.name}
                          </span>
                          <span className="text-[10px] text-[#75675C] line-clamp-1 max-w-xs">
                            {product.description}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-[#75675C] font-medium">
                      {cat?.name || 'Unassigned'}
                    </td>
                    <td className="py-3 px-4 font-bold text-[#6B4F3A]">
                      {product.price.toLocaleString()} MMK
                    </td>
                    <td className="py-3 px-4">
                      {isLow ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-200">
                          <AlertTriangle className="w-3 h-3" /> {product.stock} left
                        </span>
                      ) : (
                        <span className="text-xs font-semibold text-[#2B2521]">
                          {product.stock} units
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => updateProduct(product.id, { featured: !product.featured })}
                        className={`p-1 rounded-md transition-colors ${
                          product.featured ? 'text-amber-500 bg-amber-50' : 'text-[#75675C]'
                        }`}
                        title="Toggle Featured"
                      >
                        <Star className={`w-4 h-4 ${product.featured ? 'fill-current' : ''}`} />
                      </button>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(product)}
                          className="p-1.5 text-[#6B4F3A] hover:bg-[#E8DED2]/50 rounded-lg transition-colors"
                          title="Edit product"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Delete "${product.name}"?`)) deleteProduct(product.id);
                          }}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal (PRD Section 17) */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-[#E5DBD0] shadow-2xl w-full max-w-lg p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#E5DBD0] pb-3">
              <h2 className="text-lg font-bold font-serif text-[#3E2C20]">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 text-[#75675C] hover:text-[#3E2C20]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#3E2C20] mb-1">Product Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Premium Leather Journal"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#E5DBD0] text-xs text-[#2B2521] bg-[#FAF7F2] focus:outline-none focus:ring-1 focus:ring-[#6B4F3A]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#3E2C20] mb-1">Price (MMK)</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 5000"
                    value={price}
                    onChange={(e) => setPrice(e.target.value ? Number(e.target.value) : '')}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#E5DBD0] text-xs text-[#2B2521] bg-[#FAF7F2] focus:outline-none focus:ring-1 focus:ring-[#6B4F3A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#3E2C20] mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 25"
                    value={stock}
                    onChange={(e) => setStock(e.target.value ? Number(e.target.value) : '')}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#E5DBD0] text-xs text-[#2B2521] bg-[#FAF7F2] focus:outline-none focus:ring-1 focus:ring-[#6B4F3A]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#3E2C20] mb-1">Category</label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#E5DBD0] text-xs font-semibold text-[#3E2C20] bg-[#FAF7F2] focus:outline-none"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#3E2C20] mb-1">Image URL</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#E5DBD0] text-xs text-[#2B2521] bg-[#FAF7F2] focus:outline-none focus:ring-1 focus:ring-[#6B4F3A]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#3E2C20] mb-1">Description</label>
                <textarea
                  rows={3}
                  placeholder="Short description of the product..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#E5DBD0] text-xs text-[#2B2521] bg-[#FAF7F2] focus:outline-none focus:ring-1 focus:ring-[#6B4F3A]"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="featured-check"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="w-4 h-4 text-[#6B4F3A] rounded border-[#E5DBD0]"
                />
                <label htmlFor="featured-check" className="text-xs font-bold text-[#3E2C20]">
                  Featured Product (Highlight on Home Page)
                </label>
              </div>

              <div className="pt-4 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#75675C] hover:bg-[#FAF7F2]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#6B4F3A] hover:bg-[#3E2C20] text-white text-xs font-bold rounded-xl shadow-md"
                >
                  {editingProduct ? 'Update Product' : 'Save Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
