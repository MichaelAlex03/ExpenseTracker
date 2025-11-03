//This runs on every page

function removeFloatingButton() {
    button = document.getElementById("float-button")
    if (button){
        button.remove(button)
        sessionStorage.setItem("show-floating", "false")
    }
}

function renderFloatingButton() {
    if (sessionStorage.getItem("show-floating") === "false") {
        return
    }

    if (document.getElementById("floating-button")) return;

    floatingButton = document.createElement("div");
    floatingButton.className = "floating-button"
    floatingButton.id = "float-button"
    console.log(chrome.runtime.getURL('icons/favicon-32x32.png'))
    floatingButton.innerHTML =
        `
        <button class="close-button" id="close-floating-button">X</button>
        <h1 class="icon-text">E</h1>
    `
    document.body.appendChild(floatingButton)

    const closeButton = document.getElementById("close-floating-button")
    if (closeButton) {
        closeButton.addEventListener('click', (e) => {
            e.stopPropagation()
            removeFloatingButton()
        })
    }
}

renderFloatingButton()



