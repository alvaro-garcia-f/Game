const SCR_WIDTH = 1000;
const SCR_HEIGHT = 562;
const GROUND = 498;

const canvas = document.getElementById("screen");
const ctx = canvas.getContext("2d");

function loadGround () {
    ctx.beginPath();
    ctx.fillStyle = "#2c2b40";
    ctx.fillRect(0, GROUND, SCR_WIDTH, 64);
}
