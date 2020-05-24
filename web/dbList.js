const databaseListElement = document.querySelector(".show_database");
const ulElement = databaseListElement.querySelector(".database_list");

const CARS_LS = "users";

function showSomething() {
  const cars = JSON.parse(localStorage.getItem(CARS_LS));

  cars.forEach(function (car) {
    const somethingElement = document.createElement("li");
    somethingElement.classList.add("something");
    somethingElement.innerText = `# ${car.userID} IS NOW AT ${car.userLocation}  [ PARKED TIME: ${car.userTime} ]`;
    ulElement.appendChild(somethingElement);
  });
}

function showNothing() {
  const nothingElement = document.createElement("div");
  nothingElement.classList.add("nothing");
  nothingElement.innerText = "Nothing in Database";
  ulElement.appendChild(nothingElement);
}

function showDatabase() {
  const carsInfo = JSON.parse(localStorage.getItem(CARS_LS));
  if (carsInfo && carsInfo.length > 0) {
    console.dir(carsInfo);
    showSomething();
  } else {
    showNothing();
  }
}

function init() {
  showDatabase();
}

init();
