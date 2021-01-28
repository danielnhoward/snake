const { parse } = require('url');

module.exports = (express, http_, socket_io, fs, commands) => {
    var app = express(), http = http_.createServer(app), io = socket_io(http);
    app.get('/*', (req, res) => {
        let readFile = true, url = req.url.split('?')[0], file;
        if (req.url.includes('start')) {
            if (req.url.includes('snake')) {
                if (Number.isInteger(parseInt(req.url.split('/')[3]))) {
                    if (req.url.split('/')[3] >= 20 && req.url.split('/')[3] <= 500) {
                        readFile = false;
                        res.redirect(`/play/${require('./commands.js').makeSnakeGame(req.url.split('/')[3])}`);
                    };
                };
            };
        }
        else if (req.url.includes('play')) {
            let gameId = req.url.split('/')[2];
            if (gameId in require('./commands.js').getGamesList()) {
                if (require('./commands.js').getGamesList()[gameId] instanceof require('./gameClass.js')) {
                    readFile = false;
                    res.sendFile(`${__dirname}/public/games/${require('./commands.js').getGamesList()[gameId].type}.html`);
                };
            };
        };
        /\./.test(url) ? file = `./public${url}` : file = `./public${url}/index.html`;
        readFile ? (fs.existsSync(file) ? res.sendFile(`${__dirname}${file.replace('.', '')}`) : res.redirect('/')) : false;
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