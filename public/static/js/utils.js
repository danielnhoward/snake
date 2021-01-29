$(document).ready(() => {
    (async () => {
        const socket = io();
        socket.on('init', (data) => {
            if (socket.id === data) {
                socket.on(`${socket.id}error`, (data) => {
                    Swal.fire({
                        icon: 'error',
                        html: `<div style="font-size: small; color: grey;"><b style="font-size: medium; color: black;">Looks like we have encouted an error on our side! This error should be fixed soon, Sorry for any inconvinience caused.</b><br><small style="color: grey;">Type: ${data.err}<br>Message: ${data.mes}</small></div>`,
                        backdrop: true,
                        allowOutsideClick: false,
                        allowEscapeKey: false,
                        allowEnterKey: false,
                        showConfirmButton: false
                    });
                });
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
                })(socket, socket.id);
            };
            if (typeof(onload) == 'function') {
                onload();
            };
        });
    })();
});

function copy(str) {
    const el = document.createElement('textarea');
    el.value = str;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
};