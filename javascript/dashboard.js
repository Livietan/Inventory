var package = document.getElementById("package");
var tagTime = document.getElementById("datetime");
var logout = document.getElementById("log-out");
var userTag = document.getElementById("userTag");

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

tagTime.textContent = `${dayList[day]} ${date}/${mont}/${year}`;
userTag.textContent = sessionStorage.getItem("user");
package.addEventListener("click", () => {
  window.location.href = "package.html";
});
logout.addEventListener("click", () => {
  sessionStorage.clear();
  window.location.href = "access.html";
});
