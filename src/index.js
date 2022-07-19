const CTX = {
    frame: 0,
    playerDirection: "right",
    score: 0,
    isRunning: false,
    didChangeDirection: false,
};

const CONFIG = {
    width: 640,
    height: 640,
    step: 32,
    moveEveryXFrames: 10,
    controls: {
        up: "W",
        down: "S",
        left: "A",
        right: "D",
    },
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
    updateHighscore();
    moveFood();

    CTX.isRunning = true;

    window.requestAnimationFrame(update);
}

function onKeyDown(event) {
    if (CTX.didChangeDirection) {
        return;
    }

    const key = event.key.toUpperCase();

    switch (key) {
        case CONFIG.controls.up: {
            if (CTX.playerDirection !== "down") {
                CTX.playerDirection = "up";
                CTX.didChangeDirection = true;
            }
            break;
        }
        case CONFIG.controls.down: {
            if (CTX.playerDirection !== "up") {
                CTX.playerDirection = "down";
                CTX.didChangeDirection = true;
            }
            break;
        }
        case CONFIG.controls.left: {
            if (CTX.playerDirection !== "right") {
                CTX.playerDirection = "left";
                CTX.didChangeDirection = true;
            }
            break;
        }
        case CONFIG.controls.right: {
            if (CTX.playerDirection !== "left") {
                CTX.playerDirection = "right";
                CTX.didChangeDirection = true;
            }
            break;
        }
    }
}

function update() {
    if (!CTX.isRunning) return;

    movePlayer();

    window.requestAnimationFrame(update);

    CTX.frame++;
}

function movePlayer() {
    if (CTX.frame % CONFIG.moveEveryXFrames !== 0) {
        return;
    }

    movePlayerBodies();
    movePlayerHead();
    handleBodyCollision();
    handleFoodCollision();

    CTX.didChangeDirection = false;
}

function movePlayerHead() {
    const playerEl = document.getElementById("player");

    let x = parseInt(playerEl.style.left) || 0;
    let y = parseInt(playerEl.style.top) || 0;

    switch (CTX.playerDirection) {
        case "up": {
            y -= CONFIG.step;
            break;
        }
        case "down": {
            y += CONFIG.step;
            break;
        }
        case "left": {
            x -= CONFIG.step;
            break;
        }
        case "right": {
            x += CONFIG.step;
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
    CTX.isRunning = false;
    updateHighscore();
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
    CTX.score++;
    updateScore();
}

function updateScore() {
    const scoreEl = document.getElementById("score");
    scoreEl.innerHTML = `Score: ${CTX.score}`;
}

function updateHighscore() {
    const highscoreEl = document.getElementById("highscore");
    const highscore = parseInt(window.localStorage.getItem("highscore") || 0);

    if (highscore) {
        highscoreEl.innerHTML = `Highscore: ${highscore}`;
    }

    if (CTX.score > highscore) {
        window.localStorage.setItem("highscore", CTX.score);
        highscoreEl.innerHTML = `New Highscore!`;
        highscoreEl.classList.add("new-highscore");
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
