import { register } from "./API.js";

const registerAdmin = document.getElementById("register-admin");
const usernameAdmin = document.getElementById("username-admin");
const passwordAdmin = document.getElementById("password-admin");
const registerManager = document.getElementById("register-manager");
const usernameManager = document.getElementById("username-manager");
const passwordManager = document.getElementById("password-manager");
var role = "admin";

var adminContent = document.getElementById("admin-content");
var managerContent = document.getElementById("manager-content");
var containerAdmin = document.getElementById("container-admin");
var containerManager = document.getElementById("container-manager");

adminContent.addEventListener("click", () => {
  containerAdmin.style.display = "none";
  containerManager.style.display = "flex";
  role = "manager";
  console.log(role);
});

managerContent.addEventListener("click", () => {
  containerAdmin.style.display = "flex";
  containerManager.style.display = "none";
  role = "admin";
  console.log(role);
});

registerAdmin.addEventListener("click", () => {
  register(usernameAdmin, passwordAdmin, role);
});

registerManager.addEventListener("click", () => {
  register(usernameManager, passwordManager, role);
});
