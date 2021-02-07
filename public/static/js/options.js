onload = reset;

function reset() {
    /* Build a snake */
    resetCanvas();
    let settings = getConfig();
    
    ['head', 'straight', 'tail', 'corner', 'food'].forEach((field) => {
        document.querySelectorAll(`#${field}`).forEach((el) => {
            el.src = settings[field];
            el.style.cursor = 'pointer';
            el.onclick = () => {
                let settings = getConfig();
                Swal.fire({
                    title: `<strong>Pick a ${field}</strong>`,
                    width: 'auto',
                    html: [
                        '<select class="image-picker" style="color: black;">',
                        '<option value=""></option>',
                        `<option data-img-src="${settings[field]}" data-img-class="opt1" data-img-alt="Current" value="current">Current</option>`,
                        `<option data-img-src="/static/img/gameAssets/deafult/${field}.png" data-img-class="opt2" data-img-alt="Deafult" value="deafult">Deafult</option>`,
                        `<option data-img-src="/static/img/gameAssets/Big-Red/${field}.png" data-img-class="opt3" data-img-alt="Big Red" value="bigRed">Big Red</option>`,
                        `<option data-img-src="/static/img/gameAssets/Greyscale/${field}.png" data-img-class="opt5" data-img-alt="Greyscale" value="greyscale">Greyscale</option>`,
                        '</select>',
                        `<select class="image-picker" style="color: black;">`,
                        '<option value=""></option>',
                        `<option data-img-src="/static/img/upload-icon.svg" data-img-class="opt4" data-img-alt="Upload from files" value="upload">Upload from files</option>`,
                        '</select>'
                    ],
                    didOpen: (doc) => {
                        $("select").imagepicker({
                            hide_select : true,
                            show_label  : true,
                            changed: (from, to) => {
                                switch (to[0]) {
                                    case 'current':
                                        doc.getElementsByClassName('opt4')[1].classList.contains('selected') ? doc.getElementsByClassName('opt4')[1].click() : null;
                                        window.selected  = 0;
                                    break;
                                    case 'upload':
                                        doc.getElementsByClassName('opt1')[1].classList.contains('selected') ? doc.getElementsByClassName('opt1')[1].click() : null;
                                        doc.getElementsByClassName('opt2')[1].classList.contains('selected') ? doc.getElementsByClassName('opt2')[1].click() : null;
                                        doc.getElementsByClassName('opt3')[1].classList.contains('selected') ? doc.getElementsByClassName('opt3')[1].click() : null;
                                        doc.getElementsByClassName('opt5')[1].classList.contains('selected') ? doc.getElementsByClassName('opt3')[1].click() : null;
                                        window.selected  = 1;
                                    break;
                                    case 'deafult':
                                        doc.getElementsByClassName('opt4')[1].classList.contains('selected') ? doc.getElementsByClassName('opt4')[1].click() : null;
                                        window.selected  = 2;
                                    break;
                                    case 'bigRed':
                                        doc.getElementsByClassName('opt4')[1].classList.contains('selected') ? doc.getElementsByClassName('opt4')[1].click() : null;
                                        window.selected  = 3;
                                    break;
                                    case 'greyscale':
                                        doc.getElementsByClassName('opt4')[1].classList.contains('selected') ? doc.getElementsByClassName('opt4')[1].click() : null;
                                        window.selected  = 4;
                                    break;
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
                        switch (option) {
                            case 1:
                                document.getElementById(`${field}Input`).click();
                            break;
                            case 2:
                                document.querySelectorAll(`#${field}`).forEach((el) => {
                                    el.src = `/static/img/gameAssets/deafult/${field}.png`;
                                });
                                setConfigItem(field, `/static/img/gameAssets/deafult/${field}.png`);
                                resetCanvas();
                                settings = getConfig();
                            break;
                            case 3:
                                document.querySelectorAll(`#${field}`).forEach((el) => {
                                    el.src = `/static/img/gameAssets/Big-Red/${field}.png`;
                                });
                                setConfigItem(field, `/static/img/gameAssets/Big-Red/${field}.png`);
                                resetCanvas(); 
                                settings = getConfig();
                            break;
                            case 4:
                                document.querySelectorAll(`#${field}`).forEach((el) => {
                                    el.src = `/static/img/gameAssets/Greyscale/${field}.png`;
                                });
                                setConfigItem(field, `/static/img/gameAssets/Greyscale/${field}.png`);
                                resetCanvas(); 
                                settings = getConfig();
                        }
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
                    canvas.width = 60;
                    canvas.height = 60;

                    let ctx = canvas.getContext('2d');
                    ctx.drawImage(ev.target, 0, 0, canvas.width, canvas.height);

                    let imgSrc = ctx.canvas.toDataURL('image/png', 1);
                    document.querySelectorAll(`#${field}`).forEach((el) => {
                        el.src = imgSrc;
                    });

                    setConfigItem(field, imgSrc);
                    resetCanvas();

                };
            };
        };
    });
    document.getElementById('presets').onclick = () => {
        let settings = getConfig();
        Swal.fire({
            title: `<strong>Pick a Preset</strong>`,
            width: 'auto',
            html: [
                '<select class="image-picker" style="color: black;">',
                '<option value=""></option>',
                `<option data-img-src="/static/img/gameAssets/presets/deafult.png" data-img-class="opt1" data-img-alt="Deafult" value="deafult">Deafult</option>`,
                '</select>',
                `<select class="image-picker" style="color: black;">`,
                '<option value=""></option>',
                `<option data-img-src="/static/img/gameAssets/presets/Big-Red.png" data-img-class="opt2" data-img-alt="bigRed" value="bigRed">Big-Red</option>`,
                '</select>',
                `<select class="image-picker" style="color: black;">`,
                '<option value=""></option>',
                `<option data-img-src="/static/img/gameAssets/presets/Greyscale.png" data-img-class="opt3" data-img-alt="greyscale" value="greyscale">Greyscale</option>`,
                '</select>'
            ],
            didOpen: (doc) => {
                $("select").imagepicker({
                    hide_select : true,
                    show_label  : true,
                    changed: (from, to) => {
                        switch (to[0]) {
                            case 'deafult':
                                doc.getElementsByClassName('opt2')[1].classList.contains('selected') ? doc.getElementsByClassName('opt2')[1].click() : null;
                                doc.getElementsByClassName('opt3')[1].classList.contains('selected') ? doc.getElementsByClassName('opt3')[1].click() : null;
                                window.selected  = 1;
                            break;
                            case 'bigRed':
                                doc.getElementsByClassName('opt1')[1].classList.contains('selected') ? doc.getElementsByClassName('opt1')[1].click() : null;
                                doc.getElementsByClassName('opt3')[1].classList.contains('selected') ? doc.getElementsByClassName('opt3')[1].click() : null;
                                window.selected  = 2;
                            break;
                            case 'greyscale':
                                doc.getElementsByClassName('opt1')[1].classList.contains('selected') ? doc.getElementsByClassName('opt1')[1].click() : null;
                                doc.getElementsByClassName('opt2')[1].classList.contains('selected') ? doc.getElementsByClassName('opt2')[1].click() : null;
                                window.selected  = 3;
                            break;
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
                switch (option) {
                    case 1:
                        ['head', 'straight', 'tail', 'corner', 'food'].forEach((field) => {
                            setConfigItem(field, `/static/img/gameAssets/deafult/${field}.png`);
                        });
                        resetCanvas();
                        reset();
                        settings = getConfig();
                    break;
                    case 2:
                        ['head', 'straight', 'tail', 'corner', 'food'].forEach((field) => {
                            setConfigItem(field, `/static/img/gameAssets/Big-Red/${field}.png`);
                        });
                        resetCanvas();
                        reset();
                        settings = getConfig();
                    break;
                    case 3:
                        ['head', 'straight', 'tail', 'corner', 'food'].forEach((field) => {
                            setConfigItem(field, `/static/img/gameAssets/Greyscale/${field}.png`);
                        });
                        resetCanvas();
                        reset();
                        settings = getConfig();
                    break;
                };
            };
        });
    };
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
    let settings = getConfig();
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
    let snake = [{x:30, y:30, name: '', vel: vel, id: 0}];
    let current = -1;
    let lengthDebt = 5;
    window.canvas = new MultiCanvas('snakePreview', getConfig(), 30);
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

        snake.unshift({x:snake[0].x + vel.x, y:snake[0].y + vel.y, name: '', vel: vel, id: 0});
        if (lengthDebt) lengthDebt--;
        else snake.pop();

        canvas.drawGame({players: [snake], food: [{x: 135, y: 135}]});
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

        let file = document.getElementById(`importUpload`).files[0];
        let reader = new FileReader();

        reader.readAsDataURL(file);
        reader.name = file.name;
        reader.size = file.size;
        reader.onload = (ev) => {
            let config = JSON.parse(atob(ev.target.result.split('base64,')[1]));
            switch(config.v) {
                case 0:
                    ['head', 'straight', 'tail', 'corner', 'food'].forEach((field) => {
                        setConfigItem(field, config.skin[field]);
                    });
                    setConfigItem('background', config.background);
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
                    let settings = getConfig();
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
                    let blob = new Blob([JSON.stringify(userConfig)], {type: 'text/snakeee'});
                    let url = URL.createObjectURL(blob);
                    let a = document.createElement('a');
                    a.href = url;
                    a.download = `${Date.now()}.snakeee`;
                    a.click();
                break;
            }
        };
    });
};