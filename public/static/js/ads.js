async function onload() {
    let id = location.search.replace('?', '');
    history.replaceState(null, null, `/play/${id}`);
    if (!Number.isInteger(parseInt(id)) || id.length != 4) return location.replace('/multi');
    try {
        if (!((await (await fetch(`/api?${id}`)).json()).exists)) return location.replace('/multi');
    }
    catch (err) {
        console.error(err);
        onFinish(true);
    };
    socket.on('showAd', (id) => {
        window.adCode = id;
        onFinish();
    });
    socket.emit('ad', sessionStorage.adCode, () => {onFinish(true);});
};

function onFinish(onload) {
    onload ? null : sessionStorage.adCode = adCode;
    localStorage.auth = String(Math.random()).replace('0.', '');
    location.replace(`/play/${location.pathname.replace('/play/', '').replace('/', '')}?${localStorage.auth}`);
};