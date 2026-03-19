// scripts/fetch-podcasts.js
const { Client } = require('podcast-api');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config();

const client = Client({ apiKey: process.env.LISTEN_API_KEY || null });
const DATA_DIR = path.join(__dirname, '../public/data');
const TODAY_FILE = path.join(DATA_DIR, 'today.json');
const YESTERDAY_FILE = path.join(DATA_DIR, 'yesterday.json');

// 定义我们要抓取的分类模块 (扩充版)
const TARGET_GENRES = [
  { key: 'all', genre_id: '', name: '总榜' },
  { key: 'business', genre_id: '93', name: '商业' },
  { key: 'tech', genre_id: '127', name: '科技' },
  { key: 'comedy', genre_id: '133', name: '喜剧' },
  { key: 'culture', genre_id: '122', name: '社会与文化' },
  { key: 'education', genre_id: '111', name: '教育' },
  { key: 'film', genre_id: '68', name: '影视' }
];

async function fetchAndCalculate() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });

    let yesterdayData = {};
    try {
      const yesterdayRaw = await fs.readFile(TODAY_FILE, 'utf8');
      yesterdayData = JSON.parse(yesterdayRaw);
      await fs.writeFile(YESTERDAY_FILE, yesterdayRaw);
    } catch (e) {
      console.log('未找到昨日数据，将作为首次抓取运行。');
    }

    const todayData = {};

    // 循环抓取每个分类的数据
    for (const genre of TARGET_GENRES) {
      console.log(`正在获取 [${genre.name}] 榜单数据...`);
      const response = await client.fetchBestPodcasts({
        language: 'Chinese',
        region: 'cn',
        genre_id: genre.genre_id, // 传入分类 ID
        sort: 'listen_score',
        page: 1,
        safe_mode: 0,
      });

      const rawPodcasts = response.data.podcasts;
      const prevGenreData = yesterdayData[genre.key] || [];

      // 计算排名趋势（同之前逻辑）
      todayData[genre.key] = rawPodcasts.map((podcast, index) => {
        const currentRank = index + 1;
        const yesterdayPodcast = prevGenreData.find(p => p.id === podcast.id);
        
        let trend = 'new';
        let trend_offset = 0;

        if (yesterdayPodcast) {
          const yesterdayRank = yesterdayPodcast.rank;
          if (currentRank < yesterdayRank) {
            trend = 'up'; trend_offset = yesterdayRank - currentRank;
          } else if (currentRank > yesterdayRank) {
            trend = 'down'; trend_offset = currentRank - yesterdayRank;
          } else {
            trend = 'same';
          }
        }

        return {
          id: podcast.id,
          rank: currentRank,
          title: podcast.title,
          publisher: podcast.publisher,
          image: podcast.image,
          description: podcast.description,
          total_episodes: podcast.total_episodes, // ⭐️ 换成免费且实用的总集数
          listennotes_url: podcast.listennotes_url,
          trend,
          trend_offset
        };
      });
    }

    await fs.writeFile(TODAY_FILE, JSON.stringify(todayData, null, 2));
    console.log(`成功抓取所有分类数据！`);

  } catch (error) {
    console.error('抓取失败:', error);
    process.exit(1);
  }
}

fetchAndCalculate();