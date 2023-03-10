/**
   * import the result of a student to the teacher evaluation page
   */
async function importResultFromQr() {
    // import from QR code
    // using a callback function to stop flow
    let jsonFileString 
    QRScanner.importDataFromQR();
           
    var promise = new Promise((resolve) => {_wait = resolve }); //generates promise to wait for user input
        
    await promise.then(
        (result) => {   //if promise fullfilled (no error), save the result
          jsonFileString = result;
          // set the network data to the contents of the json file
          var resultJsonFile = JSON.parse(jsonFileString)
          document.getElementById("mapsScanned").innerHTML += 1;
          console.log("[QRSCAN] scan successfull")
        },
        (result) => {   //if promise rejected, (error), handle it and log it 
          console.log("[QRSCAN] [ERROR] while promising: "+ result);
        });
  }

  /**
   * export the results to a QR code
   */
  function exportResultsToQr() {

  }
