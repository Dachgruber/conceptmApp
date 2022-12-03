// script for the qrcode scanner -->
function startQR() {
cordova.plugins.barcodeScanner.scan(
    function (result) {
        if(!result.cancelled){
                // In this case we only want to process QR Codes
                if(result.format == "QR_CODE"){
                    var value = result.text;
                    // This is the retrieved content of the qr code
                    console.log(value);
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