const GRAVITY = 0.5;

// Audio Player Class - Handles audio (SFX or OST)
var audioPlayer = function () {
    this.sfx = {};
    this.ost = {};
    
    this.loadSfx = function (sounds) {
        this.sfx = sounds;
    }

    this.loadOst = function (sounds) {
        this.ost = sounds;
    }

    this.playSfx = function (event) {
        if (this.sfx[event]) this.sfx[event].element.play();
    }

    this.playOst = function (track) {
        if (this.ost[track]) {
            this.ost[track].element.loop = true;
            this.ost[track].element.play();
        }
    }

    this.stop = function (track) {
        if (this.ost[track]) {
            this.ost[track].element.pause();
            this.ost[track].element.currentTime = 0;
            this.ost[track].element.loop = true;
        }
    }
}

// Game Class - Handles world creation and interaction
var Game = function () {
    const self = this;
    this.status = -1;         // -1-Stopped | 0-Title | 1-Running  | 2-Life Loss | 3-Goal reached 
    
    this.keyLeft = false;
    this.keyRight = false;
    this.keyJump = false;
    
    this.resources = new Resources ();
    this.obstacles = new ObstacleBuffer (); 
    this.player = new Player ();
    this.browserFrames = 0;                  // Counts amount of animationFrames. Every 10, changes player running sprite. 
    this.bg = {                               // Background position
        x: 0,
        y: 0
    }

    this.bg2 = {                             // Second background to replicate loop
        x: SCR_WIDTH,
        y: 0
    }
    
    this.item = {
        w: 29,
        h: 31,
        x: 1000,
        y: 350,
        visible: true,
        collected: false
    };
    this.sound = new audioPlayer();

    this.level = 1;
    this.difficulty = 0;
    this.baseDistance = 500;
    this.maxCountDown = 60;
    this.countDown;
    this.timerClock;
    this.timerDistance;
    this.timerObstacle;
    this.goalReached = false;

    //- GAME SETUP 
    // Preload all assets
    this.init = function ()
    {
        this.resources.startPreload();
        setTimeout(self.loadWhenReady, 300);
    }

    // When all assets are ready set up next level
    this.loadWhenReady = function () {
        if (self.resources.isLoadComplete()) {
            self.sound.loadSfx(self.resources.list.sfx);
            self.sound.loadOst(self.resources.list.ost);
            self.sound.playOst('intro');
            animateTitle();
            return;
        } else {
            setTimeout(self.loadWhenReady, 300);
        }
    }

    // Initialize player position, counters and cleans obstacles
    this.setUpLevel = function () {
        self.player.x = 64;
        self.player.y = GROUND - self.player.h;
        self.player.status = 'idle';

        //Increase distance with difficulty
        if(self.goalReached)
            self.baseDistance += 100 * self.difficulty;
        
        self.distance = self.baseDistance;

        //Increase distance with difficulty
        if (self.goalReached)
            self.maxCountDown -= self.difficulty;
        
        if (self.maxCountDown > 10) 
            self.countDown = self.maxCountDown; 
        else 
            self.countDown = 10;    
        
        self.goalReached = false;
        self.item.visible = false;
        self.obstacles.emptyBuffer();
        self.bg.x = 0;
        self.bg2.x = SCR_WIDTH;
        drawNextLevel(`Day ${self.level}`);
        setTimeout(self.startGame, 3000);
    }

    //- GAME START
    //Start counters, launches obstacles, starts main loop
    this.startGame = function () {
        // Start animation loop
        self.sound.stop("intro");
        console.log("Game Start");
        self.sound.playOst("lvl_1");
        requestAnimationFrame(loadScrLoop);
        self.status = 1;
        
        // Start countdowns
        self.timerClock = setInterval(function () {
            self.countDown--;
        }, 1000);

        self.timerDistance = setInterval(function () {
            if (self.player.status !== 'idle') self.distance--;
        }, 30); // <-- Approx 35 makes game beatable no errors and 6-7 +5 items picked up
        
        self.timerObstacle = setInterval(self.generateObstacle, 3000);
    }
    
    //Main game block - Generates - Updates - Prints
    this.engine = function () {

        // Detect end game conditions
        // Countdown reaches 0 - Life loss or Game Over
        if (this.countDown <= 0) {
            this.sound.stop("lvl_1");             
            this.missedAttempt();
            return;
        }
        // Distance reaches 0 - Goal
        if (this.distance <= 0) { 
            this.sound.stop("lvl_1");     
            this.reachGoal();
            return;
        }
        
        // Detect key pressed and move player
        if (this.keyLeft) this.movePlayer("left");
        if (this.keyRight) this.movePlayer("right");
        if (this.keyJump || this.player.jumping) {
            this.movePlayer("jump");
        }
        
        this.generateObstacle();
        this.generateItem();

        // Draw enviroment and obstacles
        this.loadEnviroment();
        this.loadObstacle();
        this.loadCounters();
        this.loadItem();
        this.loadPlayer();
        
        //If after moving the player is still on a box, go back to idle status
        if (this.collideVertical()) this.player.updateStatus('idle'); 

        //Detect if and obstacle collides with a player
        if (this.collideObstaclePlayer()) {
            this.player.updateStatus('idle');
            if(!this.player.hit) {
                this.sound.playSfx("hit");
                this.player.hit = true;
            }
        }

        // If there are no Collisions, background and obstacles scroll
        this.animateEnviroment();

        // If item visible and collides with player increase countDown
        this.pickUpItem();
    }
    
    //- LOADERS - Print elements on screen
    //Draws heart counter, flag, distance, clock and time left
    this.loadCounters = function () {
        drawCounters(this.player.attempts, this.resources.list.ui.heart.element,
                     this.countDown, this.resources.list.ui.clock.element,
                     this.distance, this.resources.list.ui.flag.element, this.item.collected);
    }

    //Draws background and floor
    this.loadEnviroment = function () {
        drawBackground(this.resources.list.bg.city.element, this.bg);
        drawBackground(this.resources.list.bg.city.element, this.bg2);
        drawGround();
    }

    //Detect the correct sprite and draws the player
    this.loadPlayer = function () {
        var sprite = `${this.player.status.split("_")[0]}_${this.player.attempts}`;
        
        if (this.player.status.split('_')[0] === 'running') sprite = `${sprite}_${this.player.status.split("_")[1]}`; 
        
        drawElement(this.resources.list.player[sprite].element, this.player);
        
        this.browserFrames++;
        if (this.browserFrames === 6) {
            this.browserFrames = 1;
            this.player.frame++;
            this.player.updateStatus(`running_${this.player.frame%5}`);
        }
    }

    //Draws every obstacle in front and behind player
    this.loadObstacle = function () {
        if (this.obstacles.bufferFront.length > 0) {
            this.obstacles.bufferFront.forEach((o) => {
                drawElement(this.resources.list.obstacles[o.type].element, o);
            });
        }
        
        if(this.obstacles.bufferBack.length > 0) {
            this.obstacles.bufferBack.forEach((o) => {
                drawElement(this.resources.list.obstacles[o.type].element, o);
            });
        }
    }

    //Generate item on the right border of the screen and animates it
    this.loadItem = function () {
        if (this.item.visible) {
            drawElement(this.resources.list.items.beer.element, this.item);
            this.item.x -= 1 + this.difficulty;
        }

        if (this.item.x + this.item.w <= 0) {
            this.item.x = 1000;
            this.item.visible = false;
        }
    }

    //- MOVEMENT
    //Detect in which direction the player is moving and act accordingly
    this.movePlayer = function (direction) {
        // If player moves out an obstacles, falls to ground
       this.playerFalls();

        // Move player in the correct direction
        if (direction === "left") this.movePlayerLeft();
        if (direction === "right") this.movePlayerRight();
        if (direction === "jump") {
            if (!this.player.jumping) {
                this.sound.playSfx("jump");
                this.player.jumping = true;
                this.player.vSpeed = -10;
            }
            this.player.jump();

            // Control landing on ground, next obstacle or previous obstacle
            this.playerLands();
            this.checkObstacleCrossed();

            if (this.player.landed) {
                this.sound.playSfx("land");
                this.player.landed = false;
            }
        }
    }
    
    this.movePlayerLeft = function () {
        if (!this.collideLeft())
            this.player.moveLeft();
        else 
            this.player.updateStatus('idle');
        this.checkObstacleCrossed();
    }
    
    this.movePlayerRight = function () {
        if (!this.collideRight()) 
            this.player.moveRight();
        else 
            this.player.updateStatus('idle');
        this.checkObstacleCrossed();
    }
    
    //Detect if player is running out of an obstacle and makes him fall
    this.playerFalls = function () {
        if (!this.collideVertical() && this.player.position !== GROUND && !this.player.jumping) {
            this.player.jumping = true;
            this.player.land(GROUND);
        }
    }

    //Detects where player lands (previous or next obstacle or ground) after a jump or fall
    this.playerLands = function () {
        if (this.collideVertical() && this.player.location === "n") { this.player.land(this.obstacles.next().y);}
            else if (this.collideVertical() && this.player.location === "p") { this.player.land(this.obstacles.previous().y);}
            else this.player.land(GROUND);
    }

    //Detect if player collides with item and increases time if so
    this.pickUpItem = function () {
        if (this.item.visible && this.collidePlayerItem()) {
            this.item.visible = false;
            this.sound.playSfx("beer");
            this.countDown += 5;
            
            //Make title blink in green
            var counter = 4;                                    
            var bonusTimer = setInterval (() => {
                self.item.collected = !self.item.collected;
                counter--;
                if (counter === 0) clearInterval(bonusTimer);                   
            }, 160);
        }
    }

    //If there are no collisions animate the elements
    this.animateEnviroment = function () {
        if (!this.collideObstaclePlayer() && !this.collideVertical()) {
            console.log(this.player.x + this.player.w , "-", this.obstacles.next().x);
            this.animateBackground();                                                                                  
            this.obstacles.animateObstacles();
            this.player.hit = false;
        }
    }

    //- OBSTACLES & ITEMS - Obstacle and Items positioning and generation
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

    this.generateItem = function () {     
        if (!this.item.visible && Math.random()*100 <= 0.5) {
            this.item.visible = true;
            this.item.x = 1000;
        }
    }

    this.animateBackground = function () {
        this.bg.x -= 0.5;
        this.bg2.x -= 0.5;
        if(this.bg.x === -1000) this.bg.x = SCR_WIDTH;
        if(this.bg2.x === -1000) this.bg2.x = SCR_WIDTH;
    }

    //- COLLISIONS
    //Player moving left and colliding with previous obstacle
    this.collideLeft = function () {
        return this.obstacles.previous() &&
               this.player.x - this.player.runSpeed <= this.obstacles.previous().x + this.obstacles.previous().w &&
               this.player.y < this.obstacles.previous().y + this.obstacles.previous().h &&
               this.player.y + this.player.h > this.obstacles.previous().y;
    }

    //Player moving right and colliding with next obstacle
    this.collideRight = function () {
        return this.obstacles.next() &&
               this.player.x + this.player.w + this.player.runSpeed >= this.obstacles.next().x &&
               this.player.y < this.obstacles.next().y + this.obstacles.next().h &&
               this.player.y + this.player.h > this.obstacles.next().y;
    }

    //Detect if player is landing on previous or next obstacle
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

    //Detects collision with nearest obstacle
    this.collideVerticalObstacle = function (obstacle, pos) {
        if (obstacle &&
        this.collideVerticalSmallLarge(this.player, obstacle) ||
        this.collideVerticalSmallLarge(obstacle, this.player)) {
            this.player.position = obstacle.y;
            this.player.location = pos;
            return true;
        }
        this.player.location = GROUND;
        return false; 
    }

    //Detects if an element's side collides inside the limits of a large element
    this.collideVerticalSmallLarge = function (small, large) {
        return small.x > large.x &&                              // Player collides with larger obstacle
               small.x < large.x + large.w ||
               small.x + small.w > large.x &&
               small.x + small.w < large.x + large.w;
    }

    //Player stands idle and moving obstacle collides with him
    this.collideObstaclePlayer = function () {
        return this.obstacles.next() && this.collideRight() ||
               this.obstacles.next() && this.collideVertical();
    }

    //Player collides with item
    this.collidePlayerItem = function () {
        return this.item.x + this.item.w >= this.player.x &&
               this.item.x + this.item.w <= this.player.x + this.player.w &&
               this.item.y >= this.player.y && this.item.y <= this.player.y + this.player.h ||
               this.item.x <= this.player.x + this.player.w &&
               this.item.x >= this.player.x &&  this.item.y >= this.player.y && 
               this.item.y <= this.player.y + this.player.h;
    }

    //- LEVEL AND GAME ENDINGS
    this.missedAttempt = function () {
        clearInterval(this.timerClock);
        clearInterval(this.timerDistance);
        clearInterval(this.timerObstacle);

        this.player.attempts--;

        if (this.player.attempts === 0) {
            console.log("Game Over");
            this.status = -1;
        } else {
            console.log("I'm sorry! You are late!");
            this.status = 2;
            this.level++;
        }
        this.sound.playSfx("late");
    }

    this.reachGoal = function () {
        clearInterval(this.timerClock);
        clearInterval(this.timerDistance);
        clearInterval(this.timerObstacle);
        
        console.log("Congratulations! You are on time!");
        this.status = 3;
        this.level++;
        this.difficulty++;
        this.goalReached = true;
        this.sound.playSfx("victory");
    }
}
