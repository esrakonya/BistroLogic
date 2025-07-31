# Adım 1: Stabil bir Node.js versiyonu seçiyoruz.
FROM node:18-alpine

# Adım 2: Konteyner içinde çalışacağımız klasörü belirliyoruz.
WORKDIR /app

# Adım 3: Sadece paket listesini kopyalayarak kurulumu hızlandırıyoruz (cache optimizasyonu).
COPY package*.json ./

# Adım 4: Gerekli tüm paketleri kuruyoruz.
RUN npm install

# Adım 5: Projenin geri kalan tüm dosyalarını kopyalıyoruz.
COPY . .

# Adım 6: Next.js'in çalıştığı 3000 portunu dışarıya açıyoruz.
EXPOSE 3000

# Adım 7: Konteyner başladığında çalıştırılacak varsayılan komut.
CMD ["npm", "run", "dev"]