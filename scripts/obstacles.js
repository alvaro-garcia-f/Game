// Obstacle Class
var Obstacle = function (type, x, w, h) {
    const self = this;
    this.h = h;                    // Obstacle height
    this.w = w;                    // Obstacle width
    this.x = x;                    // Starting horizontal position
    this.y = GROUND - this.h;           // Starting vertical position
    this.type = type;
    this.speed = -2;

    self.move = function () {
        this.x += this.speed;
    }
}

// ObstacleBufffer Class
var ObstacleBuffer = function () {
    const OBSTACLES = {
        box1: {
            h: 64,
            w: 64,
        },
        box2: {
            h: 40,
            w: 31,
        }
    };

    this.bufferFront = [];
    this.bufferBack = [];
    this.maxSize = 5;

    // Obstacles handlers
    this.next = function () {
        return this.bufferFront[0];
    }

    this.previous = function () {
        return this.bufferBack[this.bufferBack.length - 1];
    }

    this.createObstacle = function () {

        if (this.bufferFront.length === 0 ||
            this.bufferFront[this.bufferFront.length - 1].x +
            this.bufferFront[this.bufferFront.length - 1].w < 1000) { this.createBox(SCR_WIDTH + Math.round(Math.random()*200) + 100); }
        else {
            this.createBox(this.bufferFront[this.bufferFront.length - 1].x +
            this.bufferFront[this.bufferFront.length - 1].w + Math.round(Math.random()*500) + 100);
        }
    }

    this.sendObstacleBack = function () {
        this.bufferBack.push(this.bufferFront.shift());
    }

    this.sendObstacleForward = function () {
        this.bufferFront.unshift(this.bufferBack.pop());
    }

    // Obstacle creators
    this.createBox = function (position) {
        if (Math.random() < 0.5) { this.bufferFront.push(new Obstacle("box1", position, OBSTACLES.box1.w, OBSTACLES.box1.h, OBSTACLES.box1)); }
        else { this.bufferFront.push(new Obstacle("box2", position, OBSTACLES.box2.w, OBSTACLES.box2.h, OBSTACLES.box2)); }
    }

    //Obstacle animation
    this.animateObstacles = function () {
        if (this.bufferFront.length > 0)
            this.bufferFront.forEach((obstacle) => {
                obstacle.move();
            });

        if (this.bufferBack.length > 0)
            this.bufferBack.forEach((obstacle) => {
                obstacle.move();
            });

        if (this.bufferBack.length && this.bufferBack[0].x + this.bufferBack[0].w <= 0)
            this.bufferBack.shift();
    }

    this.bufferFull = function () {
        return this.bufferFront.length === this.maxSize;
    }

    this.emptyBuffer = function () {
        this.bufferFront = [];
        this.bufferBack = [];
    }
}