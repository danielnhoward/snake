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
        try {
            this.img = {
                background: createImg(settings.background),
                food: createImg(settings.food)
            };
        }
        catch(err) {
            resetConfig();
            location.reload();
        };
        this.veloceties = veloceties(gameSize);
        this.canvas = document.getElementById(id);
        this.ctx = this.canvas.getContext('2d');
        this.clearCanvas();
    };
    resetImg() {
        try {
            this.img = {
                background: createImg(this.settings.background),
                food: createImg(this.settings.food)
            };
        }
        catch(err) {
            resetConfig();
            location.reload();
        };
    };
    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.drawImage(this.img.background, 0, 0, this.canvas.width, this.canvas.height);
    };
    setImage(id, image) {
        try {
            let dragon = (image.head == '/static/img/gameAssets/Big-Red/head.png' && image.tail == '/static/img/gameAssets/Big-Red/tail.png' && image.body == '/static/img/gameAssets/Big-Red/straight.png' && image.corner == '/static/img/gameAssets/Big-Red/corner.png')
            this.images[id] = {
                head: createImg(image.head),
                straight: createImg(image.body),
                tail: createImg(image.tail),
                corner: createImg(image.corner)
            };
            if (dragon) {
                this.images[id].dragon = dragon;
                this.images[id].cornerWings = createImg('/static/img/gameAssets/Big-Red/corner-wing.png');
                this.images[id].straightWings = createImg('/static/img/gameAssets/Big-Red/straight-wing.png');
            };
        }
        catch(err) {
            resetConfig();
            alert(err)
            alert(err.stack)
            location.reload();
        };
    };
    drawGame(game) {
        this.clearCanvas();
        game.food.forEach((part) => {
            this.ctx.drawImage(this.img.food, part.x, part.y, this.gameSize, this.gameSize);
        });
        let queue = [];
        Object.keys(game.players).forEach((playerId) => {
            let player = game.players[playerId];
            player.snake.forEach((part, index) => {
                if (index == 0) {
                    this.ctx.save();
                    queue.push([part.name, part.position.x + this.gameSize / 3, part.position.y - 15]);
                    if (part.vel.x == this.veloceties.up.x && part.vel.y == this.veloceties.up.y) {
                        this.ctx.drawImage(this.images[part.id].head, part.position.x, part.position.y, this.gameSize, this.gameSize);
                    }
                    else if (part.vel.x == this.veloceties.down.x && part.vel.y == this.veloceties.down.y) {
                        this.ctx.translate(part.position.x + this.gameSize, part.position.y + this.gameSize);
                        this.ctx.rotate(180*Math.PI/180);
                        this.ctx.translate(-(part.position.x + this.gameSize), -(part.position.y + this.gameSize));
                        this.ctx.drawImage(this.images[part.id].head, part.position.x + this.gameSize, part.position.y + this.gameSize, this.gameSize, this.gameSize);
                    }
                    else if (part.vel.x == this.veloceties.left.x && part.vel.y == this.veloceties.left.y) {
                        this.ctx.translate(part.position.x + this.gameSize, part.position.y + this.gameSize);
                        this.ctx.rotate(270*Math.PI/180);
                        this.ctx.translate(-(part.position.x + this.gameSize), -(part.position.y + this.gameSize));
                        this.ctx.drawImage(this.images[part.id].head, part.position.x + this.gameSize, part.position.y, this.gameSize, this.gameSize);
                    }
                    else if (part.vel.x == this.veloceties.right.x && part.vel.y == this.veloceties.right.y) {
                        this.ctx.translate(part.position.x + this.gameSize, part.position.y + this.gameSize);
                        this.ctx.rotate(90*Math.PI/180);
                        this.ctx.translate(-(part.position.x + this.gameSize), -(part.position.y + this.gameSize));
                        this.ctx.drawImage(this.images[part.id].head, part.position.x, part.position.y + this.gameSize, this.gameSize, this.gameSize);
                    };
                    this.ctx.restore();
                }
                else if (index == player.snake.length - 1) {
                    this.ctx.save();
                    let differences = {
                        x: part.position.x - player.snake[index - 1].x,
                        y: part.position.y - player.snake[index - 1].y
                    };
                    if (differences.y == this.gameSize) {
                        this.ctx.translate(part.position.x + this.gameSize, part.position.y + this.gameSize);
                        this.ctx.rotate(180*Math.PI/180);
                        this.ctx.translate(-(part.position.x + this.gameSize), -(part.position.y + this.gameSize));
                        this.ctx.drawImage(this.images[part.id].tail, part.position.x + this.gameSize, part.position.y + this.gameSize, this.gameSize, this.gameSize);
                    }
                    else if (differences.y == -this.gameSize) {
                        this.ctx.drawImage(this.images[part.id].tail, part.position.x, part.position.y, this.gameSize, this.gameSize);
                    }
                    else if (differences.x == this.gameSize) {
                        this.ctx.translate(part.position.x + this.gameSize, part.position.y + this.gameSize);
                        this.ctx.rotate(90*Math.PI/180);
                        this.ctx.translate(-(part.position.x + this.gameSize), -(part.position.y + this.gameSize));
                        this.ctx.drawImage(this.images[part.id].tail, part.position.x, part.position.y + this.gameSize, this.gameSize, this.gameSize);
                    }
                    else if (differences.x == -this.gameSize) {
                        this.ctx.translate(part.position.x + this.gameSize, part.position.y + this.gameSize);
                        this.ctx.rotate(270*Math.PI/180);
                        this.ctx.translate(-(part.position.x + this.gameSize), -(part.position.y + this.gameSize));
                        this.ctx.drawImage(this.images[part.id].tail, part.position.x + this.gameSize, part.position.y, this.gameSize, this.gameSize);
                    };
                    this.ctx.restore();
                }
                else {
                    this.ctx.save();
                    let differences = {
                        before: {
                            x: part.position.x - player.snake[index - 1].x,
                            y: part.position.y - player.snake[index - 1].y
                        },
                        after: {
                            x: part.position.x - player.snake[index + 1].x,
                            y: part.position.y - player.snake[index + 1].y
                        }
                    };
                    if (differences.before.x == differences.after.x || differences.before.y == differences.after.y) {
                        if (part.vel.x == this.veloceties.up.x && part.vel.y == this.veloceties.up.y) {
                            this.ctx.drawImage(this.images[part.id].dragon && index == 1 ? this.images[part.id].straightWings : this.images[part.id].straight, part.position.x, part.position.y, this.gameSize, this.gameSize);
                        }
                        else if (part.vel.x == this.veloceties.down.x && part.vel.y == this.veloceties.down.y) {
                            this.ctx.translate(part.position.x + this.gameSize/2, part.position.y + this.gameSize/2);
                            this.ctx.rotate(180*Math.PI/180);
                            this.ctx.translate(-(part.position.x + this.gameSize/2), -(part.position.y + this.gameSize/2));
                            this.ctx.drawImage(this.images[part.id].dragon && index == 1 ? this.images[part.id].straightWings : this.images[part.id].straight, part.position.x, part.position.y, this.gameSize, this.gameSize);
                        }
                        else if (part.vel.x == this.veloceties.left.x && part.vel.y == this.veloceties.left.y) {
                            this.ctx.translate(part.position.x + this.gameSize, part.position.y + this.gameSize);
                            this.ctx.rotate(270*Math.PI/180);
                            this.ctx.translate(-(part.position.x + this.gameSize), -(part.position.y + this.gameSize));
                            this.ctx.drawImage(this.images[part.id].dragon && index == 1 ? this.images[part.id].straightWings : this.images[part.id].straight, part.position.x + this.gameSize, part.position.y, this.gameSize, this.gameSize);
                        }
                        else if (part.vel.x == this.veloceties.right.x && part.vel.y == this.veloceties.right.y) {
                            this.ctx.translate(part.position.x + this.gameSize, part.position.y + this.gameSize);
                            this.ctx.rotate(90*Math.PI/180);
                            this.ctx.translate(-(part.position.x + this.gameSize), -(part.position.y + this.gameSize));
                            this.ctx.drawImage(this.images[part.id].dragon && index == 1 ? this.images[part.id].straightWings : this.images[part.id].straight, part.position.x, part.position.y + this.gameSize, this.gameSize, this.gameSize);
                        };
                    }
                    else if (differences.before.x == this.gameSize && differences.after.y == this.gameSize || differences.before.y == this.gameSize && differences.after.x == this.gameSize) {
                        this.ctx.translate(part.position.x + this.gameSize, part.position.y + this.gameSize);
                        this.ctx.rotate(90*Math.PI/180);
                        this.ctx.translate(-(part.position.x + this.gameSize), -(part.position.y + this.gameSize));
                        this.ctx.drawImage(this.images[part.id].dragon && index == 1 ? this.images[part.id].cornerWings : this.images[part.id].corner, part.position.x, part.position.y + this.gameSize, this.gameSize, this.gameSize);
                    }
                    else if (differences.before.x == -this.gameSize && differences.after.y == this.gameSize || differences.before.y == this.gameSize && differences.after.x == -this.gameSize) {
                        this.ctx.translate(part.position.x + this.gameSize, part.position.y + this.gameSize);
                        this.ctx.rotate(180*Math.PI/180);
                        this.ctx.translate(-(part.position.x + this.gameSize), -(part.position.y + this.gameSize));
                        this.ctx.drawImage(this.images[part.id].dragon && index == 1 ? this.images[part.id].cornerWings : this.images[part.id].corner, part.position.x + this.gameSize, part.position.y + this.gameSize, this.gameSize, this.gameSize);
                    }
                    else if (differences.before.x == this.gameSize && differences.after.y == -this.gameSize || differences.before.y == -this.gameSize && differences.after.x == this.gameSize) {
                        this.ctx.drawImage(this.images[part.id].dragon && index == 1 ? this.images[part.id].cornerWings : this.images[part.id].corner, part.position.x, part.position.y, this.gameSize, this.gameSize);
                    }
                    else if (differences.before.x == -this.gameSize && differences.after.y == -this.gameSize || differences.before.y == -this.gameSize && differences.after.x == -this.gameSize) {
                        this.ctx.translate(part.position.x + this.gameSize, part.position.y + this.gameSize);
                        this.ctx.rotate(270*Math.PI/180);
                        this.ctx.translate(-(part.position.x + this.gameSize), -(part.position.y + this.gameSize));
                        this.ctx.drawImage(this.images[part.id].dragon && index == 1 ? this.images[part.id].cornerWings : this.images[part.id].corner, part.position.x + this.gameSize, part.position.y, this.gameSize, this.gameSize);
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