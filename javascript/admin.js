var firstMenu = document.getElementById("first-menu");
var secondaryMenu = document.getElementById("secondary-menu");
var logoutMenu = document.getElementById("logout-menu");
var userTag = document.getElementById("userTag");
var blockPopup = document.getElementById("block-popup");
var closeMenu = document.getElementById("close");
var user = sessionStorage.getItem("user");
var role = sessionStorage.getItem("role");

userTag.textContent = user;

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
