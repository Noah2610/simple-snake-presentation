let IS_RUNNING = true;
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
    // Don't perform any more updates once the IS_RUNNING flag is set to false.
    // This effectively stops the game.
    if (!IS_RUNNING) {
        return;
    }

    // Only move every 30 frames.
    if (FRAME % 30 === 0) {
        moveSnakeBodies();
        // Note, that we move the BODIES first and the HEAD afterwards.
        // This allows for the first body to copy the OLD position of the head,
        // then when the head updates it moves to its NEW position.
        // This way, the body elements will "lag behind" by one position.
        moveSnakeHead();
        handleFoodCollision();
        handleBodyCollision();
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

function handleFoodCollision() {
    const headEl = document.getElementById("snake-head");
    const foodEl = document.getElementById("food");

    const isColliding = doElementsCollide(headEl, foodEl);

    if (isColliding) {
        randomizeFoodPosition();
        spawnSnakeBody();
    }
}

function handleBodyCollision() {
    const headEl = document.getElementById("snake-head");
    const bodyEls = document.getElementsByClassName("snake-body");

    for (let i = 0; i < bodyEls.length; i++) {
        const bodyEl = bodyEls[i];

        const inCollision = doElementsCollide(headEl, bodyEl);

        if (inCollision) {
            gameOver();
        }
    }
}

function randomizeFoodPosition() {
    const foodEl = document.getElementById("food");

    // Calculate amount of cells per row / column.
    const columns = Math.floor(GAME_WIDTH / STEP);
    const rows = Math.floor(GAME_HEIGHT / STEP);

    // We set this to true initially so the while loop runs at least once.
    let inCollision = true;

    // Continue randomizing position until food is no longer in collision.
    while (inCollision) {
        // Get random cell and multiply by STEP to get actual position.
        const x = Math.floor(Math.random() * columns) * STEP;
        const y = Math.floor(Math.random() * rows) * STEP;

        foodEl.style.left = `${x}px`;
        foodEl.style.top = `${y}px`;

        const headEl = document.getElementById("snake-head");
        const bodyEls = document.getElementsByClassName("snake-body");

        // Check collision with snake head.
        inCollision = doElementsCollide(foodEl, headEl);

        // If the snake head element is not colliding,
        // then check for collision with any snake body element.
        if (!inCollision) {
            for (let i = 0; i < bodyEls.length; i++) {
                const bodyEl = bodyEls[i];
                if (doElementsCollide(foodEl, bodyEl)) {
                    inCollision = true;
                    break;
                }
            }
        }
    }
}

function spawnSnakeBody() {
    const bodyContainerEl = document.getElementById("snake-bodies");
    const lastBodyEl = bodyContainerEl.lastElementChild;

    const newBodyEl = document.createElement("div");
    newBodyEl.classList.add("entity", "snake-body");

    // Set new body's position to the position of the last existing body element
    newBodyEl.style.left = lastBodyEl.style.left;
    newBodyEl.style.top = lastBodyEl.style.top;

    bodyContainerEl.appendChild(newBodyEl);
}

function gameOver() {
    // Show the game-over element by removing its "hidden" class.
    const gameOverEl = document.getElementById("game-over");
    gameOverEl.classList.remove("hidden");

    IS_RUNNING = false;
}

function doElementsCollide(el1, el2) {
    const el1X = parseInt(el1.style.left);
    const el1Y = parseInt(el1.style.top);
    const el2X = parseInt(el2.style.left);
    const el2Y = parseInt(el2.style.top);

    return el1X === el2X && el1Y === el2Y;
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
