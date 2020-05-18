const btn = document.querySelector(".clear_database");

// button_control.js -> const CARS_LS = "cars_info"

function delDatabase() {
    localStorage.removeItem(CARS_LS)
    window.location.reload();
}

function btnHandler(event) {
    event.preventDefault();
    delDatabase();
}

function init() {
    btn.addEventListener("click", btnHandler);
}

init();