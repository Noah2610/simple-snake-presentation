let ACTIVE_SLIDE = 0;
let SLIDE_COUNT = 0;

// https://stackoverflow.com/a/4467559/10927893
function mod(n1, n2) {
    return ((n1 % n2) + n2) % n2;
}

function main() {
    SLIDE_COUNT = document.querySelectorAll(".slide").length;

    setActiveSlide(getSlideIdFromUrl() ?? ACTIVE_SLIDE);

    document.addEventListener("keydown", onKeyDown);
}

function getSlideIdFromUrl() {
    const params = getQueryParams();
    const slideId = parseInt(params["slide"]);
    return Number.isNaN(slideId) ? null : slideId - 1;
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
    history.pushState(null, "", newPath);
}

function onKeyDown(event) {
    const key = event.key;
    switch (key) {
        case "n":
        case "d":
        case "j":
        case "ArrowRight": {
            nextSlide();
            break;
        }
        case "p":
        case "a":
        case "k":
        case "ArrowLeft": {
            prevSlide();
            break;
        }
    }
}

function setActiveSlide(slideId) {
    ACTIVE_SLIDE = Math.min(Math.max(slideId, 0), SLIDE_COUNT - 1);

    setQueryParam("slide", ACTIVE_SLIDE + 1);

    const slideEls = document.querySelectorAll(".slide");
    slideEls.forEach((slideEl) => {
        if (parseInt(slideEl.getAttribute("data-slide-id")) === ACTIVE_SLIDE) {
            slideEl.classList.add("active");
        } else {
            slideEl.classList.remove("active");
        }
    });
}

function nextSlide() {
    setActiveSlide(ACTIVE_SLIDE + 1);
}

function prevSlide() {
    setActiveSlide(ACTIVE_SLIDE - 1);
}

window.onload = main;
