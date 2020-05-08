// Obstacle Class
var Obstacle = function (type, x, y, w, h, sprite) {
    this.h = h;                    // Obstacle height
    this.w = w;                    // Obstacle width
    this.x = x;                    // Starting horizontal position
    this.y = y - this.h;           // Starting vertical position
    this.type = type;
    this.sprite = sprite;
}

var ObstacleBuffer = function () {
    const self = this;
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

    this.buffer = [];

    this.next = function () {
        return this.buffer[0];
    }

    this.createObstacle = function (x, y) {
        this.buffer.push(self.createBox(x, y));
    }

    this.createBox = function (x, y) {
        if (Math.random() < 0.5) return new Obstacle ("box1", x, y, OBSTACLES.box1.w, OBSTACLES.box1.h, OBSTACLES.box1.sprite);
        return new Obstacle ("box2", x, y, OBSTACLES.box2.w, OBSTACLES.box2.h, OBSTACLES.box2.sprite);
    }
}