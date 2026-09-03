import { token } from "./API";

var firstMenu = document.getElementById("first-menu");
var secondaryMenu = document.getElementById("secondary-menu");
var user = document.getElementById("user");

user.textContent = token;

firstMenu.addEventListener("click", () => {
  window.location.href = "admin-dashboard.html";
});

secondaryMenu.addEventListener("click", () => {
  window.location.href = "admin-package.html";
});
