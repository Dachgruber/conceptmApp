//This has to be the most boilderplated-code ever
// Get the modal
var addmodal = document.getElementById("addModal");
var inputmodal = document.getElementById("inputModal")
var exportmodal = document.getElementById("exportModal")
var edgeInputModal = document.getElementById("edgeInputModal")
var nodeInputModal = document.getElementById("nodeInputModal")

// Get every <span> element that closes the modal
var addspans = Array.from(document.getElementsByClassName("addclose"));
var inputspans = Array.from(document.getElementsByClassName("inputclose"));
var exportspans = Array.from(document.getElementsByClassName("exportclose"));
var edgeInputspans = Array.from(document.getElementsByClassName("edgeInputclose"));
var nodeInputspans = Array.from(document.getElementsByClassName("nodeInputclose"));

// When the user clicks on the button, open the modal
function openAddModal() {
    console.log("[MODALS] addModalopen fired with: " + addmodal.style.display);
    addmodal.style.display = "block";
}
function openInputModal() {
    console.log("[MODALS] inputModalopen fired");
    inputmodal.style.display = "block";
}
function openExportModal() {
    console.log("[MODALS] exportModalopen fired");
    exportmodal.style.display = "block";
}
function openEdgeInputModal() {
    console.log("[MODALS] edgeInputModalopen fired");
    edgeInputModal.style.display = "block";
}
function openNodeInputModal() {
    console.log("[MODALS] nodeInputModalopen fired");
    nodeInputModal.style.display = "block";
}

function closeAddModal() {
 addmodal.style.display = "none";
}
function closeinputModal() {
 inputmodal.style.display = "none";
}
function closeExportModal() {
 exportmodal.style.display = "none";
}
function closeEdgeInputModal() {
 edgeInputModal.style.display = "none";
} 
function closeNodeInputModal() {
 nodeInputModal.style.display = "none";
}

// When the user clicks on <span> (x), close the modal
addspans.forEach(element => { element.onclick = closeAddModal;});
inputspans.forEach(element =>{ element.onclick = closeinputModal;})
exportspans.forEach(element =>{ element.onclick = closeExportModal;})
edgeInputspans.forEach(element =>{ element.onclick = closeEdgeInputModal;})
nodeInputspans.forEach(element =>{ element.onclick = closeNodeInputModal;})


// When the user clicks anywhere outside of the modal, close it
//currently not in use as it breaks the double-tap feature
// window.onclick = function(event) {
//   if (event.target == addmodal || event.target == inputmodal) {
//     addmodal.style.display = "none";
//     inputmodal.style.display = "none";
//   }
// } 