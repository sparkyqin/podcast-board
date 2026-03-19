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
    <div className="flex items-center p-4 md:p-7 bg-white rounded-3xl shadow-pod-card hover:shadow-lg transition-all duration-300 border border-slate-200/50 group cursor-pointer gap-3 md:gap-7">
      
      {/* 1. 排名区：手机端稍微缩小 */}
      <div className="flex flex-col items-center justify-center w-10 md:w-20 flex-shrink-0 gap-1">
        {renderTrend()}
        <div className={`text-3xl md:text-7xl font-black italic leading-none drop-shadow-sm ${getRankColor(podcast.rank)}`}>
          {podcast.rank}
        </div>
      </div>

      {/* 2. 封面图：手机端 64px, 电脑端 144px */}
      <div className="relative flex-shrink-0 group-hover:scale-105 transition-transform duration-300">
        <img src={podcast.image} alt={podcast.title} className="w-16 h-16 md:w-36 md:h-36 rounded-xl md:rounded-3xl object-cover shadow-sm border border-slate-100" />
      </div>

      {/* 3. 文字内容区 */}
      <div className="flex-1 min-w-0 py-1">
        <h3 className="text-base md:text-2xl font-bold text-slate-900 truncate group-hover:text-indigo-600 transition-colors">{podcast.title}</h3>
        <p className="text-[10px] md:text-sm text-slate-500 font-medium mt-0.5 md:mt-2">{podcast.publisher}</p>
        
        {/* 手机端隐藏简介，保证不拥挤 */}
        <div 
          className="text-sm text-slate-500 mt-4 line-clamp-2 hidden md:-webkit-box leading-relaxed" 
          dangerouslySetInnerHTML={{ __html: podcast.description }}
          style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
        />

        {/* ⭐️ 新增：手机端专用的简易集数显示 (仅在手机端显示) */}
        <div className="md:hidden mt-2">
           <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
             更新 {podcast.total_episodes} 集
           </span>
        </div>
      </div>

      {/* 4. 右侧数据与操作区：去掉 hidden，改为在手机端也显示，但调整样式 */}
      <div className="flex w-20 md:w-40 flex-col items-end flex-shrink-0 md:border-l md:border-slate-100 md:pl-7 py-1 gap-2 md:gap-4">
        
        {/* 电脑端显示的精致标签 */}
        <div className="hidden md:flex items-center gap-1.5 bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-full border border-indigo-100">
          <span className="text-indigo-400 text-sm">🎙️</span>
          <span className="text-xs font-bold whitespace-nowrap">已更新</span>
          <span className="text-base font-bold text-indigo-800">{podcast.total_episodes}</span>
          <span className="text-xs font-bold whitespace-nowrap">集</span>
        </div>
        
        {/* 查看详情按钮：手机端变小，电脑端恢复正常 */}
        <Link 
          href={`/podcast/${podcast.id}`} 
          className="text-center w-full block text-[10px] md:text-sm font-bold text-indigo-600 bg-indigo-50 md:bg-indigo-50 hover:bg-indigo-600 hover:text-white px-2 py-1.5 md:px-5 md:py-2.5 rounded-lg md:rounded-xl transition-all border border-indigo-100/50"
        >
          {/* 手机端显示简写，电脑端显示全称 */}
          <span className="md:hidden">详情</span>
          <span className="hidden md:inline">查看详情</span>
        </Link>
      </div>
    </div>
  );
}