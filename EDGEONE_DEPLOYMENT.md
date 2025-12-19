# EdgeOne Pages 部署指南

## 问题分析

目前在 EdgeOne Pages 部署时遇到 401 错误：
```
401 Authorization Required
X-EOP-MSG: eo_time missing
```

这个错误是 EdgeOne Pages 平台级别的安全检查错误，不是应用程序本身的问题。通过分析，发现以下原因：

1. **EdgeOne Pages 部署限制**：
   - EdgeOne Pages 主要支持 Next.js 和基于 MCP (多模态控制协议) 的应用
   - 传统的 Express.js 应用需要持续运行的 Node.js 服务器，可能与 EdgeOne Pages 的部署模型不兼容
   - 平台可能对动态应用有特殊的配置要求

2. **当前应用架构**：
   - 基于 Express.js 的传统 Node.js 应用
   - 使用 SQLite 数据库文件存储数据
   - 需要持续运行的服务器进程

## 解决方案

### 方案一：使用传统服务器部署（推荐）

EdgeOne Pages 可能不是最适合传统 Express.js 应用的部署平台。建议使用以下传统服务器部署方式：

1. **使用 Vercel 部署**：
   - 项目已包含 `vercel.json` 配置文件，支持 Vercel 部署
   - Vercel 原生支持 Express.js 应用
   - 部署命令：`vercel`

2. **使用云服务器部署**：
   - 参考 `DEPLOYMENT.md` 文件
   - 使用 PM2 管理 Node.js 进程
   - 使用 Nginx 作为反向代理

### 方案二：适配 EdgeOne Pages（实验性）

如果坚持使用 EdgeOne Pages，可以尝试以下配置：

1. **创建 EdgeOne 配置文件**：
   - 已创建 `edgeone.json` 配置文件
   - 配置将所有请求转发到 `server.js`

2. **修改应用配置**：
   - 确保应用监听环境变量指定的端口
   - 启用信任代理设置
   - 配置正确的 CORS 和会话设置

3. **部署步骤**：
   ```bash
   # 安装依赖
   npm install
   
   # 构建项目（如果需要）
   npm run build
   
   # 按照 EdgeOne Pages 部署指南进行部署
   ```

## 替代部署方案

### 使用 Vercel 部署

Vercel 是一个优秀的 Node.js 应用部署平台，支持 Express.js 应用：

1. **安装 Vercel CLI**：
   ```bash
   npm install -g vercel
   ```

2. **部署应用**：
   ```bash
   vercel
   ```

3. **访问应用**：
   - Vercel 会提供一个临时 URL
   - 可以绑定自定义域名

### 使用云服务器部署

参考 `DEPLOYMENT.md` 文件，使用以下命令快速部署：

```bash
# 运行部署脚本
./deploy.sh
```

## 调试建议

1. **检查应用日志**：
   ```bash
   pm2 logs vibe-learning
   ```

2. **测试本地应用**：
   ```bash
   # 启动应用
   npm start
   
   # 测试登录
   curl -X POST -H "Content-Type: application/json" -d '{"username":"admin","password":"123456"}' http://localhost:3000/api/auth/login -v
   ```

3. **检查端口占用**：
   ```bash
   netstat -tulpn | grep 3000
   ```

## 结论

当前应用是一个传统的 Express.js 应用，最适合使用以下部署方式：

1. **Vercel**：简单易用，支持 Node.js 应用
2. **云服务器 + PM2 + Nginx**：灵活性高，适合生产环境
3. **其他支持 Node.js 的 PaaS 平台**：如 Heroku、Render 等

EdgeOne Pages 可能更适合静态网站或特定框架的应用部署，如果坚持使用，需要进一步研究其对传统 Express.js 应用的支持情况。