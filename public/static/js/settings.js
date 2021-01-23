function getConfig() {
    let settings = {
        gameSpeed:100,
        gameTime:120,
        canvasBorderColour:'#000000',
        canvasBackgroundColour:'#ffffff',
        snakeColour:'#90ee90',
        snakeBorderColour:'#013220',
        foodColour:'#ff0000',
        foodBorderColour:'#8b0000',
        up:38,
        down:40,
        left:37,
        right:39,
        upKey:'ArrowUp',
        downKey:'ArrowDown',
        leftKey:'ArrowLeft',
        rightKey:'ArrowRight'
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
        if (config.gameSpeed < 20 || config.gameSpeed > 500) {
            config.gameSpeed = 100;
        };
        if (config.gameTime < 30 || config.gameTime > 300) {
            config.gameTime = 120;
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