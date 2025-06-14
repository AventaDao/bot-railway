const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const fs = require('fs');
const path = require('path');

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
});

const prefix = '!';

const admins = JSON.parse(fs.readFileSync('./data/admins.json', 'utf-8'));
let blacklist = JSON.parse(fs.readFileSync('./data/blacklist.json', 'utf-8'));
const commandUsage = new Map();

function isAdmin(message) {
    const sender = message.from.includes('@g.us') ? message.author || message.from : message.from;
    return admins.includes(sender.replace('@c.us', ''));
}

client.on('qr', qr => {
    console.log('📷 Scan QR ini:');
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('✅ Bot siap!');
});

const commands = new Map();
fs.readdirSync('./commands').filter(f => f.endsWith('.js')).forEach(file => {
    const cmd = require(`./commands/${file}`);
    if (cmd.name && typeof cmd.execute === 'function') {
        commands.set(cmd.name, cmd);
        console.log(`✅ Command dimuat: ${cmd.name}`);
    }
});

client.on('message', async msg => {
    const text = msg.body.trim();
    const userId = msg.from;

    if (blacklist.includes(userId)) return msg.reply('🚫 Kamu diblokir menggunakan bot.');

    const now = Date.now();
    const timestamps = commandUsage.get(userId) || [];
    const recent = timestamps.filter(ts => now - ts < 30000);
    recent.push(now);
    commandUsage.set(userId, recent);

    if (recent.length > 5) {
        blacklist.push(userId);
        fs.writeFileSync('./data/blacklist.json', JSON.stringify(blacklist, null, 2));
        return msg.reply('❌ Kamu terlalu sering pakai command. Kamu diblokir!');
    }

    if (!text.startsWith(prefix)) return msg.reply('👋 Hai aku Aventabot, ketik !help untuk command!');

    const args = text.slice(prefix.length).split(/ +/);
    const commandName = args.shift().toLowerCase();

    if (commands.has(commandName)) {
        try {
            await commands.get(commandName).execute(msg, args, client, isAdmin);
        } catch (err) {
            console.error(err);
            await msg.reply('❌ Terjadi error saat eksekusi command.');
        }
    } else {
        await msg.reply(`❓ Command *${commandName}* tidak dikenal. Coba !help.`);
    }
});

client.initialize();