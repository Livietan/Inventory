export async function register(username, password, role) {
  if (username.value.trim() == "") {
    alert("username could'not empety");
  } else if (password.value.trim() == "") {
    alert("password could'not empety");
  } else {
    const request = await fetch(
      `http://127.0.0.1:8000/register?username=${username.value}&password=${password.value}&role=${role}`,
    );
    var response = await request.json();
    if (response.status == true) {
      sessionStorage.setItem("user", response.user);
      sessionStorage.setItem("role", response.role);
      window.location.href = `${response.role}-dashboard.html`;
    }
    if (response.status == false) {
      alert(response.detail);
    }
  }
}

export async function login(username, password, role) {
  if (username.value.trim() == "") {
    alert("username could'not empety");
  } else if (password.value.trim() == "") {
    alert("password could'not empety");
  } else {
    const request = await fetch(
      `http://127.0.0.1:8000/login?username=${username.value}&password=${password.value}&role=${role}`,
    );
    var response = await request.json();
    if (response.status == true) {
      sessionStorage.setItem("user", response.user);
      sessionStorage.setItem("role", response.role);
      window.location.href = `${response.role}-dashboard.html`;
    }
    if (response.status == false) {
      alert(response.detail);
    }
  }
}
