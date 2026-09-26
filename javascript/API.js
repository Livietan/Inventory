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
    const request = await fetch(
      `http://127.0.0.1:8000/register?firstName=${firstName.value}&lastName=${lastNameValue}&username=${username.value}&password=${password.value}`,
      { method: "POST" },
    );
    var response = await request.json();
    if (response.status == true) {
      sessionStorage.setItem("signature", response.signature);
      window.location.href = "dashboard.html";
    } else {
      alert(response.detail);
    }
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
    const request = await fetch(
      `http://127.0.0.1:8000/login?username=${username.value}&password=${password.value}`,
      { method: "POST" },
    );
    var response = await request.json();
    if (response.status == true) {
      sessionStorage.setItem("signature", response.signature);
      window.location.href = "dashboard.html";
    } else {
      console.log(response.detail);
    }
  }
}

export async function addItem(
  signature,
  nameitem,
  typeItem,
  amountItem,
  priceItem,
) {
  var request = await fetch(
    `http://127.0.0.1:8000/AddItem?signature=${signature}&nameItem=${nameitem}&typeItem=${typeItem}&amountItem=${amountItem}&priceItem=${priceItem}`,
    { method: "POST" },
  );
  var response = request.json();
  if (response.status == false) {
    console.log(response.detail);
  }
}

export async function getDataUser(sign) {
  try {
    const request = await fetch(
      `http://127.0.0.1:8000/GetData?signature=${sign}`,
      { method: "POST" },
    );
    return request.json();
  } catch {
    return null;
  }
}

export async function getDataItem(username) {
  try {
    const request = await fetch(
      `http://127.0.0.1:8000/GetItems?signature=${username}`,
      { method: "POST" },
    );
    return request.json();
  } catch {
    return null;
  }
}

export async function getDataStat(username) {
  try {
    const request = await fetch(
      `http://127.0.0.1:8000/GetStat?signature=${username}`,
      { method: "POST" },
    );
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
    const request = await fetch(
      `http://127.0.0.1:8000/delete?signature=${signature}&nameItem=${nameItem.value}&typeItem=${typeItem.value}`,
      { method: "POST" },
    );
    var response = request.json();
    if (response.status == false) {
      console.log(response.detail);
    }
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
    alert(`Amount cannot be under ${amount.value}`);
  } else if (amount.value <= 0) {
    alert(`Amount cannot be under ${amount.value}`);
  } else {
    const request = await fetch(
      `http://127.0.0.1:8000/update?signature=${signature}&nameItem=${nameItem.value}&typeItem=${typeItem.value}&amount=${amount.value}&price=${price.value}`,
      { method: "POST" },
    );
    var response = request.json();
    if (response.status == false) {
      console.log(response.detail);
    }
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
    var request = await fetch(
      `http://127.0.0.1:8000/shipping?signatureSender=${signature_sender}&signatureReciever=${signature_reciever.value}&nameItem=${name_item.value}&typeItem=${type_item.value}&amount=${amount.value}`,
      { method: "POST" },
    );
    var response = request.json();
    if (response.status == false) {
      console.log(response.detail);
    }
  }
}
