const GRAVITY = 0.5;

// Player Class - Handles Player movement     
var Player = function () {
    this.h = 40;                    // Player height
    this.w = 32;                    // Player width
    this.x = 64;                    // Starting horizontal position
    const LAND = GROUND - this.h;   // Players feet touch ground
    this.y = LAND;                  // Starting vertical position
    this.runSpeed = 2;
    this.jumpSpeed = -10;
    this.jumping = false;

    this.loadSprite = function () {
        ctx.fillStyle = "#00FF00";
        ctx.fillRect(this.x, this.y, this.w, this.h);
    }

    this.moveLeft = function () {
        if (this.x - this.runSpeed > 0)   // Prevents crossing left border 
            this.x -= this.runSpeed;
    }

    this.moveRight = function () {
        if (this.x + this.runSpeed < 968)  // Prevents crossing right border 
            this.x += this.runSpeed;
    }

    this.jump = function () {
        if (this.jumping) {
            this.y += this.jumpSpeed;
            this.jumpSpeed += GRAVITY;
        }
    }

    this.land = function () {
        if(this.y + this.jumpSpeed >= LAND) {   // Prevents falling below ground
            this.y = LAND;
            this.jumpSpeed = -10;               // Reset jump speed
            this.jumping = false;
        }
    }

    this.collide = function () {
        return this.x + this.w >= game.obstacle.x &&
               this.y + this.h >= game.obstacle.y;
    }
};

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

    this.init = function () {
        loadGround();
    }

    this.loadObstacle = function () {
        this.obstacle = new Obstacle (600, GROUND, 32, 32);
        drawObstacle(this.obstacle);
    }
}

// Animation Loop
function loadScrLoop() {
    ctx.clearRect(0, 0, SCR_WIDTH, SCR_HEIGHT);
    loadGround();
    game.loadObstacle();
    if (game.keyLeft) player.moveLeft();
    if (game.keyRight) if (!player.collide()) player.moveRight();
    if (game.keyJump || player.jumping) {
        player.jumping = true;
        player.jump();
        player.land();
    }
    player.loadSprite();
    requestAnimationFrame(loadScrLoop);
}

// Initialize game
var game = new Game();
game.init();

var player = new Player();
// player.loadSprite();

// Keyboard listeners
window.addEventListener("keydown", (e) => {
    switch (e.key) {
        case "ArrowLeft":
            game.keyLeft = true;
            break;
        case "ArrowRight":
            game.keyRight = true;
            break;
        case "ArrowUp":
            game.keyJump = true;
            break;
    }
});

window.addEventListener("keyup", (e) => {
    switch (e.key) {
        case "ArrowLeft":
            game.keyLeft = false;
            break;
        case "ArrowRight":
            game.keyRight = false;
            break;
        case "ArrowUp":
            game.keyJump = false;
            break;
    }
});

// Start animation loop
requestAnimationFrame(loadScrLoop);