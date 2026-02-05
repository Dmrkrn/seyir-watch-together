#!/bin/bash

# Renkler
GREEN='\033[0;32m'
NC='\033[0m'

echo -e "${GREEN}Seyir Sunucu Kurulumu Başlıyor...${NC}"

# 1. SWAP (Sanal RAM) Oluşturma (4GB)
if [ -f /swapfile ]; then
    echo -e "${GREEN}✅ Swap dosyası zaten var.${NC}"
else
    echo "Swap dosyası oluşturuluyor (4GB)..."
    fallocate -l 4G /swapfile
    chmod 600 /swapfile
    mkswap /swapfile
    swapon /swapfile
    echo '/swapfile none swap sw 0 0' | tee -a /etc/fstab
    echo -e "${GREEN}✅ Swap oluşturuldu.${NC}"
fi

# 2. Docker & Docker Compose Kurulumu
if ! command -v docker &> /dev/null; then
    echo "Docker bulunamadı, kuruluyor..."
    apt-get update
    apt-get install -y ca-certificates curl gnupg
    install -m 0755 -d /etc/apt/keyrings
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
    chmod a+r /etc/apt/keyrings/docker.gpg
    echo \
      "deb [arch="$(dpkg --print-architecture)" signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
      "$(. /etc/os-release && echo "$VERSION_CODENAME")" stable" | \
      tee /etc/apt/sources.list.d/docker.list > /dev/null
    apt-get update
    apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
    echo -e "${GREEN}✅ Docker kuruldu.${NC}"
else
    echo -e "${GREEN}✅ Docker zaten kurulu.${NC}"
fi

# 3. Projeyi Çalıştır
echo "Docker Compose başlatılıyor..."
docker compose up -d --build

echo -e "${GREEN}🎉 Kurulum Tamamlandı! Seyir şu an çalışıyor.${NC}"
