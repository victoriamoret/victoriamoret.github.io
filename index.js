var nav = document.querySelector("nav");
var icon = document.getElementById("icon");
icon.style.visibility = "visible";
nav.style.visibility = "hidden";

icon.onclick = function() {
    if (nav.style.visibility == "hidden") {
        nav.style.visibility = "visible";
        icon.innerHTML = "X";
    } else {
        nav.style.visibility = "hidden";
        icon.innerHTML = "=";
    }
};
