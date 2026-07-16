#!/bin/bash
set -e

echo "===== Step 1: Check and Install Node.js ====="
if ! command -v node &>/dev/null; then
  if [ ! -d "/www/server/nodejs/v22.16.0" ]; then
    echo "Downloading Node.js v22.16.0..."
    cd /tmp
    wget -q "https://npmmirror.com/mirrors/node/v22.16.0/node-v22.16.0-linux-x64.tar.xz" -O node.tar.xz
    tar -xf node.tar.xz
    mkdir -p /www/server/nodejs
    mv node-v22.16.0-linux-x64 /www/server/nodejs/v22.16.0
    rm -f node.tar.xz
  fi
  ln -sf /www/server/nodejs/v22.16.0/bin/node /usr/local/bin/node
  ln -sf /www/server/nodejs/v22.16.0/bin/npm /usr/local/bin/npm
  ln -sf /www/server/nodejs/v22.16.0/bin/npx /usr/local/bin/npx
fi
echo "Node version: $(node -v)"
echo "npm version: $(npm -v)"

echo "===== Step 2: Install PM2 ====="
if ! command -v pm2 &>/dev/null; then
  npm install -g pm2
  ln -sf /www/server/nodejs/v22.16.0/bin/pm2 /usr/local/bin/pm2 2>/dev/null || ln -sf $(npm root -g)/pm2/bin/pm2 /usr/local/bin/pm2
fi
echo "PM2 version: $(pm2 -v)"

echo "===== Step 3: Clean up deploy.zip ====="
rm -f /www/wwwroot/deploy.zip

echo "===== Step 4: Start app with PM2 ====="
cd /www/wwwroot/github-star-trending
pm2 delete github-star-trending 2>/dev/null || true
pm2 start ecosystem.config.cjs
pm2 save
echo "PM2 apps:"
pm2 list

echo "===== Step 5: Check Nginx ====="
if [ -f "/www/server/nginx/sbin/nginx" ]; then
  echo "Nginx found at /www/server/nginx/sbin/nginx"
  /www/server/nginx/sbin/nginx -v
  NGINX_BIN="/www/server/nginx/sbin/nginx"
elif command -v nginx &>/dev/null; then
  echo "Nginx found in PATH"
  nginx -v
  NGINX_BIN="nginx"
else
  echo "WARNING: Nginx not installed yet. Please install via BT Panel software store."
  NGINX_BIN=""
fi

echo "===== Step 6: Configure Nginx reverse proxy ====="
if [ -n "$NGINX_BIN" ]; then
  NGINX_CONF="/www/server/nginx/conf/nginx.conf"
  VHOST_DIR="/www/server/panel/vhost/nginx"
  mkdir -p "$VHOST_DIR"
  
  cat > "$VHOST_DIR/github-star-trending.conf" << 'NGINXEOF'
server {
    listen 80;
    server_name _;
    
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
    }
    
    location /_next/static/ {
        alias /www/wwwroot/github-star-trending/.next/static/;
        expires 365d;
        access_log off;
    }
}
NGINXEOF

  # Include vhost in nginx.conf if not already included
  if ! grep -q "vhost/nginx" "$NGINX_CONF"; then
    sed -i '/http {/a \    include /www/server/panel/vhost/nginx/*.conf;' "$NGINX_CONF"
  fi
  
  # Test and reload nginx
  $NGINX_BIN -t && $NGINX_BIN -s reload || $NGINX_BIN
  echo "Nginx configured and reloaded!"
fi

echo "===== Step 7: Set PM2 to start on boot ====="
pm2 startup systemd -u root --hp /root
pm2 save

echo "===== DEPLOY COMPLETE ====="
echo "App should be running at http://39.106.123.139"
