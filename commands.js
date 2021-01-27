const Game = require('./gameClass.js');
let games = {};

module.exports = {
    commands: {
        snakeJoin(body, emit, id) {
            if (!(body in games)) return emit('redirect');
            emit('gameExists');
        },
        snakeJoinWithName(body, emit, id) {
            games[body.gameId].addPlayer(id, emit, body.name);
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