var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var fs = require('fs')
const mime = require('mime')
let games = {multi_snake:{}}

const socket_commands = [
    ['multi_start_game', (body, emit, token) => {
        let game_id = make_id()
        games.multi_snake[game_id] = {
            p1:{
                token:null,
                username:null,
                emit:null,
                game:null
            },
            p2:{
                token:null,
                username:null,
                emit:null,
                game:null
            },
            status:'waiting_for_p1_connection',
            game_id:game_id,
            game_speed:body.game_speed,
            game_time:body.game_time
        }
        emit('multi_game_create', games.multi_snake[game_id])
    }],
    ['multi_join_game', (body, emit_func, token) => {
        if (!(body.game_id in games.multi_snake)) return emit_func('invalid_code', null);
        switch (games.multi_snake[body.game_id].status) {
            case 'waiting_for_p1_connection':
                games.multi_snake[body.game_id].p1 = {
                    token:token,
                    username:null,
                    emit:emit_func
                }
                games.multi_snake[body.game_id].status = 'waiting_for_p2_connection'
            break;
            case 'waiting_for_p2_connection':
                games.multi_snake[body.game_id].p2 = {
                    token:token,
                    username:null,
                    emit:emit_func
                }
                games.multi_snake[body.game_id].status = 'starting_game'
                games.multi_snake[body.game_id].p1.emit('start_game', {game_speed:games.multi_snake[body.game_id].game_speed, game_time:games.multi_snake[body.game_id].game_time})
                games.multi_snake[body.game_id].p2.emit('start_game', {game_speed:games.multi_snake[body.game_id].game_speed, game_time:games.multi_snake[body.game_id].game_time})
            break;
            case 'starting_game':
                emit_func('invalid_code', null);
            break;
        }
    }],
    ['multi_game_tick', (body, emit, token) => {
        if (games.multi_snake[body.game_id].p1.token == token) {
            games.multi_snake[body.game_id].p2.emit('multi_server_player_move', {snake:body.game.snake, food:body.game.food, score:body.game.score})
        }
        else if (games.multi_snake[body.game_id].p2.token == token) {
            games.multi_snake[body.game_id].p1.emit('multi_server_player_move', {snake:body.game.snake, food:body.game.food, score:body.game.score})
        }
    }],
    ['client_game_end', (body, emit, token) => {
        if (games.multi_snake[body].p1.token == token) {
            games.multi_snake[body].p1.emit('server_game_end', 'Lost')
            games.multi_snake[body].p2.emit('server_game_end', 'Won')
        }
        else if (games.multi_snake[body].p2.token == token) {
            games.multi_snake[body].p2.emit('server_game_end', 'Lost')
            games.multi_snake[body].p1.emit('server_game_end', 'Won')
        }
        delete games.multi_snake[body]
    }],
    ['client_game_end', (body, emit, token) => {
        games.multi_snake[body].p2.emit('server_game_end', 'ran out of time!')
        games.multi_snake[body].p1.emit('server_game_end', 'ran out of time!')
    }]
]

function make_id(length=5) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    if (result in games.multi_snake) return make_id(length)
    return result;
 }

app.get('*', (req, res) => {
    let url = req.url
    let file
    let read_file = true
    if (url.includes('game')) {
        read_file = false
        res.redirect('https://youtu.be/dQw4w9WgXcQ')
    }
    else if (url.includes('.')) {
        file = './public' + url
    }
    else {
        file = './public' + url + '/index.html'
    }
    if (read_file) {
        try {
            if (fs.existsSync(file)) {
                res.statusCode = 200
                res.setHeader('Content-Type', mime.getType(__dirname + String(file).replace('.', '')))
                res.sendFile(__dirname + String(file).replace('.', ''))
            }
            else {
                res.redirect('/')
            }
        }
        catch (err) {
            res.statusCode = 500
            res.send('Major error: Please contact site owner')
            console.error(err)
        }
    }
  });

const PORT = process.env.PORT || 80;
http.listen(PORT, () => {
    console.log(`App is running on port ${PORT}`);
});

io.on('connection', (socket) => {
    socket.on('add_user', (data) => {
        for (const x of socket_commands) {
            socket.on(data.token + x[0], (data) => {
                x[1](data.body, (socket_event, func_data) => {
                    socket.emit(data.token + socket_event, {body:func_data, token:data.token})
                }, data.token)
            })
        }
    })
    socket.on('reconnect_user', (data) => {
        for (const x of socket_commands) {
            socket.on(data.token + x[0], (data) => {
                x[1](data.body, (socket_event, func_data) => {
                    socket.emit(data.token + socket_event, {body:func_data, token:data.token})
                }, data.token)
            })
        }
    })
})
