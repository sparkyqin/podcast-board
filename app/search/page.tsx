// app/search/page.tsx
import { Client } from 'podcast-api';
import Link from 'next/link';

// 初始化 Listen Notes 客户端
const client = Client({ apiKey: process.env.LISTEN_API_KEY || null });

// 核心功能：并行调用两次 API（一次搜节目，一次搜单集）
async function fetchAllSearchResults(query: string) {
  try {
    const [podcastsRes, episodesRes] = await Promise.all([
      client.search({ q: query, type: 'podcast', language: 'Chinese', safe_mode: 0 }),
      client.search({ q: query, type: 'episode', language: 'Chinese', safe_mode: 0 })
    ]);

    return {
      podcasts: podcastsRes.data.results || [],
      episodes: episodesRes.data.results || []
    };
  } catch (error) {
    console.error("搜索请求失败", error);
    return { podcasts: [], episodes: [] };
  }
}

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const params = await searchParams;
  const query = params.q || '';
  
  // 如果没有关键词，不发请求
  const { podcasts, episodes } = query ? await fetchAllSearchResults(query) : { podcasts: [], episodes: [] };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      
      {/* 顶部导航 */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/50 mb-8">
        <div className="max-w-5xl mx-auto py-4 px-4 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2 font-bold text-indigo-600 hover:text-indigo-800 transition">
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7 7-7"></path></svg>
             返回首页
          </Link>
          <div className="text-sm font-medium text-slate-500">
            "{query}" 的搜索结果
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 space-y-12">
        
        {/* 如果没搜到任何东西 */}
        {query && podcasts.length === 0 && episodes.length === 0 && (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
             <p className="text-slate-400 font-medium">没找到相关内容，换个词试试？</p>
          </div>
        )}

        {/* ================= 区块 1：相关播客节目 ================= */}
        {podcasts.length > 0 && (
          <section>
            <h2 className="text-2xl font-extrabold tracking-tight mb-6 flex items-center gap-2">
              <span>📺</span> 播客节目
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {podcasts.slice(0, 4).map((podcast: any) => (
                <Link href={`/podcast/${podcast.id}`} key={podcast.id} className="flex items-start p-5 bg-white rounded-3xl border border-slate-100 hover:border-indigo-300 hover:shadow-md transition group gap-5">
                  <img src={podcast.image || podcast.thumbnail} alt="cover" className="w-20 h-20 md:w-28 md:h-28 rounded-2xl object-cover shadow-sm flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-bold text-slate-900 truncate group-hover:text-indigo-600 transition" dangerouslySetInnerHTML={{ __html: podcast.title_highlighted || podcast.title_original }} />
                    <p className="text-sm text-slate-500 mt-1">{podcast.publisher_original}</p>
                    <div className="text-sm text-slate-500 mt-3 line-clamp-2" dangerouslySetInnerHTML={{ __html: podcast.description_highlighted || podcast.description_original }} />
                    <div className="mt-4">
                      {/* 修复点 1：必定有数字 */}
                      <span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-xs font-bold">已更新 {podcast.total_episodes || 0} 集</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ================= 区块 2：相关单集（带播放器） ================= */}
        {episodes.length > 0 && (
          <section>
            <h2 className="text-2xl font-extrabold tracking-tight mb-6 flex items-center gap-2">
              <span>🎙️</span> 单集直达
            </h2>
            <div className="grid grid-cols-1 gap-4">
              {episodes.map((episode: any) => {
                // 修复点 2：准确获取所属播客的 ID
                const parentPodcastId = episode.podcast?.id || episode.podcast_id;

                return (
                  <div key={episode.id} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition">
                    <div className="flex flex-col md:flex-row gap-5">
                      <img src={episode.image || episode.thumbnail} alt="cover" className="w-20 h-20 md:w-24 md:h-24 rounded-2xl object-cover shadow-sm mx-auto md:mx-0 flex-shrink-0" />
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-slate-900" dangerouslySetInnerHTML={{ __html: episode.title_highlighted || episode.title_original }} />
                        <p className="text-sm font-medium text-slate-500 mt-1">来自: {episode.podcast_title_original || episode.podcast?.title_original || "未知播客"}</p>
                        
                        <div className="text-sm text-slate-500 mt-2 line-clamp-2 leading-relaxed" dangerouslySetInnerHTML={{ __html: episode.description_highlighted || episode.description_original }} />
                        
                        {/* 音频播放器 */}
                        {episode.audio && (
                          <div className="mt-4">
                            <audio controls src={episode.audio} className="w-full h-10 outline-none" preload="none" />
                          </div>
                        )}

                        <div className="mt-5 flex items-center justify-between border-t border-slate-50 pt-3">
                          <span className="text-xs font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-md">
                            时长: {Math.floor((episode.audio_length_sec || 0) / 60)} 分钟
                          </span>
                          
                          {/* 跳转到对应的播客详情页 */}
                          <Link 
                            href={`/podcast/${parentPodcastId}`}
                            className="text-xs font-bold text-indigo-600 bg-indigo-50 px-4 py-2 rounded-xl hover:bg-indigo-600 hover:text-white transition-all"
                          >
                            查看所属播客
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

      </main>
    </div>
  );
}