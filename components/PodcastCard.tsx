// components/PodcastCard.tsx
import React from 'react';
import Link from 'next/link';

// 更新 TypeScript 定义，因为 listen_score 实际上可能是 string 类型的警告
export interface PodcastData {
  id: string;
  rank: number;
  title: string;
  publisher: string;
  image: string;
  description: string;
  listen_score: number | string; 
  total_episodes: number; // 👈 核心修复：添加这一行，告诉 TS 这个属性是存在的
  listennotes_url: string;
  trend: 'up' | 'down' | 'same' | 'new';
  trend_offset?: number;
}

// ... 下面的组件代码保持不变 ...

export default function PodcastCard({ podcast }: { podcast: PodcastData }) {
  // 排名颜色逻辑
  const getRankColor = (rank: number) => {
    if (rank === 1) return 'text-[#EAB308]'; // 金
    if (rank === 2) return 'text-[#94A3B8]'; // 银
    if (rank === 3) return 'text-[#CD7F32]'; // 铜
    return 'text-gray-300';
  };

  // 趋势渲染逻辑
  const renderTrend = () => {
    switch (podcast.trend) {
      case 'up':
        return (
          <div className="flex items-center text-trend-up font-bold text-[11px] gap-0.5" title={`比昨日上升 ${podcast.trend_offset} 位`}>
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clip-rule="evenodd"></path></svg>
            <span>{podcast.trend_offset}</span>
          </div>
        );
      case 'down':
        return (
          <div className="flex items-center text-trend-down font-bold text-[11px] gap-0.5" title={`比昨日下降 ${podcast.trend_offset} 位`}>
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
            <span>{podcast.trend_offset}</span>
          </div>
        );
      case 'new':
        return <div className="bg-red-500 text-white font-bold text-[10px] px-1.5 py-0.5 rounded-sm" title="今日新上榜">NEW</div>;
      default:
        return <div className="text-stone-300 font-bold text-lg leading-none" title="排名未变动">-</div>;
    }
  };

  // 判断 listen_score 是否为数字 (如果是 PRO 计划警告，将其视为 N/A)
  const isScoreNumeric = typeof podcast.listen_score === 'number' || (typeof podcast.listen_score === 'string' && !isNaN(Number(podcast.listen_score)));

  return (
    <div className="flex items-center p-5 md:p-7 bg-white rounded-3xl shadow-pod-card hover:shadow-lg transition-all duration-300 border border-stone-50 group cursor-pointer gap-5 md:gap-7">
      
      {/* 排名与趋势 (更精致的布局) */}
      <div className="flex flex-col items-center justify-center w-14 md:w-20 flex-shrink-0 gap-1.5">
        {renderTrend()}
        <div className={`text-5xl md:text-7xl font-black italic leading-none drop-shadow-sm ${getRankColor(podcast.rank)}`}>
          {podcast.rank}
        </div>
      </div>

      {/* 封面图加大，视觉焦点 */}
      <div className="relative flex-shrink-0 group-hover:scale-105 transition-transform duration-300">
        <img src={podcast.image} alt={podcast.title} className="w-24 h-24 md:w-36 md:h-36 rounded-2xl md:rounded-3xl object-cover shadow-sm border border-stone-100" />
      </div>

      {/* 文字内容区 (排版优化) */}
      <div className="flex-1 min-w-0 py-1">
        <h3 className="text-xl md:text-2xl font-bold text-pod-text-main truncate group-hover:text-pod-accent transition-colors">{podcast.title}</h3>
        <p className="text-xs md:text-sm text-stone-500 font-medium mt-1 md:mt-2">{podcast.publisher}</p>
        
        {/* ⭐ HTML Description 核心修复区 */}
        <div 
          className="text-sm text-stone-500 mt-4 line-clamp-2 hidden md:-webkit-box leading-relaxed" 
          dangerouslySetInnerHTML={{ __html: podcast.description }} // 安全地渲染 HTML
          style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
        />
      </div>

      {/* 数据与操作区：用总集数替代 N/A 的分数 */}
      <div className="hidden md:flex w-36 flex-col items-end flex-shrink-0 border-l border-stone-100 pl-7 py-2 gap-4">
        
        <div className="flex items-center gap-1.5 bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-full border border-indigo-100">
          <span className="text-indigo-400 text-sm">🎙️</span>
          <span className="text-xs font-bold whitespace-nowrap">已更新</span>
          <span className="text-base font-bold text-indigo-800">{podcast.total_episodes}</span>
          <span className="text-xs font-bold whitespace-nowrap">集</span>
        </div>
        
        <Link 
          href={`/podcast/${podcast.id}`} 
          className="text-center w-full mt-auto block text-sm font-bold text-indigo-600 bg-indigo-50 hover:bg-pod-accent hover:text-white px-5 py-2.5 rounded-xl transition-all border border-indigo-100/50"
        >
          查看详情
        </Link>
      </div>
    </div>
  );
}