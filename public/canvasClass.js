class snakeCanvas {
    constructor(gameSpeed, canvasId, settings, blockSize) {
        this.gameSpeed = gameSpeed
        this.canvasId = canvasId
        this.blockSize = blockSize
        this.canvasEl = document.getElementById(canvasId)
        this.canvas = this.canvasEl.getContext('2d')
    }
    drawSnake() {
        if (!this.canvasEl.snake) return
        for (const el of this.canvasEl.snake) {
            this.canvas.fillStyle = this.settings.snake_colour
            this.canvas.strokeStyle = this.settings.snake_border_colour
            for(const snake of el) {
                this.canvas.fillRect(snake.x, snake.y, this.blockSize, this.blockSize)
                this.canvas.strokeRect(snake.x, snake.y, this.blockSize, this.blockSize)
            }
        }
    }
    clearCanvas() {
        this.canvas.fillStyle = this.settings.canvas_background_colour
        this.canvas.strokeStyle = this.settings.canvas_border_colour
        this.canvas.fillRect(0, 0, this.canvasEl.width, this.canvasEl.height)
        this.canvas.strokeRect(0, 0, this.canvasEl.width, this.canvasEl.height)
    }
}