var x = 64;

function moveLeft () {
    if (x - 10 > 0) {   // Prevents crossing left border 
        x -= 10;
        player.style.left = `${x}px`;
    }
}

function moveRight () {
    if (x + 10 < 968) {  // Prevents crossing right border 
        x += 10;
        player.style.left = `${x}px`;
    }
}

window.addEventListener("keydown", (e) => {
    switch (e.key) {
        case "ArrowLeft":
            moveLeft();
            break;
        case "ArrowRight":
            moveRight();
            break;
    }
});