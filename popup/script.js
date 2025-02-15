const $crosshairToggle = document.getElementById("crosshair-toggle");
const $saveButton = document.getElementById("save");

const $dotColor = document.getElementById("dot-color");
const $dotSize = document.getElementById("dot-size");

const defaultSettings = {
    "enabled": true,
    "dot": {
        "color": "#ff0000",
        "size": 3
    }
};

chrome.storage.sync.get(
    defaultSettings,
    (settings) => {
        $crosshairToggle.checked = settings.enabled;

        const dotSettings = settings.dot;
        if (dotSettings) {
            $dotColor.value = dotSettings.color;
            $dotSize.value = dotSettings.size;
        }
    }
);

$saveButton.addEventListener("click", () => {
    const enabled = $crosshairToggle.checked;
    const dotColor = $dotColor.value;
    const dotSize = $dotSize.value;

    chrome.storage.sync.set({
        "enabled": enabled,
        "dot": {
            "color": dotColor,
            "size": dotSize
        }
    }, () => {
        $saveButton.style.background = "green";
        setTimeout(() => {
            $saveButton.style.background = "none";
        }, 1000);
    });
});