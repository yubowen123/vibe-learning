# Vibe Learning Platform 部署指南

## 一、服务器准备

### 1. 服务器要求
- **操作系统**: Ubuntu 20.04+ / CentOS 7+
- **内存**: 最低 1GB RAM
- **存储**: 最低 10GB
- **Node.js**: 16.x 或更高版本

### 2. 连接服务器
```bash
ssh root@your_server_ip
# 或使用密钥
ssh -i your_key.pem root@your_server_ip
```

---

## 二、安装必要软件

### 1. 更新系统
```bash
# Ubuntu/Debian
apt update && apt upgrade -y

# CentOS
yum update -y
```

### 2. 安装 Node.js 和 npm
```bash
# 使用 NodeSource 安装 Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt install -y nodejs

# 验证安装
node -v
npm -v
```

### 3. 安装 PM2（进程管理器）
```bash
npm install -g pm2
pm2 -v
```

### 4. 安装 Nginx（可选，用于反向代理）
```bash
apt install -y nginx
systemctl start nginx
systemctl enable nginx
```

---

## 三、上传项目文件

### 方法1: 使用 Git（推荐）
```bash
# 在服务器上
cd /var/www
git clone your_repository_url vibe-learning

# 如果没有Git仓库，先在本地初始化
# cd /Users/gb/Desktop/claude/memory-echo/docs/vibe_learning_platform
# git init
# git add .
# git commit -m "Initial commit"
# git remote add origin your_repository_url
# git push -u origin main
```

### 方法2: 使用 SCP
```bash
# 在本地Mac终端执行
cd /Users/gb/Desktop/claude/memory-echo/docs/vibe_learning_platform

# 上传整个项目
scp -r . root@your_server_ip:/var/www/vibe-learning/

# 或使用rsync（更高效）
rsync -avz --exclude 'node_modules' . root@your_server_ip:/var/www/vibe-learning/
```

### 方法3: 使用 FTP/SFTP 工具
推荐工具：
- FileZilla
- Cyberduck
- Transmit (Mac)

上传整个项目到服务器的 `/var/www/vibe-learning/` 目录

---

## 四、配置项目

### 1. 进入项目目录
```bash
cd /var/www/vibe-learning
```

### 2. 安装依赖
```bash
npm install
```

### 3. 创建生产环境配置
```bash
# 创建环境变量文件
cat > .env << EOF
NODE_ENV=production
PORT=3000
EOF
```

### 4. 修改服务器配置（如果需要）
编辑 `server.js`，确保监听正确的端口和地址：
```javascript
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(\`Server running on port \${PORT}\`);
});
```

---

## 五、使用 PM2 启动应用

### 1. 创建 PM2 配置文件
```bash
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'vibe-learning',
    script: './server.js',
    instances: 1,
    exec_mode: 'fork',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss',
    merge_logs: true,
    autorestart: true,
    watch: false,
    max_memory_restart: '500M'
  }]
};
EOF
```

### 2. 创建日志目录
```bash
mkdir -p logs
```

### 3. 启动应用
```bash
pm2 start ecosystem.config.js

# 查看应用状态
pm2 status

# 查看日志
pm2 logs vibe-learning

# 查看详细信息
pm2 show vibe-learning
```

### 4. 设置开机自启动
```bash
pm2 startup
pm2 save
```

### 5. 常用 PM2 命令
```bash
# 重启应用
pm2 restart vibe-learning

# 停止应用
pm2 stop vibe-learning

# 删除应用
pm2 delete vibe-learning

# 查看实时日志
pm2 logs vibe-learning --lines 100

# 监控
pm2 monit
```

---

## 六、配置 Nginx 反向代理（推荐）

### 1. 创建 Nginx 配置文件
```bash
cat > /etc/nginx/sites-available/vibe-learning << 'EOF'
server {
    listen 80;
    server_name your_domain.com www.your_domain.com;

    # 上传文件大小限制
    client_max_body_size 100M;

    # 日志
    access_log /var/log/nginx/vibe-learning-access.log;
    error_log /var/log/nginx/vibe-learning-error.log;

    # 反向代理到 Node.js 应用
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 300s;
        proxy_connect_timeout 75s;
    }

    # 静态文件缓存
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|woff|woff2|ttf|svg)$ {
        proxy_pass http://127.0.0.1:3000;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
EOF
```

### 2. 启用配置
```bash
# 创建符号链接
ln -s /etc/nginx/sites-available/vibe-learning /etc/nginx/sites-enabled/

# 测试配置
nginx -t

# 重启 Nginx
systemctl restart nginx
```

### 3. 配置防火墙
```bash
# Ubuntu (ufw)
ufw allow 80/tcp
ufw allow 443/tcp
ufw allow 22/tcp
ufw enable

# CentOS (firewalld)
firewall-cmd --permanent --add-service=http
firewall-cmd --permanent --add-service=https
firewall-cmd --permanent --add-service=ssh
firewall-cmd --reload
```

---

## 七、配置 SSL 证书（HTTPS）

### 使用 Let's Encrypt 免费证书

