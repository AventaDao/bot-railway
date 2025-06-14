const { getCoin } = require('../coins/coinManager');

module.exports = {
    name: 'wallet',
    description: 'Lihat saldo wallet',
    async execute(message) {
        const userId = message.from;
        const coins = getCoin(userId);
        await message.reply(`💼 Saldo wallet kamu: ${coins} coin`);
    }
};