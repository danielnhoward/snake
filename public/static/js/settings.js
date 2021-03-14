class Settings {
    constructor() {
        if (!localStorage) alert('Hmm, looks like you browser doesnt support localStorage!')
        this.validateConfig();
    };

    get deafultSettings() {
        return {
            "gameSize":50,
            "gameSpeed":65,
            "startLength":3,
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
    };
    get imageSizes() {
        return {
            head: [60, 60],
            tail: [60, 60],
            corner: [60, 60],
            straight: [60, 60],
            food: [60, 60],
            background: [1000, 1000]
        };
    };


    validateConfig() {
        let settings = this.deafultSettings;
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
            let imgs = {};
            ['head', 'tail', 'corner', 'straight', 'food'].forEach((el) => {
                imgs[el] = new Image();
                imgs[el].src = config[el];
                imgs[el].onerror = () => {
                    this.reset();
                    location.reload();
                };
                imgs[el].onload = () => {
                    if (imgs[el].width != this.imageSizes[el][0] && imgs[el].height != this.imageSizes[el][1]) {
                        this.reset();
                        location.reload();
                    };
                };
            });
            imgs.background = new Image();
            imgs.background.src = config.background;
            imgs.background.onerror = () => {
                this.reset();
                location.reload();
            };
            imgs.background.onload = () => {
                if (imgs.background.width != this.imageSizes.background[0] && imgs.background.height != this.imageSizes.background[1]) {
                    this.reset();
                    location.reload();
                };
            };
        }
        else {
            config = settings;
        };
        localStorage.config = JSON.stringify(config);
        return {
        };
    };

    reset() {
        localStorage.config = undefined;
        this.validateConfig();
    }

    toJSON() {
        return JSON.parse(localStorage.config);
    };
    
    


    get gameSize() {
        try {
            if (localStorage.config) {
                return JSON.parse(localStorage.config).gameSize ? JSON.parse(localStorage.config).gameSize : (() => {
                    this.validateConfig();
                    return this.deafultSettings.gameSize;
                })();
            };
        }
        catch(err) {
            this.validateConfig();
            return this.deafultSettings.gameSize;
        };
    };
    set gameSize(value) {
        if (!Number.isInteger(parseInt(value))) return;
        try {
            if (localStorage.config) {
                let settings = JSON.parse(localStorage.config);
                settings.gameSize = value;
                return localStorage.config = JSON.stringify(settings);
            };
        }
        catch(err) {
            this.validateConfig();
            return this.deafultSettings.gameSize;
        };
    };

    get gameSpeed() {
        try {
            if (localStorage.config) {
                return JSON.parse(localStorage.config).gameSpeed ? JSON.parse(localStorage.config).gameSpeed : (() => {
                    this.validateConfig();
                    return this.deafultSettings.gameSpeed;
                })();
            };
        }
        catch(err) {
            this.validateConfig();
            return this.deafultSettings.gameSpeed;
        };
    };
    set gameSpeed(value) {
        if (!Number.isInteger(parseInt(value))) return;
        try {
            if (localStorage.config) {
                let settings = JSON.parse(localStorage.config);
                settings.gameSpeed = value;
                return localStorage.config = JSON.stringify(settings);
            };
        }
        catch(err) {
            this.validateConfig();
            return this.deafultSettings.gameSpeed;
        };
    };

    get startLength() {
        try {
            if (localStorage.config) {
                return JSON.parse(localStorage.config).startLength ? JSON.parse(localStorage.config).startLength : (() => {
                    this.validateConfig();
                    return this.deafultSettings.startLength;
                })();
            };
        }
        catch(err) {
            this.validateConfig();
            return this.deafultSettings.startLength;
        };
    };
    set startLength(value) {
        if (!Number.isInteger(parseInt(value))) return;
        try {
            if (localStorage.config) {
                let settings = JSON.parse(localStorage.config);
                settings.startLength = value;
                return localStorage.config = JSON.stringify(settings);
            };
        }
        catch(err) {
            this.validateConfig();
            return this.deafultSettings.startLength;
        };
    };

    get head() {
        try {
            if (localStorage.config) {
                return JSON.parse(localStorage.config).head ? JSON.parse(localStorage.config).head : (() => {
                    this.validateConfig();
                    return this.deafultSettings.head;
                })();
            };
        }
        catch(err) {
            this.validateConfig();
            return this.deafultSettings.head;
        };
    };
    set head(value) {
        try {
            if (localStorage.config) {
                let settings = JSON.parse(localStorage.config);
                let img = new Image();
                img.src = value;
                
                img.onerror = () => {
                    this.reset();
                    location.reload();
                };
                img.onload = () => {
                    if (img.width != this.imageSizes.head[0] && img.height != this.imageSizes.head[1]) {
                        this.reset();
                        location.reload();
                    };
                };

                settings.head = value;
                return localStorage.config = JSON.stringify(settings);
            };
        }
        catch(err) {
            this.validateConfig();
            return this.deafultSettings.head;
        };
    };

    get tail() {
        try {
            if (localStorage.config) {
                return JSON.parse(localStorage.config).tail ? JSON.parse(localStorage.config).tail : (() => {
                    this.validateConfig();
                    return this.deafultSettings.tail;
                })();
            };
        }
        catch(err) {
            this.validateConfig();
            return this.deafultSettings.tail;
        };
    };
    set tail(value) {
        try {
            if (localStorage.config) {
                let settings = JSON.parse(localStorage.config);
                let img = new Image();
                img.src = value;
                
                img.onerror = () => {
                    this.reset();
                    location.reload();
                };
                img.onload = () => {
                    if (img.width != this.imageSizes.tail[0] && img.height != this.imageSizes.tail[1]) {
                        this.reset();
                        location.reload();
                    };
                };

                settings.tail = value;
                return localStorage.config = JSON.stringify(settings);
            };
        }
        catch(err) {
            this.validateConfig();
            return this.deafultSettings.tail;
        };
    };

    get corner() {
        try {
            if (localStorage.config) {
                return JSON.parse(localStorage.config).corner ? JSON.parse(localStorage.config).corner : (() => {
                    this.validateConfig();
                    return this.deafultSettings.corner;
                })();
            };
        }
        catch(err) {
            this.validateConfig();
            return this.deafultSettings.corner;
        };
    };
    set corner(value) {
        try {
            if (localStorage.config) {
                let settings = JSON.parse(localStorage.config);
                let img = new Image();
                img.src = value;
                
                img.onerror = () => {
                    this.reset();
                    location.reload();
                };
                img.onload = () => {
                    if (img.width != this.imageSizes.corner[0] && img.height != this.imageSizes.corner[1]) {
                        this.reset();
                        location.reload();
                    };
                };

                settings.corner = value;
                return localStorage.config = JSON.stringify(settings);
            };
        }
        catch(err) {
            this.validateConfig();
            return this.deafultSettings.corner;
        };
    };

    get straight() {
        try {
            if (localStorage.config) {
                return JSON.parse(localStorage.config).straight ? JSON.parse(localStorage.config).straight : (() => {
                    this.validateConfig();
                    return this.deafultSettings.straight;
                })();
            };
        }
        catch(err) {
            this.validateConfig();
            return this.deafultSettings.straight;
        };
    };
    set straight(value) {
        try {
            if (localStorage.config) {
                let settings = JSON.parse(localStorage.config);
                let img = new Image();
                img.src = value;
                
                img.onerror = () => {
                    this.reset();
                    location.reload();
                };
                img.onload = () => {
                    if (img.width != this.imageSizes.straight[0] && img.height != this.imageSizes.straight[1]) {
                        this.reset();
                        location.reload();
                    };
                };

                settings.straight = value;
                return localStorage.config = JSON.stringify(settings);
            };
        }
        catch(err) {
            this.validateConfig();
            return this.deafultSettings.straight;
        };
    };

    get food() {
        try {
            if (localStorage.config) {
                return JSON.parse(localStorage.config).food ? JSON.parse(localStorage.config).food : (() => {
                    this.validateConfig();
                    return this.deafultSettings.food;
                })();
            };
        }
        catch(err) {
            this.validateConfig();
            return this.deafultSettings.food;
        };
    };
    set food(value) {
        try {
            if (localStorage.config) {
                let settings = JSON.parse(localStorage.config);
                let img = new Image();
                img.src = value;
                
                img.onerror = () => {
                    this.reset();
                    location.reload();
                };
                img.onload = () => {
                    if (img.width != this.imageSizes.food[0] && img.height != this.imageSizes.food[1]) {
                        this.reset();
                        location.reload();
                    };
                };

                settings.food = value;
                return localStorage.config = JSON.stringify(settings);
            };
        }
        catch(err) {
            this.validateConfig();
            return this.deafultSettings.food;
        };
    };

    get background() {
        try {
            if (localStorage.config) {
                return JSON.parse(localStorage.config).background ? JSON.parse(localStorage.config).background : (() => {
                    this.validateConfig();
                    return this.deafultSettings.background;
                })();
            };
        }
        catch(err) {
            this.validateConfig();
            return this.deafultSettings.background;
        };
    };
    set background(value) {
        try {
            if (localStorage.config) {
                let settings = JSON.parse(localStorage.config);
                let img = new Image();
                img.src = value;
                
                img.onerror = () => {
                    this.reset();
                    location.reload();
                };
                img.onload = () => {
                    if (img.width != this.imageSizes.background[0] && img.height != this.imageSizes.background[1]) {
                        this.reset();
                        location.reload();
                    };
                };

                settings.background = value;
                return localStorage.config = JSON.stringify(settings);
            };
        }
        catch(err) {
            this.validateConfig();
            return this.deafultSettings.background;
        };
    };

    
    get up() {
        try {
            if (localStorage.config) {
                return JSON.parse(localStorage.config).up ? JSON.parse(localStorage.config).up : (() => {
                    this.validateConfig();
                    return this.deafultSettings.up;
                })();
            };
        }
        catch(err) {
            this.validateConfig();
            return this.deafultSettings.up;
        };
    };
    set up(value) {
        if (!Number.isInteger(parseInt(value))) return;
        try {
            if (localStorage.config) {
                let settings = JSON.parse(localStorage.config);
                settings.up = value;
                return localStorage.config = JSON.stringify(settings);
            };
        }
        catch(err) {
            this.validateConfig();
            return this.deafultSettings.up;
        };
    };

    
    get down() {
        try {
            if (localStorage.config) {
                return JSON.parse(localStorage.config).down ? JSON.parse(localStorage.config).down : (() => {
                    this.validateConfig();
                    return this.deafultSettings.down;
                })();
            };
        }
        catch(err) {
            this.validateConfig();
            return this.deafultSettings.down;
        };
    };
    set down(value) {
        if (!Number.isInteger(parseInt(value))) return;
        try {
            if (localStorage.config) {
                let settings = JSON.parse(localStorage.config);
                settings.down = value;
                return localStorage.config = JSON.stringify(settings);
            };
        }
        catch(err) {
            this.validateConfig();
            return this.deafultSettings.down;
        };
    };

    
    get left() {
        try {
            if (localStorage.config) {
                return JSON.parse(localStorage.config).left ? JSON.parse(localStorage.config).left : (() => {
                    this.validateConfig();
                    return this.deafultSettings.left;
                })();
            };
        }
        catch(err) {
            this.validateConfig();
            return this.deafultSettings.left;
        };
    };
    set left(value) {
        if (!Number.isInteger(parseInt(value))) return;
        try {
            if (localStorage.config) {
                let settings = JSON.parse(localStorage.config);
                settings.left = value;
                return localStorage.config = JSON.stringify(settings);
            };
        }
        catch(err) {
            this.validateConfig();
            return this.deafultSettings.left;
        };
    };

    
    get right() {
        try {
            if (localStorage.config) {
                return JSON.parse(localStorage.config).right ? JSON.parse(localStorage.config).right : (() => {
                    this.validateConfig();
                    return this.deafultSettings.right;
                })();
            };
        }
        catch(err) {
            this.validateConfig();
            return this.deafultSettings.right;
        };
    };
    set right(value) {
        if (!Number.isInteger(parseInt(value))) return;
        try {
            if (localStorage.config) {
                let settings = JSON.parse(localStorage.config);
                settings.right = value;
                return localStorage.config = JSON.stringify(settings);
            };
        }
        catch(err) {
            this.validateConfig();
            return this.deafultSettings.right;
        };
    };

    
    get upKey() {
        try {
            if (localStorage.config) {
                return JSON.parse(localStorage.config).upKey ? JSON.parse(localStorage.config).upKey : (() => {
                    this.validateConfig();
                    return this.deafultSettings.upKey;
                })();
            };
        }
        catch(err) {
            this.validateConfig();
            return this.deafultSettings.upKey;
        };
    };
    set upKey(value) {
        try {
            if (localStorage.config) {
                let settings = JSON.parse(localStorage.config);
                settings.upKey = value;
                return localStorage.config = JSON.stringify(settings);
            };
        }
        catch(err) {
            this.validateConfig();
            return this.deafultSettings.upKey;
        };
    };

    
    get downKey() {
        try {
            if (localStorage.config) {
                return JSON.parse(localStorage.config).downKey ? JSON.parse(localStorage.config).downKey : (() => {
                    this.validateConfig();
                    return this.deafultSettings.downKey;
                })();
            };
        }
        catch(err) {
            this.validateConfig();
            return this.deafultSettings.downKey;
        };
    };
    set downKey(value) {
        try {
            if (localStorage.config) {
                let settings = JSON.parse(localStorage.config);
                settings.downKey = value;
                return localStorage.config = JSON.stringify(settings);
            };
        }
        catch(err) {
            this.validateConfig();
            return this.deafultSettings.downKey;
        };
    };

    
    get leftKey() {
        try {
            if (localStorage.config) {
                return JSON.parse(localStorage.config).leftKey ? JSON.parse(localStorage.config).leftKey : (() => {
                    this.validateConfig();
                    return this.deafultSettings.leftKey;
                })();
            };
        }
        catch(err) {
            this.validateConfig();
            return this.deafultSettings.leftKey;
        };
    };
    set leftKey(value) {
        try {
            if (localStorage.config) {
                let settings = JSON.parse(localStorage.config);
                settings.leftKey = value;
                return localStorage.config = JSON.stringify(settings);
            };
        }
        catch(err) {
            this.validateConfig();
            return this.deafultSettings.leftKey;
        };
    };
    
    
    get rightKey() {
        try {
            if (localStorage.config) {
                return JSON.parse(localStorage.config).rightKey ? JSON.parse(localStorage.config).rightKey : (() => {
                    this.validateConfig();
                    return this.deafultSettings.rightKey;
                })();
            };
        }
        catch(err) {
            this.validateConfig();
            return this.deafultSettings.rightKey;
        };
    };
    set rightKey(value) {
        try {
            if (localStorage.config) {
                let settings = JSON.parse(localStorage.config);
                settings.rightKey = value;
                return localStorage.config = JSON.stringify(settings);
            };
        }
        catch(err) {
            this.validateConfig();
            return this.deafultSettings.rightKey;
        };
    };
};