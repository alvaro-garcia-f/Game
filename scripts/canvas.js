const SCR_WIDTH = 1000;
const SCR_HEIGHT = 562;
const GROUND = 498;

const canvas = document.getElementById("screen");
const ctx = canvas.getContext("2d");

// Drawing on canvas
function drawGround() {
    ctx.fillStyle = "#2c2b40";
    ctx.fillRect(0, GROUND, SCR_WIDTH, 64);
}

function drawCounters(attempts, heart, time, clock, distance, flag) {
    //Hearts
    for (let i = 1; i <= attempts; i++) {
        ctx.drawImage(heart, 25*i, 50, heart.width/2, heart.height/2);
    }
    //Set up font
    ctx.font = 'bold 30px Droid Sans';
    ctx.strokeStyle = '#000';
    ctx.fillStyle = '#fff';

    //Clock + Time
    ctx.drawImage(clock, 850, 50, clock.width/1.5, clock.height/1.5);
    ctx.strokeText(`${time}s`, 890, 76);
    ctx.fillText(`${time}s`, 890, 76);

    //Flag + Distance
    ctx.drawImage(flag, 430, 50, flag.width/1.5, flag.height/1.5);
    ctx.strokeText(`${distance}m`, 470, 76);
    ctx.fillText(`${distance}m`, 470, 76);
}

function drawPlayer(player, image) {
    ctx.drawImage(image, player.x, player.y);
}

function drawObstacle(obstacle, image) {
    ctx.drawImage(image, obstacle.x, obstacle.y);
}