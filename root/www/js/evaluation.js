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

  //these are the live changing numbers
    this.mapsScanned = 0;
    this.nodesPercentage = 0;
    this.edgesPercentage = 0;
    this.correctEdgesPercentage = 0;

  //and these are the computed totals

    this.eval_nodesPercentage = 0;
    this.eval_edgesPercentage = 0;
    this.eval_correctEdgesPercentage = 0;

    this.resetOutput();

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

  resetOutput() {
    //reset every variable
    this.mapsScanned = 0;
    this.nodesPercentage = 0;
    this.edgesPercentage = 0;
    this.correctEdgesPercentage = 0;

    this.eval_nodesPercentage = 0;
    this.eval_edgesPercentage = 0;
    this.eval_correctEdgesPercentage = 0;

    //reset the html output as well
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
    let self = this;
    await promise.then(
        (result) => {   //if promise fullfilled (no error), save the result
          jsonFileString = result;
          // set the network data to the contents of the json file
          var evaluationData = JSON.parse(jsonFileString)
          self.mapsScanned += 1;
          document.getElementById("mapsScanned").innerHTML = self.mapsScanned;
          self.correctEdgesPercentage += evaluationData.correctEdgesPercentage
          self.edgesPercentage += evaluationData.edgesPercentage
          self.nodesPercentage += evaluationData.nodesPercentage

          if(self.graph){
            self.graph.addBar(evaluationData.nodesPercentage);
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
    this.mapsScanned += 1;
    document.getElementById("mapsScanned").innerHTML = this.mapsScanned;
    this.correctEdgesPercentage += evaluationData.correctEdgesPercentage
    this.edgesPercentage += evaluationData.edgesPercentage
    this.nodesPercentage += evaluationData.nodesPercentage
    if (this.graph){
      this.graph.addBar(evaluationData.nodesPercentage);

    }
   this.evaluateResults();
  }

  /**
   * function to evaluate overall results after scanning data
   */
   evaluateResults() {
    this.eval_correctEdgesPercentage = this.correctEdgesPercentage / this.mapsScanned
    this.eval_edgesPercentage = this.edgesPercentage / this.mapsScanned
    this.eval_nodesPercentage = this.nodesPercentage / this.mapsScanned
    document.getElementById("correctEdgesPercentage").innerHTML = this.eval_correctEdgesPercentage.toFixed(2)
    document.getElementById("edgesPercentage").innerHTML = this.eval_edgesPercentage.toFixed(2)
    document.getElementById("nodesPercentage").innerHTML = this.eval_nodesPercentage.toFixed(2)
  }

  /**
   * export the results to a QR code
   */
   exportResultsToQr() {
    var taskName = document.getElementById('taskName').value
    var evaluationData = {
        "taskName": taskName,
        "nodesPercentage": this.eval_nodesPercentage,
        "edgesPercentage": this.eval_edgesPercentage,
        "correctEdgesPercentage": this.eval_correctEdgesPercentage,
        "mapsScanned": this.mapsScanned,
      } 
    if(DEBUG) {
    console.log("[NETWORK] exporting to QR: ", evaluationData)
    }
    QRScanner.sendDataToQR(evaluationData)
  }


}