'use client';

import React, { useState } from 'react';
import { useShop } from '@/lib/context/shop-context';
import { CategoryCard } from '@/components/category-card';
import { Plus, FolderTree, X } from 'lucide-react';

export default function AdminCategoriesPage() {
  const { categories, products, addCategory } = useShop();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [description, setDescription] = useState('');

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const fallbackImg =
      imageUrl.trim() ||
      'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80';

    addCategory({
      name: name.trim(),
      image_url: fallbackImg,
      description: description.trim(),
    });

    setName('');
    setImageUrl('');
    setDescription('');
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5DBD0] pb-4">
        <div>
          <h1 className="text-2xl font-bold font-serif text-[#3E2C20]">Category Management</h1>
          <p className="text-xs text-[#75675C] mt-0.5">
            Organize stationery catalog into distinct categories for easier discovery.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 bg-[#6B4F3A] hover:bg-[#3E2C20] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-md transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Add Category
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {categories.map((cat) => {
          const itemCount = products.filter((p) => p.category_id === cat.id).length;
          return <CategoryCard key={cat.id} category={{ ...cat, item_count: itemCount }} />;
        })}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-[#E5DBD0] shadow-2xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#E5DBD0] pb-3">
              <h2 className="text-lg font-bold font-serif text-[#3E2C20]">Add New Category</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-[#75675C]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddCategory} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#3E2C20] mb-1">Category Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Calligraphy & Ink"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#E5DBD0] text-xs text-[#2B2521] bg-[#FAF7F2] focus:outline-none focus:ring-1 focus:ring-[#6B4F3A]"
                />
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
                  rows={2}
                  placeholder="Short description..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#E5DBD0] text-xs text-[#2B2521] bg-[#FAF7F2] focus:outline-none focus:ring-1 focus:ring-[#6B4F3A]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs text-[#75675C]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#6B4F3A] text-white text-xs font-bold rounded-xl shadow-md"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
