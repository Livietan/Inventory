import { username, password } from "./dashboard";

export async function register() {
  var role = "admin";
  const response = await fetch(
    `http://127.0.0.1:8000/register?username=${username}&password=${password}&role=${role}`,
  );
  var detail = await response.json();
  if (detail.status == "valid") {
    console.log(detail.status);
  }
  if (detail.status == "Username Not Available") {
    alert(detail.status);
  }
}
