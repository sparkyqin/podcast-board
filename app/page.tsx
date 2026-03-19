'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PodcastCard, { PodcastData } from '@/components/PodcastCard';
import SearchBar from '@/components/SearchBar';

export default function Home() {
  const [activeTab, setActiveTab] = useState('all');
  const [allData, setAllData] = useState<Record<string, PodcastData[]>>({});
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // 挂载时拉取静态 JSON 数据
  useEffect(() => {
    fetch('/data/today.json')
      .then(res => res.json())
      .then(data => {
        setAllData(data);
        setIsLoading(false);
      })
      .catch(err => console.error("获取数据失败:", err));
  }, []);

  const currentPodcasts = allData[activeTab] || [];

  // 🎲 盲盒：随便听听功能
  const handleRandomListen = () => {
    const allPodcasts = allData['all'] || []; 
    if (allPodcasts.length > 0) {
      const randomIndex = Math.floor(Math.random() * allPodcasts.length);
      const randomPodcast = allPodcasts[randomIndex];
      router.push(`/podcast/${randomPodcast.id}`);
    }
  };

  return (
    // 使用纯净的灰白底色，极其现代
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased pb-24 selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* 1. 极简毛玻璃顶部导航 (Apple Style) */}
      <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-slate-200/50 supports-[backdrop-filter]:bg-white/60">
        <div className="max-w-5xl mx-auto h-16 px-4 md:px-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 flex-shrink-0 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-8 h-8 bg-slate-900 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-sm">
              播
            </div>
            {/* 隐藏手机端的全称，保持清爽 */}
            <h1 className="text-xl font-extrabold tracking-tight hidden sm:block">中文播客榜</h1>
          </div>
          
          <div className="flex-1 max-w-sm flex justify-end">
            <SearchBar /> 
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 md:px-6 mt-10 md:mt-16">
        
        {/* 2. 杂志风格的主视觉区 (Hero Section) */}
        <div className="mb-12">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter text-slate-900 leading-tight">
              发现<br className="md:hidden" />好声音。
            </h2>
            <p className="text-base md:text-lg text-slate-500 mt-4 font-medium max-w-xl">
              基于 Listen Notes 全球收听数据的每日流行度风向标。帮你找到此时此刻最值得听的中文播客。
            </p>
            
            {/* 3. 安全且高级的 Apple 风格分类药丸 (Pills) */}
            <div className="flex items-center gap-3 mt-10 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
                <button 
                  onClick={() => setActiveTab('all')}
                  className={`text-sm font-bold px-6 py-2.5 rounded-full whitespace-nowrap transition-all duration-300 ${
                    activeTab === 'all' 
                    ? 'bg-slate-900 text-white shadow-md scale-105' 
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                  }`}>
                  🔥 总榜
                </button>
                <button 
                  onClick={() => setActiveTab('business')}
                  className={`text-sm font-bold px-6 py-2.5 rounded-full whitespace-nowrap transition-all duration-300 ${
                    activeTab === 'business' 
                    ? 'bg-slate-900 text-white shadow-md scale-105' 
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                  }`}>
                  💼 商业
                </button>
                <button 
                  onClick={() => setActiveTab('tech')}
                  className={`text-sm font-bold px-6 py-2.5 rounded-full whitespace-nowrap transition-all duration-300 ${
                    activeTab === 'tech' 
                    ? 'bg-slate-900 text-white shadow-md scale-105' 
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                  }`}>
                  💻 科技
                </button>                
                {/* 新增的分类按钮 */}
                <button 
                  onClick={() => setActiveTab('comedy')}
                  className={`text-sm font-bold px-6 py-2.5 rounded-full whitespace-nowrap transition-all duration-300 ${
                    activeTab === 'comedy' ? 'bg-slate-900 text-white shadow-md scale-105' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                  }`}>
                  😂 喜剧
                </button>
                <button 
                  onClick={() => setActiveTab('culture')}
                  className={`text-sm font-bold px-6 py-2.5 rounded-full whitespace-nowrap transition-all duration-300 ${
                    activeTab === 'culture' ? 'bg-slate-900 text-white shadow-md scale-105' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                  }`}>
                  🎨 文化
                </button>
                <button 
                  onClick={() => setActiveTab('education')}
                  className={`text-sm font-bold px-6 py-2.5 rounded-full whitespace-nowrap transition-all duration-300 ${
                    activeTab === 'education' ? 'bg-slate-900 text-white shadow-md scale-105' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                  }`}>
                  📚 教育
                </button>
                <button 
                  onClick={() => setActiveTab('film')}
                  className={`text-sm font-bold px-6 py-2.5 rounded-full whitespace-nowrap transition-all duration-300 ${
                    activeTab === 'film' ? 'bg-slate-900 text-white shadow-md scale-105' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                  }`}>
                  🎬 影视
                </button>
            </div>
        </div>

        {/* 4. 榜单列表区 */}
        <div className="space-y-4 md:space-y-6">
          {isLoading ? (
            // 优雅的骨架屏加载状态
            <div className="text-center py-32 text-slate-400 font-medium animate-pulse flex flex-col items-center gap-4">
               <div className="w-10 h-10 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin"></div>
               正在为您拉取最新榜单...
            </div>
          ) : currentPodcasts.length > 0 ? (
            currentPodcasts.map((podcast: PodcastData) => (
              <PodcastCard key={podcast.id} podcast={podcast} />
            ))
          ) : (
            <div className="text-center py-32 text-slate-500 bg-white rounded-3xl border border-slate-200 border-dashed">
              今日暂无该分类数据
            </div>
          )}
        </div>
      </main>

      {/* 🎲 盲盒：悬浮按钮优化 */}
      <button
        onClick={handleRandomListen}
        className="fixed bottom-8 right-6 md:bottom-12 md:right-12 bg-indigo-600 text-white p-4 rounded-full shadow-[0_10px_40px_-10px_rgba(79,70,229,0.8)] hover:bg-indigo-700 hover:-translate-y-1 transition-all duration-300 group flex items-center gap-2 z-50 border border-indigo-500"
        title="不知道听什么？随便听听！"
      >
        <span className="text-2xl leading-none drop-shadow-sm">🎲</span>
        <span className="hidden group-hover:block text-sm font-bold pr-2 whitespace-nowrap overflow-hidden tracking-wide">
          随便听听
        </span>
      </button>

    </div>
  );
}