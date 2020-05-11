const parkingContents = document.querySelector(".parking_content");

function paintConsole(text) {
    const consoleLogList = document.querySelector(".console_log");
    const consoleLog = document.createElement("li")
    consoleLog.innerText = text;
    console.log(consoleLogList);
    consoleLogList.appendChild(consoleLog);
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

function insertInputElement() {

    const inputForm = document.createElement("form");
    const inputTxt = document.createElement("input");
    // const inputBtn = document.createElement("input");

    inputForm.classList.add("number_input");
    inputTxt.classList.add("input_box");
    inputTxt.type = "text";
    inputTxt.placeholder = "Put Number";
    // inputBtn.classList.add("input_btn");
    // inputBtn.type = "button";
    // inputBtn.value = "OK";

    inputForm.appendChild(inputTxt);
    // inputForm.appendChild(inputBtn);
    parkingContents.appendChild(inputForm);

}

function init() {
    insertInputElement();
    inputControl();
}

init();