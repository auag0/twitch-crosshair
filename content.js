const YOUTUBE_DOMAINS = [
    "www.youtube.com",
    "youtu.be"
];

const TWITCH_DOMAINS = [
    "www.twitch.tv"
];

const Platform = Object.freeze({
    UNKNOWN: 0,
    YOUTUBE: 1,
    TWITCH: 2
});

let dotSettings = {
    "color": "#ff0000",
    "size": 4
};

function getPlatform() {
    const currentDomain = location.host;
    if (YOUTUBE_DOMAINS.includes(currentDomain)) return Platform.YOUTUBE;
    if (TWITCH_DOMAINS.includes(currentDomain)) return Platform.TWITCH;
    return Platform.UNKNOWN;
}

function addOrUpdateCrosshair() {
    let query;
    switch (getPlatform()) {
        case Platform.YOUTUBE:
            query = "#player #player-container";
            break;
        case Platform.TWITCH:
            query = ".video-player__overlay";
            break;
        default:
            console.error("not supported platform: ", location.host);
            return;
    }

    const containers = document.querySelectorAll(query);
    containers.forEach((container) => {
        let crosshair = container.querySelector(".crosshair");

        if (!crosshair) {
            crosshair = document.createElement("div");
            crosshair.className = "crosshair";
            container.appendChild(crosshair);
        }

        crosshair.style.position = "absolute";
        crosshair.style.top = "50%";
        crosshair.style.left = "50%";
        crosshair.style.transform = "translate(-50%, -50%)";
        crosshair.style.zIndex = "1000";
        crosshair.style.pointerEvents = "none";

        crosshair.style.width = `${dotSettings.size}px`;
        crosshair.style.height = `${dotSettings.size}px`;
        crosshair.style.backgroundColor = dotSettings.color;
        crosshair.style.borderRadius = "50%";
        crosshair.style.border = "none";
    });
}

async function updateSettings() {
    chrome.storage.sync.get(
        ["dot"],
        (data) => {
            dotSettings = data.dot;
            addOrUpdateCrosshair();
        }
    );
}

window.addEventListener("load", async () => {
    await updateSettings();

    const observer = new MutationObserver(() => {
        addOrUpdateCrosshair();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    chrome.storage.onChanged.addListener(async () => {
        await updateSettings();
    });
});