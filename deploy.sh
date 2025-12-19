#!/bin/bash

# Vibe Learning Platform 一键部署脚本
# 用法: ./deploy.sh

set -e

echo "======================================"
echo "  Vibe Learning Platform 部署脚本"
echo "======================================"
echo ""

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 检查是否为root用户
if [ "$EUID" -ne 0 ]; then
    echo -e "${RED}请使用 root 用户运行此脚本${NC}"
    echo "使用: sudo ./deploy.sh"
    exit 1
fi

# 询问部署目录
read -p "请输入部署目录 (默认: /var/www/vibe-learning): " DEPLOY_DIR
DEPLOY_DIR=${DEPLOY_DIR:-/var/www/vibe-learning}

# 询问域名
read -p "请输入域名 (例如: example.com, 留空表示仅使用IP): " DOMAIN

# 询问是否配置SSL
if [ ! -z "$DOMAIN" ]; then
    read -p "是否配置 SSL 证书? (y/n, 默认: n): " SETUP_SSL
    SETUP_SSL=${SETUP_SSL:-n}
fi

echo ""
echo -e "${GREEN}开始部署...${NC}"
echo ""

# 1. 更新系统
echo -e "${YELLOW}[1/10] 更新系统...${NC}"
apt update && apt upgrade -y

# 2. 安装 Node.js
echo -e "${YELLOW}[2/10] 安装 Node.js...${NC}"
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
    apt install -y nodejs
fi
echo "Node.js 版本: $(node -v)"
echo "npm 版本: $(npm -v)"

# 3. 安装 PM2
echo -e "${YELLOW}[3/10] 安装 PM2...${NC}"
if ! command -v pm2 &> /dev/null; then
    npm install -g pm2
fi
echo "PM2 版本: $(pm2 -v)"

# 4. 安装 Nginx
echo -e "${YELLOW}[4/10] 安装 Nginx...${NC}"
if ! command -v nginx &> /dev/null; then
    apt install -y nginx
fi
systemctl start nginx
systemctl enable nginx

# 5. 创建部署目录
echo -e "${YELLOW}[5/10] 创建部署目录...${NC}"
mkdir -p $DEPLOY_DIR
cd $DEPLOY_DIR

# 6. 安装依赖
echo -e "${YELLOW}[6/10] 安装项目依赖...${NC}"
if [ -f "package.json" ]; then
    npm install --production
else
    echo -e "${RED}错误: 找不到 package.json 文件${NC}"
    echo "请确保项目文件已上传到 $DEPLOY_DIR"
    exit 1
fi

# 7. 创建日志目录
echo -e "${YELLOW}[7/10] 创建日志目录...${NC}"
mkdir -p logs

# 8. 创建 PM2 配置文件
echo -e "${YELLOW}[8/10] 配置 PM2...${NC}"
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

# 启动应用
pm2 delete vibe-learning 2>/dev/null || true
pm2 start ecosystem.config.js
pm2 save
pm2 startup | tail -n 1 | bash

# 9. 配置 Nginx
echo -e "${YELLOW}[9/10] 配置 Nginx...${NC}"
if [ ! -z "$DOMAIN" ]; then
    SERVER_NAME="$DOMAIN www.$DOMAIN"
else
    SERVER_NAME="_"
fi

cat > /etc/nginx/sites-available/vibe-learning << EOF
server {
    listen 80;
    server_name $SERVER_NAME;

    client_max_body_size 100M;

    access_log /var/log/nginx/vibe-learning-access.log;
    error_log /var/log/nginx/vibe-learning-error.log;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        proxy_read_timeout 300s;
        proxy_connect_timeout 75s;
    }

    location ~* \.(jpg|jpeg|png|gif|ico|css|js|woff|woff2|ttf|svg)$ {
        proxy_pass http://127.0.0.1:3000;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
EOF

ln -sf /etc/nginx/sites-available/vibe-learning /etc/nginx/sites-enabled/
nginx -t && systemctl restart nginx

# 10. 配置防火墙
echo -e "${YELLOW}[10/10] 配置防火墙...${NC}"
ufw allow 80/tcp
ufw allow 443/tcp
ufw allow 22/tcp
echo "y" | ufw enable

# 配置 SSL (如果需要)
if [ "$SETUP_SSL" = "y" ] && [ ! -z "$DOMAIN" ]; then
    echo -e "${YELLOW}配置 SSL 证书...${NC}"
    apt install -y certbot python3-certbot-nginx
    certbot --nginx -d $DOMAIN -d www.$DOMAIN --non-interactive --agree-tos --register-unsafely-without-email
fi

# 完成
echo ""
echo -e "${GREEN}======================================"
echo "  部署完成！"
echo "======================================${NC}"
echo ""
echo "应用信息:"
echo "  - 部署目录: $DEPLOY_DIR"
echo "  - PM2 状态: $(pm2 status | grep vibe-learning | awk '{print $10}')"
echo "  - Nginx 状态: $(systemctl is-active nginx)"
echo ""
if [ ! -z "$DOMAIN" ]; then
    if [ "$SETUP_SSL" = "y" ]; then
        echo "访问地址:"
        echo "  - 前端: https://$DOMAIN"
        echo "  - 后台: https://$DOMAIN/admin.html"
        echo "  - 登录: https://$DOMAIN/login.html"
    else
        echo "访问地址:"
        echo "  - 前端: http://$DOMAIN"
        echo "  - 后台: http://$DOMAIN/admin.html"
        echo "  - 登录: http://$DOMAIN/login.html"
    fi
else
    SERVER_IP=$(curl -s ifconfig.me)
    echo "访问地址:"
    echo "  - 前端: http://$SERVER_IP"
    echo "  - 后台: http://$SERVER_IP/admin.html"
    echo "  - 登录: http://$SERVER_IP/login.html"
fi
echo ""
echo "默认管理员账号:"
echo "  - 用户名: 13633602987"
echo "  - 密码: yu19920704"
echo ""
echo -e "${RED}⚠️  重要提醒: 请立即修改默认密码！${NC}"
echo ""
echo "常用命令:"
echo "  - 查看日志: pm2 logs vibe-learning"
echo "  - 重启应用: pm2 restart vibe-learning"
echo "  - 查看状态: pm2 status"
echo ""
