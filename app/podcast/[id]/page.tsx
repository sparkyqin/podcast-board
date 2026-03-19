// app/podcast/[id]/page.tsx
import { Client } from 'podcast-api';
import Link from 'next/link';

// 初始化 Listen Notes 客户端 (服务端运行，Key 绝对安全)
const client = Client({ apiKey: process.env.LISTEN_API_KEY || null });

// 获取播客详情
async function getPodcastDetail(id: string) {
  const response = await client.fetchPodcastById({ id, sort: 'recent_first' });
  return response.data;
}

// 获取相似推荐
async function getRecommendations(id: string) {
  try {
    const response = await client.fetchRecommendationsForPodcast({ id, safe_mode: 0 });
    return response.data.recommendations || [];
  } catch (e) {
    return []; // 推荐获取失败不影响主页面
  }
}

// 工具函数：格式化时间戳和秒数
const formatDate = (ms: number) => new Date(ms).toLocaleDateString('zh-CN');
const formatDuration = (sec: number) => `${Math.floor(sec / 60)} 分钟`;

// 1. 这里的类型定义改为 Promise
export default async function PodcastDetail({ params }: { params: Promise<{ id: string }> }) {
  
  // 2. 核心修复：在 Next.js 15 中，必须先 await 解构 params 拿到真实的 id
  const { id } = await params;

  // 3. 使用解构出来的真实 id 去请求 API
  const [podcast, recommendations] = await Promise.all([
    getPodcastDetail(id),
    getRecommendations(id)
  ]);

  return (
    <div className="min-h-screen bg-pod-bg text-pod-text-main font-sans antialiased pb-20">
      
      {/* 顶部导航 */}
      <header className="sticky top-0 z-50 bg-pod-bg/90 backdrop-blur-sm border-b border-stone-100">
        <div className="max-w-5xl mx-auto py-4 px-4 flex items-center gap-4">
          <Link href="/" className="flex items-center justify-center w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 transition">
             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
          </Link>
          <span className="font-bold text-stone-700">返回榜单</span>
        </div>
      </header>

      {/* 沉浸式 Header 区 */}
      <div className="bg-white border-b border-stone-100">
        <div className="max-w-5xl mx-auto px-4 py-10 md:py-16 flex flex-col md:flex-row gap-8 md:gap-12 items-start">
          {/* 左侧封面 */}
          <img src={podcast.image} alt="封面" className="w-40 h-40 md:w-64 md:h-64 rounded-3xl object-cover shadow-pod-card flex-shrink-0 border border-stone-50" />
          
          {/* 右侧信息 */}
          <div className="flex-1">
            <h1 className="text-3xl md:text-5xl font-black tracking-tight text-gray-900 leading-tight">{podcast.title}</h1>
            <p className="text-lg md:text-xl text-stone-500 font-medium mt-3">{podcast.publisher}</p>
            
            <div className="flex flex-wrap gap-2 mt-4">
              <span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-xs font-bold">
                已更新 {podcast.total_episodes} 集
              </span>
              
              {/* 删除了 Listen Score */}
              
              {/* 修复：只有当 rss 字段真实存在时，才渲染 RSS 按钮 */}
              {podcast.rss && (
                <a href={podcast.rss} target="_blank" rel="noreferrer" className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-bold hover:bg-slate-200 transition">
                  RSS 链接
                </a>
              )}
            </div>

            <div 
              className="mt-6 text-stone-600 leading-relaxed text-sm md:text-base prose prose-stone"
              dangerouslySetInnerHTML={{ __html: podcast.description }}
            />
          </div>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 mt-12 grid grid-cols-1 md:grid-cols-3 gap-12">
        
        {/* 左侧主要内容区：单集列表 (占 2/3 宽度) */}
        <div className="md:col-span-2 space-y-8">
          <h2 className="text-2xl font-extrabold tracking-tight">最新单集</h2>
          <div className="space-y-4">
            {podcast.episodes.map((episode: any) => (
              <div key={episode.id} className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition">
                
                <div className="flex justify-between items-start gap-4">
                  <h3 className="font-bold text-lg text-slate-900 leading-snug flex-1">{episode.title}</h3>
                  {/* 原来那个没有响应的假播放按钮已经被移除了 */}
                </div>
                
                <div 
                  className="text-sm text-slate-500 mt-2 line-clamp-2"
                  dangerouslySetInnerHTML={{ __html: episode.description }}
                />
                
                {/* ⭐️ 核心修复：引入 HTML5 原生音频播放器 */}
                {episode.audio && (
                  <div className="mt-4 w-full">
                    <audio 
                      controls 
                      src={episode.audio} 
                      preload="none" 
                      className="w-full h-10 outline-none" 
                    />
                  </div>
                )}

                <div className="flex items-center gap-4 mt-5 text-xs font-semibold text-slate-400">
                  <span>📅 {formatDate(episode.pub_date_ms)}</span>
                  <span>⏱️ {formatDuration(episode.audio_length_sec)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 右侧边栏：相似推荐 (占 1/3 宽度) */}
        <div className="space-y-6">
          <h2 className="text-xl font-extrabold tracking-tight">听这个的人也在听</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-4">
            {recommendations.slice(0, 5).map((rec: any) => (
              <Link href={`/podcast/${rec.id}`} key={rec.id} className="flex items-center gap-4 p-3 bg-white rounded-2xl border border-stone-100 hover:border-pod-accent hover:shadow-md transition group">
                <img src={rec.image} alt={rec.title} className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-sm text-gray-900 truncate group-hover:text-pod-accent transition">{rec.title}</h4>
                  <p className="text-xs text-stone-500 truncate mt-1">{rec.publisher}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

      </main>
    </div>
  );
}