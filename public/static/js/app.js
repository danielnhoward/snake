const pages = ['/home', '/single', '/multi', '/options', '/games'];
const titles = ['Snake', 'Single Player | Snake', 'Multi Player | Snake', 'Options | Snake', 'Public Games | Snake'];
let onload = () => {
    document.getElementById('cursorStart').onmouseover = document.getElementById('cursorStart').onfocus = () => document.getElementById('headImg').style.top = '2px';
    document.getElementById('cursorJoin').onmouseover = document.getElementById('cursorJoin').onfocus = () => document.getElementById('headImg').style.top = '36px';
    document.getElementById('cursorPublic').onmouseover = document.getElementById('cursorPublic').onfocus = () => document.getElementById('headImg').style.top = '70px';
    document.getElementById('cursorBuilder').onmouseover = document.getElementById('cursorBuilder').onfocus = () => document.getElementById('headImg').style.top = '104px';
    reset();
};
if (new URLSearchParams(location.search).get('controls')) {
    $('controls').hide();
    $('#exitBtn').hide();
    document.querySelector('div').style.display = 'none';
}
else {
    addEventListener('popstate', reset);
};

function refreshed() {
    Swal.fire({
        position: 'bottom-start',
        icon: 'success',
        title: 'Refreshed Game List',
        showConfirmButton: false,
        timer: 1000,
        backdrop: false,
        timerProgressBar: true,
        allowOutsideClick: false
    });
};

document.querySelectorAll('a').forEach((el) => {
    if (el.hasAttribute('nonclick')) return;
    el.addEventListener('click', (ev) => {
        ev.preventDefault();
        history.pushState(null, null, ev.currentTarget.href);
        reset();
    });
});

function hideAll() {
    pages.forEach((el) => {
        $(`${el.replace('/', '#')}`).hide();
    });
};

