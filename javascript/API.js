export var token = "akmal";
export async function register(username, password) {
  if (username.value == "") {
    alert("username could'not empety")
  } else if (password.value == "") {
    alert("password could'not empety")
  } else {
    var role = "admin";
    const response = await fetch(
      `http://127.0.0.1:8000/register?username=${username.value}&password=${password.value}&role=${role}`,
    );
    var detail = await response.json();
    if (detail.status == true) {
      console.log(detail.status);
    }
    if (detail.status == false) {
      alert(detail.detail);
    }
  }
}
