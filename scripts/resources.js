//Graphics and Audio
var Asset = function () {
    const self = this;
    this.ready = false;
    this.element;

    this.loadImage = function (path) {
        this.element = new Image();
        this.element.onload = function () {
            self.ready = true;
        };
        this.element.src = path;
    }

    this.loadAudio = function (path) {
        this.element = new Audio();
        this.element.oncanplay = function () {
            self.ready = true;
        };
        this.element.src = path;
    }

    this.isReady = function () {
        return self.ready;
    }
}

var Resources = function () {
    const self = this;

    // Asset categories
    this.player = {
        path: './assets/img/player/',
        running_5_0: 'runner_run_0.png',
        running_5_1: 'runner_run_1.png',
        running_5_2: 'runner_run_2.png',
        running_5_3: 'runner_run_3.png',
        running_5_4: 'runner_run_4.png',
        running_5_5: 'runner_run_5.png',
        idle_5: 'runner_run_idle.png',
        jumping_5: 'runner_run_jump.png'
    };

    this.obstacles = {
        path: './assets/img/obstacles/',
        box1: 'o1_box.png',
        box2: 'o1_trashcan.png'
    };

    this.items = {
        path: './assets/img/items/',
        beer: 'i1_beer.png'
    };

    this.ui = {
        path: './assets/img/ui/',
        clock: 'clock.png',
        heart: 'heart.png',
        flag: 'flag.png'
    };

    this.bg = {
        path: './assets/img/bg/',
        building: 'building.png'
    };

    this.sfx = {
        path: './assets/sound/sfx/',
        jump: 'sfx_jump.ogg',
        land: 'sfx_land.ogg',
        hit: 'sfx_hit.ogg',
        late: 'sfx_late.ogg',
        victory: 'sfx_victory.ogg',
        beer: 'sfx_beer.ogg'
    };

    this.list = {}; // Contains all created resources;

    this.startPreload = function () {
        
        this.preloadImages(this.player, 'player');
        this.preloadImages(this.obstacles, 'obstacles');
        this.preloadImages(this.items, 'items');
        this.preloadImages(this.ui, 'ui');
        this.preloadImages(this.bg, 'bg');
        this.preloadSfx();
    }

    //Load all assets
    this.preloadImages = function (asset, name) {
        this.list[name] = {};
        Object.keys(asset).forEach((k) => {
            if (k !== 'path') {
                self.list[name][k] = new Asset();
                self.list[name][k].loadImage(`${asset.path}${asset[k]}`);
            }
        });
    }

    this.preloadSfx = function () {
        this.list['sfx'] = {};
        Object.keys(this.sfx).forEach((k) => {
            if (k !== 'path') {
                self.list.sfx[k] = new Asset();
                self.list.sfx[k].loadAudio(`${this.sfx.path}${this.sfx[k]}`);
            }
        });
    }

    // Checking that all assets are loaded
    this.isLoadComplete = function () {
        if(self.playerLoadComplete() && self.obstaclesLoadComplete() && self.itemsLoadComplete() &&
           self.uiLoadComplete() && self.bgLoadComplete() && self.sfxLoadComplete()) {
            console.log("Assets loaded", self.list);
            return true;
        }
        return false;
    }

    this.playerLoadComplete = function () {
        var assets = Object.keys(self.list.player);
        for (let i=0; i < assets.length; i++) {
            if(!self.list.player[assets[i]].isReady()) return false;
        }
        return true;
    }

    this.obstaclesLoadComplete = function () {
        var assets = Object.keys(self.list.obstacles);
        for (let i=0; i < assets.length; i++) {
            if(!self.list.obstacles[assets[i]].isReady()) return false;
        }
        return true;
    }

    this.itemsLoadComplete = function () {
        var assets = Object.keys(self.list.items);
        for (let i=0; i < assets.length; i++) {
            if(!self.list.items[assets[i]].isReady()) return false;
        }
        return true;
    }

    this.uiLoadComplete = function () {
        var assets = Object.keys(self.list.ui);
        for (let i=0; i < assets.length; i++) {
            if(!self.list.ui[assets[i]].isReady()) return false;
        }
        return true;
    }

    this.bgLoadComplete = function () {
        var assets = Object.keys(self.list.bg);
        for (let i=0; i < assets.length; i++) {
            if(!self.list.bg[assets[i]].isReady()) return false;
        }
        return true;
    }

    this.sfxLoadComplete = function () {
        var assets = Object.keys(self.list.sfx);
        for (let i=0; i < assets.length; i++) {
            if(!self.list.sfx[assets[i]].isReady()) return false;
        }
        return true;
    }
}
