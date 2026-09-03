var firstMenu = document.getElementById("first-menu");
var secondaryMenu = document.getElementById("secondary-menu");

firstMenu.addEventListener("click", () => {
    window.location.href = "admin-dashboard.html"
})

secondaryMenu.addEventListener("click", () => {
    window.location.href = "admin-package.html"
})