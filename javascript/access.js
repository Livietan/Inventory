import { register } from "./API.js";

const registerSubmit = document.getElementById("register");
export const username = document.getElementById("username");
export const password = document.getElementById("password");

var adminContent = document.getElementById("admin-content");
var managerContent = document.getElementById("manager-content");
var containerAdmin = document.getElementById("container-admin");
var containerManager = document.getElementById("container-manager");

adminContent.addEventListener("click", () => {
  containerAdmin.style.display = "none";
  containerManager.style.display = "flex";
});

managerContent.addEventListener("click", () => {
  containerAdmin.style.display = "flex";
  containerManager.style.display = "none";
});

registerSubmit.addEventListener("click", () => {
  register();
});
