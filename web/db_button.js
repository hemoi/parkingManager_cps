const btn = document.querySelector(".clear_database");

// localStorage를 지우는 함수
function delDatabase() {
  localStorage.removeItem(CARS_LS);
  window.location.reload();
}
// DB clear버튼 클릭 이벤트를 관리해주는 함수
function btnHandler(event) {
  event.preventDefault();
  delDatabase();
}

function init() {
  btn.addEventListener("click", btnHandler);
}

init();
