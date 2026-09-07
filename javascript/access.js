import { login, register } from "./API.js";

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

linkLogin.addEventListener("click", () => {
  registerForm.style.display = "none";
  loginForm.style.display = "flex";
});
linkRegister.addEventListener("click", () => {
  registerForm.style.display = "flex";
  loginForm.style.display = "none";
});
create.addEventListener("click", () => {
  register(firstName, lastName, usernameRegister, passwordRegister, agreeRegister);
});
loginButton.addEventListener("click", () => {
  login(usernameLogin, passwordLogin, agreeLogin);
});
