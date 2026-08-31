const registerSubmit = document.getElementById("register");

async function register() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  var role = "admin";
  const response = await fetch(
    `http://127.0.0.1:8000/register?username=${username}&password=${password}&role=${role}`,
  );
  console.log("valid");
  return response;
}

registerSubmit.addEventListener("click", () => {
    register();
})