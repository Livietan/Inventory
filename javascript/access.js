import { register } from "./API.js";

const registerSubmit = document.getElementById("register");
const username = document.getElementById("username");
const password = document.getElementById("password");
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

registerSubmit.addEventListener("click", () => {
  register(username, password, role);
});
