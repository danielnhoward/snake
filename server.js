module.exports = (express, http_, socket_io, fs, commands) => {
    var app = express(), http = http_.createServer(app), io = socket_io(http);
    app.get('/*', (req, res) => {
        let readFile = true, url = req.url, file;
        /\./.test(url) ? file = `./public${url}` : file = `./public${url}/index.html`;
        readFile ? (fs.existsSync(file) ? res.sendFile(`${__dirname}${file.replace('.', '')}`) : res.redirect('/')) : false;
    });
    io.on('connection', (socket) => {
        for (const command of Object.keys(commands)) {
            socket.on(`${socket.id}${command}`, (data) => {
                try {
                    commands[command](data.body, (event, data) => {
                        socket.emit(`${socket.id}${event}`, data);
                    }, socket.id);
                }
                catch(err) {
                    ((event, data) => {
                        socket.emit(`${socket.id}${event}`, data);
                    })('error', {err: err.name, mes: err.message})
                }
            });
        };
        socket.emit('init', socket.id)
    });
    http.listen(process.env.PORT || 80, () => {console.log(`Listening on port ${process.env.PORT || 80}`)});
};