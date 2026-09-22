import { getDataUser } from "./API.js";

var userTag = document.getElementById("user-tag");
var addPopup = document.getElementById("button-add-item");
var popupAdd = document.getElementById("popup-add");
var addbutton = document.getElementById("button-add");

var sign = sessionStorage.getItem("signature");
var data = await getDataUser(sign);

if (data) {
  userTag.textContent = `${data.firstName} ${data.lastName}`;
}

addPopup.addEventListener("click", (e) => {
  popupAdd.style.display = "flex";
  e.stopPropagation();
});
popupAdd.addEventListener("click", (e) => {
  e.stopPropagation();
});
document.addEventListener("click", () => {
  popupAdd.style.display = "none";
  popupAdd.querySelectorAll("input").forEach((input) => {
    input.value = "";
  });
});
