function getConfig() {
    let settings = {
        "gameSpeed":"65",
        "gameTime":"30",
        "canvasBorderColour":"#464646",
        "canvasBackgroundColour":"#737373",
        "snakeColour":"#271cff",
        "snakeBorderColour":"#000377",
        "foodColour":"#ff0000",
        "foodBorderColour":"#8b0000",
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