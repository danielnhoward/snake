class Game {
    constructor(canvasClass, gameSpeed, gameSize, id) {
        this.game = {
            players: [],
            food: []
        };
        this.serverGame = {
            players: [],
            food: []
        };
        this.canvasClass = canvasClass; 
        this.settings = new Settings();
        this.gameSpeed = gameSpeed;
        this.gameSize = gameSize;
        this.recivedData = false;
        this.id = id;
        this.vel = veloceties(this.gameSize);
        this.run();
        // requestAnimationFrame(this.runFrames.bind(this));
    };

    gameUpdate(canvas)  {
        this.game = canvas;
        this.serverGame = canvas;
        this.recivedData = true;
    };

    run() {
        let move = true;
        if (this.recivedData) {
            move = false;
            this.recivedData = false;
        };
        Object.keys(this.game.players).forEach((playerId) => {
            let player = this.game.players[playerId];
            if (player.vel.x == 0 && player.vel.y == 0) return;
            let snake, ld;
            if (move) {
                let x = moveSnake(player.snake, player.vel, this.game.food, player.lengthDebt);
                snake = x.snake;
                ld = x.ld;
            }
            else {
                snake = player.snake;
                ld = player.lengthDebt;
            }
            this.game.players[playerId] = {snake: snake, vel: player.vel, lengthDebt: ld};
        });
        this.canvasClass.drawGame(this.game);
        this.serverGame = this.game;
    };

    // runFrames(time) {
    //     if (!this.prev) this.prev = time;
    //     const delta = time - this.prev;
    //     Object.keys(this.serverGame.players).forEach((playerId) => {
    //         let player = this.serverGame.players[playerId];
    //         if (player.vel.x == 0 && player.vel.y == 0) return;
    //         this.serverGame.players[playerId] = {snake: moveSnakeFrame(player.snake, delta, this.gameSpeed), vel: player.vel, lengthDebt: 0};
    //     });
    //     this.prev = time;
    //     // this.canvasClass.drawGame(this.serverGame);
    //     requestAnimationFrame(this.runFrames.bind(this));
    // };

    // setVel(vel) {
    //     this.serverGame.players.forEach((player, index) => {
    //         if (player.snake[0].id == this.id) return this.serverGame.players[index].vel = this.vel[vel];
    //     });
    // };
};

function moveSnake(player, vel, food, ld, onEat) {
    if (vel.x == 0 && vel.y == 0) return;
    player.turning = false;
    player.unshift({x:player[0].x + vel.x, y:player[0].y + vel.y, name: player[0].name, vel: vel, id: player[0].id, position: {x:player[0].x + vel.x, y:player[0].y + vel.y}});
    if (player[0].x == food[0].x && player[0].y == food[0].y) {
        ld++;
    };
    if (ld == 0) {
        player.pop();
    }
    else {
        ld--;
    };
    return {
        snake: player,
        ld: ld
    };
};

function moveSnakeFrame(player, delta, gameSpeed) {
    player.forEach((part, index) => {
        if (index == 0 || index == player.length - 1) {
            player[index] = {x:part.x + ((delta / gameSpeed) * part.vel.x), y: part.y + ((delta / gameSpeed) * part.vel.y), name: part.name, vel: part.vel, id: part.id, position: {x: part.x + ((delta / gameSpeed) * part.vel.x), y: part.y + ((delta / gameSpeed) * part.vel.y)}};
        }
        else {
            let differences = {
                before: {
                    x: part.position.x - player[index - 1].x,
                    y: part.position.y - player[index - 1].y
                },
                after: {
                    x: part.position.x - player[index + 1].x,
                    y: part.position.y - player[index + 1].y
                }
            };
            if (differences.before.x == differences.after.x || differences.before.y == differences.after.y) {
                player[index] = {x:part.x + ((delta / gameSpeed) * part.vel.x), y: part.y + ((delta / gameSpeed) * part.vel.y), name: part.name, vel: part.vel, id: part.id, position: {x: part.x + ((delta / gameSpeed) * part.vel.x), y: part.y + ((delta / gameSpeed) * part.vel.y)}};
            }
            else {
                player[index] = part;
            };
        };
    });
    return player;
};