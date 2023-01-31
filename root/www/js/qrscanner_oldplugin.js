/**
 * the QRScanner class encapsulates the barcode phonegap plugin
 * with the necessary functionalty for scanning and creating QR Codes
 */
class QRScanner {
    
    // script for the qrcode scanner 
    static #scanQR(returnFunction) {
    // we use an cordova.plugins.barcodescanner object
    // that has one method: scan(result,failure) where result and failure
    // are callback methods that are called individually
    cordova.plugins.barcodeScanner.scan(
        function (result) {
            if(!result.cancelled){
                    // In this case we only want to process QR Codes
                    if(result.format == "QR_CODE"){
                        var value = result.text; // This is the retrieved content of the qr code
                        //call returnFunction with the value
                        returnFunction(value);
                    }else{
                        //every other type (barcode). No cancel at this time as browsers
                        //only support barcode value input.
                        //alert("Sorry, only qr codes this time ;)");
                        returnFunction(result.text);
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
        console.log("[QRSCAN] encoding: ",content, " to QR-Code");
        //default value for debug purposes
        if (!content){
            content = "Tolle katzenbilder";
        }
        cordova.plugins.barcodeScanner.encode(cordova.plugins.barcodeScanner.Encode.TEXT_TYPE, content, (success) => alert ("success!"))
        // try {
        // cordova.plugins.barcodeScanner.encode(cordova.plugins.barcodeScanner.Encode.TEXT_TYPE, content,
        //     function(success){
        //         console.log("[QRSCAN] [ENCODE] sucess!")
        //         alert("encode success: " + success);
        //     }, function(fail) {
        //         console.log("[QRSCAN] [ENCODE] failure!")
        //         alert("encoding failed: " + fail);
        //     }
        // );
        // }
        // catch(e) {
        //     console.log(e);
        // }
    }
    
    /**
     * starts the QRscanner, basically just a wrapper
     * @param returnFunction function object which handles the scanned data
     */
    static importDataFromQR(returnFunction){
        this.#scanQR(returnFunction);
    }
    
    /**
     * takes the input content and encodes it into a working QR code
     */
    static sendDataToQR(content){
        console.log("[QRSCAN] sending data to scanner");
        this.#makeQR(content)
    }
}