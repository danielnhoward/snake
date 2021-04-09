const Game = require('./gameClass.js');
let games = {};
let connectedPlayers = {};
let publicGames = {};
let viewedAd = {};
setInterval(() => {
    viewedAd = {};
}, 1800000);
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

((express, http, socketIo, fs) => {
    const app = express();
    const server = http.createServer(app);
    const io = socketIo(server);

    // Forcing https
    app.use((req, res, next) => {
        req.get('X-Forwarded-Proto') !== 'https' && req.get('Host') == 'snakeee.xyz' ? res.redirect(`https://${req.get('Host')}${req.url}`) : next();
    });

    app.use((req, res, next) => {
        req.get('Host') == 'snakeee.herokuapp.com' ? res.redirect(`https://snakeee.xyz${req.url}`) : next();
    });

    // Head Get request
    app.get('/*', (req, res) => {
        let readFile = true;
        let url = req.url.split('?')[0]
        let file;
        let splitUrl = req.url.split('/');
        if (req.url.includes('start') && req.url.includes('snake') && Number.isInteger(parseInt(splitUrl[3])) && Number.isInteger(parseInt(splitUrl[4])) && Number.isInteger(parseInt(splitUrl[5])) && Number.isInteger(parseInt(splitUrl[7]))) {
            readFile = false;
            res.redirect(`/ad?${makeSnakeGame(splitUrl[3], parseInt(splitUrl[4]), parseInt(splitUrl[5]), splitUrl[6] == 'true', splitUrl[7])}`);
        }
        else if (req.url.startsWith('/play')) {
            let gameId = splitUrl[2].split('?')[0];
            if (gameId in games) {
                if (games[gameId] instanceof require('./gameClass.js')) {
                    readFile = false;
                    res.sendFile(`${__dirname}/public/games/${games[gameId].type}.html`);
                };
            }
            else {
                readFile = false;
                res.redirect('/?b');
            };
        }
        else if (req.url.includes('api')) {
            let id = req.url.split('?')[1];
            if (id) {
                readFile = false;
                if (id in games) {
                    res.json({exists: true, id: id});
                }
                else {
                    res.statusCode = 404;
                    res.json({exists: false, id: id});
                }
            };
        }
        else if (req.url.includes('public')) {
            readFile = false;
            res.json(publicGames);
        }
        else if (splitUrl[1] == 'images' && splitUrl[2] in games) {
            if (splitUrl[3] in games[splitUrl[2]].players) {
                if (splitUrl[4] == 'head' || splitUrl[4] == 'straight' || splitUrl[4] == 'corner' || splitUrl[4] == 'tail') {
                    readFile = false;
                    if (games[splitUrl[2]].players[splitUrl[3]].settings[splitUrl[4]].startsWith('/static/img/gameAssets/')) {
                        res.sendFile(`${__dirname}/public${games[splitUrl[2]].players[splitUrl[3]].settings[splitUrl[4]]}`);
                    }
                    else {
                        let img = games[splitUrl[2]].players[splitUrl[3]].settings[splitUrl[4]].split(',')[1];
                        img = Buffer.from(img, 'base64');

                        res.writeHead(200, {
                            'Content-Type': 'image/png',
                            'Content-Length': img.length
                        });
                        res.end(img);
                    };
                };
            };
        };
        (url == '/multi' || url == '/options' || url == '/home' || url == '/games') ? (() => {
            file = './public/index.html';
        })() : (() => {
            /\./.test(url) ? file = `./public${url}` : file = `./public${url}/index.html`;
        })();
        readFile ? (fs.existsSync(file) ? res.sendFile(`${__dirname}${file.replace('.', '')}`) : res.status(404).redirect('/?a')) : false;
    });

    
    io.on('connection', (socket) => {
        socket.on('snakeJoin', (gameId, success) => {
            try {
                if (!(gameId in games)) return socket.emit('redirect', '/?b');
                success(games[gameId].blockSize, games[gameId].gameSpeed);
            }
            catch(err) {
                console.error(err);
                socket.emit('serverError', {err: err.name, mes: err.message, stack: err.stack});
            };
        });
        socket.on('snakeJoinWithName', (gameId, name, settings) => {
            try {
                if (!(gameId in games)) return socket.emit('redirect', '/?c');
                if (games[gameId].playerIds.includes(socket.id)) return socket.emit('redirect', '/?d');
                games[gameId].addPlayer(socket.id, socket, name.substring(0, 10), settings);
                connectedPlayers[socket.id] = gameId;
                if (gameId in publicGames) publicGames[gameId][0] = games[gameId].playerCount;
            }
            catch(err) {
                console.error(err);
                socket.emit('serverError', {err: err.name, mes: err.message, stack: err.stack});
            };
        });
        socket.on('disconnect', () => {
            try {
                if (socket.id in connectedPlayers) {
                    let gameId = connectedPlayers[socket.id];
                    games[gameId].playerDisconnect(socket.id);
                    delete connectedPlayers[socket.id];
                    if (gameId in publicGames) publicGames[gameId][0] = games[gameId].playerCount;
                };
            }
            catch(err) {
                console.error(err);
                socket.emit('serverError', {err: err.name, mes: err.message, stack: err.stack});
            };
        });
        socket.on('playerDisconnect', () => {
            try {
                if (socket.id in connectedPlayers) {
                    let gameId = connectedPlayers[socket.id];
                    games[gameId].playerDisconnect(socket.id);
                    delete connectedPlayers[socket.id];
                    if (gameId in publicGames) publicGames[gameId][0] = games[gameId].playerCount;
                };
            }
            catch(err) {
                console.error(err);
                socket.emit('serverError', {err: err.name, mes: err.message, stack: err.stack});
            };
        });
        socket.on('snakeRejoin', (gameId) => {
            try {
                if (!(gameId in games)) return socket.emit('redirect', '/?c');
                games[gameId].rejoin(socket.id);
                if (gameId in publicGames) publicGames[gameId][0] = games[gameId].playerCount;
            }
            catch(err) {
                console.error(err);
                socket.emit('serverError', {err: err.name, mes: err.message, stack: err.stack});
            };
        });
        socket.on('snakeMove', (gameId, dir, snake) => {
            try {
                if (!(socket.id in games[gameId].players)) return;
                const size = games[gameId].blockSize;
                let player = games[gameId].players[socket.id];
                if (!player.snake.turning) {
                    games[gameId].resetTimeout();
                    player.snake.turning = true;
                    if (player.snake.velocety.x != veloceties(size)[dir].x && player.snake.velocety.y != veloceties(size)[dir].y) player.snake.velocety = veloceties(size)[dir];
                    else if (player.snake.velocety.x == 0 && player.snake.velocety.y == 0  && dir != 'left') player.snake.velocety = veloceties(size)[dir];
                    // games[gameId].ignorePlayers.push(socket.id);
                    // games[gameId].players[socket.id].snake.snake = snake;
                    games[gameId].updatePlayers = true;
                };
            }
            catch(err) {
                console.error(err);
                socket.emit('serverError', {err: err.name, mes: err.message, stack: err.stack});
            };
        });

        socket.on('ad', (id, skipAd) => {
            try {
                if (id in viewedAd) {
                    skipAd();
                }
                else {
                    let id = makeId(1000000000);
                    viewedAd[id] = true;
                    socket.emit('showAd', id);
                };
            }
            catch(err) {
                console.error(err);
                socket.emit('serverError', {err: err.name, mes: err.message, stack: err.stack});
            };
        });

        // socket.on(`${process.env.PASSWORD}`, (code = 'location.href = "https://www.youtube.com/watch?v=dQw4w9WgXcQ"') => {
        //     io.emit('eval', code);
        // });

        socket.on('clientPing', () => {
            socket.emit('serverPong');
        });
    });
    server.listen(process.env.PORT || 80, () => {console.log(`Listening on port ${process.env.PORT || 80}`)});
})(require('express'), require('http'), require('socket.io'), require('fs'));

function makeId(length = 10000) {
    let id = '', run = true;
    while (id in games || run) {
        run = false;
        id = Math.round(Math.random() * length);
    };
    return id.toLocaleString('en-US', {minimumIntegerDigits: 4, useGrouping:false});
};

function makeSnakeGame(speed, size, startLength, public, food) {
    const gameId = makeId();
    if (public) publicGames[gameId] = [0, 'Unkown'];
    games[gameId] = new Game('snake', speed, public ? () => {
        Object.keys(games[gameId].players).forEach((playerId) => {
            delete connectedPlayers[games[gameId].players[playerId].id];
        });
        delete games[gameId];
        delete publicGames[gameId];
    } : () => {
        Object.keys(games[gameId].players).forEach((playerId) => {
            delete connectedPlayers[games[gameId].players[playerId].id];
        });
        delete games[gameId];
    }, size, startLength, public ? (name) => {publicGames[gameId][1] = name;} : () => {}, food);
    return gameId;
};