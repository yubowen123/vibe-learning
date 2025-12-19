const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const Database = require('better-sqlite3');
const path = require('path');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const fs = require('fs');

const app = express();
const PORT = 3000;

// 确保上传目录存在
const uploadDir = path.join(__dirname, 'public', 'uploads');
const imageDir = path.join(uploadDir, 'images');
const videoDir = path.join(uploadDir, 'videos');

if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
if (!fs.existsSync(imageDir)) fs.mkdirSync(imageDir, { recursive: true });
if (!fs.existsSync(videoDir)) fs.mkdirSync(videoDir, { recursive: true });

// 配置文件上传
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (file.mimetype.startsWith('image/')) {
            cb(null, imageDir);
        } else if (file.mimetype.startsWith('video/')) {
            cb(null, videoDir);
        } else {
            cb(new Error('不支持的文件类型'));
        }
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 100 * 1024 * 1024 // 100MB限制
    },
    fileFilter: function (req, file, cb) {
        const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/webm', 'video/ogg'];
        if (allowedMimes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('不支持的文件类型'));
        }
    }
});

// 中间件
app.use(cors({
    origin: true,
    credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 会话管理
app.use(session({
    secret: 'vibe-learning-platform-secret-key-2024',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // 生产环境应设为true（需要HTTPS）
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000, // 24小时
        sameSite: 'lax'
    }
}));

app.use(express.static('public'));

// 数据库连接
const db = new Database('vibe_learning.db');

// 默认管理员账号
const ADMIN_ACCOUNT = {
    username: 'admin',
    password: '123456' // 实际应用中应该使用哈希后的密码
};

// 认证中间件
const requireAuth = (req, res, next) => {
    if (req.session && req.session.isAuthenticated) {
        next();
    } else {
        res.status(401).json({ success: false, error: '未授权访问' });
    }
};

// ============ 认证API ============

// 登录
app.post('/api/auth/login', (req, res) => {
    try {
        const { username, password } = req.body;

        if (username === ADMIN_ACCOUNT.username && password === ADMIN_ACCOUNT.password) {
            req.session.isAuthenticated = true;
            req.session.username = username;
            res.json({ success: true, message: '登录成功' });
        } else {
            res.status(401).json({ success: false, error: '用户名或密码错误' });
        }
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// 登出
app.post('/api/auth/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            res.status(500).json({ success: false, error: '登出失败' });
        } else {
            res.json({ success: true, message: '登出成功' });
        }
    });
});

// 检查登录状态
app.get('/api/auth/check', (req, res) => {
    if (req.session && req.session.isAuthenticated) {
        res.json({ success: true, isAuthenticated: true, username: req.session.username });
    } else {
        res.json({ success: true, isAuthenticated: false });
    }
});

// ============ 文件上传API ============

// 上传图片
app.post('/api/upload/image', requireAuth, upload.single('image'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, error: '没有上传文件' });
        }
        const imageUrl = `/uploads/images/${req.file.filename}`;
        res.json({ success: true, url: imageUrl });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// 上传视频
app.post('/api/upload/video', requireAuth, upload.single('video'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, error: '没有上传文件' });
        }
        const videoUrl = `/uploads/videos/${req.file.filename}`;
        res.json({ success: true, url: videoUrl });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ============ API路由 ============

