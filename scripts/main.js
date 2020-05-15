var id;

//- MAIN LOOP
function loadScrLoop() {
    ctx.clearRect(0, 0, SCR_WIDTH, SCR_HEIGHT);
    game.engine();

    // Status === 1 - Game running -> Iterate
    if (game.status === 1) id = requestAnimationFrame(loadScrLoop);

    // Status === 2 - Level ended with missedAttempt()
    if (game.status === 2) {
        cancelAnimationFrame(id);
        drawPunishment(game.player.attempts);
        setTimeout(game.setUpLevel, 3000);
    }

    // Status === 3 - Level ended with ReachGoal()
    // animateGoal() shows animation and launches next level    
    if (game.status === 3) {
        cancelAnimationFrame(id);
        game.loadEnviroment();
        animateGoal();
    }

    // Status === -1 - Game Over
    if (game.status === -1) {
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
        case " ":
            if (game.status === 0) {
                game.status = -1;
                game.setUpLevel();
            }
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