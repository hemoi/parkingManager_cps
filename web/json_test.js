const jsonBtn = document.getElementById("json_btn");

function jsonHandler(event) {
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=20&lon=60&appid=521521e4b40747fde47f910eded381d4&units=metric`
  )
    .then(function (response) {
      return response.json();
    })
    .then(function (json) {
      console.log(json);
    });
}

jsonBtn.addEventListener("click", jsonHandler);

// fetch('https://example.com/delete-item/' + id, {
//   method: 'DELETE',
// })
// .then(res => res.text()) // or res.json()
// .then(res => console.log(res))
