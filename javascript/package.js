import { getDataItem, getDataUser, mintItem } from "./API.js";

var dashboard = document.getElementById("dashboard");
var packages = document.getElementById("package");
var setting = document.getElementById("setting");
var logout = document.getElementById("log-out");
var informationDashboard = document.getElementById("information-dashboard");
var informationPackage = document.getElementById("information-package");
var informationSetting = document.getElementById("information-setting");
var informationLogout = document.getElementById("information-logout");
var tagInventory = document.getElementById("tag-inventory");
var listItems = document.getElementById("list-container");
var notFound = document.getElementById("404");

var newQuantity = document.getElementById("new-quantity");
var quantityPopup = document.getElementById("quantity-popup");
var popup = document.querySelector(".popup");
var closeQuantity = document.getElementById("close-mint");
var buttonMint = document.getElementById("button-mint");

var user = sessionStorage.getItem("username");
var dataUser = await getDataUser(user);
var dataItem = await getDataItem(user);
listItems.innerHTML = "";

if (dataUser) {
  tagInventory.textContent = `${dataUser.inventoryName}`;
}

if (dataItem.point == true) {
  notFound.style.display = "none";
  dataItem.value.forEach((item, index) => {
    var dataItem = document.createElement("div");
    dataItem.classList.add("data-row");
    dataItem.innerHTML = `
    <div>
      <span>${index + 1}</span>
      <span>${item.nameItem}</span>
    </div>
    <span>${item.typeItem}</span>
    <span>${item.category}</span>
    <span>${item.amount}</span>
    <span>$${item.price}</span>
    `;
    listItems.appendChild(dataItem);
  });
} else {
  notFound.style.display = "block";
}
dashboard.addEventListener("click", () => {
  window.location.href = "dashboard.html";
});
dashboard.addEventListener("mouseenter", () => {
  var x = dashboard.getBoundingClientRect();
  informationDashboard.style.display = "block";
  informationDashboard.style.top = `${x.top + 10}px`;
  informationDashboard.style.left = `${x.left + 60}px`;
});
dashboard.addEventListener("mouseleave", () => {
  informationDashboard.style.display = "none";
});
packages.addEventListener("mouseenter", () => {
  var x = packages.getBoundingClientRect();
  informationPackage.style.display = "block";
  informationPackage.style.top = `${x.top + 10}px`;
  informationPackage.style.left = `${x.left + 60}px`;
});
packages.addEventListener("mouseleave", () => {
  informationPackage.style.display = "none";
});
setting.addEventListener("mouseenter", () => {
  var x = setting.getBoundingClientRect();
  informationSetting.style.display = "block";
  informationSetting.style.top = `${x.top + 10}px`;
  informationSetting.style.left = `${x.left + 60}px`;
});
setting.addEventListener("mouseleave", () => {
  informationSetting.style.display = "none";
});
logout.addEventListener("click", () => {
  sessionStorage.clear();
  window.location.href = "access.html";
});
logout.addEventListener("mouseenter", () => {
  var x = logout.getBoundingClientRect();
  informationLogout.style.display = "block";
  informationLogout.style.top = `${x.top + 10}px`;
  informationLogout.style.left = `${x.left + 60}px`;
});
logout.addEventListener("mouseleave", () => {
  informationLogout.style.display = "none";
});
newQuantity.addEventListener("click", () => {
  quantityPopup.style.display = "block";
});
quantityPopup.addEventListener("click", () => {
  quantityPopup.style.display = "none";
});
popup.addEventListener("click", (e) => {
  e.stopPropagation();
});
closeQuantity.addEventListener("click", () => {
  quantityPopup.style.display = "none";
});
buttonMint.addEventListener("click", () => {
  var nameMint = document.getElementById("name-mint");
  var categoryMint = document.getElementById("category-mint");
  var amountMint = document.getElementById("amount-mint");
  var priceMint = document.getElementById("price-mint");
  var typeMint = document.querySelector("input[name=radio]:checked");
  if (nameMint.value.trim() == "") {
    alert("name could'not empety");
  } else if (categoryMint.value.trim() == "") {
    alert("category could'not empety");
  } else if (amountMint.value.trim() == "") {
    alert("amount could'not empety");
  } else if (priceMint.value.trim() == "") {
    alert("amount could'not empety");
  } else {
    mintItem(user, nameMint, typeMint, categoryMint, amountMint, priceMint);
    quantityPopup.style.display = "none";
  }
});
