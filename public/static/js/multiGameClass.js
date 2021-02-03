class MultiCanvas {
    constructor(id, settings, gameSize) {
        this.id = id;
        this.settings = settings;
        this.gameSize = gameSize;
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
        this.clearCanvas();
        game.food.forEach((part) => {
            this.ctx.fillStyle = part.colour.body;
            this.ctx.strokeStyle = part.colour.border;
            this.ctx.fillRect(part.x, part.y, this.gameSize, this.gameSize);
            this.ctx.strokeRect(part.x, part.y, this.gameSize, this.gameSize);
        });
        game.players.forEach((part, index) => {
            this.ctx.fillStyle = part.colour.body;
            this.ctx.strokeStyle = part.colour.border;
            this.ctx.lineWidth = 2;
            this.ctx.fillRect(part.x, part.y, this.gameSize, this.gameSize);
            let differences = {};
            if (index == 0) {
                differences = {
                    x: part.x - game.players[index + 1].x,
                    y: part.y - game.players[index + 1].y
                };
            };
            if (index == game.players.length - 1) {
                differences = {
                    x: part.x - game.players[index - 1].x,
                    y: part.y - game.players[index - 1].y
                };
            };
            this.ctx.beginPath();

            if (index == game.players.length - 1 || index == 0) {
                if (differences.x == this.gameSize) {
                    // Left
                    this.ctx.moveTo(part.x, part.y);
                    this.ctx.lineTo(part.x + this.gameSize, part.y);
                    this.ctx.lineTo(part.x + this.gameSize, part.y + this.gameSize);
                    this.ctx.lineTo(part.x, part.y + this.gameSize);
                }
                else if (differences.x == -this.gameSize) {
                    // Right
                    this.ctx.moveTo(part.x + this.gameSize, part.y);
                    this.ctx.lineTo(part.x, part.y);
                    this.ctx.lineTo(part.x, part.y + this.gameSize);
                    this.ctx.lineTo(part.x + this.gameSize, part.y + this.gameSize);
                }
                else if (differences.y == this.gameSize) {
                    // Up
                    this.ctx.moveTo(part.x, part.y);
                    this.ctx.lineTo(part.x, part.y + this.gameSize);
                    this.ctx.lineTo(part.x + this.gameSize, part.y + this.gameSize);
                    this.ctx.lineTo(part.x + this.gameSize, part.y);
                }
                else if (differences.y == -this.gameSize) {
                    // Down
                    this.ctx.moveTo(part.x, part.y + this.gameSize);
                    this.ctx.lineTo(part.x, part.y);
                    this.ctx.lineTo(part.x + this.gameSize, part.y);
                    this.ctx.lineTo(part.x + this.gameSize, part.y + this.gameSize);
                };
            }
            else {
                differences = {
                    before: {
                        x: part.x - game.players[index - 1].x,
                        y: part.y - game.players[index - 1].y
                    },
                    after: {
                        x: part.x - game.players[index + 1].x,
                        y: part.y - game.players[index + 1].y
                    }
                };
                if (differences.before.x != this.gameSize && differences.after.x != this.gameSize) {
                    this.ctx.moveTo(part.x, part.y);
                    this.ctx.lineTo(part.x, part.y + this.gameSize);
                };
                if (differences.before.x != -this.gameSize && differences.after.x != -this.gameSize) {
                    this.ctx.moveTo(part.x + this.gameSize, part.y);
                    this.ctx.lineTo(part.x + this.gameSize, part.y + this.gameSize);
                };
                if (differences.before.y != this.gameSize && differences.after.y != this.gameSize) {
                    this.ctx.moveTo(part.x, part.y);
                    this.ctx.lineTo(part.x + this.gameSize, part.y);
                };
                if (differences.before.y != -this.gameSize && differences.after.y != -this.gameSize) {
                    this.ctx.moveTo(part.x, part.y + this.gameSize);
                    this.ctx.lineTo(part.x + this.gameSize, part.y + this.gameSize);
                };
            };

            this.ctx.stroke();
        });
    };
};