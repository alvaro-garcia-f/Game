// Player Class - Handles Player movement     
var Player = function () {
    this.h = 40;                    // Player height
    this.w = 32;                    // Player width
    this.x = 64;                    // Starting horizontal position
    const LAND = GROUND - this.h;   // Players feet touch ground
    this.y = LAND;                  // Starting vertical position
    this.runSpeed = 2;
    this.vSpeed = 0;
    this.jumping = false;
    this.onTop = false;

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
            this.y += this.vSpeed;
            this.vSpeed += GRAVITY;
        }
    }

    this.land = function (floor) {
        if (this.y + this.vSpeed >= floor - this.h) {   // Prevents falling below obstacle
            this.y = floor - this.h;
            this.vSpeed = 0;               // Reset jump speed
            this.jumping = false;
        }      
    }
};