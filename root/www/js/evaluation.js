/**
 * function to initialize html elements
 */
function initialize() {

    mapsScanned = 0;
    nodesPercentage = 0;
    edgesPercentage = 0;
    correctEdgesPercentage = 0;

    document.getElementById("mapsScanned").innerHTML = 0;
    document.getElementById("nodesPercentage").innerHTML = 0;
    document.getElementById("edgesPercentage").innerHTML = 0;
    document.getElementById("correctEdgesPercentage").innerHTML = 0;

    var evaluationData = {
        //"nodesUsed": nodesUsed,
        //"nodesPossible": nodesPossible,
        "nodesPercentage": 0.3,
        //"edgesUsed": edgesUsed,
        //"edgesPossible": edgesPossible,
        "edgesPercentage": 0.6,
        "correctEdgesPercentage": 0.4,
      } 
      console.log(evaluationData)
      localStorage.setItem("evaluationData", JSON.stringify(evaluationData))
}

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
          var evaluationData = JSON.parse(jsonFileString)
          mapsScanned += 1;
          document.getElementById("mapsScanned").innerHTML = mapsScanned;
          correctEdgesPercentage += evaluationData.correctEdgesPercentage
          edgesPercentage += evaluationData.edgesPercentage
          nodesPercentage += evaluationData.nodesPercentage

          console.log("[QRSCAN] scan successfull")
        },
        (result) => {   //if promise rejected, (error), handle it and log it 
          console.log("[QRSCAN] [ERROR] while promising: "+ result);
        });
  }

  /**
   * function for testing the result accumulation
   */
  function importTestResult() {
    var evaluationData = JSON.parse(localStorage.getItem("evaluationData"))
    mapsScanned += 1;
    document.getElementById("mapsScanned").innerHTML = mapsScanned;
    correctEdgesPercentage += evaluationData.correctEdgesPercentage
    edgesPercentage += evaluationData.edgesPercentage
    nodesPercentage += evaluationData.nodesPercentage
  }

  /**
   * function to evaluate overall results after scanning data
   */
  function evaluateResults() {
    correctEdgesPercentage = correctEdgesPercentage / mapsScanned
    edgesPercentage = edgesPercentage / mapsScanned
    nodesPercentage = nodesPercentage / mapsScanned
    document.getElementById("correctEdgesPercentage").innerHTML = correctEdgesPercentage.toFixed(2)
    document.getElementById("edgesPercentage").innerHTML = edgesPercentage.toFixed(2)
    document.getElementById("nodesPercentage").innerHTML = nodesPercentage.toFixed(2)
  }

  /**
   * export the results to a QR code
   */
  function exportResultsToQr() {
    var taskName = document.getElementById('taskName').value
    var evaluationData = {
        "taskName": taskName,
        "nodesPercentage": nodesPercentage,
        "edgesPercentage": edgesPercentage,
        "correctEdgesPercentage": correctEdgesPercentage,
        "mapsScanned": mapsScanned,
      } 
    if(DEBUG) {
    console.log("[NETWORK] exporting to QR: ", evaluationData)
    }
    QRScanner.sendDataToQR(evaluationData)
  }