function reset() {
    hideAll();
    if (pages.includes(location.pathname) || location.pathname == '/') {
        if (location.pathname == '/') {
            document.title = 'Snake';
            $('#home').show();
        }
        else {
        document.title = titles[pages.indexOf(location.pathname)];
            $(`${location.pathname.replace('/', '#')}`).show();
        };
    }
    else {
        location.replace('/');
    };

    if (location.search) {
        let error = location.search;
        history.replaceState(null, null, location.pathname);
        if (error == '?a') {
            Swal.fire({
                icon: 'error',
                title: '<h1>404 Error</h1>',
                html: '<div style="color: white;">Looks like we couldn\'t find the file you wanted, instead we\'ve put you back on the homepage.</div>'
            });
        }
        else if (error == '?b') {
            (async () => {
                await Swal.fire({
                    icon: 'error',
                    title: 'The Game ID is inncorrect'
                });
                setTimeout(() => {
                    joinGame();
                }, 300);
            })();
        }
        else if (error == '?c') {
            Swal.fire({
                icon: 'error',
                title: 'The Game has timed out'
            });
        }
        else if (error == '?d') {
            Swal.fire({
                icon: 'error',
                title: 'We have detected that you have entered something into the console.'
            });
        }
        else if (error == '?e') {
            joinGame();
        };
    };

    let settings = new Settings();

    /* Single Player */
    // document.getElementById('gameSpeed').oninput = () => {
    //     document.getElementById('clientGameSpeed').innerHTML = document.getElementById('gameSpeed').value;
    //     setConfigItem('gameSpeed', document.getElementById('gameSpeed').value);
    // };
    // settings.gameSpeed ? (() => {
    //     document.getElementById('clientGameSpeed').innerHTML = settings.gameSpeed;
    //     document.getElementById('gameSpeed').value = settings.gameSpeed;
    // })() : (() => {
    //     document.getElementById('clientGameSpeed').innerHTML = '100';
    //     document.getElementById('gameSpeed').value = 100;
    // })();
    // document.getElementById('gameTime').oninput = () => {
    //     document.getElementById('clientGameTime').innerHTML = document.getElementById('gameTime').value;
    //     setConfigItem('gameTime', document.getElementById('gameTime').value);
    // };
    // if (settings.gameTime == 'off') {
    //     document.getElementById('gameTime').disabled = true;
    //     document.getElementById('timed').checked = false;
    //     document.getElementById('gameTimeArea').style.opacity = 0.5;
    //     document.getElementById('clientGameTime').innerHTML = '120';
    //     document.getElementById('gameTime').value = 120;
    // }
    // else {
    //     document.getElementById('clientGameTime').innerHTML = settings.gameTime;
    //     document.getElementById('gameTime').value = settings.gameTime;
    //     document.getElementById('timed').checked = true;
    // };

    // document.getElementById('timed').oninput = () => {
    //     document.getElementById('timed').checked ? (() => {
    //         document.getElementById('gameTime').disabled = false;
    //         document.getElementById('gameTimeArea').style.opacity = 1;
    //         document.getElementById('clientGameTime').innerHTML = Number.isInteger(parseInt(getConfig().gameTime)) ? getConfig().gameTime : 120;
    //         document.getElementById('gameTime').value = Number.isInteger(parseInt(getConfig().gameTime)) ? getConfig().gameTime : 120;
    //     })() : (() => {
    //         document.getElementById('gameTime').disabled = true;
    //         document.getElementById('gameTimeArea').style.opacity = 0.5;
    //         document.getElementById('clientGameTime').innerHTML = Number.isInteger(parseInt(getConfig().gameTime)) ? getConfig().gameTime : 120; 
    //         document.getElementById('gameTime').value = Number.isInteger(parseInt(getConfig().gameTime)) ? getConfig().gameTime : 120;  
    //     })();
    // }

    // document.getElementById('singlePlay').onsubmit = (ev) => {
    //     ev.preventDefault();
    //     let playSettings = getConfig();
    //     playSettings.gameSpeed = document.getElementById('gameSpeed').value;
    //     playSettings.gameTime = document.getElementById('timed').checked ? document.getElementById('gameTime').value : 'off';
    //     setConfig(playSettings);
    //     location.href = '/singleSnake';
    // };

    document.getElementById('headImg').src = settings.head;

    /* Multi player */
    function setSettings(gameSpeed, gameSize) {
        let percentage = 1;
        let value = parseInt(gameSpeed);
        value *= -1;
        percentage = (value / 100) + 1;
        gameSpeed = (1000 / ((1000 / gameSize) / 2)) * percentage;
        return {
            gameSpeed: gameSpeed,
            gameSize: gameSize
        };
    };

    const gameSizes = [[200, 'Super Small (may be imposible to play on)'], [100, 'Small'], [50, 'Medium'], [40, 'Normal'], [20, 'Big'], [10, 'Bigger'], [1, 'Super Big (may cause major lag)']]

    document.getElementById('gameSpeedMulti').oninput = () => {
        document.getElementById('clientGameSpeedMulti').innerHTML = parseInt(document.getElementById('gameSpeedMulti').value) + 100;

        let multiSettings = setSettings(document.getElementById('gameSpeedMulti').value, gameSizes[document.getElementById('gameSizeMulti').value][0]);
        settings.gameSpeed = multiSettings.gameSpeed;
        settings.gameSize = multiSettings.gameSize;
    };


    document.getElementById('gameSizeMulti').oninput = () => {
        document.getElementById('clientGameSizeMulti').innerHTML = gameSizes[document.getElementById('gameSizeMulti').value][1];

        let multiSettings = setSettings(document.getElementById('gameSpeedMulti').value, gameSizes[document.getElementById('gameSizeMulti').value][0]);
        settings.gameSpeed = multiSettings.gameSpeed;
        settings.gameSize = multiSettings.gameSize;
    };

    document.getElementById('startLength').oninput = () => {
        document.getElementById('clientStartLengthMulti').innerHTML = document.getElementById('startLength').value;
        settings.startLength = document.getElementById('startLength').value;
    };

    document.getElementById('foodCount').oninput = () => {
        document.getElementById('clientFoodCount').innerHTML = document.getElementById('foodCount').value;
    };

    document.getElementById('gameSpeedMulti').oninput();
    document.getElementById('gameSizeMulti').oninput();
    document.getElementById('foodCount').value = 1;
    document.getElementById('clientFoodCount').innerHTML = 1;
    document.getElementById('foodCount').oninput();
    document.getElementById('clientStartLengthMulti').innerHTML = 3;
    document.getElementById('startLength').value = 3;
    settings.startLength = 3;
    document.getElementById('startLength').oninput();
    

    document.getElementById('multiPlay').onsubmit = (ev) => {
        ev.preventDefault();
        console.log(`/start/snake/${settings.gameSpeed}/${settings.gameSize}/${settings.startLength}/${document.getElementById('public').checked}/${document.getElementById('foodCount').value}`)
        location.href = `/start/snake/${settings.gameSpeed}/${settings.gameSize}/${settings.startLength}/${document.getElementById('public').checked}/${document.getElementById('foodCount').value}`;
    };



    /* Options */
    const keyInps = [
        {button: document.getElementById('upKey'), dis: document.getElementById('upKeyDis'), name: 'up'},
        {button: document.getElementById('leftKey'), dis: document.getElementById('leftKeyDis'), name: 'left'},
        {button: document.getElementById('rightKey'), dis: document.getElementById('rightKeyDis'), name: 'right'},
        {button: document.getElementById('downKey'), dis: document.getElementById('downKeyDis'), name: 'down'}
    ];
    keyInps.forEach((el) => {
        function keyDown(ev) {
            settings[el.name] = ev.keyCode;
            settings[`${el.name}Key`] = ev.key;
            el.dis.innerHTML = ev.key;
        }
        el.button.addEventListener('keydown', keyDown)
        el.dis.innerHTML = settings[`${el.name}Key`];
    });


    /* Build a snake */
    resetCanvas();
    
    (async () => {
        let snakes = await (await fetch('/snakes.json')).json();

        ['head', 'straight', 'tail', 'corner', 'food', 'background'].forEach((field) => {
            let html = [
                '<select class="image-picker" style="color: black;">',
                '<option value=""></option>',
                `<option data-img-src="${settings[field]}" data-img-class="current" data-img-alt="Current" value="current">Current</option>`
            ];
            let endHtml = [
                '</select>',
                `<select class="image-picker" style="color: black;">`,
                '<option value=""></option>',
                `<option data-img-src="/static/img/upload-icon.svg" data-img-class="upload" data-img-alt="Upload from files" value="upload">Upload from files</option>`,
                '</select>'
            ]
            snakes.forEach((el, index) => {
                html.push(`<option data-img-src="/static/img/gameAssets/${el}/${field}.png" data-img-class="snakeOp${index}" data-img-alt="${el}" value="${el}">${el}</option>`);
            });
            html = [...html, ...endHtml];
            document.querySelectorAll(`#${field}`).forEach((el) => {
                el.src = settings[field];
                el.style.cursor = 'pointer';
                el.onclick = () => {
                    Swal.fire({
                        title: `<strong>Pick a ${field}</strong>`,
                        width: field == 'background' ? 400 : 'auto',
                        html: html,
                        didOpen: (doc) => {
                            $("select").imagepicker({
                                hide_select : true,
                                show_label  : true,
                                changed: (from, to) => {
                                    window.selected = to[0];
                                    if (to[0] == 'upload') {
                                        snakes.forEach((el, index) => {
                                            doc.getElementsByClassName(`snakeOp${index}`)[1].classList.contains('selected') ? doc.getElementsByClassName(`snakeOp${index}`)[1].click() : null;
                                        });
                                        doc.getElementsByClassName(`current`)[1].classList.contains('selected') ? doc.getElementsByClassName(`current`)[1].click() : null;
                                        doc.getElementsByClassName('upload')[1].classList.contains('selected') ? null  : doc.getElementsByClassName('upload')[1].click();
                                    }
                                    else {
                                        doc.getElementsByClassName('upload')[1].classList.contains('selected') ?  doc.getElementsByClassName('upload')[1].click() : null;
                                    };
                                }
                            });
                        },
                        target: '#pop-up',
                        showCancelButton: true
                    })
                    .then((result) => {
                        if (result.isConfirmed && window.selected) {
                            let option = selected;
                            delete selected;
                            if (option == 'upload') return document.getElementById(`${field}Input`).click();
                            snakes.forEach((el) => {
                                if (option == el) {
                                    document.querySelectorAll(`#${field}`).forEach((innerEl) => {
                                        innerEl.src = `/static/img/gameAssets/${el}/${field}.png`;
                                    });
                                    settings[field] = `/static/img/gameAssets/${el}/${field}.png`;
                                    reset();
                                    return;
                                };
                            });
                        };
                    });
                };
            });
            document.getElementById(`${field}Input`).oninput = () => {
                document.querySelectorAll(`#${field}`).forEach((el) => {
                    el.src = '/static/img/loading.gif';
                });
                let file = document.getElementById(`${field}Input`).files[0];
                let reader = new FileReader();

                reader.readAsDataURL(file);
                reader.name = file.name;
                reader.size = file.size;
                reader.onload = (ev) => {
                    let img = new Image();
                    img.src = ev.target.result;
                    img.size = ev.target.size;
                    img.onload = (ev) => {
                        let canvas = document.createElement('canvas');
                        canvas.width = field == 'background' ? 1000 : 60;
                        canvas.height = field == 'background' ? 1000 : 60;

                        let ctx = canvas.getContext('2d');
                        ctx.drawImage(ev.target, 0, 0, canvas.width, canvas.height);

                        let imgSrc = ctx.canvas.toDataURL('image/png', 1);
                        document.querySelectorAll(`#${field}`).forEach((el) => {
                            el.src = imgSrc;
                        });

                        settings[field] =  imgSrc;
                        reset()

                    };
                };
            };
        });
        document.getElementById('presets').onclick = () => {
            let html = [];
            snakes.forEach((el, index) => {
                html.push(
                    '<select class="image-picker" style="color: black;">',
                    '<option value=""></option>',
                    `<option data-img-src="/static/img/gameAssets/presets/${el}.png" data-img-class="snakeOp${index}" data-img-alt="${el}" value="${el}">${el}</option>`,
                    '</select>'
                );
            });
            Swal.fire({
                title: `<strong>Pick a Preset</strong>`,
                width: 'auto',
                html: html,
                didOpen: (doc) => {
                    $("select").imagepicker({
                        hide_select : true,
                        show_label  : true,
                        changed: (from, to) => {
                            snakes.forEach((el, index) => {
                                if (to[0] == el) {
                                    window.selected = el;
                                    snakes.forEach((innerEl, innerIndex) => {
                                        if (index != innerIndex) {
                                            doc.getElementsByClassName(`snakeOp${innerIndex}`)[1].classList.contains('selected') ? doc.getElementsByClassName(`snakeOp${innerIndex}`)[1].click() : null;
                                        };
                                    });
                                };
                            });
                        }
                    });
                },
                target: '#pop-up',
                showCancelButton: true
            })
            .then((result) => {
                if (result.isConfirmed && window.selected) {
                    let option = selected;
                    delete selected;
                    snakes.forEach((el) => {
                        if (option == el) {
                            ['head', 'straight', 'tail', 'corner', 'food', 'background'].forEach((field) => {
                                settings[field] = `/static/img/gameAssets/${el}/${field}.png`;
                            });
                            reset();
                        };
                    });
                };
            });
        };
    })();
};

