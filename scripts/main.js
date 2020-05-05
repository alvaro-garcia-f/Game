// Player Class - Handles Player movement     
var Player = function () {
    const self = this;
    this.h = 40;        // Player height
    this.w = 32;        // Player width
    this.x = 64;        // Starting horizontal position
    this.y = GROUND - this.h;    // Starting vertical position
    this.speed = 2;
    const MAX_JUMP_HEIGHT = GROUND - this.h * 2;

    this.loadSprite = function () {
        ctx.beginPath();
        ctx.fillStyle = "#00FF00";
        ctx.fillRect(this.x, this.y, this.w, this.h);
        ctx.closePath();
    }

    this.moveLeft = function () {
        if (this.x - this.speed > 0)   // Prevents crossing left border 
            this.x -= this.speed;
    }

    this.moveRight = function () {
        if (this.x + this.speed < 968)  // Prevents crossing right border 
            this.x += this.speed;
    }

    this.jump = function () {
        if (this.y > MAX_JUMP_HEIGHT)
            this.y -= this.speed;
    }
};

// Game Class - Handles world creation
var Game = function () {
    this.keyLeft = false;
    this.keyRight = false;
    this.keyJump = false;

    this.init = function () {
        loadGround();
    }
}

// Animation Loop
function loadScrLoop() {
    ctx.clearRect(0, 0, SCR_WIDTH, SCR_HEIGHT);
    loadGround();
    if (game.keyLeft) player.moveLeft();
    if (game.keyRight) player.moveRight();
    if (game.keyJump) player.jump();
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