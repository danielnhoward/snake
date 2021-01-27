class MultiCanvas {
    constructor(id, settings) {
        this.id = id;
        this.settings = settings;
        this.canvas = document.getElementById(id);
        this.ctx = this.canvas.getContext('2d');
        this.clearCanvas();
    };
    clearCanvas() {
        this.ctx.fillStyle = this.settings.canvasBackgroundColour;
        this.ctx.strokeStyle = this.settings.canvasBorderColour;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.strokeRect(0, 0, this.canvas.width, this.canvas.height);
    };
    drawGame(game) {
        for (const part of game) {
            this.ctx.fillStyle = part.colour.fill;
            this.ctx.strokeStyle = part.colour.border;
            this.ctx.fillRect(part.x, part.y, 40, 40);
            this.ctx.strokeRect(part.x, part.y, 40, 40);
        }
    }
}