module.exports = class {
    constructor(gameType, gameSpeed, onTimeout, blockSize, startLength, setOwner, foodCount) {
        this.type = gameType;
        this.players = {};
        this.playerIds = [];
        this.spectators = {};
        this.playerCount = 0;
        this.blockSize = blockSize;
        this.gameSpeed = gameSpeed;
        this.startLength = startLength;
        this.settings = {};
        this.foodCount = foodCount;
        this.canvas = {
            players: {},
            food: []
        };
        this.ignorePlayers = [];
        // this.food = new Food(this.canvas, blockSize);

        this.food = [];
        for (let i = 0; i < this.foodCount; i++) {
            this.food.push(new Food(this.canvas, blockSize, () => delete this.food[i]));
        };

        this.running = false;
        this.onTimeout = onTimeout;
        this.setOwner = setOwner;
        this.resetTimeout();
    };
    getAllFood() {
        let foodArr = [];
        this.food.forEach((food) => {
            foodArr.push(food.food[0]);
        });
        return foodArr;
    };
    resetTimeout() {
        if (this.timeout) clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
            this.allEmit('redirect', '/?c');
            this.onTimeout();
        }, 300000);
    };
    allEmit(func, data) {
        let args = [];
        for (let i = 1; i < arguments.length; i++) {
            args.push(arguments[i]);
        };
        Object.keys(this.players).forEach((playerId) => {
            if (this.ignorePlayers.includes(playerId)) return;
            this.players[playerId].socket.emit(func, ...args);
        });
        Object.keys(this.spectators).forEach((playerId) => {
            this.spectators[playerId].socket.emit(func, ...args);
        });
        this.ignorePlayers = [];
    };
    aliveEmit(func, data) {
        let args = [];
        for (let i = 1; i < arguments.length; i++) {
            args.push(arguments[i]);
        };
        Object.keys(this.players).forEach((playerId) => {
            this.players[playerId].socket.emit(func, ...args);
        });
    };
    specEmit(func, data) {
        let args = [];
        for (let i = 1; i < arguments.length; i++) {
            args.push(arguments[i]);
        };
        Object.keys(this.spectators).forEach((playerId) => {
            this.spectators[playerId].socket.emit(func, ...args);
        });
    };
    addPlayer(id, socket, name, settings) {
        if (Object.keys(this.players).length == 0) this.run();
        this.players[id] = {
            id: id,
            socket: socket,
            emit: socket.emit,
            name: name,
            settings: settings,
            snake: new Snake(settings, this.canvas, () => {this.playerDie(id)}, id, this.blockSize, name, this.startLength, () => socket.emit('foodEat'), () => {socket.emit('over')})
        };
        this.playerIds.push(id);
        this.playerCount = Object.keys(this.players).length;
        this.settings[id] = {
            head: settings.head,
            tail: settings.tail,
            body: settings.straight,
            corner: settings.corner
        };
        this.updatePlayers = true;
        this.allEmit('playerCount', this.playerCount);
        socket.emit('initImages', this.settings, this.timming);
        this.allEmit('setImage', id, {head: settings.head, tail: settings.tail, body: settings.straight, corner: settings.corner});
        if (!this.ownerId) {
            this.ownerId = id;
            this.setOwner(name);
        };
    };
    playerDisconnect(id) {
        delete this.players[id];
        this.updatePlayers = true;
        delete this.playerIds[this.playerIds.indexOf(id)];
        this.playerCount = Object.keys(this.players).length;
        this.allEmit('playerCount', this.playerCount);
        if (this.playerCount == 0) {
            clearInterval(this.interval);
            this.running = false;
        };
    };
    playerDie(id) {
        this.players[id].socket.emit('snakeDeath');
        this.updatePlayers = true;
        this.spectators[id] = this.players[id];
        delete this.players[id];
        this.playerCount = Object.keys(this.players).length;
        delete this.playerIds[this.playerIds.indexOf(id)];
        this.allEmit('playerCount', this.playerCount);
        if (this.playerCount == 0) {
            clearInterval(this.interval);
            this.running = false;
        };
    };
    run() {
        this.timming = Date.now();
        this.allEmit('newTimming', this.timming);
        this.running = true;
        this.updatePlayers = true;
        this.interval = setInterval(() => {
            this.canvas = {
                players: {},
                food: []
            };
            let redraw = [];
            Object.keys(this.players).forEach((playerId) => {
                this.players[playerId].snake.moveSnake(this.food);
            });
            Object.keys(this.players).forEach(((playerId) => {
                let player = this.players[playerId];
                if (player.snake.velocety.x == 0 && player.snake.velocety.y == 0) return;
                if (player.snake.gameEnded()) return player.snake.onDie();
                let collisionCanvas = [];
                Object.keys(this.players).forEach((innerPlayerId) => {
                    let innerPlayer = this.players[innerPlayerId];
                    if (innerPlayer.snake.velocety.x == 0 && innerPlayer.snake.velocety.y == 0) return;
                    let snake = innerPlayer.snake.snake;
                    if (playerId != innerPlayerId) collisionCanvas = [...collisionCanvas, ...snake];
                });
                collisionCanvas.forEach((part) => {
                    if (player.snake.snake[0].x == part.x && player.snake.snake[0].y == part.y) {
                        this.players[part.id].snake.addLength(player.snake.snake.length * player.snake.lengthDebt);
                        return player.snake.onDie();
                    };
                });
            }).bind(this));
            Object.keys(this.players).forEach((playerId) => {
                let player = this.players[playerId];
                this.canvas.players = {...this.canvas.players, [playerId]: {snake: player.snake.snake, vel: player.snake.velocety, lengthDebt: player.snake.lengthDebt}};
                this.food.forEach((food, foodIndex) => {
                    if (player.snake.snake[0].x == food.food[0].x && player.snake.snake[0].y == food.food[0].y) redraw.push(foodIndex);
                });
            });
            if (redraw.length != 0) {
                redraw.forEach((food) => {
                    this.food[food].redraw(this.canvas);
                });
                this.updatePlayers = true;
            };
            this.canvas.food = this.getAllFood();

            if (this.updatePlayers) {
                this.allEmit('snakePing', this.canvas);
                this.updatePlayers = false;
            };

            Object.keys(this.players).forEach((playerId) => {
                let player = this.players[playerId];
                player.socket.emit('render', player.snake.snake.length);
            });
            this.specEmit('render', 'Dead');
        }, this.gameSpeed);
    };
    rejoin(id) {
        this.updatePlayers = true;
        if (Object.keys(this.players).length == 0) this.run();
        let player = this.spectators[id];
        this.players[id] = {
            id: player.id,
            socket: player.socket,
            emit: player.emit,
            name: player.name,
            settings: player.settings,
            snake: new Snake(player.settings, this.canvas, () => {this.playerDie(player.id)}, id, this.blockSize, player.name, this.startLength, () => player.socket.emit('foodEat'))
        };
        this.playerCount = Object.keys(this.players).length;
        this.allEmit('playerCount', this.playerCount);
        delete this.spectators[id];
    };
};

