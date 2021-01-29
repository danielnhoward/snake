const Game = require('./gameClass.js');
let games = {};
const veloceties = {
    up: {
        x:0,
        y:-40
    },
    down: {
        x:0,
        y:40
    },
    left: {
        x:-40,
        y:0
    },
    right: {
        x:40,
        y:0
    }
};

module.exports = {
    commands: {
        snakeJoin(body, emit, id) {
            if (!(body in games)) return emit('redirect');
            emit('gameExists', body);
        },
        snakeJoinWithName(body, emit, id) {
            games[body.gameId].addPlayer(id, emit, body.name, body.settings);
        },
        playerDisconnect(body, emit, id) {
            games[body].playerDisconnect(id);
        },
        snakeRejoin(body, emit, id) {
            games[body].rejoin(id);
        },
        snakeUp(body, emit, id) {
            games[body].players.forEach((player, index) => {
                if (player.id == id) {
                    if (!games[body].players[index].snake.turning) {
                        games[body].players[index].snake.turning = true;
                        if (games[body].players[index].snake.velocety != veloceties.down) games[body].players[index].snake.velocety = veloceties.up;
                    };
                };
            });
        },
        snakeDown(body, emit, id) {
            games[body].players.forEach((player, index) => {
                if (player.id == id) {
                    if (!games[body].players[index].snake.turning) {
                        games[body].players[index].snake.turning = true;
                        if (games[body].players[index].snake.velocety != veloceties.up) games[body].players[index].snake.velocety = veloceties.down;
                    };
                };
            });
        },
        snakeLeft(body, emit, id) {
            games[body].players.forEach((player, index) => {
                if (player.id == id) {
                    if (!games[body].players[index].snake.turning) {
                        games[body].players[index].snake.turning = true;
                        if (games[body].players[index].snake.velocety != veloceties.right) games[body].players[index].snake.velocety = veloceties.left;
                    };
                };
            });
        },
        snakeRight(body, emit, id) {
            games[body].players.forEach((player, index) => {
                if (player.id == id) {
                    if (!games[body].players[index].snake.turning) {
                        games[body].players[index].snake.turning = true;
                        if (games[body].players[index].snake.velocety != veloceties.left) games[body].players[index].snake.velocety = veloceties.right;
                    };
                };
            });
        }
    },
    makeSnakeGame(speed) {
        const gameId = makeId();
        games[gameId] = new Game('snake', speed);
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
    return id;
}