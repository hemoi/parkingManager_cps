const jsonBtn = document.getElementById("json_btn");
const form = document.querySelector("form");
const inputBtn = form.querySelector(".in_button");
const outputBtn = form.querySelector(".out_button");
const consoleBtn = document
  .querySelector(".console_header")
  .querySelector("button");

const CARS_LS = "cars_info";
const CONSOLE_LS = "console_info";

let carsList = [];
let consoleList = [];


function delHandler(event){
    fetch(`http://127.0.0.1:5000/users/user1`,{
        method: "DELETE",
        // mode: "no-cors"
    })
}


function getJson(event) {
  fetch(`http://127.0.0.1:5000/users`)
    .then(function (response) {
      return response.json();
    })
    .then(function (json) {
      json.forEach((car) =>
        // car = {
        //   userID: "",
        //   userLocation: "",
        //   userTime: ""
        // }
        console.log(`carinfo: ${car.userID} => ${car.userLocation}`)
      );
    });
}

function resetLocalStorage() {
  localStorage.setItem(CARS_LS, JSON.stringify(carsList));
}

function getCarOut(location) {
  const carInfos = JSON.parse(localStorage.getItem(CARS_LS));
  if (carInfos) {
    const resetList = carsList.filter(function (car) {
      const carLocation = car.location;
      return carLocation !== location;
    });
    if (carsList.length === resetList.length) {
      // worng input
    } else {
      carsList = resetList;
      resetLocalStorage();
      const timeNow = document.querySelector(".clock");
      const carNumberNow = document.querySelector(".input_box");
      const locationNow = document.querySelector(".input_box_id");

      const carObj = {
        carNumber: carNumberNow.value,
        location: locationNow.value,
        time: timeNow.innerText,
      };
      paintConsole(carObj, "out");
      colorHandler(carObj.location, "out");
    }
  }
}

function outputBtnHandler(event) {
  event.preventDefault();
  const numberElement = document.querySelector(".input_box");
  const locationElement = document.querySelector(".input_box_id");
  const number = numberElement.value;
  const location = locationElement.value;
  if (location && number) {
    getCarOut(location);
    locationElement.value = "";
    numberElement.value = "";
  }
}

function paintConsoleLS() {
  const consoleInfo = JSON.parse(localStorage.getItem(CONSOLE_LS));
  const logElement = document.querySelector(".console_log");
  consoleInfo.forEach(function (log) {
    const newLi = document.createElement("li");
    newLi.innerText = log;
    logElement.appendChild(newLi);
  });
}

function paintConsole(carObj, status) {
  const consoleContainer = document.querySelector(".console_log");
  const name = carObj.carNumber;
  const location = carObj.location;
  const time = carObj.time;
  const li = document.createElement("li");

  if (status === "in") {
    li.innerText = ` (${time}) [ ${name} ] [ ${location} ] Parked`;
  } else {
    li.innerText = ` (${time}) [ ${name} ] [ ${location} ] Out `;
  }
  consoleList.push(li.innerText);
  localStorage.setItem(CONSOLE_LS, JSON.stringify(consoleList));
  consoleContainer.appendChild(li);
}

function colorHandler(location, status) {
  const parkingLocationElement = document.querySelector(".parking_content");
  const parkingLocations = parkingLocationElement.querySelectorAll(
    ".parking_place"
  );
  parkingLocations.forEach(function (place) {
    if (place.id === location) {
      if (status === "out") {
        place.classList.add("light");
      } else if (status === "in") {
        place.classList.remove("light");
        place.classList.add("parked");
      }
    }
  });
}

function inputBtnHandler(event) {
  event.preventDefault();

  const textElement = document.querySelector(".input_box");
  const textElementId = document.querySelector(".input_box_id");
  const text = textElement.value;
  const textId = textElementId.value;
  const clockElement = document.querySelector(".clock");
  const time = clockElement.innerText;

  if (text && textId) {
    const carObj = {
      carNumber: text,
      location: textId,
      time: time,
    };
    carsList.push(carObj);

    localStorage.setItem(CARS_LS, JSON.stringify(carsList));
    paintConsole(carObj, "in");
    colorHandler(carObj.location, "in");
  }

  textElement.value = "";
  textElementId.value = "";
}

function loadLocalStorage() {
  const carsInfo = JSON.parse(localStorage.getItem(CARS_LS));
  const consoleInfo = JSON.parse(localStorage.getItem(CONSOLE_LS));

  if (carsInfo) {
    carsInfo.forEach(function (car) {
      // 2 of top to handle colors
      const parkingLocationElement = document.querySelector(".parking_content");
      const parkingLocations = parkingLocationElement.querySelectorAll(
        ".parking_place"
      );
      const InfoObj = {
        carNumber: car.carNumber,
        location: car.location,
        time: car.time,
      };
      carsList.push(InfoObj);
      parkingLocations.forEach(function (location) {
        if (car.location === location.id) {
          colorHandler(location.id, "in");
        }
      });
    });
  }

  if (consoleInfo) {
    consoleInfo.forEach(function (log) {
      const text = log;
      consoleList.push(text);
    });
    paintConsoleLS();
  }
}

function consoleReset(event) {
  event.preventDefault();
  localStorage.removeItem(CONSOLE_LS);
  window.location.reload();
}

function init() {
  loadLocalStorage();
  inputBtn.addEventListener("click", inputBtnHandler);
  outputBtn.addEventListener("click", outputBtnHandler);
  consoleBtn.addEventListener("click", consoleReset);
  //setInterval(getJson, 1000);
  jsonBtn.addEventListener("click", delHandler);
}

init();

// fetch('https://example.com/delete-item/' + id, {
//   method: 'DELETE',
// })
// .then(res => res.text()) // or res.json()
// .then(res => console.log(res))
