function getConfig() {
    let settings = {
        "gameSize":"50",
        "gameSpeed":"65",
        "gameTime":"30",
        "startLength":"3",
        "head":"/static/img/gameAssets/Deafult/head.png",
        "tail":"/static/img/gameAssets/Deafult/tail.png",
        "corner":"/static/img/gameAssets/Deafult/corner.png",
        "straight":"/static/img/gameAssets/Deafult/straight.png",
        "food":"/static/img/gameAssets/Deafult/food.png",
        "background":"/static/img/gameAssets/Deafult/background.png",
        "up":87,
        "down":83,
        "left":65,
        "right":68,
        "upKey":"w",
        "downKey":"s",
        "leftKey":"a",
        "rightKey":"d"
    };
    let config = {};
    if (localStorage.config) {
        try {
            config = JSON.parse(localStorage.config);
        }
        catch (err) {
            localStorage.config = '{}';
        };
        for (const setting of Object.keys(settings)) {
            if (!(setting in config)) {
                config[setting] = settings[setting];
            };
        };
        if (config.gameTime < 30 || config.gameTime > 300) {
            config.gameTime = 120;
        };
        let imgs = {};
        ['head', 'tail', 'corner', 'straight', 'food'].forEach((el) => {
            imgs[el] = new Image();
            imgs[el].src = config[el];
            imgs[el].onerror = () => {
                resetConfig();
                location.reload();
            };
            imgs[el].onload = () => {
                if (imgs[el].width != 60 && imgs[el].height != 60) {
                    resetConfig();
                    location.reload();
                };
            };
        });
        imgs.background = new Image();
        imgs.background.src = config.background;
        imgs.background.onerror = () => {
            resetConfig();
            location.reload();
        };
        imgs.background.onload = () => {
            if (imgs.background.width != 1000 && imgs.background.height != 1000) {
                resetConfig();
                location.reload();
            };
        };
    }
    else {
        config = settings;
    };
    localStorage.config = JSON.stringify(config);
    return config;
};

function setConfig(settings) {
    localStorage.config = JSON.stringify(settings);
    getConfig();
}

function setConfigItem(key, value) {
    const settings = getConfig();
    settings[key] = value;
    setConfig(settings);
    getConfig();
}

function resetConfig() {
    localStorage.clear();
    getConfig();
}