const veloceties = (size) => {
    return {
        up: {
            x:0,
            y:-size
        },
        down: {
            x:0,
            y:size
        },
        left: {
            x:-size,
            y:0
        },
        right: {
            x:size,
            y:0
        }
    };
};

class MultiCanvas {
    constructor(id, settings, gameSize, img) {
        this.id = id;
        this.settings = settings;
        this.gameSize = gameSize;
        this.img = img;
        this.veloceties = veloceties(gameSize);
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
            this.ctx.drawImage(this.img.food, part.x, part.y, this.gameSize, this.gameSize);
        });
        let queue = [];
        game.players.forEach((player) => {
            player.forEach((part, index) => {
                if (index == 0) {
                    queue.push([part.name, part.x + this.gameSize / 3, part.y - 15]);
                    if (part.vel.x == this.veloceties.up.x && part.vel.y == this.veloceties.up.y) {
                        this.ctx.drawImage(this.img.heads.top, part.x, part.y, this.gameSize, this.gameSize);
                    }
                    else if (part.vel.x == this.veloceties.down.x && part.vel.y == this.veloceties.down.y) {
                        this.ctx.drawImage(this.img.heads.down, part.x, part.y, this.gameSize, this.gameSize);
                    }
                    else if (part.vel.x == this.veloceties.left.x && part.vel.y == this.veloceties.left.y) {
                        this.ctx.drawImage(this.img.heads.left, part.x, part.y, this.gameSize, this.gameSize);
                    }
                    else if (part.vel.x == this.veloceties.right.x && part.vel.y == this.veloceties.right.y) {
                        this.ctx.drawImage(this.img.heads.right, part.x, part.y, this.gameSize, this.gameSize);
                    };
                }
                else if (index == player.length - 1) {
                    let differences = {
                        x: part.x - player[index - 1].x,
                        y: part.y - player[index - 1].y
                    };
                    if (differences.y == this.gameSize) {
                        this.ctx.drawImage(this.img.tails.bottom, part.x, part.y, this.gameSize, this.gameSize);
                    }
                    else if (differences.y == -this.gameSize) {
                        this.ctx.drawImage(this.img.tails.top, part.x, part.y, this.gameSize, this.gameSize);
                    }
                    else if (differences.x == this.gameSize) {
                        this.ctx.drawImage(this.img.tails.right, part.x, part.y, this.gameSize, this.gameSize);
                    }
                    else if (differences.x == -this.gameSize) {
                        this.ctx.drawImage(this.img.tails.left, part.x, part.y, this.gameSize, this.gameSize);
                    };
                }
                else {
                    let differences = {
                        before: {
                            x: part.x - player[index - 1].x,
                            y: part.y - player[index - 1].y
                        },
                        after: {
                            x: part.x - player[index + 1].x,
                            y: part.y - player[index + 1].y
                        }
                    };
                    if (differences.before.x == differences.after.x || differences.before.y == differences.after.y) {
                        if (part.vel.x == this.veloceties.up.x && part.vel.y == this.veloceties.up.y || part.vel.x == this.veloceties.down.x && part.vel.y == this.veloceties.down.y) {
                            this.ctx.drawImage(this.img.straights.ver, part.x, part.y, this.gameSize, this.gameSize);
                        }
                        else if (part.vel.x == this.veloceties.left.x && part.vel.y == this.veloceties.left.y || part.vel.x == this.veloceties.right.x && part.vel.y == this.veloceties.right.y) {
                            this.ctx.drawImage(this.img.straights.hor, part.x, part.y, this.gameSize, this.gameSize);
                        };
                    }
                    else if (differences.before.x == this.gameSize && differences.after.y == this.gameSize || differences.before.y == this.gameSize && differences.after.x == this.gameSize) {
                        this.ctx.drawImage(this.img.corners.topLeft, part.x, part.y, this.gameSize, this.gameSize);
                    }
                    else if (differences.before.x == -this.gameSize && differences.after.y == this.gameSize || differences.before.y == this.gameSize && differences.after.x == -this.gameSize) {
                        this.ctx.drawImage(this.img.corners.topRight, part.x, part.y, this.gameSize, this.gameSize);
                    }
                    else if (differences.before.x == this.gameSize && differences.after.y == -this.gameSize || differences.before.y == -this.gameSize && differences.after.x == this.gameSize) {
                        this.ctx.drawImage(this.img.corners.bottomLeft, part.x, part.y, this.gameSize, this.gameSize);
                    }
                    else if (differences.before.x == -this.gameSize && differences.after.y == -this.gameSize || differences.before.y == -this.gameSize && differences.after.x == -this.gameSize) {
                        this.ctx.drawImage(this.img.corners.bottomRight, part.x, part.y, this.gameSize, this.gameSize);
                    };
                };
            });
        });
        this.ctx.font = '20px Arial';
        this.ctx.textAlign = "center";
        this.ctx.textBaseline = "middle";
        this.ctx.fillStyle = 'black';
        queue.forEach((el) => {
            this.ctx.fillText(el[0], el[1], el[2]);
        });
    };
};