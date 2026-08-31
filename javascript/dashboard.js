import { register } from "./API";

const registerSubmit = document.getElementById("register");
export const username = document.getElementById("username").value;
export const password = document.getElementById("password").value;

registerSubmit.addEventListener("click", () => {
  register();
});
