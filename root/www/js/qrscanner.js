/**
 * the QRScanner class encapsulates the barcode phonegap plugin
 * with the necessary functionalty for scanning and creating QR Codes
 */

//let _wait; //variable for the promise
async function editMyNode(node, callback) {
  let inputresult;
  openInputModal(); //opens the user prompt
  
  //await the user input
 

  console.log("[EDIT] edit node: " + node.label + " with new: " + inputresult) ; 
  //overwrite the label of the node and callback it to the network
  node.label = inputresult;
  
  console.log("[EDIT] edited node: " + node.label + " with new: " + inputresult) ; 
  callback(node);
  

}
let _input;
class QRScanner {
    
    // script for the qrcode scanner 
     static #scanQR() {
    // we use an cordova.plugins.barcodescanner object
    // that has one method: scan(result,failure) where result and failure
    // are callback methods that are called individually
    let self = this;
    let returnvalue;
    cordova.plugins.barcodeScanner.scan(
        function (result) {
            if(!result.cancelled){
                    // In this case we only want to process QR Codes
                    if(result.format == "QR_CODE"){
                        var value = result.text; // This is the retrieved content of the qr code
                        //return the returnvalue
                        console.log("[QRSCAN] QR_code detected")
                        self.returnvalue = value;
                        _wait(value);
                    }else{
                        //every other type (barcode). No cancel at this time as browsers
                        //only support barcode value input.
                        //alert("Sorry, only qr codes this time ;)");
                        self.returnvalue = value;
                        _wait(value);
                    }
            }else{
                alert("The user has dismissed the scan");
            }
        },
        function (error) {
                alert("An error ocurred: " + error);
        },
        {
            
          //preferFrontCamera : true, // iOS and Android
          showFlipCameraButton : true, // iOS and Android
          showTorchButton : true, // iOS and Android
          //torchOn: true, // Android, launch with the torch switched on (if available)
          saveHistory: true, // Android, save scan history (default false)
          prompt : "Platziere den QR-Code in dem Scanbereich", // Android
          resultDisplayDuration: 500, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
          formats : "QR_CODE,PDF_417", // default: all but PDF_417 and RSS_EXPANDED
          //orientation : "landscape", // Android only (portrait|landscape), default unset so it rotates with the device
          //disableAnimations : true, // iOS
          disableSuccessBeep: false // iOS and Android

        }

    );
    }
    
    //script for the QR generator
    static #makeQR(content){
        //default value for debug purposes
        if (!content){
            content = "Tolle katzenbilder";
        }
        cordova.plugins.barcodeScanner.encode(cordova.plugins.barcodeScanner.Encode.TEXT_TYPE, content,
            function(success){
                alert ("encode success: " + success);
            }, function(fail) {
                alert("encoding failed: " + fail);
            }
        );
    }
    
    /**
     * starts the QRscanner, basically just a wrapper
     * 
     */
    static async importDataFromQR(){
        this.#scanQR();
    }
    
    /**
     * takes the input content and encodes it into a working QR code
     */
    static sendDataToQR(content){
        this.#makeQR(content)
    }
}