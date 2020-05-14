const SCR_WIDTH = 1000;
const SCR_HEIGHT = 562;
const GROUND = 498;

const canvas = document.getElementById("screen");
const ctx = canvas.getContext("2d");
//Set up font
ctx.font = '15.75px Eight Bit Dragon';
ctx.lineWidth = 3;
ctx.textAlign = "center"

// Set basic font color
function resetColor() {
    ctx.strokeStyle = '#333';
    ctx.fillStyle = '#fff';
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

    resetColor();
    
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

//Draw text alerts on the screen
function drawText(text) {
    resetColor();
    ctx.strokeText(text, 500, 270);
    ctx.fillText(text, 500, 270);
}

// - GAME ELEMENTS
//Draws generic elements on the screen. Asset contains the HTML element,
//Object its position.
function drawElement(asset, object) {
    ctx.drawImage(asset, object.x, object.y);
}

// - TRANSITION SCREENS
function drawGameOver () {
    ctx.strokeStyle = '#333';
    resetColor();
    ctx.strokeText("You have been expelled!", 500, 270);
    ctx.fillText("You have been expelled!", 500, 270);
    ctx.strokeText("GAME OVER", 500, 270);
    ctx.fillText("GAME OVER", 500, 270);
}



