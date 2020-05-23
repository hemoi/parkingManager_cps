const jsonBtn = document.getElementById("json_btn");

function jsonHandler(event) {
  fetch(
    `http://127.0.0.1:5000/users`
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
