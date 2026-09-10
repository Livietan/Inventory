export async function register(
  firstName,
  lastName,
  inventoryName,
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
  } else if (inventoryName.value.trim() == "") {
    alert("name inventory could'not empety");
  } else {
    var lastNameValue = lastName.value.trim() === "" ? "" : lastName.value;
    const request = await fetch(
      `http://127.0.0.1:8000/register?firstName=${firstName.value}&lastName=${lastNameValue}&inventoryName=${inventoryName.value}&username=${username.value}&password=${password.value}`,
      { method: "POST" },
    );
    var response = await request.json();
    if (response.status == true) {
      sessionStorage.setItem("username", response.username);
      window.location.href = "dashboard.html";
    }
    if (response.status == false) {
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
      sessionStorage.setItem("username", response.username);
      window.location.href = "dashboard.html";
    }
    if (response.status == false) {
      alert(response.detail);
    }
  }
}

export async function mintItem(
  owner,
  nameitem,
  typeItem,
  categoryItem,
  amountItem,
  priceItem,
) {
  return await fetch(
    `http://127.0.0.1:8000/mint?owner=${owner}&nameItem=${nameitem.value}&typeItem=${typeItem.value}&categoryItem=${categoryItem.value}&amountItem=${amountItem.value}&priceItem=${priceItem.value}`,
    { method: "POST" },
  );
}

export async function getDataUser(username) {
  try {
    const request = await fetch(
      `http://127.0.0.1:8000/GetData?username=${username}`,
      { method: "POST" },
    );
    if (!request.ok) {
      return null;
    }
    return await request.json();
  } catch {
    return null;
  }
}

export async function getDataItem(username) {
  try {
    const request = await fetch(
      `http://127.0.0.1:8000/GetItems?username=${username}`,
      { method: "POST" },
    );
    if (!request.ok) {
      return null;
    }
    return await request.json();
  } catch {
    return null;
  }
}
