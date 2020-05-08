const GRAVITY = 0.5;

// Audio Player Class - Handles audio (SFX or OST)
var audioPlayer = function () {
    this.audio = new Audio();
    
    this.play = function (event) {
        switch (event) {
            case "jump":
                this.audio.src = "../assets/sound/sfx/sfx_jump.wav";
                break;
          /*  case "land":
                this.audio.src = "../assets/sound/sfx/sfx_land.wav";
                this.audio.play();
                break; */
        }
        this.audio.play();
    }
}

// Game Class - Handles world creation and interaction
var Game = function () {
    const self = this;
    this.keyLeft = false;
    this.keyRight = false;
    this.keyJump = false;
    this.resources = new Resources ();
    this.obstacles = new ObstacleBuffer (); 
    this.player = new Player ();
    this.sound = new audioPlayer();

    // Loaders
    this.init = function ()
    {
        this.resources.startPreload();
        drawGround();
        this.obstacles.createObstacle(300, GROUND);
        this.obstacles.createObstacle(900, GROUND);
    }

    // Main game block - Generates procedure every iteration
    this.engine = function () {
        drawGround();
        this.loadObstacle();
        // If there is no object in the direction the character moves  orthere is one but there is no collision
        if (this.keyLeft) this.movePlayer("left");
        if (this.keyRight) this.movePlayer("right");
        if (this.keyJump || this.player.jumping) {
            this.movePlayer("jump");
        }
        this.player.loadSprite();
    }

    this.loadObstacle = function () {
        this.obstacles.buffer.forEach((o) => {
            drawObstacle(o, this.resources.list.obstacles[o.type].element);
        });
    }

    //Movement
    this.movePlayer = function (direction) {
        if (!this.collideVertical() && this.player.position !== GROUND) {
            this.player.jumping = true;
            this.player.land(GROUND);
        }
        if (direction === "left") this.movePlayerLeft();
        if (direction === "right") this.movePlayerRight();
        if (direction === "jump") {
            if (!this.player.jumping) {
                this.sound.play("jump");
                this.player.jumping = true;
                this.player.vSpeed = -10;
            }
            this.player.jump();
            if (this.collideVertical()) this.player.land(this.obstacles.next().y);
            else this.player.land(GROUND);
        }
    }

    this.movePlayerLeft = function () {
        if (!this.isObjectBehind() || 
            this.isObjectBehind() && !this.collideLeft()) this.player.moveLeft();
    }

    this.movePlayerRight = function () {
        if (!this.isObjectInFront() ||
            this.isObjectInFront() && !this.collideRight()) this.player.moveRight();
    }

    // Obstacle positioning
    this.isObjectInFront = function () {
        return this.player.x + this.player.w < this.obstacles.next().x + this.obstacles.next().w;
    }

    this.isObjectBehind = function () {
        return this.player.x > this.obstacles.next().x;
    }
    
    // Collisions
    this.collideLeft = function () {
        return this.player.x - this.player.runSpeed <= this.obstacles.next().x + this.obstacles.next().w &&
               this.player.y < this.obstacles.next().y + this.obstacles.next().h &&
               this.player.y + this.player.h > this.obstacles.next().y;
    }

    this.collideRight = function () {
        return this.player.x + this.player.w + this.player.runSpeed >= this.obstacles.next().x &&
               this.player.y < this.obstacles.next().y + this.obstacles.next().h &&
               this.player.y + this.player.h > this.obstacles.next().y;
    }

    this.collideVertical = function () {
        if ((this.player.x > this.obstacles.next().x &&
            this.player.x < this.obstacles.next().x + this.obstacles.next().w ||
            this.player.x + this.player.w > this.obstacles.next().x &&
            this.player.x + this.player.w < this.obstacles.next().x + this.obstacles.next().w) &&
            this.player.y + this.player.h + this.player.vSpeed >= this.obstacles.next().y) {
                this.player.position = this.obstacles.next().y;
                return true;
            }
            return false; 
    }
}
