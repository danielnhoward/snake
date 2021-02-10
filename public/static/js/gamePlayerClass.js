class Game {
    constructor(canvasClass, gameSpeed, gameSize, id) {
        this.game = {
            players: [],
            food: []
        };
        this.canvasClass = canvasClass; 
        this.settings = getConfig();
        this.gameSpeed = gameSpeed;
        this.gameSize = gameSize;
        this.recivedData = false;
        this.id = id;
        this.vel = veloceties(this.gameSize);
        this.gameChanged = true;
        this.run();
    };

    gameUpdate(canvas)  {
        this.game = canvas;
    };

    run() {
        if (!this.game) return;
        let move = false;
        if (this.recivedData) {
            move = true;
            this.recivedData = false;
        };
        this.game.players.forEach((player, index) => {
            if (player.vel.x == 0 && player.vel.y == 0) return;
            let snake, ld;
            if (move) {
                snake = player.snake;
                ld = player.lengthDebt;
            }
            else {
                let x = moveSnake(player.snake, player.vel, this.game.food, player.lengthDebt);
                snake = x.snake;
                ld = x.ld;
            }
            this.game.players[index] = {snake: snake, vel: player.vel, lengthDebt: ld};
        });
        this.canvasClass.drawGame(this.game);
    };

    runFrames() {
        
    };

    setVel(vel) {
        this.game.players.forEach((player, index) => {
            if (player[0].id == this.id) return this.game.players[index].vel = this.vel[vel];
        });
    };
};

function moveSnake(player, vel, food, ld) {
    if (vel.x == 0 && vel.y == 0) return;
    player.turning = false;
    player.unshift({x:player[0].x + vel.x, y:player[0].y + vel.y, name: player[0].name, vel: vel, id: player[0].id, position: {x:player[0].x + vel.x, y:player[0].y + vel.y}});
    if (player[0].x == food[0].x && player[0].y == food[0].y) ld++;
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