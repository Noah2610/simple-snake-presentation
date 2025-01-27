const REPO_URL = "https://github.com/Noah2610/simple-snake-presentation";

const CONTROLS = {
    nextSlide: ["ArrowRight", "n", "d"],
    prevSlide: ["ArrowLeft", "p", "a"],
};

let ACTIVE_SLIDE = 0;
let SLIDE_COUNT = 0;

// https://stackoverflow.com/a/4467559/10927893
function mod(n1, n2) {
    return ((n1 % n2) + n2) % n2;
}

function main() {
    setupCopyCode();
    setupSlideCount();
    setupShowKeybindings();

    document.addEventListener("keydown", onKeyDown);
    // document.addEventListener("click", nextSlide);
}

function setupSlideCount() {
    SLIDE_COUNT = document.querySelectorAll(".slide").length;

    const slideNumberEls = document.querySelectorAll(".slide > .slide-number");
    slideNumberEls.forEach((slideNumberEl, i) => {
        slideNumberEl.setAttribute("href", `${REPO_URL}/tree/slide-${i + 1}`);
        slideNumberEl.innerHTML = `/${SLIDE_COUNT}`;
    });

    setActiveSlide(getSlideIdFromUrl() ?? ACTIVE_SLIDE);
}

function setupShowKeybindings() {
    const keybindingsEl = document.querySelector(".keybindings");
    const keybindingsCloseEl = keybindingsEl.querySelector(
        ".keybindings__close"
    );
    const keybindingsNextEl = keybindingsEl.querySelector(
        "#keybindings-next-slide"
    );
    const keybindingsPrevEl = keybindingsEl.querySelector(
        "#keybindings-prev-slide"
    );

    const join = (keys) => keys.join(" ");

    keybindingsNextEl.innerHTML = join(CONTROLS.nextSlide);
    keybindingsPrevEl.innerHTML = join(CONTROLS.prevSlide);

    keybindingsCloseEl.onclick = () => {
        keybindingsEl.classList.add("hidden");
        removeQueryParam("keybindings");
    };

    const isVisible = getQueryParam("keybindings");
    if (!isVisible) return;

    keybindingsEl.classList.remove("hidden");
}

function getSlideIdFromUrl() {
    const slideId = parseInt(getQueryParam("slide"));
    return Number.isNaN(slideId) ? null : slideId - 1;
}

function getQueryParam(key) {
    return getQueryParams()[key];
}

function getQueryParams() {
    const query = location.search.replace(/^\?/, "");
    return query.split(/&/g).reduce((acc, kv) => {
        const [key, val] = kv.split("=");
        return {
            ...acc,
            [key]: val,
        };
    }, {});
}

// https://stackoverflow.com/a/41542008/10927893
function setQueryParam(key, value) {
    const params = new URLSearchParams(location.search);
    params.set(key, value.toString());
    const newPath = location.pathname + "?" + params.toString();
    history.replaceState(null, "", newPath);
}

function removeQueryParam(key) {
    const params = new URLSearchParams(location.search);
    params.delete(key);
    const newPath = location.pathname + "?" + params.toString();
    history.pushState(null, "", newPath);
}

function onKeyDown(event) {
    const key = event.key;
    if (CONTROLS.nextSlide.some((k) => k === key)) {
        nextSlide();
    } else if (CONTROLS.prevSlide.some((k) => k === key)) {
        prevSlide();
    }
}

function setActiveSlide(slideId) {
    ACTIVE_SLIDE = Math.min(Math.max(slideId, 0), SLIDE_COUNT - 1);

    setQueryParam("slide", ACTIVE_SLIDE + 1);

    const slideEls = document.querySelectorAll(".slide");
    slideEls.forEach((slideEl, i) => {
        if (i === ACTIVE_SLIDE) {
            slideEl.classList.add("active");
        } else {
            slideEl.classList.remove("active");
        }
    });
}

function nextSlide() {
    setActiveSlide(ACTIVE_SLIDE + 1);
    // setActiveSlide((ACTIVE_SLIDE + 1) % SLIDE_COUNT);
}

function prevSlide() {
    setActiveSlide(ACTIVE_SLIDE - 1);
}

function setupCopyCode() {
    const preEls = document.querySelectorAll("pre.code");

    preEls.forEach((preEl) => {
        preEl.onclick = () => {
            const text = preEl.innerText;
            navigator.clipboard.writeText(text);
        };
    });
}

window.onload = main;
