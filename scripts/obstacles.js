// Obstacle Class
var Obstacle = function (type, x, y, w, h, sprite) {
    this.h = h;                    // Obstacle height
    this.w = w;                    // Obstacle width
    this.x = x;                    // Starting horizontal position
    this.y = y - this.h;           // Starting vertical position
    this.type = type;
    this.sprite = sprite;
}

var obstacleBuffer = function () {
    const self = this;
    const OBSTACLES = {
        "box1": {
            "h": 24,
            "w": 25,
            "color": "#ff0000" 
        },
        "box2": {
            "h": 32,
            "w": 25,
            "color": "#0000ff"
        }
    };

    this.buffer = [];

    this.next = function () {
        return this.buffer[0];
    }

    this.createObstacle = function (x, y) {
        this.buffer.push(self.createBox(x, y));
        drawObstacle(this.buffer.length - 1);
    }

    this.createBox = function (x, y) {
        if (Math.random() < 0.5) return new Obstacle ("box1", x, y, OBSTACLES.box1.w, OBSTACLES.box1.h, OBSTACLES.box1.color);
        return new Obstacle ("box2", x, y, OBSTACLES.box2.w, OBSTACLES.box2.h, OBSTACLES.box2.color);
    }
}