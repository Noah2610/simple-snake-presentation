let FRAME = 0;
let PLAYER_DIRECTION = "right";

const CONFIG = {
    width: 640,
    height: 640,
    step: 32,
    moveEveryXFrames: 10,
};

// https://stackoverflow.com/a/4467559/10927893
function mod(n1, n2) {
    return ((n1 % n2) + n2) % n2;
}

function checkCollision(el1, el2) {
    const el1X = parseInt(el1.style.left);
    const el1Y = parseInt(el1.style.top);
    const el2X = parseInt(el2.style.left);
    const el2Y = parseInt(el2.style.top);

    return el1X === el2X && el1Y === el2Y;
}

function main() {
    document.addEventListener("keydown", onKeyDown);

    window.requestAnimationFrame(update);
}

function onKeyDown(event) {
    const key = event.key.toUpperCase();

    switch (key) {
        case "W": {
            if (PLAYER_DIRECTION !== "down") {
                PLAYER_DIRECTION = "up";
            }
            break;
        }
        case "S": {
            if (PLAYER_DIRECTION !== "up") {
                PLAYER_DIRECTION = "down";
            }
            break;
        }
        case "D": {
            if (PLAYER_DIRECTION !== "left") {
                PLAYER_DIRECTION = "right";
            }
            break;
        }
        case "A": {
            if (PLAYER_DIRECTION !== "right") {
                PLAYER_DIRECTION = "left";
            }
            break;
        }
    }
}

function update() {
    movePlayer();

    window.requestAnimationFrame(update);

    FRAME++;
}

function movePlayer() {
    if (FRAME % CONFIG.moveEveryXFrames !== 0) {
        return;
    }

    movePlayerBodies();
    movePlayerHead();
    handleBodyCollision();
    handleFoodCollision();
}

function movePlayerHead() {
    const playerEl = document.getElementById("player");

    let x = parseInt(playerEl.style.left) || 0;
    let y = parseInt(playerEl.style.top) || 0;

    switch (PLAYER_DIRECTION) {
        case "up": {
            y -= CONFIG.step;
            break;
        }
        case "down": {
            y += CONFIG.step;
            break;
        }
        case "right": {
            x += CONFIG.step;
            break;
        }
        case "left": {
            x -= CONFIG.step;
            break;
        }
    }

    x = mod(x, CONFIG.width);
    y = mod(y, CONFIG.height);

    playerEl.style.left = `${x}px`;
    playerEl.style.top = `${y}px`;
}

function movePlayerBodies() {
    const headEl = document.getElementById("player");
    const bodyEls = document.getElementsByClassName("player-body");

    for (let i = bodyEls.length - 1; i >= 0; i--) {
        const bodyEl = bodyEls[i];
        const prevBodyEl = bodyEls[i - 1] || headEl;

        bodyEl.style.left = prevBodyEl.style.left;
        bodyEl.style.top = prevBodyEl.style.top;
    }
}

function handleBodyCollision() {
    const headEl = document.getElementById("player");
    const bodyEls = document.getElementsByClassName("player-body");

    for (let i = 0; i < bodyEls.length; i++) {
        const bodyEl = bodyEls[i];
        if (checkCollision(headEl, bodyEl)) {
            gameOver();
            break;
        }
    }
}

function gameOver() {
    throw new Error("Game Over!");
}

function handleFoodCollision() {
    const headEl = document.getElementById("player");
    const foodEl = document.getElementById("food");

    if (checkCollision(headEl, foodEl)) {
        moveFood();
        addBody();
    }
}

function addBody() {
    const bodyContainerEl = document.getElementById("player-bodies");
    const lastBodyEl = bodyContainerEl.lastElementChild;

    const bodyEl = document.createElement("div");
    bodyEl.classList.add("entity", "player-body");

    bodyEl.style.left = lastBodyEl.style.left;
    bodyEl.style.top = lastBodyEl.style.top;

    bodyContainerEl.appendChild(bodyEl);
}

function moveFood() {
    const foodEl = document.getElementById("food");

    const columns = Math.floor(CONFIG.width / CONFIG.step);
    const rows = Math.floor(CONFIG.height / CONFIG.step);

    const x = Math.floor(Math.random() * columns) * CONFIG.step;
    const y = Math.floor(Math.random() * rows) * CONFIG.step;

    foodEl.style.left = `${x}px`;
    foodEl.style.top = `${y}px`;
}

window.onload = main;
