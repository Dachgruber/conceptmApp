
/**
 * adds a node to the network
 * @param {name} String - The name for the node
 */
function AddNode(name){
  data.nodes.add({ id: nextNodeID, label: name})
  nextNodeID++       
}

// custom edit function that opens a modal popup and waits for the user to finish entering
// used in the network manipulation options 
var _input;  /* resolve-function reference */

async function editMyNode(node, callback) {
  let inputresult;
  openInputModal(); //opens the user prompt
  var promise = new Promise((resolve) => {_input = resolve }); //generates promise to wait for user input
  
  //await the user input
  await promise.then(
    (result) => {   //if promise fullfilled (no error), save the result
        inputresult = result 
      }, 
    (result) => {   //if promise rejected, (error), handle it and log it 
      console.log("[ERROR] while promising: "+ result)
    });

  console.log("[EDIT] edit node: " + node.label + " with new: " + inputresult) ; 
  //overwrite the label of the node and callback it to the network
  node.label = inputresult;
  
  console.log("[EDIT] edited node: " + node.label + " with new: " + inputresult) ; 
  callback(node);
  

}

/**
 * deletes a node from the network
 * @param {name} String - The name of the node
 * @param {nodeID} int - ID of the node to be deleted
 */
function DeleteNode(nodeID){

  //#########OLD CODE#############
  // // find the node based on the name
  // var possibleNodes = data.nodes.get({
  //   filter: function (item) {
  //     return (item.label == name);
  //   }
  // })

  // remove the found node from the DataSet
  //data.nodes.remove(possibleNodes[0])

  try {
    data.nodes.remove(nodeID);
  }
  catch (err) {
    console.log(err);
  }

}

/**
 * adds an edge to the network
 * @param {name} String - The name for the edge
 */
function AddEdge(name, fromNode, toNode){
  // find id of the starting node
  var fromNodeData = data.nodes.get({
    filter: function (item) {
      return (item.label == fromNode)
    }
  })

  // find the id of the target node
  var toNodeData = data.nodes.get({
    filter: function (item) {
      return (item.label == toNode)
    }
  })

  // add the egde to the DataSet and decrease idCounter
  data.edges.add({ id: nextEdgeID, from: fromNodeData[0].id, to: toNodeData[0].id, label: name})
  nextEdgeID--     
}


/**
 * deletes an edge from the network
 * @param {edgeID} int - ID of the edge to be deleted
 */
function DeleteEdge(edgeID){
  data.edges.remove(edgeID);
} 

/**
 * loads a json file from local storage to create a new network
 */
function LoadMap(){
  // load the JSON file from the storage
  var jsonFileObject = localStorage.getItem("jsonFile")

  var jsonFile = JSON.parse(jsonFileObject)
  console.log("loading: ", jsonFile)
  // set the data to the contents of the json file
  SetData(jsonFile)
}

/**
 * save the current network to a json file in the local storage
 */
function SaveMap(){
  // create a json file with network contents
  var jsonFile = CreateData()

  // store the JSON file in the localStorage
  localStorage.setItem("jsonFile", JSON.stringify(jsonFile));
  console.log("saving: ", jsonFile)
}

/**
 * imports a json file from local storage to create a new network
*/
function ImportMap(){
  // import from QR code
  // using a callback function to stop flow
  QRScanner.importDataFromQR(processImport)
}

/**
 * helper function for import function to stop programm flow
 * @param {jsonFileString} String version of the json file to be used as data 
*/
function processImport(jsonFileString){
  var jsonFile = JSON.parse(jsonFileString)
  console.log("importing: ", jsonFile)
  
  // set the network data to the contents of the json file
  SetData(jsonFile)
}

/**
 * exports the current network to a json file in the local storage
*/
function ExportMap(){
  // create a json file with network contents
  var jsonFile = CreateData()
  
  var jsonString = JSON.stringify(jsonFile)
  console.log("exporting: ", jsonFile)
  // create the data as an QR code
  QRScanner.sendDataToQR(jsonString)
}

/**
 * creates the network data as jsonFile
 * @return the json file containing network data 
 */
function CreateData(){
  // store the current positions in the nodes
  network.storePositions()
  // copy the data from the vis network DataSet
  var nodesCopy = data.nodes.get()
  var edgesCopy = data.edges.get()

  // store the data in a JSON file
  var jsonFile = {
    "nodes": [nodesCopy],
    "edges": [edgesCopy],
    "nextNodeID": nextNodeID,
    "nextEdgeID": nextEdgeID,
  }

  return jsonFile
}

/**
 * sets the current network data to the contents of the jsonFile
 * @param {jsonFile} jsonFile 
 */
function SetData(jsonFile){
  // clear the current data
  data.nodes.clear()
  data.edges.clear()

  // set the data from the provided JSON file
  data.nodes.add(jsonFile.nodes[0])
  data.edges.add(jsonFile.edges[0])
  // set the IDs to the new IDs
  nextNodeID = jsonFile.nextNodeID
  nextEdgeID = jsonFile.nextEdgeID
}

