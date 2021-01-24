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
        this.timeElement = document.getElementById(timeId);
        this.running = false;
        this.ready = false;
        this.time = '00:00';
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
                    clearInterval(this.timeInterval);
                    this.intervalRunning = false;
                }
                this.running = false;
                this.ready = false;
                Swal.fire({
                    html: `<div style="font-size: large; color: white;"><b>You lost!</b></div><br><div style="font-size: small; color: light-grey;">Your score was ${this.score}<br>You lasted for ${this.time}</div><br><large style="font-size: large;">Would you like to play again?</large><br><br><button type="button" class="swal2-confirm swal2-styled" style="display: inline-block; border: none;" aria-label="" onclick="Swal.close(); snake.restart();">Yes</button><button type="button" class="swal2-confirm swal2-styled" style="display: inline-block; border: none;" aria-label="" onclick="Swal.close();">No</button>`,
                    showConfirmButton: false
                });
            };
            this.changingDirection = false;
            this.clearCanvas();
            this.advanceSnake();
            this.drawSnake();
            this.drawFood();
        }, this.settings.gameSpeed);
        if (Number.isInteger(parseInt(this.settings.gameTime))) {
            this.timeCount = 0;
            this.timeInterval = setInterval(() => {
                if (this.settings.gameTime <= this.timeCount) {
                    if (this.intervalRunning) {
                        clearInterval(this.interval);
                        clearInterval(this.timeInterval);
                        this.intervalRunning = false;
                    }
                    this.running = false;
                    this.ready = false;
                    Swal.fire({
                        html: `<div style="font-size: large; color: white;"><b>You ran out of time!</b></div><br><div style="font-size: small; color: light-grey;">Your score was ${this.score}<br>You lasted for ${this.time}</div><br><large style="font-size: large;">Would you like to play again?</large><br><br><button type="button" class="swal2-confirm swal2-styled" style="display: inline-block; border: none;" aria-label="" onclick="Swal.close(); snake.restart();">Yes</button><button type="button" class="swal2-confirm swal2-styled" style="display: inline-block; border: none;" aria-label="" onclick="Swal.close();">No</button>`,
                        showConfirmButton: false
                    });
                }
                else {
                    this.timeCount++;
                    let timeGone = new Date(this.timeCount * 1000);
                    this.time = createTime(timeGone.getMinutes(), timeGone.getSeconds());
                    const timer = new Date(this.settings.gameTime * 1000 - this.timeCount * 1000);
                    this.timeElement.innerHTML = createTime(timer.getMinutes(), timer.getSeconds());
                };
            }, 1000);
        }
        else {
            this.timeCount = 0;
            this.timeInterval = setInterval(() => {
                this.timeCount++;
                let timeGone = new Date(this.timeCount * 1000);
                this.time = createTime(timeGone.getMinutes(), timeGone.getSeconds());
                this.timeElement.innerHTML = this.time;
            }, 1000);
        };
        document.addEventListener('touchstart', (ev) => {
            this.touch = {
                x: ev.touches[0].clientX,
                y: ev.touches[0].clientY
            };
        });
        document.addEventListener('touchend', (ev) => {
            if (ev.target.hasAttribute('nontouch')) return;
            this.touchEnd(this.touch, {
                x: ev.changedTouches[0].clientX,
                y: ev.changedTouches[0].clientY
            });
        });
    };
    touchEnd(from, to) {
        const mouseDiff = {
            x: from.x - to.x,
            y: from.y - to.y
        };
        if (Math.abs(mouseDiff.x) > Math.abs(mouseDiff.y)) {
            if (Math.abs(mouseDiff.x) < screenX/10) return;
            if (Math.sign(mouseDiff.x) == 1) {
                this.keyPress({keyCode:this.settings.left});
            }
            else if (Math.sign(mouseDiff.x) == -1) {
                this.keyPress({keyCode:this.settings.right});
            };
        }
        else if (Math.abs(mouseDiff.x) < Math.abs(mouseDiff.y)) {
            if (Math.abs(mouseDiff.y) < screenY/10) return;
            if (Math.sign(mouseDiff.y) == 1) {
                this.keyPress({keyCode:this.settings.up});
            }
            else if (Math.sign(mouseDiff.y) == -1) {
                this.keyPress({keyCode:this.settings.down});
            };
        };
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
            this.addScore(1);
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
        if (Number.isInteger(parseInt(this.settings.gameTime))) {
            const timer = new Date(this.settings.gameTime * 1000);
            this.timeElement.innerHTML = createTime(timer.getMinutes(), timer.getSeconds());
        }
        else {
            this.timeElement.innerHTML = '00:00';
        };
        document.addEventListener('keydown', (ev) => {
            if (this.ready) {
                this.start();
                this.keyPress(ev);
            };
        });
        document.addEventListener('touchstart', (ev) => {
            if (this.ready) {
                document.documentElement.requestFullscreen();
                this.touch = {
                    x: ev.touches[0].clientX,
                    y: ev.touches[0].clientY
                };
            };
        });
        document.addEventListener('touchend', (ev) => {
            if (this.ready) {
                if (ev.target.hasAttribute('nontouch')) return;
                this.start();
                this.touchEnd(this.touch, {
                    x: ev.changedTouches[0].clientX,
                    y: ev.changedTouches[0].clientY
                });
            };
        });
    }
    restart() {
        if (this.intervalRunning) {
            clearInterval(this.interval);
            clearInterval(this.timeInterval);
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

function createTime(minutes, seconds) {
    return `${`0${minutes}`.slice(-2)}:${`0${seconds}`.slice(-2)}`;
}