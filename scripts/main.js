var id;
// Animation Loop
function loadScrLoop() {
    ctx.clearRect(0, 0, SCR_WIDTH, SCR_HEIGHT);
    game.engine(); 
    if(game.status === 1) id = requestAnimationFrame(loadScrLoop);
    if(game.status === 2) {
        cancelAnimationFrame(id);
        game.setUpLevel();
    }
    if(game.status === 0) cancelAnimationFrame(id);
}

// Initialize game
var game = new Game();
game.init();

// Keyboard listeners
window.addEventListener("keydown", (e) => {
    switch (e.key) {
        case "ArrowLeft":
            game.keyLeft = true;
            break;
        case "ArrowRight":
            game.keyRight = true;
            break;
        case "ArrowUp":
            game.keyJump = true;
            break;
    }
});

window.addEventListener("keyup", (e) => {
    switch (e.key) {
        case "ArrowLeft":
            game.keyLeft = false;
            break;
        case "ArrowRight":
            game.keyRight = false;
            break;
        case "ArrowUp":
            game.keyJump = false;
            break;
    }
});