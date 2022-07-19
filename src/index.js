let FRAME = 0;
let PLAYER_DIRECTION = "right";
let SCORE = 0;
let IS_RUNNING = false;

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
    const el1X = parseInt(el1.x ?? el1.style.left);
    const el1Y = parseInt(el1.y ?? el1.style.top);
    const el2X = parseInt(el2.x ?? el2.style.left);
    const el2Y = parseInt(el2.y ?? el2.style.top);

    return el1X === el2X && el1Y === el2Y;
}

function main() {
    document.addEventListener("keydown", onKeyDown);

    updateScore();
    moveFood();

    IS_RUNNING = true;

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
    if (!IS_RUNNING) return;

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
    const gameOverEl = document.getElementById("game-over");
    gameOverEl.classList.remove("hidden");
    IS_RUNNING = false;
}

function handleFoodCollision() {
    const headEl = document.getElementById("player");
    const foodEl = document.getElementById("food");

    if (checkCollision(headEl, foodEl)) {
        collectFood();
    }
}

function collectFood() {
    moveFood();
    addBody();
    SCORE++;
    updateScore();
}

function updateScore() {
    const scoreEl = document.getElementById("score");
    scoreEl.innerHTML = `Score: ${SCORE}`;
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
    const headEl = document.getElementById("player");
    const bodyEls = document.getElementsByClassName("player-body");

    let inCollision = true;
    let x;
    let y;

    while (inCollision) {
        const columns = Math.floor(CONFIG.width / CONFIG.step);
        const rows = Math.floor(CONFIG.height / CONFIG.step);

        x = Math.floor(Math.random() * columns) * CONFIG.step;
        y = Math.floor(Math.random() * rows) * CONFIG.step;

        inCollision = false;

        if (checkCollision(headEl, { x, y })) {
            inCollision = true;
            continue;
        }

        for (let i = 0; i < bodyEls.length; i++) {
            if (checkCollision(bodyEls[i], { x, y })) {
                inCollision = true;
                break;
            }
        }
    }

    foodEl.style.left = `${x}px`;
    foodEl.style.top = `${y}px`;
}

window.onload = main;
