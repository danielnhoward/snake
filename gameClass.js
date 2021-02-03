module.exports = class {
    constructor(gameType, gameSpeed, onTimeout, blockSize) {
        this.type = gameType;
        this.players = [];
        this.playerIds = [];
        this.spectators = [];
        this.playerCount = 0;
        this.blockSize = blockSize;
        this.gameSpeed = gameSpeed;
        this.canvas = {
            players: [],
            food: []
        };
        this.food = new Food(this.canvas, blockSize);
        this.running = false;
        this.onTimeout = onTimeout;
        this.resetTimeout();
    };
    resetTimeout() {
        if (this.timeout) clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
            this.allEmit('redirect', '/?c');
            this.onTimeout();
        }, 300000);
    };
    allEmit(func, data) {
        this.players.forEach((el) => {
            el.emit(func, data);
        });
        this.spectators.forEach((el) => {
            el.emit(func, data);
        });
    };
    aliveEmit(func, data) {
        this.players.forEach((el) => {
            el.emit(func, data);
        });
    };
    specEmit(func, data) {
        this.spectators.forEach((el) => {
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
            snake: new Snake(settings, this.canvas, () => {this.playerDie(id)}, id, this.blockSize, name)
        });
        this.playerIds.push(id);
        this.playerCount = this.players.length;
        this.allEmit('playerCount', this.playerCount);
    };
    playerDisconnect(id) {
        this.players.forEach((player, index) => {
            if (player.id == id) {
                this.players = this.players.filter((value, filterIndex) => {
                    return filterIndex != index;
                });
                this.playerCount = this.players.length;
                this.allEmit('playerCount', this.playerCount);
            };
        });
        if (this.players.length == 0) {
            clearInterval(this.interval);
            this.running = false;
        };
    };
    playerDie(id) {
        this.players.forEach((player, index) => {
            if (player.id == id) {
                player.emit('snakeDeath');
                this.spectators.push(player);
                this.players = this.players.filter((value, filterIndex) => {
                    return filterIndex != index;
                });
                this.playerCount = this.players.length;
                this.allEmit('playerCount', this.playerCount);
            };
        });
        if (this.players.length == 0) {
            clearInterval(this.interval);
            this.running = false;
        };
    };
    run() {
        this.running = true;
        this.interval = setInterval(() => {
            this.canvas = {
                players: [],
                food: []
            };
            let redraw = false
            for (const player of this.players) {
                player.snake.moveSnake(this.food);
            };
            this.players.forEach(((player, index, players) => {
                if (player.snake.velocety.x == 0 && player.snake.velocety.y == 0) return;
                if (player.snake.gameEnded()) return player.snake.onDie();
                let collisionCanvas = [];
                players.forEach((el, innerIndex) => {
                    if (el.snake.velocety.x == 0 && el.snake.velocety.y == 0) return;
                    let snake = el.snake.snake;
                    for (let i in snake) {
                        snake[i].owner = innerIndex;
                    };
                    if (innerIndex != index) collisionCanvas = [...collisionCanvas, ...snake];
                });
                for (const el of collisionCanvas) {
                    if (player.snake.snake[0].x == el.x && player.snake.snake[0].y == el.y) {
                        this.players[el.owner].snake.addLength(player.snake.snake.length);
                        return player.snake.onDie();
                    }
                };
            }).bind(this));
            for (const player of this.players) {
                this.canvas.players = [...this.canvas.players, ...player.snake.snake];
                if (player.snake.snake[0].x == this.food.food[0].x && player.snake.snake[0].y == this.food.food[0].y) redraw = true;
            };
            if (redraw) this.food.redraw(this.canvas);
            this.canvas.food = this.food.food;
            this.allEmit('snakePing', this.canvas);

            this.players.forEach((player) => {
                player.emit('playerSize', player.snake.snake.length);
            });
        }, this.gameSpeed);
    };
    rejoin(id) {
        this.spectators.forEach((player, index) => {
            if (player.id == id) {
                this.spectators = this.spectators.filter((value, filterIndex) => {
                    return filterIndex != index;
                });
                if (this.players.length == 0) this.run();
                this.players.push({
                    id: player.id,
                    emit: player.emit,
                    name: player.name,
                    settings: player.settings,
                    snake: new Snake(player.settings, this.canvas, () => {this.playerDie(player.id)}, id, this.blockSize, player.name)
                });
                this.playerCount = this.players.length;
                this.allEmit('playerCount', this.playerCount);
            };
        })
    };
};

