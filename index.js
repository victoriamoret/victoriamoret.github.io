var nav = document.querySelector("nav");
var icon = document.getElementById("icon");
var uls = document.querySelector("nav ul");
var circles = document.querySelectorAll(".circle");
var whiteSections = document.querySelectorAll(".white");
console.log(circles);
icon.style.visibility = "visible";
nav.style.visibility = "hidden";

icon.onclick = function() {
    if (nav.style.visibility == "hidden") {
        nav.style.visibility = "visible";
        icon.innerHTML = "X";
        // nav.style.background = "white";
        // nav.style.transition = "0.5s ease-out";
        uls.style.transform = "translate(+50vw)";
        uls.style.transition = "0.5s ease-out";
    } else {
        uls.style.transform = "translate(-50vw)";
        uls.style.transition = "1s ease-out";
        // nav.style.background = "none";
        // nav.style.transition = "0.5s ease-out";
        nav.style.visibility = "hidden";
        icon.innerHTML = "=";
    }
};
document.getElementsByTagName("body")[0].onscroll = () => {
    if (nav.style.visibility == "visible") {
        icon.onclick();
    }
};

for (let i = 0; i < whiteSections.length; i++) {
    console.log(whiteSections[i].offsetHeight);

    if (whiteSections[i].offsetHeight > 400) {
        console.log("bigger");
        whiteSections[i].style.marginTop = 2 + "em";
    }
    // if (whiteSections[i].style.height > 30 + "vh") {
    //     console.log("bigger");
    // } else {
    //     console.log("smaller");
    // }
}
