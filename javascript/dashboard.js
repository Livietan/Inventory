var package = document.getElementById("package");
var tagTime = document.getElementById("datetime");
var logout = document.getElementById("log-out");
var userTag = document.getElementById("userTag");
var ellipsis = document.getElementById("ellipsis");
var profileSetting = document.getElementById("profile-setting");

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
userTag.textContent = `${sessionStorage.getItem("firstName")} ${sessionStorage.getItem("lastName")}`;
package.addEventListener("click", () => {
  window.location.href = "package.html";
});
logout.addEventListener("click", () => {
  sessionStorage.clear();
  window.location.href = "access.html";
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
