
// Designed by:  Mauricio Bucardo
// Original image:
// https://dribbble.com/shots/5619509-Animated-Tab-Bar

"use strict";

const body = document.body;
const bgColorsBody = ["#ffb457", "#ff96bd", "#9999fb", "#ffe797", "#cffff1"];
const menu = body.querySelector(".menu");
const menuItems = menu.querySelectorAll(".menu__item");
const menuBorder = menu.querySelector(".menu__border");
let activeItem = menu.querySelector(".active");
//<iframe src="link.html" width="100%" height="300"></iframe>

//we use this to load the HTML pages from the other pages
function load_tabs() {
    document.getElementById("tab0").innerHTML='<iframe src="networks.html" frameborder="0" style="overflow: hidden; height: 100%; width: 100%; position: absolute;left: 50%; margin-left: -50%;"></iframe>';
    document.getElementById("tab1").innerHTML='<iframe src="qrcode_example.html" frameborder="0" style="overflow: hidden; height: 100%; width: 100%; position: absolute;left: 50%; margin-left: -50%;"></iframe>';
    document.getElementById("tab2").innerHTML='<iframe src="home.html" frameborder="0" style="overflow: hidden; height: 100%; width: 100%; position: absolute;left: 50%; margin-left: -50%;"></iframe>';
    document.getElementById("tab3").innerHTML='<iframe src="home.html" frameborder="0" style="overflow: hidden; height: 100%; width: 100%; position: absolute;left: 50%; margin-left: -50%;"></iframe>';
    document.getElementById("tab4").innerHTML='<iframe src="home.html" frameborder="0" style="overflow: hidden; height: 100%; width: 100%; position: absolute;left: 50%; margin-left: -50%;"></iframe>';
    
}

function clickItem(item, index) {

    menu.style.removeProperty("--timeOut");

    if (activeItem == item) return;

    if (activeItem) {
        activeItem.classList.remove("active");
    }


    item.classList.add("active");
    body.style.backgroundColor = bgColorsBody[index];
    activeItem = item;
    offsetMenuBorder(activeItem, menuBorder);


}

function offsetMenuBorder(element, menuBorder) {

    const offsetActiveItem = element.getBoundingClientRect();
    const left = Math.floor(offsetActiveItem.left - menu.offsetLeft - (menuBorder.offsetWidth - offsetActiveItem.width) / 2) + "px";
    menuBorder.style.transform = `translate3d(${left}, 0 , 0)`;

}

offsetMenuBorder(activeItem, menuBorder);

/**
* changes the displayed content of the tabbar
*/
function changeContent(index) {
    let tabnames = ['tab0', 'tab1', 'tab2', 'tab3', 'tab4'];
    let currentTab = tabnames[index];
    //clear the canvas
    cleartabs();

    // Show the current tab
    document.getElementById(currentTab).style.display = "block";
}
/**
 * puts all tabs on invisible
 */
function cleartabs(){
    
    const tabcontent = document.getElementsByClassName("tabcontent");

    // Get all elements with class="tabcontent" and hide them
    for (let i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
}

function clickWrapper(item, index) {
    clickItem(item, index); //every button gets the clickItem function, that handles the pretty stuff
    changeContent(index); //but we also need to change the displayed content
}

menuItems.forEach((item, index) => {

    item.addEventListener("click", () => clickWrapper(item, index));

})

window.addEventListener("resize", () => {
    offsetMenuBorder(activeItem, menuBorder);
    menu.style.setProperty("--timeOut", "none");
});

//on startup, we clear all tabs out and initiate the content
load_tabs();
cleartabs();
//also, load the first page
changeContent(0)
