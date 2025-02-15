const YOUTUBE_DOMAINS = ["www.youtube.com", "youtu.be"];
const TWITCH_DOMAINS = ["www.twitch.tv"];

const Platform = Object.freeze({
    UNKNOWN: 0,
    YOUTUBE: 1,
    TWITCH: 2
});

let currentSettings = {
    enabled: true,
    dot: {
        color: "#ff0000",
        size: 3
    }
};

function getPlatform() {
    const host = location.host;
    if (YOUTUBE_DOMAINS.includes(host)) return Platform.YOUTUBE;
    if (TWITCH_DOMAINS.includes(host)) return Platform.TWITCH;
    return Platform.UNKNOWN;
}

function getContainerSelector(platform) {
    switch (platform) {
        case Platform.YOUTUBE:
            return "#player #player-container";
        case Platform.TWITCH:
            return ".video-player__overlay";
        default:
            console.error("not supported platform: ", location.host);
            return null;
    }
}

function createOrUpdateCrosshairElement({ container, settings }) {
    let crosshair = container.querySelector(".crosshair");

    if (!crosshair) {
        crosshair = document.createElement("div");
        crosshair.className = "crosshair";
        container.appendChild(crosshair);
        console.info("Created crosshair element and added to container.");
    }

    crosshair.style.position = "absolute";
    crosshair.style.top = "50%";
    crosshair.style.left = "50%";
    crosshair.style.transform = "translate(-50%, -50%)";
    crosshair.style.zIndex = "1000";
    crosshair.style.pointerEvents = "none";

    const dotSettings = settings.dot;
    crosshair.style.width = `${dotSettings.size}px`;
    crosshair.style.height = `${dotSettings.size}px`;
    crosshair.style.backgroundColor = dotSettings.color;
    crosshair.style.borderRadius = "50%";
    crosshair.style.border = "none";

    console.info("Updated crosshair styles.");
}

function addOrUpdateCrosshair() {
    if (!currentSettings.enabled) {
        document.querySelectorAll(".crosshair").forEach(element => element.remove());
        console.info("Crosshair disabled; removed all crosshairs.");
        return;
    }

    const platform = getPlatform();
    const selector = getContainerSelector(platform);
    if (!selector) return;

    const containers = document.querySelectorAll(selector);
    containers.forEach((container) => {
        createOrUpdateCrosshairElement({ container, settings: currentSettings });
    });
}

function updateSettings() {
    chrome.storage.sync.get(currentSettings, (settings) => {
        currentSettings = settings;
        addOrUpdateCrosshair();
    });
}

window.addEventListener("load", async () => {
    updateSettings();

    const observer = new MutationObserver(() => {
        addOrUpdateCrosshair();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    chrome.storage.onChanged.addListener(updateSettings);
});