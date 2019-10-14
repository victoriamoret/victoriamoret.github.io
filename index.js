var nav = document.querySelector("nav");
var icon = document.getElementById("icon");
var uls = document.querySelector("nav ul");
icon.style.visibility = "visible";
nav.style.visibility = "hidden";

icon.onclick = function() {
    if (nav.style.visibility == "hidden") {
        nav.style.visibility = "visible";
        icon.innerHTML = "X";
        nav.style.background = "white";
        nav.style.transition = "0.5s ease-out";
        uls.style.transform = "translate(+50vw)";
        uls.style.transition = "0.5s ease-out";
    } else {
        uls.style.transform = "translate(-50vw)";
        uls.style.transition = "1s ease-out";
        nav.style.background = "none";
        nav.style.transition = "0.5s ease-out";
        nav.style.visibility = "hidden";
        icon.innerHTML = "=";
    }
};
