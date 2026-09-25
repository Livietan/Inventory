import {
  addItem,
  Delete,
  getDataItem,
  getDataStat,
  getDataUser,
  Update,
  Shipping,
} from "./API.js";

var userTag = document.getElementById("name-tag");
var valueTag = document.getElementById("value-tag");
var totalTag = document.getElementById("total-tag");
var item_pool_tags = document.getElementById("item-pool-tags");

var spawn_popup_new_item = document.getElementById("add-new");
var spawn_popup_delete = document.getElementById("delete");
var spawn_popup_edit_item = document.getElementById("edit-item");
var button_logout = document.getElementById("button-logout");
var spawn_popup_shipping = document.getElementById("shipping");

var popup_add_new = document.getElementById("popup-add-new");
var popup_delete = document.getElementById("popup-delete");
var popup_edit = document.getElementById("popup-edit");
var popup_shipping = document.getElementById("popup-shipping");

var button_add_item = document.getElementById("button-add-item");
var button_delete_item = document.getElementById("button-delete-item");
var button_edit_item = document.getElementById("button-edit-item");
var button_copy_signature = document.getElementById("copy-button");
var button_shipping_send = document.getElementById("shipping-send");

var name_delete_item = document.getElementById("name-delete-item");
var type_delete_item = document.getElementById("type-delete-item");
var aggree_delete_item = document.getElementById("aggree-delete-item");

var item_select_edit = document.getElementById("item-select-edit");
var type_edit_item = document.getElementById("type-edit-item");
var amount_edit_item = document.getElementById("Amount-edit-item");
var price_edit_item = document.getElementById("Price-edit-item");

var name_add_new = document.getElementById("name-add-new");
var type_add_new = document.getElementById("type-add-new");
var amount_add_new = document.getElementById("amount-add-new");
var price_add_new = document.getElementById("price-add-new");

var signature_reciever_shipping = document.getElementById("reciever-shipping");
var name_item_shipping = document.getElementById("name-item-shipping");
var type_item_shipping = document.getElementById("type-item-shipping");
var amount_item_shipping = document.getElementById("amount-item-shipping");

var signature = sessionStorage.getItem("signature");
var responseDataUser = await getDataUser(signature);
var responseDataItem = await getDataItem(signature);
var responseDataStat = await getDataStat(signature);

if (responseDataItem.status == true) {
  item_pool_tags.innerHTML = "";
  responseDataItem.value.forEach((item, index) => {
    var data = document.createElement("div");
    data.classList.add("data-row");
    data.innerHTML = `
    <span>${index + 1}</span>
    <span>${item.nameItem}</span>
    <span>${item.typeItem}</span>
    <span>${item.amount}</span>
    <span>${item.price}</span>
    `;
    item_pool_tags.appendChild(data);
  });
}

valueTag.textContent = `$${responseDataStat.price}`;
totalTag.textContent = responseDataStat.amount;
userTag.textContent = `${responseDataUser.firstName} ${responseDataUser.lastName}`;

spawn_popup_delete.addEventListener("click", (e) => {
  popup_delete.style.display = "flex";
  e.stopPropagation();
});
popup_delete.addEventListener("click", (e) => {
  e.stopPropagation();
});
button_logout.addEventListener("click", () => {
  sessionStorage.clear();
  window.location.href = "connect.html";
});
spawn_popup_new_item.addEventListener("click", (e) => {
  popup_add_new.style.display = "flex";
  e.stopPropagation();
});
popup_add_new.addEventListener("click", (e) => {
  e.stopPropagation();
});
spawn_popup_shipping.addEventListener("click", (e) => {
  popup_shipping.style.display = "flex";
  e.stopPropagation();
});
popup_shipping.addEventListener("click", (e) => {
  e.stopPropagation();
});
document.addEventListener("click", () => {
  popup_add_new.style.display = "none";
  popup_delete.style.display = "none";
  popup_edit.style.display = "none";
  popup_shipping.style.display = "none";
  aggree_delete_item.checked = false;
  popup_delete.querySelectorAll("input").forEach((input) => {
    input.value = "";
  });
  popup_add_new.querySelectorAll("input").forEach((input) => {
    input.value = "";
  });
});
button_add_item.addEventListener("click", async () => {
  var response = await addItem(
    signature,
    name_add_new.value,
    type_add_new.value,
    amount_add_new.value,
    price_add_new.value,
  );
  if (response.status == true) {
    popup_add_new.style.display = "none";
  } else {
    alert(response.detail);
    popup_add_new.style.display = "none";
  }
});
button_delete_item.addEventListener("click", () => {
  Delete(signature, name_delete_item, type_delete_item, aggree_delete_item);
  popup_delete.style.display = "none";
  popup_delete.querySelectorAll("input").forEach((input) => {
    input.value = "";
  });
});
spawn_popup_edit_item.addEventListener("click", (e) => {
  popup_edit.style.display = "flex";
  e.stopPropagation();
  item_select_edit.innerHTML =
    "<option value='' disabled selected>Select item</option>";
  responseDataItem.value.forEach((item) => {
    var data = document.createElement("option");
    data.value = item.nameItem;
    data.textContent = item.nameItem;
    item_select_edit.appendChild(data);
  });
});
popup_edit.addEventListener("click", (e) => {
  e.stopPropagation();
});
button_edit_item.addEventListener("click", () => {
  Update(
    signature,
    item_select_edit,
    type_edit_item,
    amount_edit_item,
    price_edit_item,
  );
  popup_edit.style.display = "none";
  popup_edit.querySelectorAll("input").forEach((input) => {
    input.value = "";
  });
});
button_copy_signature.addEventListener("click", () => {
  navigator.clipboard.writeText(signature);
});
button_shipping_send.addEventListener("click", () => {
  Shipping(
    signature,
    signature_reciever_shipping,
    name_item_shipping,
    type_item_shipping,
    amount_item_shipping,
  );
  popup_shipping.style.display = "none";
  popup_shipping.querySelectorAll("input").forEach((input) => {
    input.value = "";
  });
});
