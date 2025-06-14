const fs = require('fs');
const path = './data/coinData.json';

function loadCoins() {
    if (!fs.existsSync(path)) fs.writeFileSync(path, '{}');
    return JSON.parse(fs.readFileSync(path, 'utf8'));
}

function saveCoins(data) {
    fs.writeFileSync(path, JSON.stringify(data, null, 2));
}

function getCoin(userId) {
    const coins = loadCoins();
    return coins[userId] || 0;
}

function addCoin(userId, amount) {
    const coins = loadCoins();
    coins[userId] = (coins[userId] || 0) + amount;
    saveCoins(coins);
}

module.exports = { getCoin, addCoin };