class Snake {
    constructor(settings, initCanvas, onDie, id, blockSize, name, startLength, foodEat, error) {
        this.settings = settings;
        this.onDie = onDie;
        this.foodEat = foodEat;
        this.error = error;
        this.turning = false;
        this.velocety = {x: 0, y: 0};
        this.id = id;
        this.lengthDebt = 0;
        this.blockSize = blockSize;
        this.name = name;
        this.startLength = startLength;
        this.initSnake(initCanvas);
    };
    initSnake(initCanvas) {
        try {
            this.snake = [{x: Math.round((Math.round(Math.random() * 700))/this.blockSize) * this.blockSize, y: Math.round((Math.round(Math.random() * 700))/this.blockSize) * this.blockSize, name: this.name, vel: {x: this.blockSize, y:0}, id: this.id, position: {}}];
            this.snake[0].position.x = this.snake[0].x;
            this.snake[0].position.y = this.snake[0].y;
            this.lengthDebt = this.startLength - 1;
            Object.keys(initCanvas.players).forEach((playerId) => {
                let player = initCanvas.players[playerId];
                player.snake.forEach((part) => {
                    this.snake.forEach((snakePart) => {
                        if (snakePart.x == part.x && snakePart.y == part.y) {
                            return this.initSnake(initCanvas);
                        };
                    });
                });
            });
            initCanvas.food.forEach((food) => {
                this.snake.forEach((snakePart) => {
                    if (snakePart.x == food.x && snakePart.y == food.y) {
                        return this.initSnake(initCanvas);
                    };
                });
            });
        }
        catch(err) {
            console.log(0)
            this.error();
        };
    };
    moveSnake(food) {
        this.turning = false;
        if (this.velocety.x == 0 && this.velocety.y == 0) return;
        this.snake.unshift({x:this.snake[0].x + this.velocety.x, y:this.snake[0].y + this.velocety.y, name: this.name, vel: this.velocety, id: this.id, position: {x:this.snake[0].x + this.velocety.x, y:this.snake[0].y + this.velocety.y}});
        food.forEach((food) => {
            if (this.snake[0].x == food.food[0].x && this.snake[0].y == food.food[0].y) {
                this.lengthDebt++;
                this.foodEat();
            };
        });
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
    constructor(initCanvas, blockSize, onError) {
        this.blockSize = blockSize;
        this.onError = onError;
        this.redraw(initCanvas);
    };
    redraw(canvas) {
        try {
            this.food = [{x: Math.round((Math.round(Math.random() * (1000 - this.blockSize)))/this.blockSize) * this.blockSize, y: Math.round((Math.round(Math.random() * (1000 - this.blockSize)))/this.blockSize) * this.blockSize}];
            Object.keys(canvas.players).forEach((playerId) => {
                let player = canvas.players[playerId];
                player.snake.forEach((part) => {
                    if (this.food[0].x == part.x && this.food[0].y == part.y) {
                        return this.redraw(canvas);
                    };
                });
            });
        }
        catch(err) {
            this.onError();
        };
    };
};