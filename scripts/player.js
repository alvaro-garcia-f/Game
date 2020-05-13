// Player Class - Handles Player movement     
var Player = function () {
    const SPRITE_SIZE = {
        idle: {
            h: 66,
            w: 40
        },

        jumping: {
            h: 64,
            w: 42
        },

        running_0: {
            h: 62,
            w: 50
        },

        running_1: {
            h: 60,
            w: 56
        },

        running_2: {
            h: 62,
            w: 52
        },

        running_3: {
            h: 60,
            w: 38
        },

        running_4: {
            h: 60,
            w: 56
        },

        running_5: {
            h: 59,
            w: 38
        }
    };

    this.h = SPRITE_SIZE.idle.h;    // Player height in idle position
    this.w = SPRITE_SIZE.idle.w;    // Player width in idle position
    this.x = 64;                    // Starting horizontal position
    this.y = GROUND - this.h;       // Starting vertical position
    this.position = GROUND;         // At which height is the player standing
    this.location = GROUND;         // On which obstacle is the player standing
    this.runSpeed = 3;
    this.vSpeed = 0;
    this.status = 'idle';            // Idle || Running 0 to 5 || Jumping 
    this.jumping = false;            // Prevents double jumping and helps detect if player has landed on obstacle
    this.landed = false;             // Helps detect when caracter goes from moving to idle
    this.hit = false;                // Prevents obstacle hit sound to be played more than once
    this.frame = 0;                  // Runnign animation frame

    this.moveLeft = function () {
        this.status = `running_${this.frame%5}`;
        if (this.x - this.runSpeed > 0)   // Prevents crossing left border 
            this.x -= this.runSpeed;
    }

    this.moveRight = function () {
        this.updateStatus(`running_${this.frame%5}`);
        if (this.x + this.runSpeed < 968)  // Prevents crossing right border 
            this.x += this.runSpeed;
    }

    this.jump = function () {
        this.updateStatus('jumping');
        if (this.jumping) {
            this.y += this.vSpeed;
            this.vSpeed += GRAVITY;
        }
    }

    this.land = function (floor) {
        if (this.y + this.vSpeed >= floor - this.h) {   // Prevents falling below obstacle
            if (floor == GROUND) { this.updateStatus(`running_${this.frame%5}`); }
            else { this.updateStatus('idle'); }
            this.y = floor - this.h;
            this.vSpeed = 0;               // Reset jump speed
            this.jumping = false;
            this.position = GROUND;         // After a box (p or n) has been picked up, resets position
            this.landed = true;
        }      
    }

    this.updateStatus = function (stat) {
        this.status = stat;
        this.y += this.h - SPRITE_SIZE[stat].h;
        this.h = SPRITE_SIZE[stat].h;
        this.w = SPRITE_SIZE[stat].w;
    }
};