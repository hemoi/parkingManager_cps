// document객체를 이용해 html 요소들을 사용하기 위함
const jsonBtn = document.getElementById("json_btn");
const form = document.querySelector("form");
const parkingPlaces = document.getElementsByClassName("parking_place");
const consoleBtn = document
  .querySelector(".console_header")
  .querySelector("button");

const CARS_LS = "users";
const CONSOLE_LS = "console_info";
const MY_CAR_ID = "myCar";
const SERVER = "http://127.0.0.1:5000/users";

let carsList = []; // localStorge의 "users"의 정보를 담는 리스트
let consoleList = []; // localStorage의 "console_info"의 정보를 담는 리스트

// "users"에 중복되는 정보가 추가되는 것을 방지하기 위한 필터링 함수 - return true if user, false if not user
function checkUserInLS(user) {
  let userIn = false;
  const userLS = localStorage.getItem(CARS_LS);
  // localStorage가 없을 경우 false를 return한다
  if (!userLS) {
    return userIn;
  } else {
    // localStorage가 있을 경우, 내부를 순환하며 중복을 검사한다
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
  // 서버로부터 json파일을 읽어옴
  fetch(SERVER)
    .then(function (response) {
      return response.json();
    })
    .then(function (json) {
      // 저장하는 과정
      json.forEach(function (user) {
        if (!checkUserInLS(user)) {
          saveUserLS(user);
        }
      });
      // 만약 localStorage에 차가 읽어들인 json파일에 없을 경우(서버에서 삭제된 경우) localStroage에서 삭제한다
      parkingLS.forEach((oneCar) => {
        if (
          json.findIndex((car) => car.userLocation === oneCar.userLocation) < 0
        ) {
          getCarOut(oneCar.userLocation, oneCar);
        }
      });
    });
}

// localStorage를 초기화하는 함수
function resetLocalStorage() {
  localStorage.setItem(CARS_LS, JSON.stringify(carsList));
}

// 차의 위치와 차의 정보(객체)를 가지고 localStorage에서 해당 차의 객체를 삭제하는 함수
function getCarOut(location, carObj) {
  const carInfos = JSON.parse(localStorage.getItem(CARS_LS));

  // localStorage에 정보가 존재할 경우
  if (carInfos) {
    // location과 일치하는 (출차할 location) 차량을 필터링해준다
    const resetList = carsList.filter((car) => {
      return car.userLocation !== location;
    });
    // 필터링 후 carsList를 초기화해주며, 변경사항을 화면에 출력하며 색상으로 시각화한다
    carsList = resetList;
    resetLocalStorage();
    paintConsole(carObj, "out");
    colorHandler(carObj.userLocation, "out");
  }
}

// html 콘솔로그창 요소에 새로운 li태그를 만들어 추가한다.
function paintConsoleLS() {
  const consoleInfo = JSON.parse(localStorage.getItem(CONSOLE_LS));
  const logElement = document.querySelector(".console_log");
  // 저장되어 있는 콘솔 로그를 createElement 메서드를 이용해 추가한다
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

  // 새로운 리스트 태그를 만든다
  if (status === "in") {
    li.innerText = ` [ ${name} ] [ ${location} ] Parked`;
  } else {
    li.innerText = ` [ ${name} ] [ ${location} ] Out `;
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
      // "out" 즉, 출차하는 경우엔 light를 추가해주며 내 차인 경우 혹은 주차되어있는 경우 해당 클래스를 삭제한다
      if (status === "out") {
        place.classList.add("light");
        place.classList.forEach((color) => {
          if (color === "myCarPlace" || color === "parked") {
            place.classList.remove(color);
          }
        });
        // "in" 즉, 주차하는 경우엔 "light"태그를 삭제해준다
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

    // 새롭게 초기화된 carsList를 이용해 localStorage를 초기화한다
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
      const parkingLocationElement = document.querySelector(".parking_content");
      const parkingLocations = parkingLocationElement.querySelectorAll(
        ".parking_place"
      );
      // localStorage를 저장할 객체를 초기화한다
      const InfoObj = {
        userID: car.userID,
        userLocation: car.userLocation,
        userTime: car.userTime,
      };

      carsList.push(InfoObj);
      // 주차장을 색칠해준다
      parkingLocations.forEach(function (location) {
        if (car.userLocation === location.id) {
          colorHandler(location.id, "in");
        }
      });
    });
  }
  // console 화면에 추가해준다
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

// 해당 주차 칸을 click했을 경우에 클릭된 target의 id를 활용해 서버에 DELETE 메서드를 보낸다
function delMethodHandler(event) {
  const id = event.target.id; // 1A, 1B, etc.
  const lotLS = JSON.parse(localStorage.getItem(CARS_LS));
  if (lotLS) {
    lotLS.forEach((lot) => {
      console.log(lot, id);
      if (lot.userLocation === id) {
        console.log(lot.id);
        fetch(`http://127.0.0.1:5000/users/${lot.userID}`, {
          method: "DELETE",
        });
      }
    });
  }
}

// 프로그램의 중심이 되는 함수
function init() {
  loadLocalStorage(); // 브라우저 로딩과 동시에 localStorage를 불러온다
  // 모든 주차 칸에 eventListener를 추가하고, 클릭했을 때 delMethodHandler를 호출한다
  Array.from(parkingPlaces).forEach((place) => {
    addEventListener("click", delMethodHandler);
  });
  // console의 reset버튼을 클릭했을 경우 consoleReset함수를 호출한다
  consoleBtn.addEventListener("click", consoleReset); // 삭제 버튼
  // 1초에 한번씩 getJson함수를 호출한다
  setInterval(getJson, 1000); // 서버에서 일정 시간마다 getJson을 호출함
}

init();
