const GRAVITY = 0.5;

// Obstacle Class
var Obstacle = function (x, y, w, h) {
    this.h = h;                    // Obstacle height
    this.w = w;                    // Obstacle width
    this.x = x;                    // Starting horizontal position
    this.y = y - this.h;           // Starting vertical position
}

// Game Class - Handles world creation and interaction
var Game = function () {
    this.keyLeft = false;
    this.keyRight = false;
    this.keyJump = false;
    this.obstacle; 
    this.player = new Player ();

    // Loaders
    this.init = function () {
        drawGround();
    }

    this.loadObstacle = function () {
        this.obstacle = new Obstacle (20, GROUND, 32, 32);
        drawObstacle(this.obstacle);
    }

    //Movement
    this.movePlayer = function (direction) {
        if (!this.collideVertical() && this.player.position !== GROUND) {
            this.player.jumping = true;
            this.player.land(GROUND);
        }
        if (direction === "left") this.movePlayerLeft();
        if (direction === "right") this.movePlayerRight();
        if (direction === "jump") {
            if (!this.player.jumping) {
                this.player.jumping = true;
                this.player.vSpeed = -10;
            }
            this.player.jump();
            if (this.collideVertical()) this.player.land(this.obstacle.y);
            else this.player.land(GROUND);
        }
    }

    this.movePlayerLeft = function () {
        if (!this.isObjectBehind() || 
            this.isObjectBehind() && !this.collideLeft()) this.player.moveLeft();
    }

    this.movePlayerRight = function () {
        if (!this.isObjectInFront() ||
            this.isObjectInFront() && !this.collideRight()) this.player.moveRight();
    }

    // Obstacle positioning
    this.isObjectInFront = function () {
        return this.obstacle && this.player.x + this.player.w < this.obstacle.x + this.obstacle.w;
    }

    this.isObjectBehind = function () {
        return this.obstacle && this.player.x > this.obstacle.x;
    }
    // Collisions
    this.collideLeft = function () {
        return this.player.x - this.player.runSpeed <= this.obstacle.x + this.obstacle.w &&
               this.player.y < this.obstacle.y + this.obstacle.h &&
               this.player.y + this.player.h > this.obstacle.y;
    }

    this.collideRight = function () {
        return this.player.x + this.player.w + this.player.runSpeed >= this.obstacle.x &&
               this.player.y < this.obstacle.y + this.obstacle.h &&
               this.player.y + this.player.h > this.obstacle.y;
    }

    this.collideVertical = function () {
        if ((this.player.x > this.obstacle.x &&
            this.player.x < this.obstacle.x + this.obstacle.w ||
            this.player.x + this.player.w > this.obstacle.x &&
            this.player.x + this.player.w < this.obstacle.x + this.obstacle.w) &&
            this.player.y + this.player.h + this.player.vSpeed >= this.obstacle.y) {
                this.player.position = this.obstacle.y;
                return true;
            }
            return false; 
    }
}
