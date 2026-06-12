# 沈氏文化家园

面向全球沈氏宗亲的现代化文化社区网站，核心功能包括沈氏文化内容展示、字辈查询、留言墙、影像馆等。

## 技术栈

- **前端**: Next.js 16 (App Router) + Tailwind CSS v4 + shadcn/ui
- **后端**: NestJS (Node.js)
- **数据库**: Supabase PostgreSQL
- **存储**: Supabase Storage
- **认证**: 自建 JWT (bcrypt + @nestjs/jwt + passport-jwt)
- **部署**: Windows Server + IIS 反向代理 + PM2

## 项目结构

```
shenshi-culture/
├── backend/                  # NestJS 后端
│   └── src/
│       ├── auth/             # 认证模块 (JWT)
│       ├── articles/         # 文章模块 (名人/家训/动态)
│       ├── forum/            # 留言墙模块
│       ├── gallery/          # 影像馆模块
│       ├── generation/       # 字辈/堂号模块
│       ├── supabase/         # Supabase 客户端
│       └── common/           # 公共工具 (装饰器/过滤器/拦截器)
├── frontend/                 # Next.js 前端
│   └── src/
│       ├── app/
│       │   ├── (main)/       # 主页面路由组 (含 Header/Footer)
│       │   │   ├── celebrities/   # 名人堂
│       │   │   ├── migration/     # 迁徙史
│       │   │   ├── family-rules/  # 家规家训
│       │   │   ├── generation/    # 字辈查询
│       │   │   ├── tanghao/       # 堂号百科
│       │   │   ├── forum/         # 留言墙
│       │   │   ├── gallery/       # 影像馆
│       │   │   ├── news/          # 最新动态
│       │   │   └── profile/       # 个人中心
│       │   └── (auth)/       # 认证页面路由组 (无 Header/Footer)
│       │       ├── login/
│       │       └── register/
│       ├── components/
│       │   ├── layout/       # 布局组件 (Header, Footer)
│       │   └── ui/           # shadcn/ui 组件
│       └── lib/              # 工具库 (API 客户端, 类型, Auth Context)
├── database/
│   └── migrations/           # PostgreSQL 迁移脚本
├── deploy/
│   ├── web.config            # IIS 反向代理配置
│   └── iis-setup.md          # IIS 部署指南
├── ecosystem.config.js       # PM2 进程管理配置
└── package.json              # 根级脚本
```

## 快速开始

### 环境要求

- Node.js >= 18
- npm >= 9
- Supabase 项目（用于数据库和存储）

### 1. 安装依赖

```bash
cd backend && npm install
cd ../frontend && npm install
```

### 2. 配置环境变量

**后端** (`backend/.env`):

```env
PORT=3000
JWT_SECRET=your-random-secret-string
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-role-key
CORS_ORIGIN=http://localhost:3001
```

**前端** (`frontend/.env.local`):

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 3. 初始化数据库

在 Supabase SQL Editor 中执行 `database/migrations/001_initial_schema.sql` 中的 SQL。

### 4. 配置 Supabase Storage

在 Supabase Dashboard 中创建一个名为 `shenshi-images` 的公开读取 bucket。

### 5. 开发模式

```bash
# 终端 1: 启动后端 (http://localhost:3000)
npm run dev:backend

# 终端 2: 启动前端 (http://localhost:3001)
npm run dev:frontend
```

### 6. 生产构建

```bash
npm run build
npm start        # 使用 PM2 启动
```

## API 接口

### 认证

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| POST | /api/auth/register | 注册 | 否 |
| POST | /api/auth/login | 登录 | 否 |
| GET | /api/auth/profile | 获取个人信息 | 是 |
| PUT | /api/auth/profile | 更新个人资料 | 是 |

### 文章

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| GET | /api/articles | 文章列表 | 否 |
| GET | /api/articles/:id | 文章详情 | 否 |
| POST | /api/articles/:id/like | 点赞 | 是 |
| POST | /api/articles/:id/comments | 评论 | 是 |

### 留言墙

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| GET | /api/forum/posts | 帖子列表 | 否 |
| POST | /api/forum/posts | 发帖 | 是 |
| GET | /api/forum/posts/:id | 帖子详情 | 否 |
| POST | /api/forum/posts/:id/replies | 回复 | 是 |

### 影像馆

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| GET | /api/gallery | 图片列表 | 否 |
| POST | /api/gallery | 上传图片 | 是 |
| POST | /api/gallery/:id/like | 点赞图片 | 是 |

### 寻根

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| GET | /api/generation/query?verse=xxx | 字辈查询 | 否 |
| GET | /api/tanghao | 堂号列表 | 否 |

### 健康检查

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| GET | / | 健康检查 | 否 |

## 部署

详见 `deploy/iis-setup.md`。简要步骤：

1. Windows Server 安装 Node.js 和 PM2
2. 安装 IIS + URL Rewrite + ARR
3. 部署 `deploy/web.config` 到 IIS 站点
4. 构建项目: `npm run build`
5. 使用 PM2 启动: `pm2 start ecosystem.config.js`

## 设计规范

- **主色调**: 暖木色 (#D1A579)、黛绿 (#3A6B4B)、米白 (#FDF8F0)、浅灰 (#F5F5F5)
- **风格**: 极简主义，留白充足，卡片圆角 12px，微阴影，柔和的 hover 动效
- **响应式**: 移动端汉堡菜单，图片自动缩放
