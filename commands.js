const Game = require('./gameClass.js');
let games = {};

module.exports = {
    commands: {

    },
    makeSnakeGame: () => {
        const gameId = makeId();
        games[gameId] = new Game('snake');
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