class Snake {
    constructor(settings, initCanvas, onDie, id, blockSize, name) {
        this.settings = settings;
        this.onDie = onDie;
        this.turning = false;
        this.velocety = {x: 0, y: 0};
        this.id = id;
        this.lengthDebt = 0;
        this.blockSize = blockSize;
        this.name = name;
        this.initSnake(initCanvas);
    };
    initSnake(initCanvas) {
        this.snake = [{x: Math.round((Math.round(Math.random() * 700))/this.blockSize) * this.blockSize, y: Math.round((Math.round(Math.random() * 700))/this.blockSize) * this.blockSize, colour: {border: this.settings.snakeBorderColour, body: this.settings.snakeColour}, name: this.name}];
        for (let x = 1; x < 3; x++) {
            this.snake.unshift({x:this.snake[this.snake.length - 1].x + this.blockSize * x, y:this.snake[this.snake.length - 1].y, colour: {border: this.settings.snakeBorderColour, body: this.settings.snakeColour}, name: this.name});
        };
        for (const part of initCanvas.players) {
            for (const snakePart of this.snake) {
                if (snakePart.x == part.x && snakePart.y == part.y) {
                    return this.initSnake(initCanvas);
                };
            };
        };
        for (const part of initCanvas.food) {
            for (const snakePart of this.snake) {
                if (snakePart.x == part.x && snakePart.y == part.y) {
                    return this.initSnake(initCanvas);
                };
            };
        };
    };
    moveSnake(food) {
        this.turning = false;
        if (this.velocety.x == 0 && this.velocety.y == 0) return;
        this.snake.unshift({x:this.snake[0].x + this.velocety.x, y:this.snake[0].y + this.velocety.y, colour: {border: this.settings.snakeBorderColour, body: this.settings.snakeColour}, name:this.name});
        if (this.snake[0].x == food.food[0].x && this.snake[0].y == food.food[0].y) this.lengthDebt++;
        if (this.lengthDebt == 0) {
            this.snake.pop();
        }
        else {
            this.lengthDebt--;
        };
    };
    gameEnded() {
        for (let i = 1; i < this.snake.length; i++) {
            if (this.snake[i].x === this.snake[0].x && this.snake[i].y === this.snake[0].y) {
                return true;
            };
        };
        const hits = {
            leftWall: this.snake[0].x < 0,
            rightWall: this.snake[0].x > (1000 - this.blockSize),
            topWall: this.snake[0].y < 0,
            bottomWall: this.snake[0].y > (1000 - this.blockSize)
        };
        return hits.leftWall || hits.rightWall || hits.topWall || hits.bottomWall;
    };
    addLength(amount) {
        this.lengthDebt += amount;
    };
};

class Food {
    constructor(initCanvas, blockSize) {
        this.blockSize = blockSize;
        this.redraw(initCanvas);
    };
    redraw(canvas) {
        this.food = [{x: Math.round((Math.round(Math.random() * 800))/this.blockSize) * this.blockSize, y: Math.round((Math.round(Math.random() * 800))/this.blockSize) * this.blockSize, colour: {border: '#2b9348', body: '#4BB500'}}];
        for (const part of canvas.players) {
            for (const foodPart of canvas.food) {
                if (foodPart.x == part.x && foodPart.y == part.y) {
                    return this.redraw(canvas);
                };
            };
        };
    };
};