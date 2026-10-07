export async function register(firstName, lastName, username, password) {
  try {
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
  } catch {
    return null;
  }
}

export async function login(username, password) {
  try {
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
  } catch {
    return null;
  }
}

export async function InsertItem(
  signature,
  imageItem,
  nameitem,
  typeItem,
  amountItem,
  priceItem,
) {
  try {
    if (imageItem === null) {
      var formData = new FormData();
      formData.append("Signature", signature);
      formData.append("Image", imageItem);
      formData.append("NameItem", nameitem);
      formData.append("TypeItem", typeItem);
      formData.append("Amount", amountItem);
      formData.append("Price", priceItem);

      if (imageItem !== null) {
        formData.append("Image", "Default.png")
      }

      var request = await fetch("http://127.0.0.1:8000/insert", {
        method: "POST",
        body: formData,
      });
      return request.json();
    }
  } catch {
    return null;
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

export async function Delete(signature, nameItem, typeItem) {
  try {
    const request = await fetch("http://127.0.0.1:8000/Delete", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        Signature: signature,
        NameItem: nameItem,
        TypeItem: typeItem,
      }),
    });
    return request.json();
  } catch {
    return null;
  }
}

export async function Update(signature, nameItem, typeItem, amount, price) {
  try {
    const request = await fetch("http://127.0.0.1:8000/Update", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        Signature: signature,
        NameItem: nameItem,
        TypeItem: typeItem,
        AmountItem: amount,
        PriceItem: price,
      }),
    });
    return request.json();
  } catch {
    return null;
  }
}

export async function Shipping(
  signature_sender,
  signature_reciever,
  name_item,
  type_item,
  amount,
) {
  try {
    var request = await fetch("http://127.0.0.1:8000/Shipping", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        SignatureSend: signature_sender,
        SignatureRecieve: signature_reciever,
        NameItem: name_item,
        TypeItem: type_item,
        AmountItem: amount,
      }),
    });
    return request.json();
  } catch {
    return null;
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
