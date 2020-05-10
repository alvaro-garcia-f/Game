// Obstacle Class
var Obstacle = function (type, w, h, sprite) {
    const self = this;
    this.h = h;                    // Obstacle height
    this.w = w;                    // Obstacle width
    this.x = SCR_WIDTH;                    // Starting horizontal position
    this.y = GROUND - this.h;           // Starting vertical position
    this.type = type;
    this.sprite = sprite;
    this.speed = -4;

    self.move = function () {
        this.x += this.speed;
    }
}

var ObstacleBuffer = function () {
    const OBSTACLES = {
        box1: {
            h: 24,
            w: 25,
            sprite: "o1_box.png" 
        },
        box2: {
            h: 32,
            w: 25,
            sprite: "o1_trashcan.png"
        }
    };

    this.bufferFront = [];
    this.bufferBack = [];

    // Obstacles handlers
    this.next = function () {
        return this.bufferFront[0];
    }

    this.previous = function () {
        return this.bufferBack[this.bufferBack.length - 1];
    }

    this.createObstacle = function () {
      //  this.bufferFront.push(this.createBox());
      this.createBox();
    }

    this.sendObstacleBack = function () {
        this.bufferBack.push(this.bufferFront.shift());
    }
    
    this.sendObstacleForward = function () {
        this.bufferFront.unshift(this.bufferBack.pop());
    }

    // Obstacle creators
    this.createBox = function () {
        if (Math.random() < 0.5) this.bufferFront.push(new Obstacle ("box1", OBSTACLES.box1.w, OBSTACLES.box1.h, OBSTACLES.box1.sprite));
        return this.bufferFront.push(new Obstacle ("box2", OBSTACLES.box2.w, OBSTACLES.box2.h, OBSTACLES.box2.sprite));
    }

    //Obstacle animation
    this.animateObstacleStart = function () {
       if(this.bufferFront.length > 0 && !this.stopped) this.bufferFront[0].move();
       if(this.bufferBack.length > 0 && !this.stopped) this.bufferBack[0].move();
    }

    this.animateObstacleStop = function () {
        this.speed = 0;
        this.stopped = true;
    }
}