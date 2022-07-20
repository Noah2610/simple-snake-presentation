// Used to keep track of current frame number.
let FRAME = 0;

function main() {
    window.requestAnimationFrame(update);
}

function update() {
    // We will put our game logic here...

    // Call update() again once the browser
    // is ready to redraw the page.
    window.requestAnimationFrame(update);

    FRAME++;
}

// Start our game once the page has loaded.
window.onload = main;
