import { register } from "./API.js";

const registerSubmit = document.getElementById("register");
export const username = document.getElementById("username");
export const password = document.getElementById("password");

registerSubmit.addEventListener("click", () => {
  register()
});
