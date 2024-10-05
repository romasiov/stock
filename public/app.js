
let players = [];
let market = {
    blue: [],
    red: [],
    green: []
};

document.getElementById('login-btn').addEventListener('click', loginPlayer);
document.getElementById('sell-btn').addEventListener('click', sellStock);

function loginPlayer() {
    const playerId = document.getElementById('player-select').value;
    document.getElementById('login-section').style.display = 'none';
    document.getElementById('game-section').style.display = 'block';
    document.getElementById('player-id').innerText = playerId;
    loadPlayerData(playerId);
}

function loadPlayerData(playerId) {
    fetch(`/player/${playerId}`)
        .then(response => response.json())
        .then(data => {
            document.getElementById('player-portfolio').innerHTML = '';
            document.getElementById('player-cash').innerText = data.cash;
            for (const color in data.stocks) {
                const li = document.createElement('li');
                li.innerText = `${color} акции: ${data.stocks[color]}`;
                document.getElementById('player-portfolio').appendChild(li);
            }
            loadMarket();
        });
}

function loadMarket() {
    fetch('/market')
        .then(response => response.json())
        .then(data => {
            document.getElementById('market-list').innerHTML = '';
            for (const color in data) {
                data[color].forEach((stock, index) => {
                    const li = document.createElement('li');
                    li.innerHTML = `${color} акция от Игрока ${stock.seller} за $1 <button onclick="buyStock('${color}', ${index})">Купить</button>`;
                    document.getElementById('market-list').appendChild(li);
                });
            }
        });
}

function sellStock() {
    const color = document.getElementById('sell-color').value;
    const amount = parseInt(document.getElementById('sell-amount').value);
    const playerId = document.getElementById('player-id').innerText;
    fetch(`/sell`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ playerId, color, amount })
    })
    .then(() => loadPlayerData(playerId));
}

function buyStock(color, index) {
    const playerId = document.getElementById('player-id').innerText;
    fetch(`/buy`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ playerId, color, index })
    })
    .then(() => loadPlayerData(playerId));
}

fetch('/players')
    .then(response => response.json())
    .then(data => {
        players = data;
        const playerSelect = document.getElementById('player-select');
        players.forEach(player => {
            const option = document.createElement('option');
            option.value = player.id;
            option.innerText = `Игрок ${player.id}`;
            playerSelect.appendChild(option);
        });
    });
