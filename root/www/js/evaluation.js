/**
 * function to initialize html elements
 */
class Evaluation {
 constructor(graph) {
  
  //check if optional graph is given.
  //if not, set to undefined
  if(graph) {
    this.graph = graph;
  } else {
    this.graph = null;
    console.log("[EVAL][INFO] No graph given to evaluation")
  }

    this.mapsScanned = 0;
    this.nodesPercentage = 0;
    this.edgesPercentage = 0;
    this.correctEdgesPercentage = 0;

    this.initialize();

    this.evaluationData = {
        //"nodesUsed": nodesUsed,
        //"nodesPossible": nodesPossible,
        "nodesPercentage": 0.3,
        //"edgesUsed": edgesUsed,
        //"edgesPossible": edgesPossible,
        "edgesPercentage": 0.6,
        "correctEdgesPercentage": 0.4,
      } 
      //console.log(evaluationData)
      localStorage.setItem("evaluationData", JSON.stringify(this.evaluationData))
     // console.log("EVALUATION INITIALISED")
}

  initialize() {

    document.getElementById("mapsScanned").innerHTML = 0;
    document.getElementById("nodesPercentage").innerHTML = 0;
    document.getElementById("edgesPercentage").innerHTML = 0;
    document.getElementById("correctEdgesPercentage").innerHTML = 0;
  }

/**
   * import the result of a student to the teacher evaluation page
   */
async importResultFromQr() {
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

          if(this.graph){
            this.graph.addBar(evaluationData.nodesPercentage);
          }

          console.log("[QRSCAN] scan successfull")
        },
        (result) => {   //if promise rejected, (error), handle it and log it 
          console.log("[QRSCAN] [ERROR] while promising: "+ result);
        });
  }

  /**
   * function for testing the result accumulation
   */
   importTestResult() {
    var evaluationData = JSON.parse(localStorage.getItem("evaluationData"))
    mapsScanned += 1;
    document.getElementById("mapsScanned").innerHTML = mapsScanned;
    correctEdgesPercentage += evaluationData.correctEdgesPercentage
    edgesPercentage += evaluationData.edgesPercentage
    nodesPercentage += evaluationData.nodesPercentage
    if (this.graph){
      this.graph.addBar(evaluationData.nodesPercentage);

    }
   this.evaluateResults();
  }

  /**
   * function to evaluate overall results after scanning data
   */
   evaluateResults() {
    let eval_correctEdgesPercentage = correctEdgesPercentage / mapsScanned
    let eval_edgesPercentage = edgesPercentage / mapsScanned
    let eval_nodesPercentage = nodesPercentage / mapsScanned
    document.getElementById("correctEdgesPercentage").innerHTML = eval_correctEdgesPercentage.toFixed(2)
    document.getElementById("edgesPercentage").innerHTML = eval_edgesPercentage.toFixed(2)
    document.getElementById("nodesPercentage").innerHTML = eval_nodesPercentage.toFixed(2)
  }

  /**
   * export the results to a QR code
   */
   exportResultsToQr() {
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


}