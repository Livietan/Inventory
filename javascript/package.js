var dashboard = document.getElementById("dashboard");
var package = document.getElementById("package");
var setting = document.getElementById("setting");
var logout = document.getElementById("log-out");
var profileSetting = document.getElementById("profile-setting");
var informationDashboard = document.getElementById("information-dashboard");
var informationPackage = document.getElementById("information-package");
var informationSetting = document.getElementById("information-setting");
var informationLogout = document.getElementById("information-logout");

var newQuantity = document.getElementById("new-quantity");
var quantityPopup = document.getElementById("quantity-popup");
var popup = document.querySelector(".popup");

dashboard.addEventListener("click", () => {
  window.location.href = "dashboard.html";
});
dashboard.addEventListener("mouseenter", () => {
  var x = dashboard.getBoundingClientRect();
  informationDashboard.style.display = "block";
  informationDashboard.style.top = `${x.top + 10}px`;
  informationDashboard.style.left = `${x.left + 60}px`;
});
dashboard.addEventListener("mouseleave", () => {
  informationDashboard.style.display = "none";
});
package.addEventListener("mouseenter", () => {
  var x = package.getBoundingClientRect();
  informationPackage.style.display = "block";
  informationPackage.style.top = `${x.top + 10}px`;
  informationPackage.style.left = `${x.left + 60}px`;
});
package.addEventListener("mouseleave", () => {
  informationPackage.style.display = "none";
});
setting.addEventListener("mouseenter", () => {
  var x = setting.getBoundingClientRect();
  informationSetting.style.display = "block";
  informationSetting.style.top = `${x.top + 10}px`;
  informationSetting.style.left = `${x.left + 60}px`;
});
setting.addEventListener("mouseleave", () => {
  informationSetting.style.display = "none";
});
logout.addEventListener("click", () => {
  sessionStorage.clear();
  window.location.href = "access.html";
});
logout.addEventListener("mouseenter", () => {
  var x = logout.getBoundingClientRect();
  informationLogout.style.display = "block";
  informationLogout.style.top = `${x.top + 10}px`;
  informationLogout.style.left = `${x.left + 60}px`;
});
logout.addEventListener("mouseleave", () => {
  informationLogout.style.display = "none";
});
newQuantity.addEventListener("click", () => {
  quantityPopup.style.display = "block";
});
quantityPopup.addEventListener("click", () => {
  quantityPopup.style.display = "none";
});
popup.addEventListener("click", (e) => {
  e.stopPropagation();
})