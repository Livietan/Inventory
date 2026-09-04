var firstMenu = document.getElementById("first-menu");
var secondaryMenu = document.getElementById("secondary-menu");
var logoutMenu = document.getElementById("logout-menu");
var userTag = document.getElementById("userTag");
var blockPopup = document.getElementById("block-popup");
var closeMenu = document.getElementById("close");
var user = sessionStorage.getItem("user");
var role = sessionStorage.getItem("role");

userTag.textContent = user;

if (role == "manager") {
  blockPopup.style.display = "none";
} else {
  blockPopup.style.display = "flex";
}

firstMenu.addEventListener("click", () => {
  window.location.href = "manager-dashboard.html";
});

secondaryMenu.addEventListener("click", () => {
  window.location.href = "manager-admin.html";
});
logoutMenu.addEventListener("click", () => {
  sessionStorage.clear();
  window.location.href = "access.html";
});
closeMenu.addEventListener("click", () => {
  sessionStorage.clear();
  window.location.href = "access.html";
});