/*function showPopup(param) {
    param ? (() => {
        Swal.fire({
            icon: 'info',
            html: '<div style="font-size: medium; color: grey;"><b style="font-size: large; color: white;">Game Speed</b><br>Game speed is how often the snake will move. 1000ms are equal to 1 second.</div>'
        });
    })() : (() => {
        Swal.fire({
            icon: 'info',
            html: '<div style="font-size: medium; color: grey;"><b style="font-size: large; color: white;">Game Speed</b><br>Game speed is how often the snake will move. 1000ms are equal to 1 second.<br><b style="font-size: large; color: white;">Game Time</b><br>Game is how long the game will last for.</div>'
        });
    })();
};*/




function joinGame() {
    Swal.fire({
        title: 'Enter your Game ID',
        input: 'text',
        inputAttributes: {
            autocapitalize: 'off'
        },
        showCancelButton: true,
        confirmButtonText: 'Join',
        showLoaderOnConfirm: true,
        preConfirm: (id) => {
            return fetch(`/api?${id}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(response.statusText);
                };
                return response.json();
            })
            .catch(error => {
                Swal.showValidationMessage(`Looks like that Game ID doesn't exist`);
            });
        },
        allowOutsideClick: () => !Swal.isLoading()
    })
    .then((result) => {
        if (result.isConfirmed) {
            location.href = `/ad?${result.value.id}`;
        };
    });
};

