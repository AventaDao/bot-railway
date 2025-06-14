module.exports = {
    name: 'help',
    description: 'Menampilkan daftar perintah',
    async execute(message) {
        await message.reply(`📜 Daftar Command:\n!help\n!coin\n!wallet\n!info`);
    }
};