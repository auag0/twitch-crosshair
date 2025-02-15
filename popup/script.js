const crosshairToggle = document.getElementById("crosshair-toggle");
const saveButton = document.getElementById("save");
const dotColorInput = document.getElementById("dot-color");
const dotSizeInput = document.getElementById("dot-size");

const defaultSettings = {
    enabled: true,
    dot: {
        color: "#ff0000",
        size: 3
    }
};

function initializeUI(settings) {
    crosshairToggle.checked = settings.enabled;
    if (settings.dot) {
        dotColorInput.value = settings.dot.color;
        dotSizeInput.value = settings.dot.size;
    }
}

chrome.storage.sync.get(defaultSettings, (settings) => {
    initializeUI(settings);
}
);

saveButton.addEventListener("click", () => {
    const newSettings = {
        enabled: crosshairToggle.checked,
        dot: {
            color: dotColorInput.value,
            size: dotSizeInput.value,
        },
    };

    chrome.storage.sync.set(newSettings, () => {
        saveButton.style.background = "green";
        setTimeout(() => {
            saveButton.style.background = "none";
        }, 1000);
    });
});