// components/SearchBar.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      // 对输入内容进行编码并跳转到搜索结果页
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="relative w-full max-w-xs md:max-w-sm">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="搜索播客或主播..."
        className="w-full bg-stone-100 text-stone-700 text-sm px-4 py-2 rounded-full border border-stone-200 focus:outline-none focus:ring-2 focus:ring-pod-accent focus:bg-white transition-all"
      />
      <button 
        type="submit" 
        className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 hover:text-pod-accent p-1"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
      </button>
    </form>
  );
}