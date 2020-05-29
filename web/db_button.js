const btn = document.querySelector(".clear_database");

// localStorage를 지우는 함수
function delDatabase() {
  localStorage.removeItem(CARS_LS);
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
