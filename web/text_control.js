const parkingContents = document.querySelector(".parking_content");

function paintConsole(text) {
    const consoleLogList = document.querySelector(".console_log");
    const consoleLog = document.createElement("li")
    const paintText = "[+] " + text;
    consoleLog.innerText = paintText;
    console.log(consoleLogList);
    if (text) {
        consoleLogList.appendChild(consoleLog);
    }
}

function inputEventHandler(event) {
    const textForm = document.querySelector(".number_input");
    const textInput = textForm.querySelector("input");
    const currentNumber = textInput.value;

    event.preventDefault();
    textInput.value = "";
    console.log(`number: ${currentNumber}`);
    paintConsole(currentNumber);
}


function inputControl() {
    const textInput = document.querySelector(".number_input");

    textInput.addEventListener("submit", inputEventHandler);
}

function init() {
    //inputControl();
}

init();