/**
 * adds a node to the network
 * @param {name} String - The name for the node
 */
function AddNode(name){
  data.nodes.add({ id: nextNodeID, label: name})
  nextNodeID++       
}

/**
 * deletes a node from the network
 * @param {name} String - The name of the node
 * @param {nodeID} int - ID of the node to be deleted
 */
function DeleteNodeByName(name){

  // find the node based on the name
  var possibleNodes = data.nodes.get({
    filter: function (item) {
      return (item.label == name);
    }
  })

  // remove the found node from the DataSet
  data.nodes.remove(possibleNodes[0])
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
 * @param {name} String - The name of the edge
 * @param {edgeID} int - ID of the edge to be deleted
 */
function DeleteEdgeByName(name, fromNode, toNode){
  
  // find the nodes from the given names
  var fromNodeData = data.nodes.get({
    filter: function(item) {
      return (item.label == fromNode)
    }
  })
  var toNodeData = data.nodes.get({
    filter: function(item) {
      return (item.label == toNode)
    }
  })

  // find the edge with the node ids and the given name
  var edgeData = data.edges.get({
    filter: function (item) {
      return (item.label == name && item.from == fromNodeData[0].id && item.to == toNodeData[0].id)
    }
  })

  // remove the edge from the DataSet
  data.edges.remove(edgeData[0])
} 

/**
 * deletes an edge from the network
 * @param {edgeID} int - ID of the edge to be deleted
 */
function DeleteEdgeById(edgeID){
  data.edges.remove(edgeID);
} 

/**
 * deletes a node from the network
 * @param {name} String - The name of the node
 * @param {nodeID} int - ID of the node to be deleted
 */
function DeleteNodeById(nodeID){

  try {
    data.nodes.remove(nodeID);
  }
  catch (err) {
    console.log(err);
  }

}


/**
 * loads a json file from local storage to create a new network for the correct user
 * @param user string of the user to identify
 */
function LoadMap(user){
  // load the JSON file from the storage
  var storePosition = user + "jsonFile"
  var jsonFileObject = localStorage.getItem(storePosition)
  var jsonFile = JSON.parse(jsonFileObject)
  console.log("loading: ", jsonFile, "from: ", storePosition)
  // set the data to the contents of the json file
  SetData(jsonFile)
}

/**
 * save the current network to a json file in the local storage under the correct user
 * @param string of the user to identify
 */
function SaveMap(user){
  // create a json file with network contents
  var jsonFile = CreateData()
  var storePosition = user + "jsonFile"
  // store the JSON file in the localStorage
  localStorage.setItem(storePosition, JSON.stringify(jsonFile));
  console.log("saving: ", jsonFile, "at: ", storePosition)
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

/**
 * function to import a map that can be used to work on tasks 
 */
function ImportTask(){
  // import from QR code
  // using a callback function to stop flow
  QRScanner.importDataFromQR(ImportTaskHelper)
}

function ImportTaskHelper(qrdata) {
  SaveTask(qrdata);
  PopulateLabels();
}

/**
 * function to fill the labels for the dropdowns for student editor
 */
function PopulateLabels() {
  var [nodeNames, edgeNames] = ExtractLabels()
  console.log(nodeNames)
  var nodeSelect = document.getElementById("node-labels")
  var edgeSelect = document.getElementById("edge-labels")

  nodeSelect.innerHTML = "";
  edgeSelect.innerHTML = "";

  // iterating over nodes and adding them to the dropdown menu
  for (var i = 0; i < nodeNames.length; i++) {
    var opt = nodeNames[i]
    //console.log(opt)
    var el = document.createElement("option")
    el.text = opt
    el.value = opt
    nodeSelect.add(el)
  }
  
  // iterating over edges and adding them to the dropdown menu
  for (var i = 0; i < edgeNames.length; i++) {
    var opt = edgeNames[i]

    var el = document.createElement("option")
    el.text = opt
    el.value = opt
    edgeSelect.add(el)
  }

}

/**
 * Use the loaded teacher map to find out all possible node labels
 * @returns an array with all node labels from saved teacher map in localStorage
 */
function ExtractLabels(){

  var jsonFileObject = localStorage.getItem("taskjsonFile")
  var jsonFile = JSON.parse(jsonFileObject)
  var nodeNames = []
  var labelNames = []
  for (let i=0; i < jsonFile.nodes[0].length; i++) {
    nodeNames.push(jsonFile.nodes[0][i].label)
  }
  for (let i=0; i < jsonFile.edges[0].length; i++) {
    labelNames.push(jsonFile.edges[0][i].label)
  }
  console.log("Extracted: ", "Nodes: ", nodeNames, "Edges: ", labelNames)
  return [nodeNames, labelNames]
}

/**
 * helper function to complete import of task map from teacher for the student
 * @param {String} jsonFileString containing the vis network map data
 */
function SaveTask(jsonFileString){
  var jsonFile = JSON.parse(jsonFileString)
  localStorage.setItem("taskjsonFile", JSON.stringify(jsonFile));
  console.log("imported and saved map to taskjsonFile")
}