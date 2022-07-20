// Used to keep track of current frame number.
let FRAME = 0;
// Keep track of the direction our snake is moving into.
// One of "up", "down", "left", or "right".
let SNAKE_DIRECTION = "right";
// Our step size for moving our snake.
const STEP = 32;

const GAME_WIDTH = 640;
const GAME_HEIGHT = 640;

function main() {
    // Call the onKeyDown() function when the user presses a key.
    document.addEventListener("keydown", onKeyDown);

    randomizeFoodPosition();

    window.requestAnimationFrame(update);
}

function onKeyDown(event) {
    const key = event.key.toLowerCase();
    switch (key) {
        case "w":
            // We aren't allowed to move in the opposite direction.
            if (SNAKE_DIRECTION !== "down") {
                SNAKE_DIRECTION = "up";
            }
            break;
        case "s":
            if (SNAKE_DIRECTION !== "up") {
                SNAKE_DIRECTION = "down";
            }
            break;
        case "a":
            if (SNAKE_DIRECTION !== "right") {
                SNAKE_DIRECTION = "left";
            }
            break;
        case "d":
            if (SNAKE_DIRECTION !== "left") {
                SNAKE_DIRECTION = "right";
            }
            break;
    }
}

function update() {
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

    switch (SNAKE_DIRECTION) {
        case "up": {
            y -= STEP;
            break;
        }
        case "down": {
            y += STEP;
            break;
        }
        case "left": {
            x -= STEP;
            break;
        }
        case "right": {
            x += STEP;
            break;
        }
    }

    // Use modulo operator to limit our x and y positions to 0 - 640.
    x = mod(x, GAME_WIDTH);
    y = mod(y, GAME_HEIGHT);

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

function randomizeFoodPosition() {
    const foodEl = document.getElementById("food");

    // Calculate amount of cells per row / column.
    const columns = Math.floor(GAME_WIDTH / STEP);
    const rows = Math.floor(GAME_HEIGHT / STEP);

    // Get random cell and multiply by STEP to get actual position.
    const x = Math.floor(Math.random() * columns) * STEP;
    const y = Math.floor(Math.random() * rows) * STEP;

    foodEl.style.left = `${x}px`;
    foodEl.style.top = `${y}px`;
}

// Use this function as the modulo (%) operator instead of the default operator.
// The built-in JavaScript % operator doesn't handle negative numbers
// the way we want it to. So I "borrowed" this function from StackOverflow.
// https://stackoverflow.com/a/4467559/10927893
function mod(n1, n2) {
    return ((n1 % n2) + n2) % n2;
}

// Start our game once the page has loaded.
window.onload = main;
