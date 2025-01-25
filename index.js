const mineflayer = require('mineflayer');
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

let botConnected = false; // Bot bağlantı durumu

// Bot yapılandırma ayarları
const config = {
  botAccount: {
    username: "EylandAFKv1",
    password: "Fake-3",
    type: "legacy"
  },
  server: {
    ip: "mc.craftlime.net",
    port: 25565,
    version: "1.19.3"
  },
  utils: {
    autoAuth: {
      enabled: true,
      password: "Fake-3"
    },
    chatMessages: {
      enabled: true,
      messages: [
        { text: "/t spawn Eyland", delay: 5 },
        { text: "/quake towny3", delay: 5 },
        { text: "/onay", delay: 5 }
      ]
    },
    antiAfk: {
      enabled: true
    },
    autoReconnect: true,
    autoReconnectDelay: 5000
  },
  chatLog: true
};

let bot;

// Bot başlatma fonksiyonu
function startBot() {
  bot = mineflayer.createBot({
    host: config.server.ip,
    port: config.server.port,
    username: config.botAccount.username,
    password: config.botAccount.password,
    version: config.server.version,
    auth: config.botAccount.type
  });

  // Bot spawn olduğunda
  bot.on('spawn', () => {
    console.log('Bot başarıyla bağlandı ve spawn oldu.');
    botConnected = true;
  });

  // Sohbet mesajlarını dinleme ve login komutunu doğru zamanda gönderme
  bot.on('message', (message) => {
    const msg = message.toString();
    console.log(`Sunucudan mesaj: ${msg}`);

    if (msg.includes("Lütfen /login") && config.utils.autoAuth.enabled) {
      bot.chat(`/login ${config.utils.autoAuth.password}`);
      console.log(`Otomatik giriş yapıldı: /login ${config.utils.autoAuth.password}`);
    }
  });

  // Bağlantı kesildiğinde yeniden bağlanma
  bot.on('end', () => {
    console.log('Bot bağlantısı kesildi. Yeniden bağlanacak...');
    botConnected = false;
    setTimeout(startBot, config.utils.autoReconnectDelay); // Botu yeniden başlat
  });

  // Hata mesajlarını dinleme
  bot.on('error', (err) => {
    console.log('Bot hata aldı:', err);
  });
}

// Botu başlat
startBot();

// Web sunucusu
app.get('/', (req, res) => {
  if (botConnected) {
    res.send('Bot başarıyla bağlandı ve sohbetleri dinliyor.');
  } else {
    res.send('Bot bağlantı kurmaya çalışıyor...');
  }
});

// Sunucu bağlantısını başlat
app.listen(port, () => {
  console.log(`Sunucu ${port} numaralı bağlantı noktasında yürütülüyor.`);
});
