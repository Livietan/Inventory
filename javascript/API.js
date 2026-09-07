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
  } else if (lastName.value.trim() == "") {
    alert("last name could'not empety");
  } else if (checklist.checked == false) {
    alert("Please checklist the terms & conditions");
  } else {
    const request = await fetch(
      `http://127.0.0.1:8000/register?firstName=${firstName.value}&lastName=${lastName.value}&username=${username.value}&password=${password.value}`,
    );
    var response = await request.json();
    if (response.status == true) {
      sessionStorage.setItem("user", response.name);
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
      sessionStorage.setItem("user", response.name);
      window.location.href = "dashboard.html";
    }
    if (response.status == false) {
      alert(response.detail);
    }
  }
}
