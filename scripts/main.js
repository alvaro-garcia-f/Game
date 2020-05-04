var x = 64;

function moveLeft () {
    x -= 10;
    player.style.left = `${x}px`
}

function moveRight () {
    x += 10;
    player.style.left = `${x}px`
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