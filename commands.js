const Game = require('./gameClass.js');
let games = {};
const veloceties = (size) => {
    return {
        up: {
            x:0,
            y:-size
        },
        down: {
            x:0,
            y:size
        },
        left: {
            x:-size,
            y:0
        },
        right: {
            x:size,
            y:0
        }
    };
};

module.exports = {
    commands: {
        snakeJoin(body, emit, id) {
            if (!(body in games)) return emit('redirect', '/?b');
            emit('gameExists', games[body].blockSize);
        },
        snakeJoinWithName(body, emit, id) {
            if (!(body.gameId in games)) return emit('redirect', '/?c');
            if (games[body.gameId].playerIds.includes(id)) return emit('redirect', '/?d');
            games[body.gameId].addPlayer(id, emit, body.name, body.settings);
        },
        playerDisconnect(body, emit, id) {
            if (!(body in games)) return;
            games[body].playerDisconnect(id);
        },
        snakeRejoin(body, emit, id) {
            if (!(body in games)) return emit('redirect', '/?c');
            games[body].rejoin(id);
        },
        snakeMove(body, emit, id) {
            const size = games[body.gameId].blockSize;
            games[body.gameId].players.forEach((player, index) => {
                if (player.id == id) {
                    if (!games[body.gameId].players[index].snake.turning) {
                        games[body.gameId].resetTimeout();
                        games[body.gameId].players[index].snake.turning = true;
                        if (player.snake.velocety.x != veloceties(size)[body.dir].x && player.snake.velocety.y != veloceties(size)[body.dir].y) games[body.gameId].players[index].snake.velocety = veloceties(size)[body.dir];
                    };
                };
            });
        }
    },
    makeSnakeGame(speed, size) {
        const gameId = makeId();
        games[gameId] = new Game('snake', speed, () => {delete games[gameId]}, size);
        return gameId;
    },
    getGamesList() {
        return games;
    }
};

function makeId() {
    let id = '', run = true;
    while (id in games || run) {
        run = false;
        id = Math.round(Math.random() * 10000);
    }
    return id.toLocaleString('en-US', {minimumIntegerDigits: 4, useGrouping:false});
}