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

function drawCounters() {

}

function drawPlayer(player, image) {
    ctx.drawImage(image, player.x, player.y);
}

function drawObstacle(obstacle, image) {
    ctx.drawImage(image, obstacle.x, obstacle.y);
}