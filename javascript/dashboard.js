import {
  Delete,
  GetItems,
  GetDataStat,
  Update,
  Shipping,
  InsertItem,
} from "./API.js";

var userTag = document.getElementById("name-tag");
var valueTag = document.getElementById("value-tag");
var totalTag = document.getElementById("total-tag");
var item_pool_tags = document.getElementById("item-pool-tags");
var tagLog = document.getElementById("log");

var spawn_popup_new_item = document.getElementById("add-new");
var spawn_popup_delete = document.getElementById("delete");
var spawn_popup_edit_item = document.getElementById("edit-item");
var button_logout = document.getElementById("button-logout");
var spawn_popup_shipping = document.getElementById("shipping");
var spawn_note_items = document.getElementById("item-menu");
var spawn_note_history = document.getElementById("history-menu");

var popup_add_new = document.getElementById("popup-add-new");
var popup_delete = document.getElementById("popup-delete");
var popup_edit = document.getElementById("popup-edit");
var popup_shipping = document.getElementById("popup-shipping");
var popup_items = document.getElementById("notepad-item");
var popup_history = document.getElementById("notepad-history");

var button_add_item = document.getElementById("button-add-item");
var button_delete_item = document.getElementById("button-delete-item");
var button_edit_item = document.getElementById("button-edit-item");
var button_copy_signature = document.getElementById("copy-button");
var button_shipping_send = document.getElementById("shipping-send");

var name_delete_item = document.getElementById("name-delete-item");
var type_delete_item = document.getElementById("type-delete-item");
var aggree_delete_item = document.getElementById("aggree-delete-item");

var item_select_edit_name = document.getElementById("item-select-edit-name");
var item_select_edit_type = document.getElementById("item-select-edit-type");
var amount_edit_item = document.getElementById("Amount-edit-item");
var price_edit_item = document.getElementById("Price-edit-item");

var name_add_new = document.getElementById("name-add-new");
var type_add_new = document.getElementById("type-add-new");
var amount_add_new = document.getElementById("amount-add-new");
var price_add_new = document.getElementById("price-add-new");

var signature_reciever_shipping = document.getElementById("reciever-shipping");
var name_item_shipping = document.getElementById("item-select-shipping-name");
var type_item_shipping = document.getElementById("item-select-shipping-type");
var amount_item_shipping = document.getElementById("amount-item-shipping");

var FirstName = sessionStorage.getItem("FirstName");
var LastName = sessionStorage.getItem("LastName");
var Signature = sessionStorage.getItem("Signature");
var responseDataItem = await GetItems(Signature);
var responseDataStat = await GetDataStat(Signature);

if (FirstName && LastName != null) {
  userTag.textContent = `${FirstName} ${LastName}`;
}

if (!responseDataItem || !responseDataStat) {
  alert("Fail to load data");
} else {
  if (responseDataItem.Status === true) {
    item_pool_tags.innerHTML = "";

    responseDataItem.Value.forEach((item, index) => {
      var data = document.createElement("div");
      data.classList.add("data-row-items");
      data.innerHTML = `
      <span>${index + 1}</span>
      <span>${item.NameItem}</span>
      <span>${item.TypeItem}</span>
      <span>${item.AmountItem}</span>
      <span>${item.PriceItem}</span>
      `;
      item_pool_tags.appendChild(data);
    });
  }

  valueTag.textContent = "$" + responseDataStat.Value;
  totalTag.textContent = responseDataStat.Total;
}

if (Signature === null) {
  tagLog.textContent = "Login";
} else {
  tagLog.textContent = "Logout";
}

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
  name_item_shipping.innerHTML =
    "<option value='' disabled selected>Select item</option>";
  type_item_shipping.innerHTML =
    "<option value='' disabled selected>Select item</option>";
  responseDataItem.Value.forEach((item) => {
    var data = document.createElement("option");
    data.value = item.NameItem;
    data.textContent = item.NameItem;
    name_item_shipping.appendChild(data);
  });
  responseDataItem.Value.forEach((item) => {
    var data = document.createElement("option");
    data.value = item.TypeItem;
    data.textContent = item.TypeItem;
    type_item_shipping.appendChild(data);
  });
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
  popup_shipping.querySelectorAll("input").forEach((input) => {
    input.value = "";
  });
  popup_edit.querySelectorAll("input").forEach((input) => {
    input.value = "";
  });
  popup_delete.querySelectorAll("input").forEach((input) => {
    input.value = "";
  });
  popup_add_new.querySelectorAll("input").forEach((input) => {
    input.value = "";
  });
});
button_add_item.addEventListener("click", async () => {
  var response = await InsertItem(
    Signature,
    name_add_new,
    type_add_new,
    amount_add_new,
    price_add_new,
  );
  if (response.Status === true) {
    popup_add_new.style.display = "none";
    location.reload();
  } else {
    popup_add_new.style.display = "none";
    popup_add_new.querySelectorAll("input").forEach((input) => {
      input.value = "";
    });
    alert(response.Detail);
  }
});
button_delete_item.addEventListener("click", async () => {
  var request = await Delete(
    Signature,
    name_delete_item,
    type_delete_item,
    aggree_delete_item,
  );
  if (request.Status === true) {
    popup_delete.style.display = "none";
    location.reload();
  } else {
    popup_delete.style.display = "none";
    popup_delete.querySelectorAll("input").forEach((input) => {
      input.value = "";
    });
    aggree_delete_item.checked = false;
    alert(request.Detail);
  }
});
spawn_popup_edit_item.addEventListener("click", (e) => {
  popup_edit.style.display = "flex";
  e.stopPropagation();
  item_select_edit_name.innerHTML =
    "<option value='' disabled selected>Select item</option>";
  item_select_edit_type.innerHTML =
    "<option value='' disabled selected>Select item</option>";
  responseDataItem.Value.forEach((item) => {
    var data = document.createElement("option");
    data.value = item.NameItem;
    data.textContent = item.NameItem;
    item_select_edit_name.appendChild(data);
  });
  responseDataItem.Value.forEach((item) => {
    var data = document.createElement("option");
    data.value = item.TypeItem;
    data.textContent = item.TypeItem;
    item_select_edit_type.appendChild(data);
  });
});
popup_edit.addEventListener("click", (e) => {
  e.stopPropagation();
});
button_edit_item.addEventListener("click", async () => {
  var request = await Update(
    Signature,
    item_select_edit_name,
    item_select_edit_type,
    amount_edit_item,
    price_edit_item,
  );
  if (request.Status === true) {
    popup_edit.style.display = "none";
    location.reload();
  } else {
    popup_edit.style.display = "none";
    popup_edit.querySelectorAll("input").forEach((input) => {
      input.value = "";
    });
    alert(request.Detail);
  }
});
button_copy_signature.addEventListener("click", () => {
  navigator.clipboard.writeText(Signature);
});
button_shipping_send.addEventListener("click", async () => {
  var response = await Shipping(
    Signature,
    signature_reciever_shipping,
    name_item_shipping,
    type_item_shipping,
    amount_item_shipping,
  );
  if (response.Status === false) {
    spawn_popup_shipping.style.display = "none";
    location.reload();
    spawn_popup_shipping.querySelectorAll("input").forEach((input) => {
      input.value = "";
    });
    alert(response.Detail);
  } else {
    spawn_popup_shipping.style.display = "none";
    location.reload();
  }
});
spawn_note_items.addEventListener("click", () => {
  popup_items.style.display = "flex";
  popup_history.style.display = "none";
});
spawn_note_history.addEventListener("click", () => {
  popup_items.style.display = "none";
  popup_history.style.display = "flex";
});
