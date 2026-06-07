'use client';

import { Tag } from '@/lib/types';
import { useState } from 'react';

interface FilterProps {
  tags: Tag[];
  onTagChange: (tagId: string | null) => void;
  isLoading?: boolean;
}

export function Filter({
  tags,
  onTagChange,
  isLoading = false,
}: FilterProps) {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const handleTagClick = (tagId: string) => {
    const newSelected = selectedTag === tagId ? null : tagId;
    setSelectedTag(newSelected);
    onTagChange(newSelected);
  };

  return (
    <div className="w-full">
      <div className="flex flex-col gap-6">
        {/* Title */}
        <div>
          <h2 className="text-3xl font-black text-white uppercase tracking-tight">
            All Products
          </h2>
          <p className="text-white mt-2">Filter by tags below</p>
        </div>

        {/* Tag Filter */}
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => {
              setSelectedTag(null);
              onTagChange(null);
            }}
            className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${
              selectedTag === null
                ? 'bg-white text-black border-3 border-white'
                : 'bg-transparent text-white border-3 border-white hover:bg-white/20'
            }`}
          >
            All
          </button>

          {tags.map((tag) => (
            <button
              key={tag.id}
              onClick={() => handleTagClick(tag.id)}
              disabled={isLoading}
              className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${
                selectedTag === tag.id
                  ? 'bg-white text-black border-3 border-white'
                  : 'text-white border-3 border-white hover:bg-gray-700'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {tag.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
