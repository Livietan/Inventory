export async function register(
  firstName,
  lastName,
  username,
  password,
  checklist,
) {
  if (username.value.trim() == "") {
    alert("username could'not empety");
  } else if (password.value.trim() == "") {
    alert("password could'not empety");
  } else if (firstName.value.trim() == "") {
    alert("fist name could'not empety");
  } else if (checklist.checked == false) {
    alert("Please checklist the terms & conditions");
  } else {
    var lastNameValue = lastName.value.trim() === "" ? "" : lastName.value;
    const request = await fetch("http://127.0.0.1:8000/register?", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        FIrstName: firstName.value,
        LastName: lastNameValue,
        Signature: username.value,
        Password: password.value,
      }),
    });
    return request.json();
  }
}

export async function login(username, password, checklist) {
  if (username.value.trim() == "") {
    alert("username could'not empety");
  } else if (password.value.trim() == "") {
    alert("password could'not empety");
  } else if (checklist.checked == false) {
    alert("Please checklist the terms & conditions");
  } else {
    const request = await fetch("http://127.0.0.1:8000/login", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        Signature: username.value,
        Password: password.value,
      }),
    });
    return request.json();
  }
}

export async function InsertItem(
  signature,
  nameitem,
  typeItem,
  amountItem,
  priceItem,
) {
  if (amountItem.value <= 0) {
    alert("Amount cannot 0");
    return;
  } else if (priceItem.value <= 0) {
    alert("Amount cannot under 0");
    return;
  } else {
    var request = await fetch("http://127.0.0.1:8000/insert", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        Signature: signature,
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
  if (signature.trim() == "") {
    alert("signature could'not empety");
  } else if (nameItem.value.trim() == "") {
    alert("name item could'not empety");
  } else if (typeItem.value.trim() == "") {
    alert("type item could'not empety");
  } else if (checklist.checked == false) {
    alert("Please checklist the terms & conditions");
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
  if (signature.trim() == "") {
    alert("signature could'not empety");
  } else if (nameItem.value.trim() == "") {
    alert("name item could'not empety");
  } else if (typeItem.value.trim() == "") {
    alert("type item could'not empety");
  } else if (amount.value <= 0) {
    alert(`Amount cannot 0`);
  } else if (price.value <= 0) {
    alert(`Price cannot 0`);
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
  if (amount <= 0) {
    alert("the amount cannot be 0 or below 0");
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
  }
}
