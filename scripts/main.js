var Player = function () {
    this.x = 64;
    
    this.moveLeft = function () {
        if (this.x - 10 > 0) {   // Prevents crossing left border 
            this.x -= 10;
            playerSprite.style.left = `${this.x}px`;
        }
    }

    this.moveRight = function () {
        if (this.x + 10 < 968) {  // Prevents crossing right border 
            this.x += 10;
            playerSprite.style.left = `${this.x}px`;
        }
    }
};


var player = new Player();

window.addEventListener("keydown", (e) => {
    console.log(player);
    switch (e.key) {
        case "ArrowLeft":
            player.moveLeft();
            break;
        case "ArrowRight":
            player.moveRight();
            break;
    }
});