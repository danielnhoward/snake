class Snake {
    constructor(id, startLength, blockSize, settings, scoreId, timeId) {
        this.canvas = document.getElementById(id);
        this.ctx = this.canvas.getContext('2d');
        this.id = id;
        this.startLength = startLength;
        this.settings = settings;
        this.snake = [{x:this.canvas.width / 2 - (startLength * blockSize), y:this.canvas.height / 2}];
        this.food = {x:0, y:0};
        this.velocety = {x:0, y:0};
        this.blockSize = blockSize;
        this.changingDirection = false;
        this.score = 0;
        this.scoreId = scoreId;
        this.timeId = timeId;
        this.running = false;
        this.ready = false;
        this.init();
    }
    async start() {
        this.ready = false;
        this.running = true;
        this.velocety.x = this.blockSize;
        document.addEventListener('keydown', this.keyPress.bind(this));
        this.interval = setInterval(() => {
            this.intervalRunning = true;
            if (!this.running) return;
            if (this.gameEnded()) {
                if (this.intervalRunning) {
                    clearInterval(this.interval);
                    this.intervalRunning = false;
                }
                this.running = false;
                this.ready = false;
                Swal.fire({
                    html: `<div style="font-size: large; color: white;"><b>You lost!</b></div><br><div style="font-size: small; color: light-grey;">Your score was ${this.score}<br>You lasted for</div><br><large style="font-size: large;">Would you like to play again?</large><br><br><button type="button" class="swal2-confirm swal2-styled" style="display: inline-block; border: none;" aria-label="" onclick="Swal.close(); snake.restart();">Yes</button><button type="button" class="swal2-confirm swal2-styled" style="display: inline-block; border: none;" aria-label="" onclick="Swal.close();">No</button>`,
                    showConfirmButton: false
                });
            };
            this.changingDirection = false;
            this.clearCanvas();
            this.advanceSnake();
            this.drawSnake();
            this.drawFood();
        }, this.settings.gameSpeed);
    };
    random(min, max) {
        return Math.round(Math.random() * (max-min) + min);
    };
    clearCanvas() {
        this.ctx.fillStyle = this.settings.canvasBackgroundColour;
        this.ctx.strokeStyle = this.settings.canvasBorderColour;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.strokeRect(0, 0, this.canvas.width, this.canvas.height);
    };
    drawFood() {
        this.ctx.fillStyle = this.settings.foodColour;
        this.ctx.strokeStyle = this.settings.foodBorderColour;
        this.ctx.fillRect(this.food.x, this.food.y, this.blockSize, this.blockSize);
        this.ctx.strokeRect(this.food.x, this.food.y, this.blockSize, this.blockSize);
    };
    createFood() {
        this.food.x = Math.round(this.random(0, this.canvas.width - this.blockSize)/this.blockSize) * this.blockSize;
        this.food.y = Math.round(this.random(0, this.canvas.height - this.blockSize)/this.blockSize) * this.blockSize;
        this.snake.forEach((part) => {
            if (part.x === this.food.x && part.y === this.food.y) this.createFood();
        });
    };
    drawSnake() {
        this.ctx.fillStyle = this.settings.snakeColour;
        this.ctx.strokeStyle = this.settings.snakeBorderColour;
        this.snake.forEach((part) => {
            this.ctx.fillRect(part.x, part.y, this.blockSize, this.blockSize);
            this.ctx.strokeRect(part.x, part.y, this.blockSize, this.blockSize);
        });
    };
    advanceSnake() {
        this.snake.unshift({x:this.snake[0].x + this.velocety.x, y:this.snake[0].y + this.velocety.y});
        if (this.snake[0].x === this.food.x && this.snake[0].y === this.food.y) {
            this.addScore(10);
            this.createFood();
        }
        else {
            this.snake.pop();
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
            rightWall: this.snake[0].x > this.canvas.width - this.blockSize,
            topWall: this.snake[0].y < 0,
            bottomWall: this.snake[0].y > this.canvas.height - this.blockSize
        };
        return hits.leftWall || hits.rightWall || hits.topWall || hits.bottomWall;
    };
    keyPress(event) {
        if (this.changingDirection) {
            return;
        };
        this.changingDirection = true;
        if (event.keyCode == this.settings.up && this.velocety.y != 10) {
            this.velocety =  {
                x:0,
                y:-10
            };
        }
        else if (event.keyCode == this.settings.down && this.velocety.y != -10) {
            this.velocety =  {
                x:0,
                y:10
            };
        }
        else if (event.keyCode == this.settings.left && this.velocety.x != 10) {
            this.velocety =  {
                x:-10,
                y:0
            };
        }
        else if (event.keyCode == this.settings.right && this.velocety.x != -10) {
            this.velocety =  {
                x:10,
                y:0
            };
        };
    };
    addScore(amount) {
        this.score += amount;
        document.getElementById(this.scoreId).innerHTML = this.score;
    }
    init() {
        this.ready = true;
        for (let x = 1; x < this.startLength; x++) {
            this.snake.unshift({x:this.snake[this.snake.length - 1].x + this.blockSize * x, y:this.snake[this.snake.length - 1].y});
        };
        this.clearCanvas();
        this.createFood();
        this.drawFood();
        this.drawSnake();
        document.addEventListener('keydown', (ev) => {
            if (this.ready) {
                this.start();
                this.keyPress(ev);
            };
        });
    }
    restart() {
        if (this.intervalRunning) {
            clearInterval(this.interval);
            this.intervalRunning = false;
        }
        this.snake = [{x:this.canvas.width / 2 - (this.startLength * this.blockSize), y:this.canvas.height / 2}];
        this.food = {x:0, y:0};
        this.velocety = {x:0, y:0};
        this.score = 0;
        this.init();
    }
    setState(state) {
        this.running = state;
    }
}