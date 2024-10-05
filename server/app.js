
const express = require('express');
const path = require('path');
const app = express();

// Настройка на обслуживание статических файлов из папки "public"
app.use(express.static(path.join(__dirname, '../public')));

// Маршруты для API запросов
app.get('/players', (req, res) => {
    res.json(players);
});

app.get('/player/:id', (req, res) => {
    const playerId = parseInt(req.params.id);
    const player = players.find(p => p.id === playerId);
    res.json(player);
});

app.get('/market', (req, res) => {
    res.json(market);
});

app.post('/sell', (req, res) => {
    const { playerId, color, amount } = req.body;
    const player = players.find(p => p.id === parseInt(playerId));
    if (player.stocks[color] >= amount) {
        player.stocks[color] -= amount;
        for (let i = 0; i < amount; i++) {
            market[color].push({ seller: playerId });
        }
    }
    res.sendStatus(200);
});

app.post('/buy', (req, res) => {
    const { playerId, color, index } = req.body;
    const player = players.find(p => p.id === parseInt(playerId));
    const stock = market[color][index];
    const seller = players.find(p => p.id === stock.seller);
    if (player.cash >= 1) {
        player.cash -= 1;
        seller.cash += 1;
        player.stocks[color] += 1;
        market[color].splice(index, 1);
    }
    res.sendStatus(200);
});

app.listen(3000, () => {
    console.log('Сервер запущен на порту 3000');
});
