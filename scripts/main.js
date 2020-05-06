// Animation Loop
function loadScrLoop() {
    ctx.clearRect(0, 0, SCR_WIDTH, SCR_HEIGHT);
    loadGround();
    game.loadObstacle();
    // If there is no object in the direction the character moves there is one but there is no collision
    if (game.keyLeft && (!game.isObjectBehind() || 
        game.isObjectBehind() && !game.collideLeft())) game.player.move("left");
    if (game.keyRight && (!game.isObjectInFront() ||
        game.isObjectInFront() && !game.collideRight())) game.player.move("right");
    
    if (game.keyJump || game.player.jumping) {
        game.player.move("jump");
        game.land();
    }
    game.player.loadSprite();
    requestAnimationFrame(loadScrLoop);
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

// Start animation loop
requestAnimationFrame(loadScrLoop);