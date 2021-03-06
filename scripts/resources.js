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
        jumping_5: 'runner_run_jump.png',
        running_4_0: 'runner_dyed_0.png',
        running_4_1: 'runner_dyed_1.png',
        running_4_2: 'runner_dyed_2.png',
        running_4_3: 'runner_dyed_3.png',
        running_4_4: 'runner_dyed_4.png',
        running_4_5: 'runner_dyed_5.png',
        idle_4: 'runner_dyed_idle.png',
        jumping_4: 'runner_dyed_jump.png',
        running_3_0: 'runner_bald_0.png',
        running_3_1: 'runner_bald_1.png',
        running_3_2: 'runner_bald_2.png',
        running_3_3: 'runner_bald_3.png',
        running_3_4: 'runner_bald_4.png',
        running_3_5: 'runner_bald_5.png',
        idle_3: 'runner_bald_idle.png',
        jumping_3: 'runner_bald_jump.png',
        running_2_0: 'runner_urkel_0.png',
        running_2_1: 'runner_urkel_1.png',
        running_2_2: 'runner_urkel_2.png',
        running_2_3: 'runner_urkel_3.png',
        running_2_4: 'runner_urkel_4.png',
        running_2_5: 'runner_urkel_5.png',
        idle_2: 'runner_urkel_idle.png',
        jumping_2: 'runner_urkel_jump.png',
        running_1_0: 'runner_naked_0.png',
        running_1_1: 'runner_naked_1.png',
        running_1_2: 'runner_naked_2.png',
        running_1_3: 'runner_naked_3.png',
        running_1_4: 'runner_naked_4.png',
        running_1_5: 'runner_naked_5.png',
        idle_1: 'runner_naked_idle.png',
        jumping_1: 'runner_naked_jump.png'
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
        building: 'building.png',
        city: 'background_1.png'
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

    this.ost = {
        path: './assets/sound/ost/',
        intro: 'ost_intro.ogg',
        lvl_1: 'ost_lvl_1.ogg'
    };

    this.list = {}; // Contains all created resources;

    this.startPreload = function () {
        
        this.preloadImages(this.player, 'player');
        this.preloadImages(this.obstacles, 'obstacles');
        this.preloadImages(this.items, 'items');
        this.preloadImages(this.ui, 'ui');
        this.preloadImages(this.bg, 'bg');
        this.preloadAudio(this.sfx, 'sfx');
        this.preloadAudio(this.ost, 'ost');

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

    this.preloadAudio = function (asset, name) {
        this.list[name] = {};
        Object.keys(asset).forEach((k) => {
            if (k !== 'path') {
                self.list[name][k] = new Asset();
                self.list[name][k].loadAudio(`${asset.path}${asset[k]}`);
            }
        });
    }

    // Checking that all assets are loaded
    this.isLoadComplete = function () {
        if(self.playerLoadComplete() && self.obstaclesLoadComplete() && self.itemsLoadComplete() &&
           self.uiLoadComplete() && self.bgLoadComplete() && self.sfxLoadComplete() && self.ostLoadComplete()) {
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

    this.ostLoadComplete = function () {
        var assets = Object.keys(self.list.ost);
        for (let i=0; i < assets.length; i++) {
            if(!self.list.ost[assets[i]].isReady()) return false;
        }
        return true;
    }
}
