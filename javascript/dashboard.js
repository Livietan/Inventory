import { getDataUser } from "./API.js";

var dashboard = document.getElementById("dashboard");
var packages = document.getElementById("package");
var setting = document.getElementById("setting");
var logout = document.getElementById("log-out");
var tagTime = document.getElementById("datetime");
var userTag = document.getElementById("userTag");
var ellipsis = document.getElementById("ellipsis");
var profileSetting = document.getElementById("profile-setting");
var informationDashboard = document.getElementById("information-dashboard");
var informationPackage = document.getElementById("information-package");
var informationSetting = document.getElementById("information-setting");
var informationLogout = document.getElementById("information-logout");
var menuTableAction = document.getElementById("menu-action");
var menuTableTransaction = document.getElementById("menu-transaction");
var tableAction = document.getElementById("audit-log-action");
var tableTransaction = document.getElementById("audit-log-transaction");

var user = sessionStorage.getItem("username");
var data = await getDataUser(user);

var datetime = new Date();
var day = datetime.getDay();
var date = datetime.getDate();
var mont = datetime.getMonth();
var year = datetime.getFullYear();
var dayList = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

if (data) {
  userTag.textContent = `${data.firstName} ${data.lastName}`;
}
tagTime.textContent = `${dayList[day]} ${date}/${mont + 1}/${year}`;

dashboard.addEventListener("mouseenter", () => {
  var x = dashboard.getBoundingClientRect();
  informationDashboard.style.display = "block";
  informationDashboard.style.top = `${x.top + 10}px`;
  informationDashboard.style.left = `${x.left + 60}px`;
});
dashboard.addEventListener("mouseleave", () => {
  informationDashboard.style.display = "none";
});
packages.addEventListener("click", () => {
  window.location.href = "package.html";
});
packages.addEventListener("mouseenter", () => {
  var x = packages.getBoundingClientRect();
  informationPackage.style.display = "block";
  informationPackage.style.top = `${x.top + 10}px`;
  informationPackage.style.left = `${x.left + 60}px`;
});
packages.addEventListener("mouseleave", () => {
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
ellipsis.addEventListener("click", () => {
  if (profileSetting.style.display == "none") {
    profileSetting.style.display = "block";
    profileSetting.addEventListener("click", () => {
      sessionStorage.clear();
      window.location.href = "access.html";
    });
  } else {
    profileSetting.style.display = "none";
  }
});
menuTableAction.addEventListener("click", () => {
  menuTableAction.style.background = "rgba(0, 0, 0, 0.1)";
  menuTableTransaction.style.background = "rgba(0, 0, 0, 0)";
  tableAction.style.display = "flex";
  tableTransaction.style.display = "none";
});
menuTableTransaction.addEventListener("click", () => {
  menuTableAction.style.background = "rgba(0, 0, 0, 0)";
  menuTableTransaction.style.background = "rgba(0, 0, 0, 0.1)";
  tableAction.style.display = "none";
  tableTransaction.style.display = "flex";
});
