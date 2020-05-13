const SCR_WIDTH = 1000;
const SCR_HEIGHT = 562;
const GROUND = 498;

const canvas = document.getElementById("screen");
const ctx = canvas.getContext("2d");
//Set up font
ctx.font = '15.75px Eight Bit Dragon';
ctx.lineWidth = 3;

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
function drawCounters(attempts, heart, time, clock, distance, flag) {
    //Hearts
    for (let i = 1; i <= attempts; i++) {
        ctx.drawImage(heart, 25 * i, 50, heart.width / 2, heart.height / 2);
    }

    ctx.strokeStyle = '#333';
    ctx.fillStyle = '#fff';

    //Clock + Time
    ctx.drawImage(clock, 850, 50, clock.width / 1.5, clock.height / 1.5);
    ctx.strokeText(`${time}s`, 890, 75);
    ctx.fillText(`${time}s`, 890, 75);

    //Flag + Distance
    ctx.drawImage(flag, 430, 50, flag.width / 1.5, flag.height / 1.5);
    ctx.strokeText(`${distance}m`, 470, 75);
    ctx.fillText(`${distance}m`, 470, 75);
}

//Should make time blink in green. Doesn't work
function drawBonusTime(time) {
    ctx.strokeStyle = 'lime';
    ctx.fillStyle = 'lime';
    ctx.strokeText(`${time}s`, 890, 70);
    ctx.fillText(`${time}s`, 890, 70);
}

// - GAME ELEMENTS
//Draws generic elements on the screen. Asset contains the HTML element,
//Object its position.
function drawElement(asset, object) {
    ctx.drawImage(asset, object.x, object.y);
}



