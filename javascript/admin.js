var firstMenu = document.getElementById("first-menu");
var secondaryMenu = document.getElementById("secondary-menu");
var logoutMenu = document.getElementById("logout-menu");
var userTag = document.getElementById("userTag");
var blockPopup = document.getElementById("block-popup");
var closeMenu = document.getElementById("close");
var user = sessionStorage.getItem("user");
var role = sessionStorage.getItem("role");
var dateTag = document.getElementById("dateTag");
var dates = new Date();
var date = dates.getDate();
var mont = dates.getMonth();
var year = dates.getFullYear();
var day = [
  "Monday",
  "Tuesday",
  "Wenesday",
  "Thursday",
  "Friday",
  "saturday",
  "Sunday",
];

if (userTag) {
  userTag.textContent = user;
}

if (dateTag) {
  var times = `${day[date]} ${date}/${mont}/${year}`;
  dateTag.textContent = times;
}

if (role == "admin") {
  blockPopup.style.display = "none";
} else {
  blockPopup.style.display = "flex";
}

firstMenu.addEventListener("click", () => {
  window.location.href = "admin-dashboard.html";
});

secondaryMenu.addEventListener("click", () => {
  window.location.href = "admin-package.html";
});
logoutMenu.addEventListener("click", () => {
  sessionStorage.clear();
  window.location.href = "access.html";
});
closeMenu.addEventListener("click", () => {
  sessionStorage.clear();
  window.location.href = "access.html";
});

