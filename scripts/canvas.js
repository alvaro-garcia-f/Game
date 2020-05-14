const SCR_WIDTH = 1000;
const SCR_HEIGHT = 562;
const GROUND = 498;
var animationId;
var animationOver = false;

const canvas = document.getElementById("screen");
const ctx = canvas.getContext("2d");
//Set up font
ctx.font = '15.75px Eight Bit Dragon';
ctx.lineWidth = 3;
ctx.textAlign = "center"

//Reset basic font color
function resetFont() {
    ctx.font = '15.75px Eight Bit Dragon';
    ctx.strokeStyle = '#333';
    ctx.fillStyle = '#fff';
    ctx.shadowOffsetY = 0;
    ctx.shadowBlur = 0;
    ctx.lineWidth = 3;
}

//Set font shadow
function setShadow() {
    ctx.shadowColor = 'black';
    ctx.shadowOffsetY = 2;
    ctx.shadowBlur = 2;
}

// - ENVIROMENT
function drawBackground(asset, bg) {
    ctx.drawImage(asset, bg.x, bg.y);
}

function drawGround() {
    ctx.fillStyle = "#2c2b40";
    ctx.fillRect(0, GROUND, SCR_WIDTH, 64);
}

function drawBuilding(image, pos) {
    ctx.drawImage(image, pos, GROUND - 379, 400, 400);
}

// - INTERFACE
function drawCounters(attempts, heart, time, clock, distance, flag, bonusStyle) {
    //Hearts
    for (let i = 1; i <= attempts; i++) {
        ctx.drawImage(heart, 25 * i, 50, heart.width / 2, heart.height / 2);
    }

    resetFont();
    
    //Flag + Distance
    ctx.drawImage(flag, 430, 50, flag.width / 1.5, flag.height / 1.5);
    ctx.strokeText(`${distance}m`, 495, 75);
    ctx.fillText(`${distance}m`, 495, 75);
    
    //Clock + Time
    ctx.drawImage(clock, 850, 50, clock.width / 1.5, clock.height / 1.5);
    
    if(bonusStyle) {
        ctx.strokeStyle = 'lime';
        ctx.fillStyle = 'lime';
        ctx.strokeText(`${time}s`, 905, 73);
        ctx.fillText(`${time}s`, 905, 73);
    } else {
        ctx.strokeText(`${time}s`, 905, 75);
        ctx.fillText(`${time}s`, 905, 75);
    }

}

// - GAME ELEMENTS
//Draws generic elements on the screen. Asset contains the HTML element,
//Object its position.
function drawElement(asset, object) {
    ctx.drawImage(asset, object.x, object.y);
}

// - TRANSITION SCREENS
//Draw text alerts on the screen
function drawLevel(level) {
    resetFont();
    setShadow();
    ctx.strokeText(`Day ${level}`, 500, 270);
    ctx.fillText(`Day ${level}`, 500, 270);
}

//Print top message
function drawTopText(text) {
    resetFont();
    setShadow();

    ctx.strokeText(text, 500, 220);
    ctx.fillText(text, 500, 220);
}

//Print main message
function drawMainText(text, style) {
    resetFont();
    setShadow();

    if (style !== 'day') {
        ctx.font = '42px Eight Bit Dragon';
        ctx.lineWidth = 6;
    }

    //Create gradient
    var grad = ctx.createLinearGradient(0, 240, 0, 280);
    if(style === 'punishment') {
        grad.addColorStop(0, 'black');
        grad.addColorStop(.1, '#d10000');
        grad.addColorStop(.5, '#8a0000');
        grad.addColorStop(1, 'black');
        ctx.fillStyle = grad;
    }
    
    if (style === 'gameover') {
        grad.addColorStop(0, '#d46702');
        grad.addColorStop(.1, '#d1ae00');
        grad.addColorStop(.5, '#d15000');
        grad.addColorStop(.9, '#d10000');
        grad.addColorStop(1, '#8a0000');
        ctx.fillStyle = grad;
    }

    if (style === 'congratulations') {
        grad.addColorStop(0, '#1e73fc');
        grad.addColorStop(.1, '#65aaf7');
        grad.addColorStop(.5, '#4287f5');
        grad.addColorStop(.9, '#1e73fc');
        grad.addColorStop(1, '#003180');
        ctx.fillStyle = grad;
    }
    
    //Print Text
    ctx.strokeText(text, 500, 280);
    ctx.fillText(text, 500, 280);
}

function drawNextLevel(text) {
    ctx.clearRect(0, 0, SCR_WIDTH, SCR_HEIGHT);
    ctx.drawImage(game.resources.list.bg.city.element ,0,0);
    drawMainText(text, 'day');
}

function drawPunishment (attempts) {
    //Draw Background
    ctx.drawImage(game.resources.list.bg.city.element ,0,0);
    
    drawTopText("You are late!");

    drawMainText('PUNISHMENT', 'punishment');
    
    //Print Bottom message
    if (attempts === 4) var text = "Dye your hair!";
    if (attempts === 3) var text = "Shave your head!";
    if (attempts === 2) var text = "Dress like Urkel!";
    if (attempts === 1) var text = "You know what to do...";

    resetFont();
    setShadow();
    ctx.strokeText(text, 500, 320);
    ctx.fillText(text, 500, 320);
}

function drawGameOver () {
    //Draw Background
    ctx.drawImage(game.resources.list.bg.city.element, 0, 0);
    
    drawTopText("You have been expelled!");

    //Print game over
    drawMainText("GAME OVER", 'gameover');
}

// ANIMATION SCREENS
function animateTitle () {
var pos = SCR_HEIGHT;
animationId = requestAnimationFrame( function animation() {
    ctx.clearRect(0, 0, SCR_WIDTH, SCR_HEIGHT);
    ctx.drawImage(game.resources.list.bg.city.element, 0, pos);
    pos -= 2;
    if (pos > 0)
        requestAnimationFrame(animation);
    else 
         cancelAnimationFrame(animationId);
    });
}

function animateGoal () {
    var pos = SCR_WIDTH;
    animationId = requestAnimationFrame( function animation() {
        ctx.clearRect(0, 0, SCR_WIDTH, SCR_HEIGHT);
        game.loadEnviroment();
        
        // If player is in the air make him fall
        if (game.player.y < GROUND - game.player.h) 
            game.player.y = GROUND - game.player.h;

        // If player is not inside the building make him walk
        if (game.player.x < pos) {
            console.log(game.player.x);
            game.player.x += game.player.runSpeed;
            game.loadPlayer();
        }

        // If the building is still moving, animate background
        if(pos > 600) {
            pos -= 2;
            game.bg.x -= 0.5;
            game.bg2.x -= 0.5;
        }

        drawBuilding(game.resources.list.bg.building.element, pos);

        if (pos > 600 || game.player.x < 1000 - pos) { requestAnimationFrame(animation); }
        else {
            cancelAnimationFrame(animationId);
            drawTopText("You are on Time!");
            drawMainText("CONGRATULATIONS", 'congratulations');
            setTimeout(game.setUpLevel, 3000);
        }
    });
}