import { alertPopup, login, register } from "./API.js";

var registerForm = document.getElementById("register");
var loginForm = document.getElementById("login");

var firstName = document.getElementById("first-name");
var lastName = document.getElementById("last-name");
var usernameRegister = document.getElementById("username-register");
var passwordRegister = document.getElementById("password-register");

var usernameLogin = document.getElementById("username-login");
var passwordLogin = document.getElementById("password-login");

document.getElementById("btn-nav").addEventListener("click", () => {
  document.getElementById("content").scrollIntoView({
    behavior: "smooth",
  });
});

document.getElementById("link-register").addEventListener("click", () => {
  registerForm.style.display = "flex";
  loginForm.style.display = "none";
});
document.getElementById("link-login").addEventListener("click", () => {
  registerForm.style.display = "none";
  loginForm.style.display = "flex";
});
document.getElementById("create").addEventListener("click", async () => {
  if (usernameRegister.value.trim() == "") {
    alertPopup(false, "Username could'not empety");
  } else if (passwordRegister.value.trim() == "") {
    alertPopup(false, "Password could'not empety");
  } else if (firstName.value.trim() == "") {
    alertPopup(false, "First name could'not empety");
  } else if (document.getElementById("agree-register").checked == false) {
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
document.getElementById("connect").addEventListener("click", async () => {
  if (usernameLogin.value.trim() == "") {
    alertPopup(false, "username could'not empety");
  } else if (passwordLogin.value.trim() == "") {
    alertPopup(false, "password could'not empety");
  } else if (document.getElementById("agree-login").checked === false) {
    alertPopup(false, "Please checklist the terms & conditions");
  } else {
    var response = await login(usernameLogin.value, passwordLogin.value);

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
    eye.src = "/assets/visibility_off.svg";
  }
});
document.getElementById("eye-icon-login").addEventListener("click", () => {
  var eye = document.getElementById("eye-icon-login");

  if (passwordLogin.type === "password") {
    passwordLogin.type = "text";
    eye.src = "/assets/visibility_on.svg";
  } else {
    passwordLogin.type = "password";
    eye.src = "/assets/visibility_off.svg";
  }
});
