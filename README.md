# 🎙️ 中文播客每日榜单 (Chinese Podcast Daily)

基于 [Listen Notes API](https://www.listennotes.com/api/) 构建的现代化中文播客发现平台。每天自动更新播客流行度榜单，提供极简的收听与探索体验。

<img width="2624" height="1499" alt="image" src="https://github.com/user-attachments/assets/69ae4c12-e089-4845-8fde-79f60cf8914e" />

## ✨ 核心特性

* **📈 每日自动刷新榜单**：基于全球收听数据（Listen Score），每天自动更新总榜及商业、科技、喜剧、文化等多个子分类榜单。
* **🔍 沉浸式站内搜索**：支持全网中文播客及主播名称检索，精准过滤英文干扰内容。
* **🎧 闭环收听体验**：独立的播客详情页，包含最新 10 期节目列表、原生 HTML5 音频播放器（支持进度拖拽与后台播放）及 RSS 订阅直达。
* **💡 智能相似推荐**：在详情页提供“听这个的人也在听”的关联推荐，打破信息茧房。
* **🎲 “随便听听”盲盒**：专治选择困难症，一键随机跳转优质中文播客。
* **🎨 现代极简 UI**：参考顶级流媒体 App 设计，采用 Apple 风格的毛玻璃导航、杂志级大字排版及丝滑的微交互动画。

## 🛠️ 技术栈与架构

本项目采用 **Jamstack 架构**，实现了**零服务器成本**的全自动化运营：

* **前端框架**：[Next.js 15](https://nextjs.org/) (App Router, Server Components)
* **样式引擎**：[Tailwind CSS](https://tailwindcss.com/)
* **数据来源**：[Listen Notes API v2](https://www.listennotes.com/api/docs/) (使用官方 Node.js SDK)
* **自动化抓取**：GitHub Actions (Cron Job 定时任务)
* **托管部署**：[Vercel](https://vercel.com/) (全自动 CI/CD)

### 🔄 数据流转原理
1. 每天北京时间凌晨，**GitHub Actions** 自动触发 `scripts/fetch-podcasts.js` 脚本。
2. 脚本调用 API 拉取最新榜单，计算排名变化（上升/下降/新晋），并生成静态的 `today.json` 文件提交到仓库。
3. 仓库代码的变更自动触发 **Vercel** 重新构建静态页面，用户访问时体验秒开级别的加载速度。

---

## 🚀 本地运行指南

如果你想在本地运行或二次开发此项目，请按以下步骤操作：

### 1. 克隆项目
```bash
git clone [https://github.com/你的用户名/你的仓库名.git](https://github.com/你的用户名/你的仓库名.git)
cd 你的仓库名
````

### 2\. 安装依赖

```bash
npm install
```

### 3\. 配置环境变量

在项目根目录创建一个 `.env` 文件，并填入你的 Listen Notes API Key（免费获取：[Listen Notes Dashboard](https://www.listennotes.com/api/pricing/)）：

```env
LISTEN_API_KEY=你的真实API_KEY
```

### 4\. 获取初始数据

由于应用依赖本地 JSON 渲染首页，首次运行前需要执行抓取脚本生成数据文件：

```bash
node scripts/fetch-podcasts.js
```

*(成功后，你会在 `public/data/` 目录下看到生成的 `today.json`)*

### 5\. 启动开发服务器

```bash
npm run dev
```

打开浏览器访问 [http://localhost:3000](https://www.google.com/search?q=http://localhost:3000) 即可预览项目！

-----

## ☁️ 自动化部署 (Vercel + GitHub Actions)

如果你 Fork 了此项目并希望部署属于自己的自动更新榜单：

1.  **配置 GitHub Secrets**：
    进入你的 GitHub 仓库 -\> `Settings` -\> `Secrets and variables` -\> `Actions`，添加一个名为 `LISTEN_API_KEY` 的 Repository secret，值为你的 API Key。
2.  **部署到 Vercel**：
      * 登录 [Vercel](https://vercel.com/)，导入该 GitHub 仓库。
      * 在部署前的 **Environment Variables** 选项中，同样添加 `LISTEN_API_KEY` 变量。
      * 点击 Deploy 完成部署。

至此，你的网站将每天全自动更新数据！

## 📝 声明与许可

  * 播客元数据及搜索服务由 **[Listen Notes API](https://www.listennotes.com/api/)** 强力驱动。
  * 本项目开源，遵循 MIT License。欢迎提交 PR 或 Issue 一起完善！
