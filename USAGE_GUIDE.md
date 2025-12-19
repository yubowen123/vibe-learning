# Vibe Learning Platform 使用指南

## 后台管理系统使用说明

### 登录信息
- 登录地址: `http://localhost:3000/login.html`
- 默认用户名: `13633602987`
- 默认密码: `yu19920704`

### 启动服务器
```bash
cd /Users/gb/Desktop/claude/memory-echo/docs/vibe_learning_platform
node server.js
```

服务器启动后访问:
- 前端展示: `http://localhost:3000`
- 后台管理: `http://localhost:3000/admin.html`
- 登录页面: `http://localhost:3000/login.html`

## 富文本编辑器功能

### 支持的HTML元素

后台使用 TinyMCE 6 富文本编辑器,支持以下所有元素:

1. **标题** (H1-H6)
   - H1: 一级标题,文章主标题
   - H2: 二级标题,主要章节
   - H3-H6: 更细分的标题层级

2. **段落格式**
   - 普通段落: 自动首行缩进2字符
   - 行距: 1.5倍
   - 字间距: 0.05em
   - 段前/段后: 0.5行

3. **文字格式**
   - **粗体**: Ctrl/Cmd + B
   - *斜体*: Ctrl/Cmd + I
   - 下划线: Ctrl/Cmd + U

4. **列表**
   - 无序列表 (项目符号)
   - 有序列表 (数字编号)
   - 支持多级嵌套

5. **代码**
   - 内联代码: 用于简短代码片段
   - 代码块: 用于完整代码示例

6. **表格**
   - 创建/编辑表格
   - 表头会显示为黑底白字
   - 表格自动带边框和阴影

7. **引用块**
   - 用于重要观点或名言
   - 左侧带蓝色强调边框

8. **媒体**
   - 图片上传: 支持拖拽和粘贴
   - 视频上传: 支持 MP4, WebM, OGG
   - 文件大小限制: 100MB

9. **链接**
   - 插入外部链接
   - 支持在新窗口打开

### 工具栏按钮说明

- **undo/redo**: 撤销/重做
- **blocks**: 选择段落格式 (段落/标题1-4/预格式化)
- **bold/italic**: 粗体/斜体
- **forecolor/backcolor**: 文字颜色/背景色
- **alignleft/center/right/justify**: 对齐方式
- **bullist/numlist**: 无序/有序列表
- **outdent/indent**: 减少/增加缩进
- **removeformat**: 清除格式
- **link**: 插入链接
- **image**: 插入图片
- **media**: 插入视频
- **table**: 插入表格
- **code**: 查看HTML源代码
- **preview**: 预览效果
- **help**: 帮助文档

## 示例文章

项目中包含 `sample-article-content.html` 文件,展示了所有支持的格式。

### 使用示例文章的方法:

1. 登录后台管理系统
2. 点击"新建文章"
3. 在TinyMCE编辑器中,点击工具栏的"code"按钮
4. 复制 `sample-article-content.html` 的全部内容
5. 粘贴到代码编辑窗口
6. 点击"保存"
7. 切换回可视化编辑模式查看效果

## 前端展示

### 字体大小设置
前端支持4种字体大小:
- **小** (10px): 适合较小屏幕
- **中** (12px): 默认大小
- **大** (14px): 适合阅读
- **特大** (16px): 最大字号

所有内容会按比例缩放,保持视觉一致性。

### 学习进度追踪
- 点击文章卡片进入阅读
- 阅读完成后点击"标记为已完成"
- 进度会自动保存到数据库
- 首页显示整体学习进度

## 文件上传

### 图片上传
- 支持格式: JPEG, PNG, GIF, WebP
- 最大大小: 100MB
- 存储位置: `public/uploads/images/`
- URL格式: `/uploads/images/文件名`

### 视频上传
- 支持格式: MP4, WebM, OGG
- 最大大小: 100MB
- 存储位置: `public/uploads/videos/`
- URL格式: `/uploads/videos/文件名`

### 上传方法
1. **直接粘贴**: 在编辑器中粘贴图片
2. **拖拽**: 拖拽文件到编辑器
3. **工具栏**: 点击图片/视频按钮选择文件

## 数据库结构

### chapters 表
- id: 章节ID
- chapter_number: 章节序号
- title: 标题
- subtitle: 副标题
- icon: 图标
- color: 颜色
- order: 排序

### lessons 表
- id: 文章ID
- chapter_id: 所属章节
- lesson_number: 课程序号
- title: 标题
- content: HTML内容
- word_count: 字数
- estimated_time: 预计阅读时间(分钟)
- completed: 完成状态 (0/1)

## CSS 样式系统

### 字体
- 中英文统一字体: -apple-system, BlinkMacSystemFont, "Segoe UI", "Microsoft YaHei"
- 代码字体: Courier New, Monaco, Consolas

### 主题色彩
- 主色调: 黑色边框 + 像素风格
- 强调色: 蓝色 (#0066ff)
- 背景色: 米白色 (#fafafa)

### 响应式设计
- 移动端自适应
- 字体大小可调节
- 灵活的布局系统

## 常见问题

### 1. 登录后无法访问后台?
检查 CORS 设置,确保 credentials 设为 'include'。

### 2. 图片上传失败?
- 检查文件大小是否超过100MB
- 确认文件格式是否支持
- 查看 `public/uploads` 目录权限

### 3. 前端显示与编辑器不一致?
- 确保已更新 style.css
- 清除浏览器缓存
- 检查 TinyMCE content_style 配置

### 4. 文章内容无法保存?
- 检查是否已登录
- 查看浏览器控制台错误信息
- 确认服务器正在运行

## 技术栈

- **后端**: Node.js + Express
- **数据库**: SQLite (better-sqlite3)
- **会话管理**: express-session
- **文件上传**: multer
- **富文本编辑**: TinyMCE 6
- **前端**: 原生 JavaScript + CSS

## 安全注意事项

1. **生产环境部署前必须修改**:
   - 更改默认管理员账号密码
   - 启用 HTTPS (设置 cookie.secure = true)
   - 使用强密码和密钥
   - 设置合适的 CORS 策略

2. **文件上传安全**:
   - 已限制文件类型和大小
   - 文件名使用时间戳避免冲突
   - 建议添加病毒扫描

3. **数据验证**:
   - 后端已有基本验证
   - 建议添加更严格的输入校验
   - 防止 XSS 和 SQL 注入

## 更新日志

### 最新版本特性
- ✅ 完整的富文本编辑器支持
- ✅ 图片和视频上传功能
- ✅ 前后端格式完全匹配
- ✅ 中英文字体统一
- ✅ 响应式字体缩放系统
- ✅ 支持所有HTML元素样式
- ✅ 完善的认证系统

## 联系与支持

如需帮助,请查看:
- TinyMCE 官方文档: https://www.tiny.cloud/docs/
- Express.js 文档: https://expressjs.com/
- SQLite 文档: https://www.sqlite.org/docs.html
