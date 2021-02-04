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

function createImg(src) {
    let img = document.createElement('img');
    img.src = src;
    return img;
};

class MultiCanvas {
    constructor(id, settings, gameSize) {
        this.id = id;
        this.settings = settings;
        this.gameSize = gameSize;
        this.images = {};
        this.img = {
            background: createImg(settings.background),
            food: createImg(settings.food)
        }
        this.veloceties = veloceties(gameSize);
        this.canvas = document.getElementById(id);
        this.ctx = this.canvas.getContext('2d');
        this.clearCanvas();
    };
    clearCanvas() {
        this.ctx.drawImage(this.img.background, 0, 0, 1000, 1000);
    };
    setImage(id, image) {
        this.images[id] = {
            head: createImg(image.head),
            straight: createImg(image.body),
            tail: createImg(image.tail),
            corner: createImg(image.corner)
        };
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
                    this.ctx.save();
                    queue.push([part.name, part.x + this.gameSize / 3, part.y - 15]);
                    if (part.vel.x == this.veloceties.up.x && part.vel.y == this.veloceties.up.y) {
                        this.ctx.drawImage(this.images[part.id].head, part.x, part.y, this.gameSize, this.gameSize);
                    }
                    else if (part.vel.x == this.veloceties.down.x && part.vel.y == this.veloceties.down.y) {
                        this.ctx.translate(part.x + this.gameSize, part.y + this.gameSize);
                        this.ctx.rotate(180*Math.PI/180);
                        this.ctx.translate(-(part.x + this.gameSize), -(part.y + this.gameSize));
                        this.ctx.drawImage(this.images[part.id].head, part.x + this.gameSize, part.y + this.gameSize, this.gameSize, this.gameSize);
                    }
                    else if (part.vel.x == this.veloceties.left.x && part.vel.y == this.veloceties.left.y) {
                        this.ctx.translate(part.x + this.gameSize, part.y + this.gameSize);
                        this.ctx.rotate(270*Math.PI/180);
                        this.ctx.translate(-(part.x + this.gameSize), -(part.y + this.gameSize));
                        this.ctx.drawImage(this.images[part.id].head, part.x + this.gameSize, part.y, this.gameSize, this.gameSize);
                    }
                    else if (part.vel.x == this.veloceties.right.x && part.vel.y == this.veloceties.right.y) {
                        this.ctx.translate(part.x + this.gameSize, part.y + this.gameSize);
                        this.ctx.rotate(90*Math.PI/180);
                        this.ctx.translate(-(part.x + this.gameSize), -(part.y + this.gameSize));
                        this.ctx.drawImage(this.images[part.id].head, part.x, part.y + this.gameSize, this.gameSize, this.gameSize);
                    };
                    this.ctx.restore();
                }
                else if (index == player.length - 1) {
                    this.ctx.save();
                    let differences = {
                        x: part.x - player[index - 1].x,
                        y: part.y - player[index - 1].y
                    };
                    if (differences.y == this.gameSize) {
                        this.ctx.translate(part.x + this.gameSize, part.y + this.gameSize);
                        this.ctx.rotate(180*Math.PI/180);
                        this.ctx.translate(-(part.x + this.gameSize), -(part.y + this.gameSize));
                        this.ctx.drawImage(this.images[part.id].tail, part.x + this.gameSize, part.y + this.gameSize, this.gameSize, this.gameSize);
                    }
                    else if (differences.y == -this.gameSize) {
                        this.ctx.drawImage(this.images[part.id].tail, part.x, part.y, this.gameSize, this.gameSize);
                    }
                    else if (differences.x == this.gameSize) {
                        this.ctx.translate(part.x + this.gameSize, part.y + this.gameSize);
                        this.ctx.rotate(90*Math.PI/180);
                        this.ctx.translate(-(part.x + this.gameSize), -(part.y + this.gameSize));
                        this.ctx.drawImage(this.images[part.id].tail, part.x, part.y + this.gameSize, this.gameSize, this.gameSize);
                    }
                    else if (differences.x == -this.gameSize) {
                        this.ctx.translate(part.x + this.gameSize, part.y + this.gameSize);
                        this.ctx.rotate(270*Math.PI/180);
                        this.ctx.translate(-(part.x + this.gameSize), -(part.y + this.gameSize));
                        this.ctx.drawImage(this.images[part.id].tail, part.x + this.gameSize, part.y, this.gameSize, this.gameSize);
                    };
                    this.ctx.restore();
                }
                else {
                    this.ctx.save();
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
                            this.ctx.drawImage(this.images[part.id].straight, part.x, part.y, this.gameSize, this.gameSize);
                        }
                        else if (part.vel.x == this.veloceties.left.x && part.vel.y == this.veloceties.left.y || part.vel.x == this.veloceties.right.x && part.vel.y == this.veloceties.right.y) {
                            this.ctx.translate(part.x + this.gameSize, part.y + this.gameSize);
                            this.ctx.rotate(90*Math.PI/180);
                            this.ctx.translate(-(part.x + this.gameSize), -(part.y + this.gameSize));
                            this.ctx.drawImage(this.images[part.id].straight, part.x, part.y + this.gameSize, this.gameSize, this.gameSize);
                        };
                    }
                    else if (differences.before.x == this.gameSize && differences.after.y == this.gameSize || differences.before.y == this.gameSize && differences.after.x == this.gameSize) {
                        this.ctx.translate(part.x + this.gameSize, part.y + this.gameSize);
                        this.ctx.rotate(90*Math.PI/180);
                        this.ctx.translate(-(part.x + this.gameSize), -(part.y + this.gameSize));
                        this.ctx.drawImage(this.images[part.id].corner, part.x, part.y + this.gameSize, this.gameSize, this.gameSize);
                    }
                    else if (differences.before.x == -this.gameSize && differences.after.y == this.gameSize || differences.before.y == this.gameSize && differences.after.x == -this.gameSize) {
                        this.ctx.translate(part.x + this.gameSize, part.y + this.gameSize);
                        this.ctx.rotate(180*Math.PI/180);
                        this.ctx.translate(-(part.x + this.gameSize), -(part.y + this.gameSize));
                        this.ctx.drawImage(this.images[part.id].corner, part.x + this.gameSize, part.y + this.gameSize, this.gameSize, this.gameSize);
                    }
                    else if (differences.before.x == this.gameSize && differences.after.y == -this.gameSize || differences.before.y == -this.gameSize && differences.after.x == this.gameSize) {
                        this.ctx.drawImage(this.images[part.id].corner, part.x, part.y, this.gameSize, this.gameSize);
                    }
                    else if (differences.before.x == -this.gameSize && differences.after.y == -this.gameSize || differences.before.y == -this.gameSize && differences.after.x == -this.gameSize) {
                        this.ctx.translate(part.x + this.gameSize, part.y + this.gameSize);
                        this.ctx.rotate(270*Math.PI/180);
                        this.ctx.translate(-(part.x + this.gameSize), -(part.y + this.gameSize));
                        this.ctx.drawImage(this.images[part.id].corner, part.x + this.gameSize, part.y, this.gameSize, this.gameSize);
                    };
                    this.ctx.restore();
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