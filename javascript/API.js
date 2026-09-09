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

export async function getDataUser(username) {
  const request = await fetch(
    `http://127.0.0.1:8000/GetData?username=${username}`,
  );
  return await request.json();
}
