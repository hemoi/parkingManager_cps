const form = document.querySelector("form");
const inputBtn = form.querySelector(".in_button");
const outputBtn = form.querySelector(".out_button");

const CARS_LS = "cars_info";

const carsList = [];

function outputBtnHandler(event) {
    event.preventDefault();

}


function paintConsole(carObj) {
    const consoleContainer = document.querySelector(".console_log");
    const name = carObj.carNumber;
    const location = carObj.location;
    const time = carObj.time;
    const li = document.createElement("li");
    li.innerText = `(${time})
${name} parked at ${location}`;
    consoleContainer.appendChild(li);
}

function inputBtnHandler(event) {
    event.preventDefault();
    const textElement = document.querySelector(".input_box");
    const text = textElement.value;
    const clockElement = document.querySelector(".clock");
    const time = clockElement.innerText;

    if (text) {
        const carObj = {
            carNumber: text,
            location: null,
            time: time
        };
        carsList.push(carObj);

        localStorage.setItem(CARS_LS, JSON.stringify(carsList));
        paintConsole(carObj);
    }

    textElement.value = "";

}


function init() {
    inputBtn.addEventListener("click", inputBtnHandler);
    outputBtn.addEventListener("click", outputBtnHandler);
}

init();