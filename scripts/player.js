// Player Class - Handles Player movement     
var Player = function () {
    this.h = 35;                    // Player height
    this.w = 25;                    // Player width
    this.x = 64;                    // Starting horizontal position
    this.y = GROUND - this.h;       // Starting vertical position
    this.position = GROUND;         // At which height is the player standing
    this.location = GROUND;         // On which obstacle is the player standing
    this.runSpeed = 3;
    this.vSpeed = 0;
    this.status = 'idle';                  // Idle || Running || Jumping 
    this.jumping = false;
    this.landed = false;

    this.moveLeft = function () {
        this.status = 'running';
        if (this.x - this.runSpeed > 0)   // Prevents crossing left border 
            this.x -= this.runSpeed;
    }

    this.moveRight = function () {
        this.status = 'running';
        if (this.x + this.runSpeed < 968)  // Prevents crossing right border 
            this.x += this.runSpeed;
    }

    this.jump = function () {
        this.status = 'jumping';
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
            this.position = GROUND;
            this.landed = true;
            this.status = 'running';
        }      
    }
};