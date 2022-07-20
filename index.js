// Used to keep track of current frame number.
let FRAME = 0;

function main() {
    window.requestAnimationFrame(update);
}

function update() {
    // MOVE SNAKE HEAD
    // Only move every 30 frames.
    if (FRAME % 30 === 0) {
        moveSnakeBodies();
        // Note, that we move the BODIES first and the HEAD afterwards.
        // This allows for the first body to copy the OLD position of the head,
        // then when the head updates it moves to its NEW position.
        // This way, the body elements will "lag behind" by one position.
        moveSnakeHead();
    }

    // Call update() again once the browser
    // is ready to redraw the page.
    window.requestAnimationFrame(update);

    FRAME++;
}

function moveSnakeHead() {
    const headEl = document.getElementById("snake-head");

    let x = parseInt(headEl.style.left) || 0;
    let y = parseInt(headEl.style.top) || 0;

    // Only move right for now...
    x += 32;

    headEl.style.left = `${x}px`;
    headEl.style.top = `${y}px`;
}

function moveSnakeBodies() {
    const headEl = document.getElementById("snake-head");
    const bodyEls = document.getElementsByClassName("snake-body");

    // Loop through body elements BACKWARDS.
    for (let i = bodyEls.length - 1; i >= 0; i--) {
        const bodyEl = bodyEls[i];
        const prevBodyEl = bodyEls[i - 1] || headEl;

        // Set position of previous body element, or of head element.
        bodyEl.style.left = prevBodyEl.style.left;
        bodyEl.style.top = prevBodyEl.style.top;
    }
}

// Start our game once the page has loaded.
window.onload = main;
