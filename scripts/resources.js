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
    this.player = {
        path: '../assets/img/player/',
        idle: 'runner_idle_0.png',
        running: 'runner_run_0.png',
        jumping: 'runner_jump_0.png'
    };

    this.obstacles = {
        path: '../assets/img/obstacles/',
        box1: 'o1_box.png',
        box2: 'o1_trashcan.png'
    };

    this.sfx = {
        path: '../assets/sound/sfx/',
        jump: 'sfx_jump.wav',
        land: 'sfx_land.wav'
    };

    this.list = {}; // Contains all created resources; 
    this.totalAssets = Object.keys(this.player).length +
                      Object.keys(this.obstacles).length + 
                      Object.keys(this.sfx).length - 3; // All elements minus the path 

    this.startPreload = function () {
   
        this.preloadPlayer();
        this.preloadObstacles();
        this.preloadSfx();
    }

    //Load all assets
    this.preloadPlayer = function () {
        this.list['player'] = {};
        Object.keys(this.player).forEach((k) => {
            if (k !== 'path') {
                self.list.player[k] = new Asset();
                self.list.player[k].loadImage(`${self.player.path}${self.player[k]}`);
            }
        });
    }

    this.preloadObstacles = function () {
        this.list['obstacles'] = {};
        Object.keys(this.obstacles).forEach((k) => {
            if (k !== 'path') {
                self.list.obstacles[k] = new Asset();
                self.list.obstacles[k].loadImage(`${self.obstacles.path}${self.obstacles[k]}`);
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

    this.isLoadComplete = function () {
        if(self.playerLoadComplete() && self.obstaclesLoadComplete() && self.sfxLoadComplete()) {
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

    this.sfxLoadComplete = function () {
        var assets = Object.keys(self.list.sfx);
        for (let i=0; i < assets.length; i++) {
            if(!self.list.sfx[assets[i]].isReady()) return false;
        }
        return true;
    }
}