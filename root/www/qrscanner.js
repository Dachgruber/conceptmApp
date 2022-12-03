/**
 * the QRScanner class encapsulates the barcode phonegap plugin
 * with the necessary functionalty for scanning and creating QR Codes
 */
class QRScanner {
    
    // script for the qrcode scanner 
    #scanQR() {
    // we use an cordova.plugins.barcodescanner object
    // that has one methode: scan(result,failure) where result and failure
    // are methods that are called individually
    cordova.plugins.barcodeScanner.scan(
        function (result) {
            if(!result.cancelled){
                    // In this case we only want to process QR Codes
                    if(result.format == "QR_CODE"){
                        var value = result.text; // This is the retrieved content of the qr code
                        //console.log(value);
                        //alert(value);
    
                        return value;
                    }else{
                        alert("Sorry, only qr codes this time ;)");
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
    #makeQR(content){
        //default value for debug purposes
        //content = "Tolle katzenbilder";
        cordova.plugins.barcodeScanner.encode(cordova.plugins.barcodeScanner.Encode.TEXT_TYPE, content,
            function(success){
                alert ("encode success: " + success);
            }, function(fail) {
                alert("encoding failed: " + fail);
            }
        );
    }
    
    /**
     * starts the QRscanner and retrieves the encoded dada
     * @return encoded Data
     */
    importDataFromQR(){
        importData = scanQR();
        //here could be some validating of the data
    }
    
    /**
     * takes the input content and encodes it into a working QR code
     */
    sendDataToQR(content){
        makeQR(content)
    }
}