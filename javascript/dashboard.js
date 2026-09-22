import { getDataUser } from "./API.js";

var userTag = document.getElementById("user-tag");

var sign = sessionStorage.getItem("signature");
var data = await getDataUser(sign);

userTag.textContent = `${data.firstName} ${data.lastName}`;
