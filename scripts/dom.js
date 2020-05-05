const canvas = document.getElementById("screen");
const ctx = canvas.getContext("2d");

function loadGround () {
    ctx.beginPath();
    ctx.fillStyle = "#2c2b40";
    ctx.fillRect(0,498, 1000, 64);
}
