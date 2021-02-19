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
        snakeJoin([gameId], emit, id) {
            if (!(gameId in games)) return emit('redirect', '/?b');
            emit('gameExists', games[gameId].blockSize, games[gameId].gameSpeed);
        },
        snakeJoinWithName([gameId, name, settings], emit, id) {
            if (!(gameId in games)) return emit('redirect', '/?c');
            if (games[gameId].playerIds.includes(id)) return emit('redirect', '/?d');
            games[gameId].addPlayer(id, emit, name.substring(0, 10), settings);
        },
        playerDisconnect([gameId], emit, id) {
            if (!(gameId in games)) return;
            games[gameId].playerDisconnect(id);
        },
        snakeRejoin([gameId], emit, id) {
            if (!(gameId in games)) return emit('redirect', '/?c');
            games[gameId].rejoin(id);
        },
        snakeMove([gameId, dir], emit, id) {
            const size = games[gameId].blockSize;
            games[gameId].players.forEach((player, index) => {
                if (player.id == id) {
                    if (!games[gameId].players[index].snake.turning) {
                        games[gameId].resetTimeout();
                        games[gameId].players[index].snake.turning = true;
                        if (player.snake.velocety.x != veloceties(size)[dir].x && player.snake.velocety.y != veloceties(size)[dir].y) games[gameId].players[index].snake.velocety = veloceties(size)[body.dir];
                        else if (player.snake.velocety.x == 0 && player.snake.velocety.y == 0 && dir != 'left') games[gameId].players[index].snake.velocety = veloceties(size)[dir];
                        games[gameId].updatePlayers = true;
                    };
                };
            });
        }
    },
    makeSnakeGame(speed, size, startLength) {
        const gameId = makeId();
        games[gameId] = new Game('snake', speed, () => {delete games[gameId]}, size, startLength);
        return gameId;
    },
    getGamesList() {
        return games;
    }
};