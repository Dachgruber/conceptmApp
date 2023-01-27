// Get the modal
var addmodal = document.getElementById("addModal");
var inputmodal = document.getElementById("inputModal")
var exportmodal = document.getElementById("exportModal")

// Get the <span> element that closes the modal
var addspan = document.getElementsByClassName("addclose")[0];
var inputspan = document.getElementsByClassName("inputclose")[0];
var exportspan = document.getElementsByClassName("exportclose")[0];

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

function closeAddModal() {
 addmodal.style.display = "none";
}
function closeinputModal() {
 inputmodal.style.display = "none";
}
function closeExportModal() {
 exportmodal.style.display = "none";
}
// When the user clicks on <span> (x), close the modal
addspan.onclick = closeAddModal;
inputspan.onclick = closeinputModal;
exportspan.onclick = closeExportModal;


// When the user clicks anywhere outside of the modal, close it
//currently not in use as it breaks the double-tap feature
// window.onclick = function(event) {
//   if (event.target == addmodal || event.target == inputmodal) {
//     addmodal.style.display = "none";
//     inputmodal.style.display = "none";
//   }
// } 