
// Designed by:  Mauricio Bucardo
// Original image:
// https://dribbble.com/shots/5619509-Animated-Tab-Bar

"use strict";

const body = document.body;
const bgColorsBody = ["#003049", "#ff96bd", "#9999fb", "#ffe797", "#cffff1"];
const menu = body.querySelector(".menu");
const menuItems = menu.querySelectorAll(".menu__item");
const menuBorder = menu.querySelector(".menu__border");
let activeItem = menu.querySelector(".active");
//<iframe src="link.html" width="100%" height="300"></iframe>

//we use this to load the HTML pages from the other pages
function load_tabs() {

    document.getElementById("tab0").innerHTML='<object class = "tab" data="networks_teacher_ui.html" type="text/html" "> Error: Embedded data could not be displayed.</embed>'
    document.getElementById("tab1").innerHTML='<object class = "tab" data="networks_student_ui.html" type="text/html" "> Error: Embedded data could not be displayed.</embed>'
    
    //document.getElementById("tab1").innerHTML='<iframe src="toller_button2.html" frameborder="0" style="overflow: hidden; height: 100%; width: 100%; position: absolute;left: 50%; margin-left: -50%;"></iframe>';
    document.getElementById("tab2").innerHTML='<iframe src="cat_example.html" frameborder="0" style="overflow: hidden; height: 100%; width: 100%; position: absolute;left: 50%; margin-left: -50%;"></iframe>';
    document.getElementById("tab3").innerHTML='<object class = "tab" data="test_button.html" style"=overflow: hidden; height: 100%; width: 100%; position: absolute;left: 50%; margin-left: -50%;"> <embed src="test_button.html" style"=overflow: hidden; height: 100%; width: 100%; position: absolute;left: 50%; margin-left: -50%;">> </embed> Error: Embedded data could not be displayed.</object>'

    //document.getElementById("tab4").innerHTML='<iframe src="cat_example.html" frameborder="0" style="overflow: hidden; height: 100%; width: 100%; position: absolute;left: 50%; margin-left: -50%;"></iframe>';
    
    //last set the backgroundcolour accordingly
    body.style.backgroundColor = bgColorsBody[0];
}

function clickItem(item, index) {

    menu.style.removeProperty("--timeOut");

    

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

let oldTabInt = 0; //we start off with the first tab
/**
* changes the displayed content of the tabbar with short fade animation
*/
function changeContent(index) {
    let tabnames = ['tab0', 'tab1', 'tab2', 'tab3', 'tab4'];
    let newTab = document.getElementById(tabnames[index]);
    let oldTab = document.getElementById(tabnames[oldTabInt]);

    //first, lay both tabs on top of each other
    oldTab.style.display = "block";
    newTab.style.display = "block";
    
    //then play the animation
    newTab.classList.remove("fadeIn");
    newTab.classList.remove("fadeOut");
    newTab.classList.add("fadeIn");
    oldTab.classList.remove("fadeIn");
    oldTab.classList.remove("fadeOut");
    oldTab.classList.add("fadeOut");   

    //last, edit the z coordinate to correctly manage foreground/background
    newTab.style.zIndex = "2";
    oldTab.style.zIndex = "1";

    //we hide the old tab...
    oldTab.style.display = "none";
    //... and save the current displayed tab to act as the next oldTab
    oldTabInt = index;
    
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

    //no changeroos when we click on the active item
    if (activeItem == item) return;

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
//also, load the first page defined at the top
document.getElementById('tab0').style.display = "block";

