const $dotColor = document.getElementById("dot-color");
const $dotSize = document.getElementById("dot-size");
const $saveButton = document.getElementById("save");

chrome.storage.sync.get(
    ["dot"],
    (data) => {
        const dotSettings = data.dot;
        if (dotSettings) {
            $dotColor.value = dotSettings.color;
            $dotSize.value = dotSettings.size;
        }
    }
);

$saveButton.addEventListener("click", () => {
    const dotColor = $dotColor.value;
    const dotSize = $dotSize.value;

    chrome.storage.sync.set({
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