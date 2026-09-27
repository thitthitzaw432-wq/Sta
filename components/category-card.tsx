'use client';

import React from 'react';
import { Category } from '@/types/shop';
import { ArrowRight } from 'lucide-react';

interface CategoryCardProps {
  category: Category;
  isSelected?: boolean;
  onClick?: () => void;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ category, isSelected, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`group text-left relative rounded-2xl overflow-hidden border transition-all duration-300 flex flex-col justify-end p-4 h-36 sm:h-44 w-full shadow-xs ${
        isSelected
          ? 'border-[#6B4F3A] ring-2 ring-[#6B4F3A]/40 scale-[1.02]'
          : 'border-[#E5DBD0] hover:border-[#6B4F3A] hover:shadow-md'
      }`}
    >
      {/* Background Image with Warm Gradient Overlay */}
      <img
        src={category.image_url}
        alt={category.name}
        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#2B2521]/85 via-[#2B2521]/40 to-transparent" />

      {/* Content */}
      <div className="relative z-10 text-white">
        <span className="text-[10px] uppercase font-bold tracking-widest text-[#E8DED2] bg-[#3E2C20]/60 backdrop-blur-xs px-2 py-0.5 rounded-md inline-block mb-1">
          {category.item_count ? `${category.item_count} Items` : 'Category'}
        </span>
        <h3 className="text-base font-bold font-serif text-white group-hover:translate-x-0.5 transition-transform">
          {category.name}
        </h3>
        {category.description && (
          <p className="text-[11px] text-[#E8DED2]/90 line-clamp-1 mt-0.5 font-light">
            {category.description}
          </p>
        )}
      </div>

      <div className="absolute top-3 right-3 z-10 w-7 h-7 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        <ArrowRight className="w-3.5 h-3.5" />
      </div>
    </button>
  );
};
