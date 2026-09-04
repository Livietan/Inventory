export var token = "akmal";
export async function register(username, password, role) {
  if (username.value.trim() == "") {
    alert("username could'not empety")
  } else if (password.value.trim() == "") {
    alert("password could'not empety")
  } else {
    const response = await fetch(
      `http://127.0.0.1:8000/register?username=${username.value}&password=${password.value}&role=${role}`,
    );
    var detail = await response.json();
    if (detail.status == true) {
      alert(username.value, role);
    }
    if (detail.status == false) {
      alert(detail.detail);
    }
  }
}
