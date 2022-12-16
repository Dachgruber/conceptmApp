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
     * @param returnFunction function object which handles the scanned data
     */
    static importDataFromQR(returnFunction){
        this.#scanQR(returnFunction);
    }
    
    /**
     * takes the input content and encodes it into a working QR code
     */
    static sendDataToQR(content){
        this.#makeQR(content)
    }
}