// Obstacle Class
var Obstacle = function (type, x, w, h, sprite) {
    const self = this;
    this.h = h;                    // Obstacle height
    this.w = w;                    // Obstacle width
    this.x = x;                    // Starting horizontal position
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
    this.maxSize = 10;

    // Obstacles handlers
    this.next = function () {
        return this.bufferFront[0];
    }

    this.previous = function () {
        return this.bufferBack[this.bufferBack.length - 1];
    }

    this.createObstacle = function () {
      //  this.bufferFront.push(this.createBox());
      if (this.bufferFront.length === 0) { this.createBox(SCR_WIDTH); }
      else {
          this.createBox(SCR_WIDTH + this.bufferFront[this.bufferFront.length - 1].x + 100) }
    }

    this.sendObstacleBack = function () {
        this.bufferBack.push(this.bufferFront.shift());
    }
    
    this.sendObstacleForward = function () {
        this.bufferFront.unshift(this.bufferBack.pop());
    }

    // Obstacle creators
    this.createBox = function (position) {
        if (Math.random() < 0.5) { this.bufferFront.push(new Obstacle ("box1", position, OBSTACLES.box1.w, OBSTACLES.box1.h, OBSTACLES.box1.sprite)); }
        else { this.bufferFront.push(new Obstacle ("box2", position, OBSTACLES.box2.w, OBSTACLES.box2.h, OBSTACLES.box2.sprite)); }
    }

    //Obstacle animation
    this.animateObstacles = function () {
       if(this.bufferFront.length > 0) 
            this.bufferFront.forEach((obstacle) => {
                obstacle.move();        
            });

       if(this.bufferBack.length > 0)
           this.bufferBack.forEach((obstacle) => {
               obstacle.move();
           });
           
       if(this.bufferBack.length && this.bufferBack[0].x + this.bufferBack[0].w <= 0) 
            this.bufferBack.shift();
    }

    this.bufferFull = function () {
        return this.bufferFront.length === this.maxSize;
    }
}