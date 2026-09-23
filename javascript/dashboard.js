import { addItem, Delete, getDataItem, getDataUser } from "./API.js";

var userTag = document.getElementById("user-tag");
var addPopup = document.getElementById("button-add-item");
var popupAdd = document.getElementById("popup-add");
var addbutton = document.getElementById("button-add");
var dataItem = document.getElementById("data-item");
var logout = document.getElementById("logout");
var deletex = document.getElementById("delete");
var popupDelete = document.getElementById("popup-delete");
var nameD = document.getElementById("nameD");
var typeD = document.getElementById("typeD");
var checkboxD = document.getElementById("checkboxD");
var deleteItem = document.getElementById("delete-item");

var name = document.getElementById("Name");
var type = document.getElementById("Type");
var amount = document.getElementById("Amount");
var price = document.getElementById("Price");

var sign = sessionStorage.getItem("signature");
var data = await getDataUser(sign);
var response = await getDataItem(sign);

if (response.status == true) {
  dataItem.innerHTML = "";
  response.value.forEach((item, index) => {
    var data = document.createElement("div");
    data.classList.add("data-row");
    data.innerHTML = `
    <span>${index + 1}</span>
    <span>${item.nameItem}</span>
    <span>${item.typeItem}</span>
    <span>${item.amount}</span>
    <span>${item.price}</span>
    `;
    dataItem.appendChild(data);
  });
}

if (data) {
  userTag.textContent = `${data.firstName} ${data.lastName}`;
}

deletex.addEventListener("click", (e) => {
  popupDelete.style.display = "flex";
  e.stopPropagation();
});
popupDelete.addEventListener("click", (e) => {
  e.stopPropagation();
});
logout.addEventListener("click", () => {
  sessionStorage.clear();
  window.location.href = "connect.html";
});
addPopup.addEventListener("click", (e) => {
  popupAdd.style.display = "flex";
  e.stopPropagation();
});
popupAdd.addEventListener("click", (e) => {
  e.stopPropagation();
});
document.addEventListener("click", () => {
  popupAdd.style.display = "none";
  popupDelete.style.display = "none";
  checkboxD.checked = false;
  popupDelete.querySelectorAll("input").forEach((input) => {
    input.value = "";
  });
  popupAdd.querySelectorAll("input").forEach((input) => {
    input.value = "";
  });
});
addbutton.addEventListener("click", async () => {
  var request = await addItem(
    sign,
    name.value,
    type.value,
    amount.value,
    price.value,
  );
  var response = await request.json();
  if (response.status == true) {
    popupAdd.style.display = "none";
  } else {
    alert(response.detail);
    popupAdd.style.display = "none";
  }
});
deleteItem.addEventListener("click", () => {
  Delete(sign, nameD, typeD, checkboxD);
  popupDelete.style.display = "none";
});
