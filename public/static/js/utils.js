$(document).ready(() => {
    (async () => {
        const socket = io();
        socket.on('init', (data) => {
            if (socket.id === data) {
                socket.on(`${socket.id}error`, (data) => {
                    location.replace(`/error#${btoa(JSON.stringify(data))}`);
                })
                window.emits = ((socket, id) => {
                    return {
                        emit: (event, data) => {
                            return socket.emit(`${id}${event}`, {id: id, body: data});
                        },
                        on: (event, func) => {
                            return socket.on(`${id}${event}`, (data) => {
                                func(data.body, data.id);
                            });
                        }
                    };
                })(socket, socket.id)
            }
        })
    })()
    let mouse = document.createElement('div');
    mouse.id = 'mouse';
    document.querySelector('body').appendChild(mouse);
    mouse = document.getElementById('mouse');
    addEventListener('mousemove', (ev) => {
        mouse.style.top = `${ev.clientY}px`;
        mouse.style.left = `${ev.clientX}px`;
    })
    if (typeof(onload) != 'undefined') {
        onload()
    }
})