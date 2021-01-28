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
            snake: new Snake(settings, this.canvas, () => {this.playerDie(id)})
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
        if (this.players.length == 0) {
            clearInterval(this.interval);
            delete this;
        };
    };
    playerDie(id) {
        this.players.forEach((player, index) => {
            if (player.id == id) {
                player.emit('snakeDeath');
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
                this.canvas = [...this.canvas, ...player.snake.moveSnake()];
            }
            this.emit('snakePing', this.canvas);
        }, this.gameSpeed);
    };
};

class Snake {
    constructor(settings, initCanvas, onDie) {
        this.settings = settings;
        this.onDie = onDie;
        this.velocety = {x: 40, y: 0};
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
    moveSnake() {
        if (this.gameEnded()) {
            this.onDie();
            return [];
        };
        this.snake.unshift({x:this.snake[0].x + this.velocety.x, y:this.snake[0].y + this.velocety.y, colour: {border: this.settings.snakeBorderColour, body: this.settings.snakeColour}});
        this.snake.pop();
        return this.snake;
    };
    gameEnded() {
        for (let i = 1; i < this.snake.length; i++) {
            if (this.snake[i].x === this.snake[0].x && this.snake[i].y === this.snake[0].y) {
                return true;
            };
        };
        const hits = {
            leftWall: this.snake[0].x < 0,
            rightWall: this.snake[0].x > 960,
            topWall: this.snake[0].y < 0,
            bottomWall: this.snake[0].y > 960
        };
        return hits.leftWall || hits.rightWall || hits.topWall || hits.bottomWall;
    };
}