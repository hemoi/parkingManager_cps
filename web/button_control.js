const jsonBtn = document.getElementById("json_btn");
const form = document.querySelector("form");
const inputBtn = form.querySelector(".in_button");
const outputBtn = form.querySelector(".out_button");
const consoleBtn = document
  .querySelector(".console_header")
  .querySelector("button");

const CARS_LS = "users";
const CONSOLE_LS = "console_info";
const MY_CAR_ID = "myCar";

let carsList = [];
let consoleList = [];
let tempUser = [
  (user1 = { userID: "Hello", userLocation: "1B", userTime: "15:24:21" }),
  (user2 = { userID: "HI~", userLocation: "1C", userTime: "15:26:12" }),
  (user3 = { userID: "Ohh", userLocation: "1G", userTime: "15:31:42" }),
  (user4 = { userID: "myCar", userLocation: "1E", userTime: "15:37:42" }),
];

function delHandler(event) {
  // fetch(`http://127.0.0.1:5000/users/${myCarId}`, {
  //   method: "DELETE",
  // });
  const myCarId = MY_CAR_ID;
  let myCarObjID;
  let myCarObjLocation;
  let myCarObjTime;
  tempUser.forEach(function (user) {
    if (user.userID === myCarId) {
      myCarObjID = user.userID;
      myCarObjLocation = user.userLocation;
      myCarObjTime = user.userTime;
    }
  });
  const myCarObj = {
    userID: myCarObjID,
    userLocation: myCarObjLocation,
    userTime: myCarObjTime,
  };
  console.log(`sent DELETE method to <http://127.0.0.1:5000/users/${myCarId}>`);
  getCarOut(myCarObjLocation, myCarObj);
}

function checkUserInLS(user) {
  let userIn = false;

  const userLS = localStorage.getItem(CARS_LS);
  if (!userLS) {
    return userIn;
  } else {
    const parsedUser = JSON.parse(userLS);
    parsedUser.forEach(function (userInLS) {
      if (userInLS.userLocation === user.userLocation) {
        userIn = true;
      }
    });
    return userIn;
  }
}

function getJson(event) {
  // fetch(`http://127.0.0.1:5000/users`)
  //   .then(function (response) {
  //     return response.json();
  //   })
  //   .then(function (json) {
  //     json.forEach(function (user) {
  //       // car = {
  //       //   userID: "",
  //       //   userLocation: "",
  //       //   userTime: ""
  //       // }
  //       // console.log(`carinfo: ${car.userID} => ${car.userLocation}`)
  //       if (!checkUserInLS(user)) {
  //         saveUserLS(user);
  //       }
  //     });
  //   });
  tempUser.forEach(function (user) {
    if (!checkUserInLS(user)) {
      saveUserLS(user);
    }
  });
}

function resetLocalStorage() {
  localStorage.setItem(CARS_LS, JSON.stringify(carsList));
}

function getCarOut(location, carObj) {
  const carInfos = JSON.parse(localStorage.getItem(CARS_LS));
  if (carInfos) {
    const resetList = carsList.filter(function (car) {
      return car.userLocation !== location;
    });
    if (carsList.length === resetList.length) {
      // worng input
    } else {
      carsList = resetList;
      resetLocalStorage();
      paintConsole(carObj, "out");
      colorHandler(carObj.userLocation, "out");
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
  const name = carObj.userID;
  const location = carObj.userLocation;
  const time = carObj.userTime;
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

function saveUserLS(user) {
  // event.preventDefault();
  const text = user.userID;
  const textId = user.userLocation;
  const time = user.userTime;

  if (text && textId) {
    const carObj = {
      userID: text,
      userLocation: textId,
      userTime: time,
    };
    carsList.push(carObj);

    localStorage.setItem(CARS_LS, JSON.stringify(carsList));
    paintConsole(carObj, "in");
    colorHandler(carObj.userLocation, "in");
  }
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
        userID: car.userID,
        userLocation: car.userLocation,
        userTime: car.userTime,
      };
      carsList.push(InfoObj);
      parkingLocations.forEach(function (location) {
        if (car.userLocation === location.id) {
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
  // inputBtn.addEventListener("click", inputBtnHandler);
  // outputBtn.addEventListener("click", outputBtnHandler);
  setInterval(getJson, 1000);
  consoleBtn.addEventListener("click", consoleReset);
  jsonBtn.addEventListener("click", delHandler);
}

init();

// fetch('https://example.com/delete-item/' + id, {
//   method: 'DELETE',
// })
// .then(res => res.text()) // or res.json()
// .then(res => console.log(res))
