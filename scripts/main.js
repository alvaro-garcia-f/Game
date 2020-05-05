const GROUND = 498;

// Player Class      
var Player = function () {
    const self = this;
    this.h = 40;        // Player height
    this.w = 32;        // Player width
    this.x = 64;        // Starting horizontal position
    this.y = GROUND - this.h;    // Starting vertical position
    const MAX_JUMP_HEIGHT = GROUND + this.h; 
    this.timer;
    
    this.loadSprite = function () {
        ctx.beginPath();
        ctx.fillStyle = "#00FF00";
        ctx.fillRect(this.x, this.y, this.w, this.h);
        ctx.closePath();
    }

    this.moveLeft = function () {
        if (this.x - 10 > 0) {   // Prevents crossing left border 
            this.x -= 10;
            playerSprite.style.left = `${this.x}px`;
        }
    }

    this.moveRight = function () {
        if (this.x + 10 < 968) {  // Prevents crossing right border 
            this.x += 10;
            playerSprite.style.left = `${this.x}px`;
        }
    }

    this.jump = function () {
        if (this.y < MAX_JUMP_HEIGHT) {
            this.y += 10;
            playerSprite.style.bottom = `${this.y}px`;
        } else {
            this.timer = setInterval(self.land, 100);
        }
    }

    this.land = function () {
        if (this.y >= GROUND && this.y < 10) {
            this.y = GROUND;
            playerSprite.style.bottom = `${this.y}px`;
            clearInterval(this.timer);
        } else {
            this.y -= 10;
            playerSprite.style.bottom = `${this.y}px`;
        }
    }
};

var Game = function () {

    this.init = function () {
        loadGround ();
    }
}

var game = new Game ();
game.init();

var player = new Player();
player.loadSprite();


/*
window.addEventListener("keydown", (e) => {
    switch (e.key) {
        case "ArrowLeft":
            player.moveLeft();
            break;
        case "ArrowRight":
            player.moveRight();
            break;
        case "ArrowUp":
            player.jumping = true;
            player.jump();
            break;
    }
});

window.addEventListener("keyup", (e) => {
    console.log("up");
    switch (e.key) {
        case "ArrowUp":
            player.land();
            break;
    }
});*/