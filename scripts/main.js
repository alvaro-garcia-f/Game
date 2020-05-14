var id;

//- MAIN LOOP
function loadScrLoop() {
    ctx.clearRect(0, 0, SCR_WIDTH, SCR_HEIGHT);
    game.engine(); 
    if(game.status === 1) id = requestAnimationFrame(loadScrLoop); // Game running
    if(game.status === 2) {                                        // Life loss
        cancelAnimationFrame(id);
        drawPunishment(game.player.attempts);
        setTimeout(game.setUpLevel, 3000);
    }
 
    if(game.status === 3) {                                        // Goal reached
        cancelAnimationFrame(id);
        animateGoal();
       // game.setUpLevel();
    }
    if(game.status === 0) {                                         // Game Over
        cancelAnimationFrame(id);
        drawGameOver();
    }
}

//- INITIALIZE GAME
var game = new Game();
game.init();

// KEYBOARD LISTENERS
window.addEventListener("keydown", (e) => {
    e.preventDefault();
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
    e.preventDefault();
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