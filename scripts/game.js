const GRAVITY = 0.5;

// Audio Player Class - Handles audio (SFX or OST)
var audioPlayer = function () {
    this.sfx = {};
    
    this.load = function (sounds) {
        this.sfx = sounds;
    }

    this.play = function (event) {
        if (this.sfx[event]) this.sfx[event].element.play();
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
    this.attempts = 5;
    this.countDown = 60;

    // Game Setup - Preloads all assets
    this.init = function ()
    {
        this.resources.startPreload();
        setTimeout(self.loadWhenReady, 300);
    }

    this.loadWhenReady = function () {
        if (self.resources.isLoadComplete()) {
            self.sound.load(self.resources.list.sfx);
            drawGround();
            self.obstacles.createObstacle(300, GROUND);
            self.obstacles.createObstacle(900, GROUND);
            return;
        } else {
            setTimeout(self.loadWhenReady(), 300);
        }
    }

    // Main game block - Generates procedure every iteration
    this.engine = function () {
        drawGround();  
        this.loadObstacle();
        this.loadCounters();
        // If there is no object in the direction the character moves or there is one but there is no collision
        if (this.keyLeft) this.movePlayer("left");
        if (this.keyRight) this.movePlayer("right");
        if (this.keyJump || this.player.jumping) {
            this.movePlayer("jump");
        }
        this.loadPlayer();
    }
    
    // Loaders
    this.loadCounters = function () {
        drawCounters(this.attempts, this.resources.list.ui.heart.element,
                     this.countDown, this.resources.list.ui.clock.element);
    }

    this.loadPlayer = function () {
        drawPlayer(this.player, this.resources.list.player[this.player.status].element);
    }

    this.loadObstacle = function () {
        if (this.obstacles.bufferFront.length > 0) {
            this.obstacles.bufferFront.forEach((o) => {
                drawObstacle(o, this.resources.list.obstacles[o.type].element);
            });
        }
        
        if(this.obstacles.bufferBack.length > 0) {
            this.obstacles.bufferBack.forEach((o) => {
                drawObstacle(o, this.resources.list.obstacles[o.type].element);
            });
        }
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
            if (this.collideVertical() && this.player.location === "n") { this.player.land(this.obstacles.next().y);}
            else if (this.collideVertical() && this.player.location === "p") { this.player.land(this.obstacles.previous().y);}
            else this.player.land(GROUND);

            if (this.player.landed) {
                this.sound.play("land");
                this.player.landed = false;
            }
        }
    }

    this.movePlayerLeft = function () {
        if (!this.isObjectBehind() || 
            this.isObjectBehind() && !this.collideLeft()) this.player.moveLeft();
        this.checkObstacleCrossed();
    }

    this.movePlayerRight = function () {
        if (!this.isObjectInFront() ||
            this.isObjectInFront() && !this.collideRight()) this.player.moveRight();
        this.checkObstacleCrossed();
    }

    // Obstacle positioning
    this.isObjectInFront = function () {
        return this.obstacles.next() && this.player.x + this.player.w < this.obstacles.next().x + this.obstacles.next().w;
    }

    this.isObjectBehind = function () {
        return this.obstacles.previous() && this.player.x > this.obstacles.previous().x;
    }
    
    this.checkObstacleCrossed = function () {
        if (this.obstacles.next() && this.player.x > this.obstacles.next().x + this.obstacles.next().w)
           this.obstacles.sendObstacleBack(); 
        if (this.obstacles.previous() && this.player.x + this.player.w < this.obstacles.previous().x)
            this.obstacles.sendObstacleForward();
    }

    // Collisions
    this.collideLeft = function () {
        return this.obstacles.previous() &&
               this.player.x - this.player.runSpeed <= this.obstacles.previous().x + this.obstacles.previous().w &&
               this.player.y < this.obstacles.previous().y + this.obstacles.previous().h &&
               this.player.y + this.player.h > this.obstacles.previous().y;
    }

    this.collideRight = function () {
        return this.player.x + this.player.w + this.player.runSpeed >= this.obstacles.next().x &&
               this.player.y < this.obstacles.next().y + this.obstacles.next().h &&
               this.player.y + this.player.h > this.obstacles.next().y;
    }

    this.collideVertical = function () {
        if (!this.obstacles.next() && this.obstacles.previous()) {
            return this.collideVerticalObstacle (this.obstacles.previous(), "p");

        } else if (!this.obstacles.previous() && this.obstacles.next()) {
            return this.collideVerticalObstacle (this.obstacles.next(), "n");

        } else if (this.obstacles.previous() && this.obstacles.next()) {
            if (Math.abs(this.player.x - this.obstacles.previous().x + this.obstacles.previous().w) <
                Math.abs(this.player.x + this.player.w - this.obstacles.next().x)) {
                return this.collideVerticalObstacle (this.obstacles.previous(), "p");
            } else {
                return this.collideVerticalObstacle (this.obstacles.next(), "n");
            }           
        }
    }

    this.collideVerticalObstacle = function (obstacle, pos) {
        if (obstacle &&
        (this.player.x > obstacle.x &&
        this.player.x < obstacle.x + obstacle.w ||
        this.player.x + this.player.w > obstacle.x &&
        this.player.x + this.player.w < obstacle.x + obstacle.w) &&
        this.player.y + this.player.h + this.player.vSpeed >= obstacle.y) {
            this.player.position = obstacle.y;
            this.player.location = pos;
            return true;
        }
        this.player.location = GROUND;
        return false; 
    }
}
