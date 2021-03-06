var nav = document.querySelector("nav");
var icon = document.getElementById("icon");
var uls = document.querySelector("nav ul");

//onload setup

icon.style.visibility = "visible";
nav.style.visibility = "hidden";

//menu toggle

icon.onclick = function() {
    if (nav.style.visibility == "hidden") {
        nav.style.visibility = "visible";
        icon.innerHTML = "X";
        // nav.style.background = "white";
        // nav.style.transition = "0.5s ease-out";
        uls.style.left = 50 + "px";
        uls.style.transition = "0.5s ease-out";
    } else {
        uls.style.left = -100 + "vw";
        uls.style.transition = "1s ease-out";
        // nav.style.background = "none";
        // nav.style.transition = "0.5s ease-out";
        nav.style.visibility = "hidden";
        icon.innerHTML = "=";
    }
};
//make menu disappear on scroll:

// document.getElementsByTagName("body")[0].onscroll = () => {
//     if (nav.style.visibility == "visible") {
//         icon.onclick();
//     }
// };

//active nav ul :

let mainNavLinks = document.querySelectorAll("nav ul a li");
let mainSections = document.querySelectorAll(
    "#home, #about, #projects, #skills, #timeline"
);

window.addEventListener("scroll", event => {
    let fromTop = window.scrollY;

    mainSections.forEach(link => {
        let li = document.querySelector("[href='#" + link.id + "']");
        if (
            link.offsetTop + link.offsetHeight >= fromTop &&
            link.offsetTop - 100 <= fromTop
            //-100 for the padding
        ) {
            li.classList.add("current");
        } else {
            li.classList.remove("current");
        }
    });
});

//DRAFTS:

//
// for (let i = 0; i < whiteSections.length; i++) {
//     console.log(whiteSections[i].offsetHeight);
//
//     if (whiteSections[i].offsetHeight > 400) {
//         console.log("bigger");
//         whiteSections[i].style.marginTop = 2 + "em";
//     }
// if (whiteSections[i].style.height > 30 + "vh") {
//     console.log("bigger");
// } else {
//     console.log("smaller");
// }
// }
