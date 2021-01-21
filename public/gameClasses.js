class snakeCanvas {
    constructor(gameSpeed, canvasId, settings, blockSize) {
        this.gameSpeed = gameSpeed
        this.canvasId = canvasId
        this.blockSize = blockSize
        this.settings = settings
        this.canvasEl = document.getElementById(canvasId)
        this.canvas = this.canvasEl.getContext('2d')
    }
    drawGame() {
        if (!this.canvasEl.snake) return
        this.canvas.fillStyle = this.settings.canvas_background_colour
        this.canvas.strokeStyle = this.settings.canvas_border_colour
        this.canvas.fillRect(0, 0, this.canvasEl.width, this.canvasEl.height)
        this.canvas.strokeRect(0, 0, this.canvasEl.width, this.canvasEl.height)
        for (const el of this.canvasEl.snake) {
            this.canvas.fillStyle = this.settings.snake_colour
            this.canvas.strokeStyle = this.settings.snake_border_colour
            for (const snake of el) {
                this.canvas.fillRect(snake.x, snake.y, this.blockSize, this.blockSize)
                this.canvas.strokeRect(snake.x, snake.y, this.blockSize, this.blockSize)
            }
        }
        for (const el of this.canvasEl.food) {
            this.canvas.fillStyle = this.settings.food_colour
            this.canvas.strokeStyle = this.settings.food_border_colour
            for (const food of el) {
                this.canvas.fillRect(food.x, food.y, this.blockSize, this.blockSize)
                this.canvas.strokeRect(food.x, food.y, this.blockSize, this.blockSize)
            }
        }
    }
}

class Snake {
    constructor(id, startLength, blockSize, settings, scoreId) {
        this.canvas = document.getElementById(id)
        this.id = id
        this.startLength = startLength
        this.settings = settings
        this.snake = [{x:document.getElementById(id).width / 2 - (startLength * blockSize), y:document.getElementById(id).height / 2}]
        this.food = {x:0, y:0}
        this.velocety = {x:0, y:0}
        this.blockSize = blockSize
        this.changingDirection = false
        this.score = 0
        this.scoreId = scoreId
        this.running = false
    }
    async start() {
        this.running = true
        for (let x = 1; x < this.startLength; x++) {
            this.snake.unshift({x:this.snake[this.snake.length - 1].x + this.blockSize * x, y:this.snake[this.snake.length - 1].y})
        }
        document.addEventListener('keydown', this.keyPress.bind(this))
        this.clearCanvas()
        this.createFood()
        this.drawFood()
        this.drawSnake()
        this.velocety.x = this.blockSize
        setInterval(() => {
            if (!this.running) return
            if (this.gameEnded()) {
                alert('You lost!')
                window.location.href = '/single/start'
            }
            this.changingDirection = false
            this.clearCanvas()
            this.advanceSnake()
            this.drawSnake()
            this.drawFood()
        }, this.settings.game_speed)
    }
    random(min, max) {
        return Math.round(Math.random() * (max-min) + min);
    }
    clearCanvas() {
        this.canvas.fillStyle = this.settings.canvas_background_colour
        this.canvas.strokeStyle = this.settings.canvas_border_colour
        this.canvas.fillRect(0, 0, document.getElementById(this.id).width, document.getElementById(this.id).height)
        this.canvas.strokeRect(0, 0, document.getElementById(this.id).width, document.getElementById(this.id).height)
    }
    drawFood() {
        this.canvas.fillStyle = this.settings.food_colour
        this.canvas.strokeStyle = this.settings.food_border_colour
        this.canvas.fillRect(this.food.x, this.food.y, this.blockSize, this.blockSize)
        this.canvas.strokeRect(this.food.x, this.food.y, this.blockSize, this.blockSize)
    }
    createFood() {
        this.food.x = this.random(0, document.getElementById(this.id).width - this.blockSize)
        this.food.y = this.random(0, document.getElementById(this.id).height - this.blockSize)
        this.snake.forEach((part) => {
            if (part.x === this.food.x && part.y === this.food.y) this.createFood()
        })
    }
    drawSnake() {
        this.canvas.fillStyle = this.settings.snake_colour
        this.canvas.strokeStyle = this.settings.snake_border_colour
        this.snake.forEach((part) => {
            this.canvas.fillRect(part.x, part.y, this.blockSize, this.blockSize)
            this.canvas.strokeRect(part.x, part.y, this.blockSize, this.blockSize)
        })
    }
    advanceSnake() {
        this.snake.unshift({x:this.snake[0].x + this.velocety.x, y:this.snake[0].y + this.velocety.y})
        if (this.snake[0].x === this.food.x && this.snake[0].y === this.food.y) {
            this.addScore(10)
            this.createFood()
        }
        else {
            this.snake.pop()
        }
    }
    gameEnded() {
        for (let i = 1; i < this.snake.length; i++) {
            if (this.snake[i].x === this.snake[0].x && this.snake[i].y === this.snake[0].y) {
                return true
            }
            const hit = {
                left_wall: this.snake[0].x < 0,
                right_wall: this.snake[0].x > document.getElementById(this.id).width - this.blockSize,
                top_wall: this.snake[0].y < 0,
                bottom_wall: this.snake[0].y > document.getElementById(this.id).height - this.blockSize
            }
            return hit.left_wall || hit.right_wall || hit.top_wall || hit.bottom_wall
        }
    }
    keyPress(event) {
        if (this.changingDirection) {
            return
        }
        this.changingDirection = true
        if (event.keyCode == this.settings.up && this.velocety.y != -10) {
            this.velocety =  {
                x:0,
                y:-10
            }
        }
        else if (event.keyCode == this.settings.down && this.velocety.y != 10) {
            this.velocety =  {
                x:0,
                y:10
            }
        }
        else if (event.keyCode == this.settings.left && this.velocety.x != -10) {
            this.velocety =  {
                x:-10,
                y:0
            }
        }
        else if (event.keyCode == this.settings.right && this.velocety.x != 10) {
            this.velocety =  {
                x:10,
                y:0
            }
        }
    }
    addScore(amount) {
        this.score += amount
        document.getElementById(this.scoreId).innerHTML = this.score
    }
}