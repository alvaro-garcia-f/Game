const GRAVITY = 0.5;

// Player Class - Handles Player movement     
var Player = function () {
    const self = this;
    this.h = 40;                    // Player height
    this.w = 32;                    // Player width
    this.x = 64;                    // Starting horizontal position
    const LAND = GROUND - this.h;   // Players feet touch ground
    this.y = LAND;                  // Starting vertical position
    this.runSpeed = 2;
    this.jumpSpeed = -10;
    this.jumping = false;

    this.loadSprite = function () {
        ctx.beginPath();
        ctx.fillStyle = "#00FF00";
        ctx.fillRect(this.x, this.y, this.w, this.h);
        ctx.closePath();
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
        if(this.y + this.jumpSpeed >= LAND) {
            this.y = LAND;
            this.jumping = false;
        }
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
    if (game.keyJump) {
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