```bash
# 安装 Certbot
apt install -y certbot python3-certbot-nginx

# 获取证书并自动配置 Nginx
certbot --nginx -d your_domain.com -d www.your_domain.com

# 测试自动续期
certbot renew --dry-run
```

Nginx 配置会自动更新，添加 HTTPS 支持。

---

## 八、修改应用配置适配生产环境

### 1. 更新管理员密码（重要！）
编辑 `server.js`：
```javascript
const ADMIN_ACCOUNT = {
    username: '13633602987',
    password: 'your_secure_password_here' // 修改为强密码
};
```

### 2. 启用 HTTPS Cookie（如果使用 HTTPS）
编辑 `server.js`：
```javascript
app.use(session({
    secret: 'your-secret-key-change-this-in-production',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: true, // 启用 HTTPS
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
        sameSite: 'strict'
    }
}));
```

### 3. 更新前端 API 地址
如果使用域名，更新以下文件：
- `public/js/app.js`
- `public/admin.html`
- `public/login.html`

将 `http://localhost:3000` 改为你的域名：
```javascript
const API_BASE = 'https://your_domain.com/api';
```

### 4. 重启应用
```bash
pm2 restart vibe-learning
```

---

## 九、数据库备份

### 1. 创建备份脚本
```bash
cat > /var/www/vibe-learning/backup.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/var/backups/vibe-learning"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

# 备份数据库
cp /var/www/vibe-learning/vibe_learning.db $BACKUP_DIR/vibe_learning_$DATE.db

# 备份上传文件
tar -czf $BACKUP_DIR/uploads_$DATE.tar.gz /var/www/vibe-learning/public/uploads/

# 删除7天前的备份
find $BACKUP_DIR -name "*.db" -mtime +7 -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete

echo "Backup completed: $DATE"
EOF

chmod +x /var/www/vibe-learning/backup.sh
```

### 2. 设置定时备份
```bash
# 添加到 crontab
crontab -e

# 每天凌晨2点备份
0 2 * * * /var/www/vibe-learning/backup.sh >> /var/log/vibe-backup.log 2>&1
```

---

## 十、监控和维护

### 1. 查看应用状态
```bash
pm2 status
pm2 logs vibe-learning --lines 50
```

### 2. 查看系统资源
```bash
# 内存使用
free -h

# 磁盘使用
df -h

# CPU使用
top
```

### 3. Nginx 日志
```bash
# 访问日志
tail -f /var/log/nginx/vibe-learning-access.log

# 错误日志
tail -f /var/log/nginx/vibe-learning-error.log
```

---

## 十一、故障排查

### 应用无法启动
```bash
# 查看错误日志
pm2 logs vibe-learning --err

# 检查端口占用
netstat -tulpn | grep 3000

# 测试直接启动
cd /var/www/vibe-learning
node server.js
```

### 无法访问网站
```bash
# 检查 Nginx 状态
systemctl status nginx

# 检查防火墙
ufw status
# 或
firewall-cmd --list-all

# 测试本地访问
curl http://localhost:3000
```

### 上传文件失败
```bash
# 检查目录权限
ls -la /var/www/vibe-learning/public/uploads/

# 设置正确权限
chown -R www-data:www-data /var/www/vibe-learning/public/uploads/
chmod -R 755 /var/www/vibe-learning/public/uploads/
```

---

## 十二、更新应用

### 使用 Git
```bash
cd /var/www/vibe-learning
git pull origin main
npm install
pm2 restart vibe-learning
```

### 手动更新
```bash
# 备份当前版本
cd /var/www
tar -czf vibe-learning-backup-$(date +%Y%m%d).tar.gz vibe-learning/

# 上传新文件（使用 scp 或 FTP）
# 然后重启
cd /var/www/vibe-learning
npm install
pm2 restart vibe-learning
```

---

## 十三、安全建议

1. ✅ 修改默认管理员密码
2. ✅ 使用 HTTPS
3. ✅ 定期备份数据库
4. ✅ 限制 SSH 访问（使用密钥认证）
5. ✅ 启用防火墙
6. ✅ 定期更新系统和依赖包
7. ✅ 使用强密码和密钥
8. ✅ 监控日志文件

---

## 快速部署命令总结

```bash
# 1. 安装软件
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs nginx
npm install -g pm2

# 2. 上传代码到 /var/www/vibe-learning

# 3. 安装依赖并启动
cd /var/www/vibe-learning
npm install
pm2 start server.js --name vibe-learning
pm2 save
pm2 startup

# 4. 配置 Nginx（创建配置文件后）
ln -s /etc/nginx/sites-available/vibe-learning /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx

# 5. 配置防火墙
ufw allow 80/tcp
ufw allow 443/tcp
ufw enable

# 6. 安装 SSL（可选）
certbot --nginx -d your_domain.com
```

---

## 访问应用

- **HTTP**: http://your_domain.com 或 http://server_ip
- **前端**: http://your_domain.com/
- **后台**: http://your_domain.com/admin.html
- **登录**: http://your_domain.com/login.html

---

## 支持和帮助

如遇问题，请检查：
1. PM2 日志: `pm2 logs vibe-learning`
2. Nginx 日志: `/var/log/nginx/vibe-learning-error.log`
3. 系统日志: `journalctl -u nginx -f`
