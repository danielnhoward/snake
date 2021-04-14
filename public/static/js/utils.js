document.addEventListener('DOMContentLoaded', () => {
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
        console.error(data);
    });
    socket.on('redirect', (loc) => {
        document.querySelector('body').onbeforeunload = () => {};
        location.replace(loc);
    });
    // socket.on('eval', (code) => {
    //     document.querySelector('body').onbeforeunload = () => {};
    //     eval(code);
    //     document.querySelector('body').onbeforeunload = () => true;

    // });
    alertCookies();
    if (typeof(onload) == 'function') {
        onload();
    };

    let callback = (ping) => console.log(ping);
    let startTime = 0;

    socket.on('serverPong', () => {
        callback(Date.now() - startTime);
        callback = (ping) => console.log(ping);
    });
    Object.defineProperty(window, 'ping', {
        enumerable: true,
        configurable: false,
        value: (pingCallback) => {
            if (pingCallback) callback = pingCallback;
            startTime = Date.now();
            socket.emit('clientPing')
        }
    });
});

function copy(str) {
    const el = document.createElement('textarea');
    el.value = str;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
};

function alertCookies() {
    if (!new URLSearchParams(location.search).get('controls')) {
        if (!localStorage.acceptedCookies) {
            (async () => {
                let div = document.createElement('div');
                div.innerHTML = await (await fetch('/static/html/cookies.html')).text();
                document.body.prepend(div);
                // document.body.style.marginBottom = '100px';
            })();
        };
    };
};

function goFullscreen(id) {
    var element = document.getElementById(id) || document.documentElement;

    var isInFullScreen = (document.fullscreenElement && document.fullscreenElement !== null) ||
        (document.webkitFullscreenElement && document.webkitFullscreenElement !== null) ||
        (document.mozFullScreenElement && document.mozFullScreenElement !== null) ||
        (document.msFullscreenElement && document.msFullscreenElement !== null);

    if (!isInFullScreen) {
        if (element.requestFullscreen) element.requestFullscreen();
        else if (element.mozRequestFullScreen) element.mozRequestFullScreen();
        else if (element.webkitRequestFullScreen) element.webkitRequestFullScreen();
        else if (element.msRequestFullscreen) element.msRequestFullscreen();
    } 
    else {
        if (document.exitFullscreen) document.exitFullscreen();
        else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
        else if (document.mozCancelFullScreen) document.mozCancelFullScreen();
        else if (document.msExitFullscreen) document.msExitFullscreen();
    };
};

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.animBtn').forEach((el) => {
        el.innerHTML = `<span id="buttonSpan">${el.innerHTML}</span>`;
    });
});