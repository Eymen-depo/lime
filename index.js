const mineflayer = require('mineflayer');

// Botu oluştur
const bot = mineflayer.createBot({
  host: 'sunucu_adresi', // Sunucu adresi
  port: 25565, // Sunucu portu (varsayılan: 25565)
  username: 'kullanici_adi', // Minecraft kullanıcı adı
  password: 'sifre', // Şifre (Premium hesaplar için)
});

// Giriş mesajı
bot.on('login', () => {
  console.log('Bot başarıyla giriş yaptı!');
});

// Spawn olayı
bot.on('spawn', () => {
  console.log('Bot spawn oldu, komutlar döngüsel olarak başlatılıyor.');

  // Döngüde çalışacak komutlar
  const commands = [
    { text: "/quake towny3", delay: 5 },
    { text: "/t spawn Eyland_Empire", delay: 5 },
    { text: "/onay", delay: 5 }
  ];

  // Döngüyü başlat
  function startCommandLoop() {
    let index = 0;

    function executeNextCommand() {
      const command = commands[index];
      bot.chat(command.text); // Komutu gönder
      console.log(`Komut gönderildi: ${command.text}`);

      // Sonraki komuta geç
      index = (index + 1) % commands.length;

      // Döngüyü devam ettir
      setTimeout(executeNextCommand, command.delay * 1000);
    }

    // İlk komutu çalıştır
    executeNextCommand();
  }

  // Döngüyü başlat
  startCommandLoop();
});

// Hata durumunda mesaj yazdır
bot.on('error', (err) => {
  console.log('Bir hata oluştu:', err);
});

bot.on('end', () => {
  console.log('Bot bağlantısı kesildi.');
});
