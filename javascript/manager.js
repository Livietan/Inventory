var firstMenu = document.getElementById("first-menu");
var secondaryMenu = document.getElementById("secondary-menu");
var logoutMenu = document.getElementById("logout-menu");
var userTag = document.getElementById("userTag");

userTag.textContent = sessionStorage.getItem("user");

firstMenu.addEventListener("click", () => {
  window.location.href = "manager-dashboard.html";
});

secondaryMenu.addEventListener("click", () => {
  window.location.href = "manager-admin.html";
});
logoutMenu.addEventListener("click", () => {
  sessionStorage.removeItem("user");
  window.location.href = "access.html";
});