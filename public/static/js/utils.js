$(document).ready(() => {
    let servSocket = io();
    Object.defineProperty(window, 'socket', {
        enumerable: true,
        configurable: false,
        get: () => servSocket,
        set: (value) => {}
    });
    socket.on(`serverError`, (data) => {
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
    socket.on('redirect', (loc) => {
        document.querySelector('body').onbeforeunload = () => {};
        location.replace(loc);
    });
    if (typeof(onload) == 'function') {
        onload();
    };
});

function copy(str) {
    const el = document.createElement('textarea');
    el.value = str;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
};