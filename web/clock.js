const clock = document.querySelector(".clock");

// 시간을 표시해주는 함수
function paintTime(day, hour, min, sec) {
  switch (day) {
    case 0:
      day = "SUN";
      break;
    case 1:
      day = "MON";
      break;
    case 2:
      day = "TUE";
      break;
    case 3:
      day = "WED";
      break;
    case 4:
      day = "THU";
      break;
    case 5:
      day = "FRI";
      break;
    case 6:
      day = "SAT";
      break;
  }
  clock.innerText = `${day} / ${hour < 10 ? `0${hour}` : hour}:${
    min < 10 ? `0${min}` : min
  }:${sec < 10 ? `0${sec}` : sec}`;
}

// Date 객체를 활용해 시간을 설정한다
function getTime() {
  const date = new Date();
  const min = date.getMinutes();
  const hour = date.getHours();
  const sec = date.getSeconds();
  const day = date.getDay();

  paintTime(day, hour, min, sec);
}

function init() {
  setInterval(getTime, 500);
}

init();
