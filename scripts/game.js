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
    this.distance = 2000;
    this.countDown = 60;
    this.timerClock;
    this.timerDistance;
    this.timerObstacle;
    this.over = false;

    // Game Setup - Preloads all assets
    this.init = function ()
    {
        this.resources.startPreload();
        //begin testing
        //this.obstacles.createObstacle(); // <--- this is the only creation point at the moment
        // this.startGame();
        //end testing  
        setTimeout(self.loadWhenReady, 300);
    }

    this.loadWhenReady = function () {
        if (self.resources.isLoadComplete()) {
            self.sound.load(self.resources.list.sfx);
            self.startGame();
            return;
        } else {
            setTimeout(self.loadWhenReady, 300);
        }
    }

    this.startGame = function () {
        this.timerClock = setInterval(function () {
            self.countDown--;
        }, 1000);
        this.timerDistance = setInterval(function () {
            if (self.player.status !== 'idle') self.distance--;
        }, 30); // <-- Approx 35 makes game beatable no errors and 6-7 +5 items picked up
        this.timerObstacle = setInterval(self.generateObstacle, 1000);
    }

    // Main game block - Generates procedure every iteration
    this.engine = function () {
        // Detect end game conditions
        if (this.countDown === 0) {             // Life loss or Game Over
            if (this.attempts === 1) {
                this.over = true
                clearInterval(this.timerClock);
                clearInterval(this.timerDistance);
                this.attempts--;
                this.loadCounters();
                console.log("Game Over");
            } else {
                this.countDown = 60;
                this.attempts--;
            }
            this.distance = 2000;    
        }
        if (this.distance <= 0) {               // Goal
            this.over = true;
            clearInterval(this.timerClock);
            clearInterval(this.timerDistance);
            console.log("Congratulations! You are on time!");
        }

        // Draw enviroment and obstacles
        drawGround(); 
        this.generateObstacle();
        this.loadObstacle();
        this.loadCounters();

        // Detect key pressed and move player
        if (this.keyLeft) this.movePlayer("left");
        if (this.keyRight) this.movePlayer("right");
        if (this.keyJump || this.player.jumping) {
            this.movePlayer("jump");
        }
        this.loadPlayer();

        //Detec collisions
        if (this.collideObstaclePlayer() && !this.player.hit) {
            this.sound.play("hit");
            this.player.hit = true;
        }

        if (!this.collideObstaclePlayer() && !this.collideVertical()) {
            this.obstacles.animateObstacles();
            this.player.hit = false;
        }
    }
    
    // Loaders
    this.loadCounters = function () {
        drawCounters(this.attempts, this.resources.list.ui.heart.element,
                     this.countDown, this.resources.list.ui.clock.element,
                     this.distance, this.resources.list.ui.flag.element);
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
            this.checkObstacleCrossed();

            if (this.player.landed) {
                this.sound.play("land");
                this.player.landed = false;
            }
        }
    }

    this.movePlayerLeft = function () {
        if (!this.collideLeft()) { this.player.moveLeft(); }
        else { this.player.status = 'idle' }
        this.checkObstacleCrossed();
    }

    this.movePlayerRight = function () {
        if (!this.collideRight()) this.player.moveRight();
        else { this.player.status = 'idle' }
        this.checkObstacleCrossed();
    }

    // Obstacle positioning and generations
    this.generateObstacle = function () {
        if (!self.obstacles.bufferFull())
            self.obstacles.createObstacle();
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
        return this.obstacles.next() &&
               this.player.x + this.player.w + this.player.runSpeed >= this.obstacles.next().x &&
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

    this.collideObstaclePlayer = function () {
        return this.obstacles.next() && this.collideRight();
    }
}
