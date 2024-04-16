let aside = document.querySelector("aside");
let button = document.querySelector("button");
let store = document.querySelector("store");

button.addEventListener("click", function () {
  aside.classList.toggle("open");
});
