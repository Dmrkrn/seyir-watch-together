#!/bin/bash

DOMAIN="socket.cagridemirkiran.com"
EMAIL="dmrkrn21@hotmail.com" # Using email from screenshot

# Renkler
GREEN='\033[0;32m'
NC='\033[0m'

echo -e "${GREEN}Domain ve SSL Kurulumu Başlıyor... ($DOMAIN)${NC}"

# 1. Nginx ve Certbot Kur
apt-get update
apt-get install -y nginx certbot python3-certbot-nginx

# 2. Nginx Ayarını Yaz
cat > /etc/nginx/sites-available/seyir <<EOF
server {
    server_name $DOMAIN;

    location / {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

# 3. Ayarı Aktif Et
ln -s /etc/nginx/sites-available/seyir /etc/nginx/sites-enabled/
rm /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx

# 4. SSL Sertifikası Al (Let's Encrypt)
echo -e "${GREEN}SSL Sertifikası alınıyor...${NC}"
certbot --nginx --non-interactive --agree-tos -m $EMAIL -d $DOMAIN

echo -e "${GREEN}🎉 Kurulum Tamamlandı! Artık https://$DOMAIN adresinden güvenli bağlantı sağlanabilir.${NC}"
