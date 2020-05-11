const parkingPlaceMap = document.querySelector(".parking_content");
const parkingPlaceNumber = [];
const brTag = document.createElement("br");

const NUMBER_OF_PARKING_LOT = 8;

function makeParkingPlace(number) {
    for (let i = 1; i <= number; i++) {
        const parkingPlace = document.createElement("div");
        parkingPlace.classList.add("parking_place");
        parkingPlace.innerText = "HOTEL \n NUMBER";
        parkingPlace.id = i;
        if (i <= number / 2) {
            parkingPlace.classList.add("upside");
        } else {
            parkingPlace.classList.add("downside");
        }
        parkingPlaceMap.appendChild(parkingPlace);
        if (i === number / 2) {
            parkingPlaceMap.appendChild(brTag);
        }
    }
}


function init() {
    makeParkingPlace(NUMBER_OF_PARKING_LOT);
}

init();