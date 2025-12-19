# 🌌 Vibe Learning Platform

<div align="center">

**一个现代化的在线学习平台**

采用像素风格设计 | 富文本编辑 | 学习进度追踪

[![GitHub stars](https://img.shields.io/github/stars/yubowen123/vibe-learning?style=social)](https://github.com/yubowen123/vibe-learning)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen)](https://nodejs.org/)

</div>

---

## ✨ 核心特性

### 🎓 学习管理
- 📚 **多层级内容组织** - 支持章节-课程的结构化内容管理
- 📊 **进度追踪** - 实时追踪学习进度和完成状态
- 🔖 **课程标记** - 支持课程完成标记和状态管理

### 📝 富文本编辑
- ⌨️ **TinyMCE 6 集成** - 强大的所见即所得编辑器
- 📑 **多级标题支持** - H1-H6六级标题，轻松组织内容结构
- 🎨 **格式化工具** - 粗体、斜体、下划线、删除线等
- 📋 **列表和表格** - 有序列表、无序列表、表格插入
- 🔧 **格式清除** - 一键清除所有格式
- ⚡ **已修复** - Z-index冲突问题，下拉菜单正常工作

### 🖼️ 媒体管理
- 📸 **图片上传** - 支持 JPEG, PNG, GIF, WebP 格式
- 🎬 **视频上传** - 支持 MP4, WebM, OGG 格式
- 📦 **大文件支持** - 最大支持 100MB 文件上传
- 🗂️ **文件管理** - 自动分类存储图片和视频

### 🔐 安全管理
- 👤 **管理员认证** - 基于 Session 的登录系统
- 🔒 **权限控制** - 后台管理页面需要登录访问
- 🛡️ **输入验证** - 文件类型和大小验证

### 🎨 用户界面
- 🖌️ **像素风格设计** - 独特的像素艺术/漫画风格UI
- 📱 **响应式布局** - 完美适配桌面、平板、手机
- 🔧 **字体调节** - 4种字体大小可选（10px-16px）
- 🌈 **主题定制** - 支持自定义配色方案

## 🚀 快速开始

### 📋 环境要求

- **Node.js** 16.x 或更高版本（推荐 18.x LTS）
- **npm** 或 **yarn**
- **操作系统** macOS / Linux / Windows

### 💻 本地开发

```bash
# 1. 克隆项目
git clone https://github.com/yubowen123/vibe-learning.git
cd vibe-learning

# 2. 安装依赖
npm install

# 3. 启动开发服务器
node server.js

# 4. 访问应用
# 浏览器打开 http://localhost:3000
```

### 🌐 访问地址

| 页面 | 地址 | 说明 |
|------|------|------|
| 🏠 前端首页 | http://localhost:3000 | 学习平台主页 |
| ⚙️ 后台管理 | http://localhost:3000/admin.html | 内容管理后台 |
| 🔑 登录页面 | http://localhost:3000/login.html | 管理员登录 |

### 🔐 默认管理员账号

```
用户名：admin
密码：123456
```

> ⚠️ **安全提示**
> 部署到生产环境前请务必修改默认密码！
> 建议使用强密码并启用 HTTPS

## 🛠️ 技术栈

### 后端技术
- **Node.js** - JavaScript 运行时
- **Express.js** - Web 应用框架
- **SQLite** - 轻量级嵌入式数据库
- **better-sqlite3** - 同步数据库驱动
- **express-session** - Session 管理
- **multer** - 文件上传中间件
- **bcryptjs** - 密码加密

### 前端技术
- **原生 JavaScript** - 无框架依赖
- **TinyMCE 6** - 富文本编辑器
- **marked.js** - Markdown 解析
- **CSS3** - 像素风格设计
- **响应式布局** - 移动端适配

### 开发工具
- **Git** - 版本控制
- **npm** - 包管理器

## 📁 项目结构

```
vibe-learning/
├── public/                 # 静态资源目录
│   ├── admin.html         # 后台管理页面
│   ├── index.html         # 前端首页
│   ├── login.html         # 登录页面
│   ├── css/               # 样式文件
│   ├── js/                # 脚本文件
│   └── uploads/           # 上传文件目录
├── scripts/               # 工具脚本
│   └── init-database.js   # 数据库初始化
├── server.js              # 主服务器文件
├── package.json           # 项目配置
├── DEPLOYMENT.md          # 部署文档
├── deploy.sh              # 一键部署脚本
└── README.md             # 项目说明
```

## 🚢 部署方式

### 方式 1：Vercel 部署（推荐）

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yubowen123/vibe-learning)

1. 访问 [Vercel](https://vercel.com)
2. 导入 GitHub 仓库
3. 点击 Deploy
4. 完成！

> 📌 **注意**: Vercel 免费版不支持 SQLite 持久化，建议使用 PostgreSQL 或 MySQL

### 方式 2：VPS 部署（完整功能）

```bash
# 1. SSH 登录服务器
ssh root@your_server_ip

# 2. 克隆项目
git clone https://github.com/yubowen123/vibe-learning.git
cd vibe-learning

# 3. 一键部署（自动配置 Nginx、PM2 等）
chmod +x deploy.sh
sudo ./deploy.sh
```

**部署脚本将自动完成：**
- ✅ 安装 Node.js 18.x
- ✅ 安装项目依赖
- ✅ 配置 PM2 进程管理
- ✅ 配置 Nginx 反向代理
- ✅ 配置防火墙规则
- ✅ 可选 SSL 证书配置

### 方式 3：手动部署

详细步骤请查看 [DEPLOYMENT.md](DEPLOYMENT.md)

### 方式 4：Docker 部署（计划中）

```bash
# 即将推出
docker-compose up -d
```

## 📖 使用指南

### 管理员操作

1. **登录后台**
   - 访问 `/login.html`
   - 输入管理员账号密码

2. **管理章节**
   - 创建新章节
   - 设置章节图标和颜色
   - 调整章节顺序

3. **管理课程**
   - 在章节下创建课程
   - 使用富文本编辑器编写内容
   - 上传图片和视频
   - 设置课程编号

4. **编辑内容**
   - 使用标题组织内容结构
   - 插入图片和视频
   - 添加代码块和表格
   - 格式化文本

### 学生操作

1. **浏览课程**
   - 查看所有章节
   - 点击进入课程详情

2. **学习追踪**
   - 查看学习进度
   - 标记课程完成状态

## 🔧 配置说明

### 修改管理员密码

编辑 `server.js` 文件：

```javascript
const ADMIN_ACCOUNT = {
    username: 'your_username',
    password: 'your_strong_password'
};
```

### 修改端口

```javascript
const PORT = process.env.PORT || 3000;
```

### 配置 HTTPS

生产环境建议启用 HTTPS：

```javascript
app.use(session({
    cookie: {
        secure: true,  // 启用 HTTPS
        httpOnly: true,
        sameSite: 'strict'
    }
}));
```

## ❓ 常见问题

<details>
<summary><strong>Q: 如��重置数据库？</strong></summary>

删除 `vibe_learning.db` 文件，重启服务器会自动创建新数据库。

```bash
rm vibe_learning.db
node server.js
```
</details>

<details>
<summary><strong>Q: 上传文件失败怎么办？</strong></summary>

检查 `public/uploads/` 目录权限：

```bash
chmod -R 755 public/uploads/
```
</details>

<details>
<summary><strong>Q: 端口 3000 被占用？</strong></summary>

修改 `server.js` 中的 PORT 配置，或设置环境变量：

```bash
PORT=8080 node server.js
```
</details>

<details>
<summary><strong>Q: 如何备份数据？</strong></summary>

定期备份 `vibe_learning.db` 文件和 `public/uploads/` 目录：

```bash
tar -czf backup-$(date +%Y%m%d).tar.gz vibe_learning.db public/uploads/
```
</details>

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

1. Fork 本项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

本项目采用 [MIT License](LICENSE) 许可证。

## 🙏 致谢

- [TinyMCE](https://www.tiny.cloud/) - 富文本编辑器
- [Express.js](https://expressjs.com/) - Web 框架
- [SQLite](https://www.sqlite.org/) - 数据库

## 📞 联系方式

- GitHub: [@yubowen123](https://github.com/yubowen123)
- 项目地址: [https://github.com/yubowen123/vibe-learning](https://github.com/yubowen123/vibe-learning)

---

<div align="center">

⭐ 如果这个项目对你有帮助，请给个 Star！

**Made with ❤️ by Vibe Learning Team**

</div>
