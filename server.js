module.exports = (express, http_, socket_io, fs, commands, cors) => {
    var app = express(), http = http_.createServer(app), io = socket_io(http);
    app.use(cors());
    app.get('/*', (req, res) => {
        let readFile = true, url = req.url.split('?')[0], file;
        if (req.url.includes('start')) {
            if (req.url.includes('snake')) {
                if (Number.isInteger(parseInt(req.url.split('/')[3]))) {
                    if (Number.isInteger(parseInt(req.url.split('/')[4]))) {
                        if (Number.isInteger(parseInt(req.url.split('/')[5]))) {
                            readFile = false;
                            res.redirect(`/play/${require('./commands.js').makeSnakeGame(req.url.split('/')[3], parseInt(req.url.split('/')[4]), parseInt(req.url.split('/')[5]))}`);
                        };
                    };
                };
            };
        }
        else if (req.url.startsWith('/play')) {
            let gameId = req.url.split('/')[2];
            if (gameId == 6969) {
                res.redirect('https://youtu.be/dQw4w9WgXcQ');
            }
            else if (gameId in require('./commands.js').getGamesList()) {
                if (require('./commands.js').getGamesList()[gameId] instanceof require('./gameClass.js')) {
                    readFile = false;
                    res.sendFile(`${__dirname}/public/games/${require('./commands.js').getGamesList()[gameId].type}.html`);
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
                let games = require('./commands.js').getGamesList();
                if (id in games) {
                    res.json({exists: true, id: id});
                }
                else {
                    res.statusCode = 404;
                    res.json({exists: false, id: id});
                }
            };
        };
        (url == '/single' || url == '/multi' || url == '/options' || url == '/home') ? (() => {
            file = './public/index.html';
        })() : (() => {
            /\./.test(url) ? file = `./public${url}` : file = `./public${url}/index.html`;
        })();
        readFile ? (fs.existsSync(file) ? res.sendFile(`${__dirname}${file.replace('.', '')}`) : res.redirect('/?a')) : false;
    });
    io.on('connection', (socket) => {
        for (const command of Object.keys(commands)) {
            socket.on(`${socket.id}${command}`, (data) => {
                try {
                    commands[command](data.body, (event, data) => {
                        socket.emit(`${socket.id}${event}`, {body: data, id: socket.id});
                    }, socket.id);
                }
                catch(err) {
                    ((event, data) => {
                        socket.emit(`${socket.id}${event}`, data);
                    })('error', {err: err.name, mes: err.message});
                    console.error(err)
                }
            });
        };
        socket.emit('init', socket.id)
    });
    http.listen(process.env.PORT || 80, () => {console.log(`Listening on port ${process.env.PORT || 80}`)});
};