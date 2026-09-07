var dashboard = document.getElementById("dashboard");
var logout = document.getElementById("log-out");

dashboard.addEventListener("click", () => {
  window.location.href = "dashboard.html";
});
logout.addEventListener("click", () => {
  sessionStorage.clear();
  window.location.href = "access.html";
});
