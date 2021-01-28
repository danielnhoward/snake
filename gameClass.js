module.exports = class {
    constructor(gameType, gameSpeed) {
        this.type = gameType;
        this.players = [];
        this.playerIds = [];
        this.playerCount = 0;
        this.gameSpeed = gameSpeed;
        this.canvas = [];
    };
    emit(func, data) {
        this.players.forEach((el) => {
            el.emit(func, data);
        });
    };
    addPlayer(id, emit, name, settings) {
        if (this.players.length == 0) this.run();
        this.players.push({
            id: id,
            emit: emit,
            name: name,
            settings: settings,
            snake: new Snake(settings, this.canvas)
        });
        this.playerIds.push = id;
        this.playerCount = this.players.length;
        this.emit('playerCount', this.playerCount);
    };
    playerDisconnect(id) {
        this.players.forEach((player, index) => {
            if (player.id == id) {
                this.players = this.players.filter((value, filterIndex) => {
                    return filterIndex != index;
                });
                this.playerCount = this.players.length;
                this.emit('playerCount', this.playerCount);
            };
        });
    };
    run() {
        this.interval = setInterval(() => {
            this.canvas = [];
            for (const player of this.players) {
                this.canvas = [...this.canvas, ...player.snake.getSnake()];
            }
            this.emit('snakePing', this.canvas);
        }, this.gameSpeed);
    };
};

class Snake {
    constructor(settings, initCanvas) {
        this.settings = settings;
        this.initSnake(initCanvas);
    };
    initSnake(initCanvas) {
        this.snake = [{x: Math.round((Math.round(Math.random() * 800))/40) * 40, y: Math.round((Math.round(Math.random() * 800))/40) * 40, colour: {border: this.settings.snakeBorderColour, body: this.settings.snakeColour}}];
        for (let x = 1; x < 3; x++) {
            this.snake.unshift({x:this.snake[this.snake.length - 1].x + 40 * x, y:this.snake[this.snake.length - 1].y, colour: {border: this.settings.snakeBorderColour, body: this.settings.snakeColour}});
        };
        for (const part of initCanvas) {
            for (const snakePart of this.snake) {
                if (snakePart.x == part.x && snakePart.y == part.y) {
                    return initCanvas();
                };
            };
        };
    };
    getSnake() {
        return this.snake;
    };
}