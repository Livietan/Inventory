import { alertPopup, login, register } from "./API.js";

var linkRegister = document.getElementById("link-register");
var registerForm = document.getElementById("register");
var linkLogin = document.getElementById("link-login");
var loginForm = document.getElementById("login");

var firstName = document.getElementById("first-name");
var lastName = document.getElementById("last-name");
var usernameRegister = document.getElementById("username-register");
var passwordRegister = document.getElementById("password-register");
var agreeRegister = document.getElementById("agree-register");
var create = document.getElementById("create");

var usernameLogin = document.getElementById("username-login");
var passwordLogin = document.getElementById("password-login");
var agreeLogin = document.getElementById("agree-login");
var loginButton = document.getElementById("button-login");
var startedButton = document.getElementById("get-started");

startedButton.addEventListener("click", () => {
  document.getElementById("content").scrollIntoView({
    behavior: "smooth",
  });
});

linkRegister.addEventListener("click", () => {
  registerForm.style.display = "flex";
  loginForm.style.display = "none";
});
linkLogin.addEventListener("click", () => {
  registerForm.style.display = "none";
  loginForm.style.display = "flex";
});
create.addEventListener("click", async () => {
  if (username.value.trim() == "") {
    alertPopup(false, "Username could'not empety");
  } else if (password.value.trim() == "") {
    alertPopup(false, "Password could'not empety");
  } else if (firstName.value.trim() == "") {
    alertPopup(false, "First name could'not empety");
  } else if (agreeRegister.checked == false) {
    alertPopup(false, "Please checklist the terms & conditions");
  } else {
    var lastNameValue = lastName.value.trim() === "" ? "" : lastName.value;
    var response = await register(
      firstName.value,
      lastNameValue,
      usernameRegister.value,
      passwordRegister.value,
    );
    if (response.Status === true) {
      sessionStorage.setItem("FirstName", response.FirstName);
      sessionStorage.setItem("LastName", response.LastName);
      sessionStorage.setItem("Signature", response.Signature);
      window.location.href = "dashboard.html";
    } else {
      alertPopup(false, response.Detail);
    }
  }
});
loginButton.addEventListener("click", async () => {
  if (username.value.trim() == "") {
    alertPopup(false, "username could'not empety");
  } else if (password.value.trim() == "") {
    alertPopup(false, "password could'not empety");
  } else if (agreeLogin.checked === false) {
    alertPopup(false, "Please checklist the terms & conditions");
  } else {
    var response = await login(usernameLogin, passwordLogin);

    if (response.Status == true) {
      sessionStorage.setItem("FirstName", response.FirstName);
      sessionStorage.setItem("LastName", response.LastName);
      sessionStorage.setItem("Signature", response.Signature);
      window.location.href = "dashboard.html";
    } else {
      alertPopup(false, response.Detail);
    }
  }
});
document.getElementById("eye-icon-register").addEventListener("click", () => {
  var eye = document.getElementById("eye-icon-register");

  if (passwordRegister.type === "password") {
    passwordRegister.type = "text";
    eye.src = "/assets/visibility_on.svg";
  } else {
    passwordRegister.type = "password";
    eye.src = "assets/visibility_off.svg";
  }
});
document.getElementById("eye-icon-login").addEventListener("click", () => {
  var eye = document.getElementById("eye-icon-login");

  if (passwordLogin.type === "password") {
    passwordLogin.type = "text";
    eye.src = "/assets/visibility_on.svg";
  } else {
    passwordLogin.type = "password";
    eye.src = "assets/visibility_off.svg";
  }
});
