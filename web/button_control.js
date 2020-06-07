// document객체를 이용해 html 요소들을 사용하기 위함
const jsonBtn = document.getElementById("json_btn");
const form = document.querySelector("form");
const parkingPlaces = document.getElementsByClassName("parking_place");
// const outputBtn = form.querySelector(".out_button");
const consoleBtn = document
  .querySelector(".console_header")
  .querySelector("button");

const CARS_LS = "users";
const CONSOLE_LS = "console_info";
const MY_CAR_ID = "myCar";

let carsList = []; // localStorge의 "users"의 정보를 담는 리스트
let consoleList = []; // localStorage의 "console_info"의 정보를 담는 리스트

// temp data
let tempUser = [
  (user1 = { userID: "Hello", userLocation: "1B", userTime: "15:24:21" }),
  (user2 = { userID: "HI~", userLocation: "1C", userTime: "15:26:12" }),
  (user3 = { userID: "Ohh", userLocation: "1G", userTime: "15:31:42" }),
  (user4 = { userID: "myCar", userLocation: "1E", userTime: "15:37:42" }),
];

// 자신의 차의 정보를 이용해 getCarOut(차를 빼는 함수)을 호출한다.
// function delHandler(event) {
//   // ### real use ###
//   // fetch(`http://127.0.0.1:5000/users/${myCarId}`, {
//   //   method: "DELETE",
//   // });
//   const myCarId = MY_CAR_ID;

//   let myCarObjID;
//   let myCarObjLocation;
//   let myCarObjTime;
//   tempUser.forEach(function (user) {
//     if (user.userID === myCarId) {
//       myCarObjID = user.userID;
//       myCarObjLocation = user.userLocation;
//       myCarObjTime = user.userTime;
//     }
//   });
//   const myCarObj = {
//     userID: myCarObjID,
//     userLocation: myCarObjLocation,
//     userTime: myCarObjTime,
//   };
//   getCarOut(myCarObjLocation, myCarObj);
// }

// "users"에 중복되는 정보가 추가되는 것을 방지하기 위한 필터링 함수
// return true if user, false if not user
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

// fetch api를 이용해 setInterval에서 설정한 간격마다 서버에서 json파일을 받아옴
// 해당 json파일을 파싱해 localStorage에 저장한다.
function getJson(event) {
  const parkingLS = JSON.parse(localStorage.getItem(CARS_LS));

  let inCars = [];
  // ### real use ###
  fetch(`http://127.0.0.1:5000/users`)
    .then(function (response) {
      return response.json();
    })
    .then(function (json) {
      // saving
      json.forEach(function (user) {
        const car = {
          userID: "",
          userLocation: "",
          userTime: "",
        };
        if (!checkUserInLS(user)) {
          saveUserLS(user);
        }
      });
      parkingLS.forEach((oneCar) => {
        if (
          json.findIndex((car) => car.userLocation === oneCar.userLocation) < 0
        ) {
          getCarOut(oneCar.userLocation, oneCar);
        }
      });
    });

  // tempUser.forEach(function (user) {
  //   if (!checkUserInLS(user)) {
  //     saveUserLS(user);
  //   }
  // });
}

function resetLocalStorage() {
  localStorage.setItem(CARS_LS, JSON.stringify(carsList));
}

// 차의 위치와 차의 정보(객체)를 가지고 localStorage에서 해당 차의 객체를 삭제
function getCarOut(location, carObj) {
  const carInfos = JSON.parse(localStorage.getItem(CARS_LS));

  if (carInfos) {
    const resetList = carsList.filter((car) => {
      return car.userLocation !== location;
    });
    if (carsList.length === resetList.length) {
      // error
    } else {
      carsList = resetList;
      resetLocalStorage();
      paintConsole(carObj, "out");
      colorHandler(carObj.userLocation, "out");
    }
  }
}

// will be replaced
// function outputBtnHandler(event) {
//   event.preventDefault();
//   const numberElement = document.querySelector(".input_box");
//   const locationElement = document.querySelector(".input_box_id");
//   const number = numberElement.value;
//   const location = locationElement.value;
//   if (location && number) {
//     getCarOut(location);
//     locationElement.value = "";
//     numberElement.value = "";
//   }
// }

// html 콘솔로그창 요소에 새로운 li태그를 만들어 추가한다.
function paintConsoleLS() {
  const consoleInfo = JSON.parse(localStorage.getItem(CONSOLE_LS));
  const logElement = document.querySelector(".console_log");
  consoleInfo.forEach(function (log) {
    const newLi = document.createElement("li");
    newLi.innerText = log;
    logElement.appendChild(newLi);
  });
}

// 콘솔창을 html로 시각화해 보여주는 함수이다.
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

// status매개변수를 이용해 'in'과 'out'을 구분해 색으로 표현해준다.
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
        if (place.id === "1F") {
          place.classList.add("myCarPlace");
        } else {
          place.classList.add("parked");
        }
      }
    }
  });
}

// user(객체)를 매개변수로 하여 localStorage의 "users"카테고리로
// carslist에 추가해주며, 이를 업데이트해준다.
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

// localStorage에 저장되어있는 정보들을 바탕으로
// 색을 칠하고, html 콘솔에 추가해준다.
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

// 콘솔을 지우는 함수
function consoleReset(event) {
  event.preventDefault();
  localStorage.removeItem(CONSOLE_LS);
  window.location.reload();
}

function delMethodHandler(event) {
  event.preventDefault();
  const id = event.target; // 1A, 1B, etc.
  const lotLS = JSON.parse(localStorage.getItem(CARS_LS));
  lotLS.forEach((lot) => {
    if (lot.id === id) {
      console.log(lot.id);
      fetch(`http://127.0.0.1:5000/users/${lot.userId}`, {
        method: "DELETE",
      });
    }
  });
}

function init() {
  loadLocalStorage();
  // ### don't need these(will be deleted) ###
  // outputBtn.addEventListener("click", outputBtnHandler);
  // jsonBtn.addEventListener("click", delHandler); // out 버튼
  Array.from(parkingPlaces).forEach((place) => {
    addEventListener("click", delMethodHandler);
  });
  setInterval(getJson, 1000); // 서버에서 일정 시간마다 getJson을 호출함
  consoleBtn.addEventListener("click", consoleReset); // 삭제 버튼
}

init();
