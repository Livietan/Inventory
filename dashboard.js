const registerSubmit = document.getElementById("register");

async function register() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  var role = "admin";
  const response = await fetch(
    `http://127.0.0.1:8000/register?username=${username}&password=${password}&role=${role}`,
  );
  var detail = await response.json();
  if (detail.status == "valid") {
    console.log(detail.status);
  }
  if (detail.status == "invalid") {
    console.log(detail.status);
  }
}

registerSubmit.addEventListener("click", () => {
  register();
});