function resetSettings() {
    Swal.fire({
        position: 'bottom-start',
        icon: 'success',
        title: 'Settings have been reset',
        showConfirmButton: false,
        timer: 1000,
        backdrop: false,
        timerProgressBar: true,
        allowOutsideClick: false
    });
};


function resetCanvas() {
    let settings = new Settings();
    document.getElementById('presethead').src = settings.head;
    document.getElementById('presetstraight').src = settings.straight;
    document.getElementById('presettail').src = settings.tail;
    if (window.interval) clearInterval(interval);
    const snakePath = [
        {coords: {x: 30, y: 30}, vel: {x: 30, y: 0}},
        {coords: {x: 240, y: 30}, vel: {x: 0, y: 30}},
        {coords: {x: 240, y: 240}, vel: {x: -30, y: 0}},
        {coords: {x: 30, y: 240}, vel: {x: 0, y: -30}}
    ];
    let vel = {x: 30, y: 0};
    let snake = [{x:30, y:30, name: '', vel: vel, id: 0, position: {x: 30, y: 30}}];
    let current = -1;
    let lengthDebt = 5;
    window.canvas = new MultiCanvas('snakePreview', settings, 30);
    canvas.setImage(0, {
        head: settings.head,
        body: settings.straight,
        tail: settings.tail,
        corner: settings.corner
    });
    window.interval = setInterval(() => {
        if (current >= 3) current = -1;
        if (snakePath[current + 1].coords.x == snake[0].x && snakePath[current + 1].coords.y == snake[0].y) {
            vel = snakePath[current + 1].vel;
            current++;
        };

        snake.unshift({x:snake[0].x + vel.x, y:snake[0].y + vel.y, name: '', vel: vel, id: 0, position: {x:snake[0].x + vel.x, y:snake[0].y + vel.y}});
        if (lengthDebt) lengthDebt--;
        else snake.pop();

        canvas.drawGame({players: [{snake: snake}], food: [{x: 135, y: 135}]});
    }, 200);
};


