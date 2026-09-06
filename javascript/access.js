var linkRegister = document.getElementById("link-register");
var registerForm = document.getElementById("register");
var linkLogin = document.getElementById("link-login");
var loginForm = document.getElementById("login");

linkLogin.addEventListener("click", () => {
  registerForm.style.display = "none";
  loginForm.style.display = "flex";
});
linkRegister.addEventListener("click", () => {
  registerForm.style.display = "flex";
  loginForm.style.display = "none";
});
