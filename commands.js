let games = {multi_snake:{abc:undefined}}

module.exports = {
    single_game_finish: (body, emit, token) => {
        db.score.set(token, {username:body.username, snake:body.snake, score:body.score})
    },
    multi_start_game: (body, emit, token) => {
        game_id = make_id()
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
            game_id:game_id
        }
        emit('multi_game_create', games.multi_snake[game_id])
    },
    multi_join_game: (body, emit_func, token) => {
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
                games.multi_snake[body.game_id].p1.emit('start_game', {})
                games.multi_snake[body.game_id].p2.emit('start_game', {})
            break;
        }
    },
    multi_game_tick: (body, emit, token) => {
        console.log(body)
        if (games.multi_snake[body.game_id].p1.token == token) {
            games.multi_snake[body.game_id].p2.emit('multi_server_player_move', {snake:body.game.snake, food:body.game.food, score:body.game.score})
        }
        else if (games.multi_snake[body.game_id].p2.token == token) {
            games.multi_snake[body.game_id].p1.emit('multi_server_player_move', {snake:body.game.snake, food:body.game.food, score:body.game.score})
        }
    },
    print: (body, emit, token) => {
        console.log(body)
        console.log(token)
    },
    yes: (body) => {
        console.log('yes')
        console.log(sadwadsadwadsawdsa.wdsa.dwad)
    }
}