# MailPC Label System

MailPC Label System 是一个用于简化邮寄标签生成和运费查询的 React 前端项目。此应用提供类似 ShipStation 的轻量级体验，允许用户输入发货/收货信息、包裹详情并生成可下载的运单标签。

## 功能特色
- 支持分步式表单：Origin、Destination、Package、Review。
- 提供 FedEx 服务选择与包裹类型对应。
- 实时地址自动补全（需要后端支持 Google Places API 或自建接口）。
- 权限管理：包含普通用户与管理员角色，管理员可设置服务费率。
- 使用 Tailwind CSS 快速构建响应式界面。

## 安装与运行

在克隆仓库后，使用 npm 安装依赖并启动开发服务：

```
npm install
npm start
```

- 默认开发地址为 [http://localhost:3000](http://localhost:3000)。
- 修改 `.env.local` 文件以配置后端接口地址、Firebase 配置等环境变量。

### 环境变量示例

在项目根目录创建 `.env.local` 文件并添加下列内容（示例）：

```
REACT_APP_BACKEND_BASE_URL=https://your-backend.example.com
REACT_APP_FIREBASE_API_KEY=...
REACT_APP_FIREBASE_AUTH_DOMAIN=...
```

请根据实际部署的后端服务和 Firebase 项目设置。

## 项目结构

- `src/`：React 组件、页面、hooks 等代码。
- `public/`：静态资源与 HTML 模板。
- `tailwind.config.js`：Tailwind 配置。
- `postcss.config.js`：PostCSS 配置。

## 构建和部署

要构建生产版本，请执行：

```
npm run build
```

生成的静态文件位于 `build/` 目录，适合部署到 Vercel、Netlify 或其他静态托管服务。

## 贡献说明

欢迎为此项目贡献代码！请使用标准的 [Conventional Commits](https://www.conventionalcommits.org/) 格式撰写 commit message，并确保通过 lint 和测试。若有建议或问题，请在仓库的 Issue 区提出。