onresize = () => {
    if (innerHeight > innerWidth) {
        document.getElementById('snakePreview').style.width = '70vw';
        document.getElementById('snakePreview').style.height = '70vw';
    }
    else {
        document.getElementById('snakePreview').style.width = '90%';
        document.getElementById('snakePreview').style.height = '90%';
    };
};
onresize();

document.getElementById('importUpload').oninput = () => {
    try {
        document.getElementById('shareImg').src = '/static/img/loading.gif';
        document.getElementById('export').style.cursor = 'deafult';

        let settings = new Settings();

        let file = document.getElementById(`importUpload`).files[0];
        let reader = new FileReader();

        reader.readAsDataURL(file);
        reader.onload = (ev) => {
            let config = JSON.parse(atob(ev.target.result.split('base64,')[1]));
            switch(config.v) {
                case 0:
                    ['head', 'straight', 'tail', 'corner', 'food', 'background'].forEach((field) => {
                        settings[field] = config.skin[field];
                    });
                    reset();
                break;
                default:
                    throw new Error('Improper Version');
                break;
            }
        };
    }
    catch (err) {
        Swal.fire({
            title: 'Looks like we encounted an error!',
            icon: 'error',
            html: `Error: ${err.name}<br>Message: ${err.message}`
        });
    };
    document.getElementById('shareImg').src = '/static/img/export-icon.svg';
    document.getElementById('export').style.cursor = 'pointer';
};


document.getElementById('export').onclick = (ev) => {
    if (!ev.isTrusted) return;
    Swal.fire({
        title: `<strong>Pick an Option</strong>`,
        width: 'auto',
        html: [
            '<select class="image-picker" style="color: black;">',
            `<option data-img-src="/static/img/upload-icon.svg" data-img-class="opt1" data-img-alt="Import" value="import">Import a save</option>`,
            `<option data-img-src="/static/img/export-icon.svg" data-img-class="opt2" data-img-alt="Download" value="download">Export this save</option>`,
            '</select>'
        ],
        didOpen: (doc) => {
            $("select").imagepicker({
                hide_select : true,
                show_label  : true,
                changed: (from, to) => {
                    switch (to[0]) {
                        case 'import':
                            doc.getElementsByClassName('opt2')[1].classList.contains('selected') ? doc.getElementsByClassName('opt2')[1].click() : null;
                            window.selected  = 1;
                        break;
                        case 'download':
                            doc.getElementsByClassName('opt1')[1].classList.contains('selected') ? doc.getElementsByClassName('opt1')[1].click() : null;
                            window.selected  = 2;
                        break;
                    };
                }
            });
            window.selected  = 1;
            doc.getElementsByClassName('opt1')[0].style.width = '100px';
            doc.getElementsByClassName('opt2')[0].style.width = '100px';
            doc.getElementsByClassName('opt1')[0].style.height = 'auto';
            doc.getElementsByClassName('opt2')[0].style.height = 'auto';
        },
        target: '#pop-up',
        showCancelButton: true
    })
    .then((result) => {
        if (result.isConfirmed && window.selected) {
            let option = selected;
            delete selected;
            switch (option) {
                case 1:
                    document.getElementById('importUpload').click();
                break;
                case 2:
                    let settings = new Settings();
                    const userConfig = {
                        v: 0,
                        skin: {
                            head: settings.head,
                            straight: settings.straight,
                            tail: settings.tail,
                            corner: settings.corner,
                            food: settings.food,
                            background:  settings.background
                        }
                    };
                    let blob = new Blob([JSON.stringify(userConfig)], {type: 'text/plain'});
                    let url = URL.createObjectURL(blob);
                    let a = document.createElement('a');
                    a.href = url;
                    a.download = `${Date.now()}.snakeee`;
                    a.click();
                break;
            };
        };
    });
};
