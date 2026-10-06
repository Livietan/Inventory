export async function register(firstName, lastName, username, password) {
  const request = await fetch("http://127.0.0.1:8000/register?", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      FIrstName: firstName,
      LastName: lastName,
      Signature: username,
      Password: password,
    }),
  });
  return request.json();
}

export async function login(username, password) {
  const request = await fetch("http://127.0.0.1:8000/login", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      Signature: username,
      Password: password,
    }),
  });
  return request.json();
}

export async function InsertItem(
  signature,
  imageItem,
  nameitem,
  typeItem,
  amountItem,
  priceItem,
) {
  if (amountItem.value <= 0) {
    alertPopup(false, "Amount cannot 0");
    return;
  } else if (priceItem.value <= 0) {
    alertPopup(false, "Amount cannot under 0");
    return;
  } else if (nameitem.value.trim() == "") {
    alertPopup(false, "Name cannot empety");
  } else if (typeItem.value.trim() == "") {
    alertPopup(false, "Type cannot empety");
  } else {
    var request = await fetch("http://127.0.0.1:8000/insert", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        Signature: signature,
        Image: imageItem,
        NameItem: nameitem.value,
        TypeItem: typeItem.value,
        AmountItem: amountItem.value,
        PriceItem: priceItem.value,
      }),
    });
    return request.json();
  }
}

export async function GetItems(signature) {
  try {
    const request = await fetch("http://127.0.0.1:8000/GetItems", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        Signature: signature,
      }),
    });
    return request.json();
  } catch {
    return null;
  }
}

export async function GetDataStat(signature) {
  try {
    const request = await fetch("http://127.0.0.1:8000/GetStatItem", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        Signature: signature,
      }),
    });
    return request.json();
  } catch {
    return null;
  }
}

export async function Delete(signature, nameItem, typeItem, checklist) {
  if (nameItem.value.trim() == "") {
    alertPopup(false, "name item could'not empety");
  } else if (typeItem.value.trim() == "") {
    alertPopup(false, "type item could'not empety");
  } else if (checklist.checked == false) {
    alertPopup(false, "Please checklist the terms & conditions");
  } else {
    const request = await fetch("http://127.0.0.1:8000/Delete", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        Signature: signature,
        NameItem: nameItem.value,
        TypeItem: typeItem.value,
      }),
    });
    return request.json();
  }
}

export async function Update(signature, nameItem, typeItem, amount, price) {
  if (signature.trim() === null) {
    alertPopup(false, "signature could'not empety");
  } else if (nameItem.value.trim() == "") {
    alertPopup(false, "name item could'not empety");
  } else if (typeItem.value.trim() == "") {
    alertPopup(false, "type item could'not empety");
  } else if (amount.value <= 0) {
    alertPopup(false, "Amount cannot 0");
  } else if (price.value <= 0) {
    alertPopup(false, "Price cannot 0");
  } else {
    const request = await fetch("http://127.0.0.1:8000/Update", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        Signature: signature,
        NameItem: nameItem.value,
        TypeItem: typeItem.value,
        AmountItem: amount.value,
        PriceItem: price.value,
      }),
    });
    return request.json();
  }
}

export async function Shipping(
  signature_sender,
  signature_reciever,
  name_item,
  type_item,
  amount,
) {
  if (amount.value <= 0) {
    alertPopup(false, "the amount cannot be 0 or below 0");
    return;
  } else if (signature_reciever.value == signature_sender) {
    alertPopup(false, "Cannot send yourself");
    return;
  } else {
    var request = await fetch("http://127.0.0.1:8000/Shipping", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        SignatureSend: signature_sender,
        SignatureRecieve: signature_reciever.value,
        NameItem: name_item.value,
        TypeItem: type_item.value,
        AmountItem: amount.value,
      }),
    });
    return request.json();
  }
}

export function alertPopup(status, message = "Bad Request") {
  if (status === false) {
    var popup = document.createElement("div");
    popup.classList.add("alert-popup-fail");
    popup.innerHTML = `
    <span class='alert-title-fail'>Failed</span>
    <span class='alert-message-fail'>${message}</span>
    `;
    document.body.appendChild(popup);
  } else {
    var popup = document.createElement("div");
    popup.classList.add("alert-popup-success");
    popup.innerHTML = `
    <span class='alert-title-success'>Success</span>
    <span class='alert-message-success'>Operation Success</span>
    `;
    document.body.appendChild(popup);
  }
}
