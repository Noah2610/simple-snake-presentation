// Used to keep track of current frame number.
let FRAME = 0;

function main() {
    window.requestAnimationFrame(update);
}

function update() {
    // MOVE SNAKE HEAD
    // Only move every 30 frames.
    if (FRAME % 30 === 0) {
        const headEl = document.getElementById("snake-head");

        let x = parseInt(headEl.style.left) || 0;
        let y = parseInt(headEl.style.top) || 0;

        // Only move right for now...
        x += 32;

        headEl.style.left = `${x}px`;
        headEl.style.top = `${y}px`;
    }

    // Call update() again once the browser
    // is ready to redraw the page.
    window.requestAnimationFrame(update);

    FRAME++;
}

// Start our game once the page has loaded.
window.onload = main;
