// app/search/page.tsx
import { Client } from 'podcast-api';
import Link from 'next/link';

// 初始化 Listen Notes 客户端
const client = Client({ apiKey: process.env.LISTEN_API_KEY || null });

// 调用搜索 API
async function searchPodcasts(query: string) {
  try {
    const response = await client.search({
      q: query,
      type: 'podcast', // 只搜索播客节目
      language: 'Chinese', // 核心：过滤掉英文播客
      safe_mode: 0,
    });
    return response.data.results || [];
  } catch (error) {
    console.error("搜索请求失败", error);
    return [];
  }
}

// 注意：Next.js 15 中 searchParams 也是 Promise，需要 await
export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const params = await searchParams;
  const query = params.q || '';
  
  // 如果没有关键词，不发请求
  const results = query ? await searchPodcasts(query) : [];

  return (
    <div className="min-h-screen bg-pod-bg text-pod-text-main font-sans antialiased pb-20">
      
      {/* 顶部导航 */}
      <header className="sticky top-0 z-50 bg-pod-bg/90 backdrop-blur-sm border-b border-stone-100 mb-8">
        <div className="max-w-5xl mx-auto py-4 px-4 flex items-center gap-4">
          <Link href="/" className="flex items-center justify-center w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 transition">
             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
          </Link>
          <span className="font-bold text-stone-700">返回首页</span>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4">
        <div className="mb-10">
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
            {query ? `"${query}" 的搜索结果` : '请输入搜索词'}
          </h1>
          <p className="text-stone-500 mt-2">共找到 {results.length} 个相关播客</p>
        </div>

        {/* 搜索结果列表 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {results.length > 0 ? (
            results.map((podcast: any) => (
              <Link href={`/podcast/${podcast.id}`} key={podcast.id} className="flex items-start p-5 bg-white rounded-3xl border border-stone-100 hover:border-pod-accent hover:shadow-md transition group gap-5">
                <img src={podcast.image} alt={podcast.title_original} className="w-20 h-20 md:w-28 md:h-28 rounded-2xl object-cover shadow-sm flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-bold text-gray-900 truncate group-hover:text-pod-accent transition">{podcast.title_original}</h3>
                  <p className="text-sm text-stone-500 mt-1">{podcast.publisher_original}</p>
                  <div 
                    className="text-sm text-stone-500 mt-3 line-clamp-2 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: podcast.description_highlighted || podcast.description_original }}
                  />
                  <div className="mt-4 flex items-center gap-2">
                    <span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-xs font-bold">已更新 {podcast.total_episodes} 集</span>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            query && <div className="col-span-full text-center py-20 text-stone-400">没有找到相关播客，换个关键词试试？</div>
          )}
        </div>
      </main>
    </div>
  );
}