// 获取所有章节
app.get('/api/chapters', (req, res) => {
    try {
        const chapters = db.prepare(`
            SELECT c.*,
                   COUNT(l.id) as lesson_count,
                   SUM(CASE WHEN l.completed = 1 THEN 1 ELSE 0 END) as completed_count
            FROM chapters c
            LEFT JOIN lessons l ON c.id = l.chapter_id
            GROUP BY c.id
            ORDER BY c.\`order\`
        `).all();
        res.json({ success: true, data: chapters });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// 获取单个章节详情
app.get('/api/chapters/:id', (req, res) => {
    try {
        const chapter = db.prepare('SELECT * FROM chapters WHERE id = ?').get(req.params.id);
        if (!chapter) {
            return res.status(404).json({ success: false, error: '章节不存在' });
        }

        const lessons = db.prepare(`
            SELECT * FROM lessons
            WHERE chapter_id = ?
            ORDER BY lesson_number
        `).all(req.params.id);

        res.json({ success: true, data: { ...chapter, lessons } });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// 获取单篇文章
app.get('/api/lessons/:id', (req, res) => {
    try {
        const lesson = db.prepare('SELECT * FROM lessons WHERE id = ?').get(req.params.id);
        if (!lesson) {
            return res.status(404).json({ success: false, error: '文章不存在' });
        }
        res.json({ success: true, data: lesson });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// 更新文章完成状态
app.put('/api/lessons/:id/complete', (req, res) => {
    try {
        const { completed } = req.body;
        db.prepare('UPDATE lessons SET completed = ? WHERE id = ?')
          .run(completed ? 1 : 0, req.params.id);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// 获取学习进度
app.get('/api/progress', (req, res) => {
    try {
        const total = db.prepare('SELECT COUNT(*) as count FROM lessons').get();
        const completed = db.prepare('SELECT COUNT(*) as count FROM lessons WHERE completed = 1').get();
        const progress = {
            total: total.count,
            completed: completed.count,
            percentage: Math.round((completed.count / total.count) * 100)
        };
        res.json({ success: true, data: progress });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ============ 后台管理API ============

// 创建章节
app.post('/api/admin/chapters', requireAuth, (req, res) => {
    try {
        const { title, subtitle, icon, color, order } = req.body;
        const result = db.prepare(`
            INSERT INTO chapters (id, chapter_number, title, subtitle, icon, color, \`order\`)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `).run(`chapter-${Date.now()}`, order, title, subtitle, icon, color, order);

        res.json({ success: true, id: result.lastInsertRowid });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// 更新章节
app.put('/api/admin/chapters/:id', requireAuth, (req, res) => {
    try {
        const { title, subtitle, icon, color, order } = req.body;
        db.prepare(`
            UPDATE chapters
            SET title = ?, subtitle = ?, icon = ?, color = ?, \`order\` = ?
            WHERE id = ?
        `).run(title, subtitle, icon, color, order, req.params.id);

        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// 删除章节
app.delete('/api/admin/chapters/:id', requireAuth, (req, res) => {
    try {
        db.prepare('DELETE FROM lessons WHERE chapter_id = ?').run(req.params.id);
        db.prepare('DELETE FROM chapters WHERE id = ?').run(req.params.id);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// 创建文章
app.post('/api/admin/lessons', requireAuth, (req, res) => {
    try {
        const { chapter_id, title, content, lesson_number } = req.body;
        const word_count = content.length;
        const estimated_time = Math.max(3, Math.floor(word_count / 500));

        const result = db.prepare(`
            INSERT INTO lessons (id, chapter_id, lesson_number, title, content, word_count, estimated_time, completed)
            VALUES (?, ?, ?, ?, ?, ?, ?, 0)
        `).run(`lesson-${Date.now()}`, chapter_id, lesson_number, title, content, word_count, estimated_time);

        res.json({ success: true, id: result.lastInsertRowid });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// 更新文章
app.put('/api/admin/lessons/:id', requireAuth, (req, res) => {
    try {
        const { title, content, lesson_number } = req.body;
        const word_count = content.length;
        const estimated_time = Math.max(3, Math.floor(word_count / 500));

        db.prepare(`
            UPDATE lessons
            SET title = ?, content = ?, lesson_number = ?, word_count = ?, estimated_time = ?
            WHERE id = ?
        `).run(title, content, lesson_number, word_count, estimated_time, req.params.id);

        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// 删除文章
app.delete('/api/admin/lessons/:id', requireAuth, (req, res) => {
    try {
        db.prepare('DELETE FROM lessons WHERE id = ?').run(req.params.id);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// 启动服务器
app.listen(PORT, () => {
    console.log(`
╔═══════════════════════════════════════════════════╗
║                                                   ║
║     🌌 Vibe Coding 学习平台 - 服务器启动         ║
║                                                   ║
║     端口: ${PORT}                                    ║
║     前端: http://localhost:${PORT}                  ║
║     后台: http://localhost:${PORT}/admin.html       ║
║                                                   ║
╚═══════════════════════════════════════════════════╝
    `);
});

// 优雅关闭
process.on('SIGINT', () => {
    db.close();
    console.log('\n数据库连接已关闭');
    process.exit(0);
});
