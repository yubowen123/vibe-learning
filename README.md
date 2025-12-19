# 🌌 Vibe Learning Platform

> 一个现代化的在线学习平台，采用像素风格设计，支持富文本编辑、图片/视频上传、学习进度追踪等功能。

## ✨ 特性

- 📚 **章节管理** - 支持多章节、多课程的结构化内容组织
- 📝 **富文本编辑** - 集成TinyMCE编辑器，支持标题、列表、代码块、表格等
- 🖼️ **媒体上传** - 支持图片和视频上传（最大100MB）
- 📊 **学习进度** - 自动追踪学习进度和完成状态
- 🔐 **后台管理** - 安全的管理员后台，支持内容增删改查
- 🎨 **像素风格** - 独特的像素艺术/漫画风格UI设计
- 📱 **响应式设计** - 完美适配桌面和移动设备
- 🔧 **字体大小调节** - 4种字体大小可选（10px-16px）

## 🚀 快速开始

### 环境要求
- Node.js 16.x 或更高版本
- npm 或 yarn

### 安装
```bash
# 克隆项目
git clone https://github.com/yourusername/vibe-learning-platform.git
cd vibe-learning-platform

# 安装依赖
npm install

# 启动开发服务器
node server.js
```

### 访问
- 前端：http://localhost:3000
- 后台：http://localhost:3000/admin.html
- 登录：http://localhost:3000/login.html

### 默认管理员账号
- 用户名：13633602987
- 密码：yu19920704

⚠️ **重要：部署到生产环境前请修改默认密码！**

## 🛠️ 技术栈

### 后端
- Node.js + Express.js
- SQLite (better-sqlite3)
- express-session
- multer (文件上传)

### 前端
- 原生JavaScript
- TinyMCE 6 (富文本编辑器)
- marked.js (Markdown解析)
- CSS3 (像素风格设计)

## 📖 使用说明

详细使用说明请查看项目内的文档文件。

## 🚢 部署

查看 DEPLOYMENT.md 获取完整部署指南。

快速部署：
```bash
chmod +x deploy.sh
./deploy.sh
```

## 📝 许可证

MIT License

---

⭐ 如果这个项目对你有帮助，请给个Star！
