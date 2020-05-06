const GRAVITY = 0.5;

var Obstacle = function (x, y, w, h) {
    this.h = h;                    // Obstacle height
    this.w = w;                    // Obstacle width
    this.x = x;                    // Starting horizontal position
    this.y = y - this.h;                  // Starting vertical position
}

// Game Class - Handles world creation
var Game = function () {
    this.keyLeft = false;
    this.keyRight = false;
    this.keyJump = false;
    this.obstacle; 
    this.player = new Player ();

    this.init = function () {
        loadGround();
    }

    this.loadObstacle = function () {
        this.obstacle = new Obstacle (600, GROUND, 32, 32);
        drawObstacle(this.obstacle);
    }
}
