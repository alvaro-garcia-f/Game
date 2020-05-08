var assetsLoaded = 0;

var Asset = function () {
    const self = this;
    this.ready = false;
    this.element;

    this.load = function (type, path) {
        if (type === "image") this.element = new Image();
        if (type === "audio") this.element = new Audio();
        this.element.src = path;
        this.element.onload = function () {
            // self.ready = true; check why this doesn't work!!!
            assetsLoaded++;
        };
    }

}

var Resources = function () {
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

    this.sounds = {
        path: '../assets/sound/sfx/',
        jump: 'sfx_jump.wav',
        land: 'sfx_land.wav'
    };

    this.list = {}; // Contains all created resources; 
    var totalAssets = Object.keys(this.player).length - 1;

    this.startPreload = function () {
   
        this.preloadPlayer();
        this.preloadObstacles();
        //this.loadSound();
    
        while (assetsLoaded < this.totalAssets) {
            console.log("Loading assets...");
        }

        console.log("Assets loaded", this.list);       
    }
    //Load all assets
    this.preloadPlayer = function () {
        this.list['player'] = {};
        Object.keys(this.player).forEach((k) => {
            if (k !== 'path') {
                this.list.player[k] = new Asset();
                this.list.player[k].load("image",`${this.player.path}${this.player[k]}`);
            }
        });
    }

    this.preloadObstacles = function () {
        this.list['obstacles'] = {};
        Object.keys(this.obstacles).forEach((k) => {
            if (k !== 'path') {
                this.list.obstacles[k] = new Asset();
                this.list.obstacles[k].load("image",`${this.obstacles.path}${this.obstacles[k]}`);
            }
        });
    }
}