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
        snakeUp(body, emit, id) {
            let size = games[body].blockSize;
            games[body].players.forEach((player, index) => {
                if (player.id == id) {
                    games[body].resetTimeout();
                    if (!games[body].players[index].snake.turning) {
                        games[body].players[index].snake.turning = true;
                        if (player.snake.velocety.x != veloceties(size).down.x && player.snake.velocety.y != veloceties(size).down.y) games[body].players[index].snake.velocety = veloceties(size).up;
                    };
                };
            });
        },
        snakeDown(body, emit, id) {
            let size = games[body].blockSize;
            games[body].players.forEach((player, index) => {
                if (player.id == id) {
                    games[body].resetTimeout();
                    if (!games[body].players[index].snake.turning) {
                        games[body].players[index].snake.turning = true;
                        if (player.snake.velocety.x != veloceties(size).up.x && player.snake.velocety.y != veloceties(size).up.y) games[body].players[index].snake.velocety = veloceties(size).down;
                    };
                };
            });
        },
        snakeLeft(body, emit, id) {
            let size = games[body].blockSize;
            games[body].players.forEach((player, index) => {
                if (player.id == id) {
                    games[body].resetTimeout();
                    if (!games[body].players[index].snake.turning) {
                        games[body].players[index].snake.turning = true;
                        if (player.snake.velocety.x != veloceties(size).right.x && player.snake.velocety.y != veloceties(size).right.y) games[body].players[index].snake.velocety = veloceties(size).left;
                    };
                };
            });
        },
        snakeRight(body, emit, id) {
            let size = games[body].blockSize;
            games[body].players.forEach((player, index) => {
                if (player.id == id) {
                    games[body].resetTimeout();
                    if (!games[body].players[index].snake.turning) {
                        games[body].players[index].snake.turning = true;
                        if (player.snake.velocety.x != veloceties(size).left.x && player.snake.velocety.y != veloceties(size).left.y) games[body].players[index].snake.velocety = veloceties(size).right;
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