const { getCoin } = require('../coins/coinManager');

module.exports = {
    name: 'coin',
    description: 'Cek jumlah koin kamu',
    async execute(message) {
        const userId = message.from;
        const coins = getCoin(userId);
        await message.reply(`💰 Koin kamu saat ini: ${coins}`);
    }
};