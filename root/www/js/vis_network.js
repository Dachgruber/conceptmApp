/**
 * vis_network.js is the required libary (written by us) to create, modify and delete vis_network graphs.
 * it includes two constructors (one for an emptythis.network, one for athis.network with some example nodes and edges)
 * and many functions used for creating, editing and deleting nodes and edges.
 * 
 * TO USE:
 *  -add a new div inside the html with id="network_editor_container" (or specified by CONTAINER_ID below)
 *  -import this js script
 *  -call the constructor to initate the network
 * 
 * There is also added functionality for import/export to localStorage and import/export by the qrcodeScanner
 * 
 * NEW IN VERSION 1.3:
 *    -added colour support (currently using hardcoded colour palette)
 * 
 * @author André Berger 
 * @author Cornelius Brütt
 * @version 1.3
 */
"use strict";

let DEBUG = true; //specify if debug console output should be generated

class ConceptMap {
  CONTAINER_ID = "network_editor_container"; // the id the div container should have
  NODE_DROPDOWN_ID = "node-labels";          // the ids the list-container (example: dropdownmenu) for
  EDGE_DROPDOWN_ID = "edge-labels";          // both nodes and edges should have

  COLOURS = ['rgba(214, 40, 40,1)',          // hardcoded colour palette
             'rgba(247, 127, 0,1)',
             'rgba(252, 191, 73,1)']; 
  
  /**
   * generates a new ConceptMap and connects it to the <div> with the CONTAINER_ID 
   * @param {array} options vis_network options array
   * @param {boolean} isExample should be the map filled with some example nodes
   */
  constructor(options, isExample) {
    this.selectedEdge = 0;
    this.selectedNode = 0;
    //get the container in which the network should be placed
    this.container = document.getElementById(this.CONTAINER_ID);

    // generate the data inside the network, contains nodes and edges
    if (isExample) {
      // create an array with example nodes
      var nodes = new vis.DataSet([
        { id: 1, label: "saure Lösung", x: -354, y: 1 },
        { id: 2, label: "Oxonium-Ionen", x: -215, y: 147 },
        { id: 3, label: "Säure", x: -159, y: 55 },
        { id: 4, label: "Protonendonator", x: -187, y: -37 },
        { id: 5, label: "Säure-Base-Paar", x: -8, y: 144 },
        { id: 6, label: "Säure-Base-Reaktion", x: 14, y: -40 },
        { id: 7, label: "Base", x: 153, y: 64 },
        { id: 8, label: "Protonenakzeptor", x: 215, y: -65 },
        { id: 9, label: "basische Lösung", x: 390, y: -13 },
        { id: 10, label: "Hydroxid-Ionen", x: 256, y: 152 },
      ]);
      //set the counter
      this.nextNodeID = 11;

      // create an array with example edges
      var edges = new vis.DataSet([
        { id: -1, from: 1, to: 2, label: "enthält" },      // , arrows:'to,from' possible individually
        { id: -2, from: 3, to: 1, label: "bildet mit Wasser" },
        { id: -3, from: 3, to: 4, label: "ist definiert als" },
        { id: -4, from: 3, to: 5, label: "ist Teil eines" },
        { id: -5, from: 5, to: 6, label: "ist Teil der" },
        { id: -6, from: 7, to: 5, label: "ist Teil eines" },
        { id: -7, from: 7, to: 8, label: "ist definiert als" },
        { id: -8, from: 7, to: 9, label: "bildet mit Wasser" },
        { id: -9, from: 9, to: 10, label: "enthält" },
      ]);
      //set the counter
      this.nextEdgeID = -10;
      //save the created arrays to the data
      this.data = {
        nodes: nodes,
        edges: edges,
      };

    }
    else {
      //if no example, the data should be empty
      this.data = {
        nodes: new vis.DataSet([]),
        edges: new vis.DataSet([])
      };
      //set the counters
      this.nextNodeID = 1;
      this.nextEdgeID = -1;
    }

    //last, the options. If no options are given, generate some default options. 
    //If not, take the parameter options
    if (!options) {
      this.options = this.generateDefaultOptions()
    } else{
      this.options = options;
    }

    // build the network together
    this.network = new vis.Network(this.container, this.data, this.options);

    // last, add the event listeners
    this.addAllEventListeners()

    if (DEBUG){
      console.log("[NETWORK] network succesfully build")
    }
  }

  /**
   * generates default options for a network (without assigning it)
   * default options include prompts for the add/edit-functions, oval nodes and arrow edges
   * @returns options array
   */
  generateDefaultOptions() {
    let options = {
      manipulation: {
        enabled: false,        // hide the edit button
        //we set prompts as the default input method
        addNode: function (nodeData, callback) {
          nodeData.label = prompt("Please enter node name", "");
          callback(nodeData);
        },
        editNode: function (nodeData, callback) {
          nodeData.label = prompt("Please enter node name", "");
          callback(nodeData);
        },
        addEdge: function (edgeData, callback) {
          if (edgeData.from === edgeData.to) {
            var r = confirm("Do you want to connect the node to itself?");
            if (r === true) {
              edgeData.label = prompt("Please enter edge name", "");
              callback(edgeData);
            }
          }
          else {
            edgeData.label = prompt("Please enter edge name", "");
            callback(edgeData);
          }
        },
        editEdge: function (nodeData, callback) {
          nodeData.label = prompt("Please enter edge name", "");
          callback(nodeData);
        },
      },
      layout: {
        hierarchical: false,  // this makes two edges on same way visible, but lessens visibility
      },
      edges: {                // options set for all edges
        arrows: 'to',         // arrows on the "to" end of the edge
        physics: false,
        smooth: true,
      },
      nodes: {
        shape: "box",
        fixed: false,
        physics: false,
      }
    };
    return options;
  }

  /**
   * adds the EventListeners on the network required for correct functionality
   */
  addAllEventListeners() {
    let conceptMap = this; //reference this object, so the anonymous func can access its parameters
    this.network.on("click", function (params) {
      if (DEBUG) {
        console.log("[NETWORK] Selected NodeID: " + this.getNodeAt(params.pointer.DOM) + "\n"
          + "[NETWORK] Selected EdgeID: " + this.getEdgeAt(params.pointer.DOM));
        }
        conceptMap.selectedNode = this.getNodeAt(params.pointer.DOM);
        conceptMap.selectedEdge = this.getEdgeAt(params.pointer.DOM);
      
    })

    //we define double click as an prompt to add a edge
    //let conceptMap = this;
    this.network.on("doubleClick", function (params) {
      if (DEBUG) {
        console.log("[NETWORK] Dbclick on NodeID: " + this.getNodeAt(params.pointer.DOM) + "\n" 
          + "[NETWORK] Dbclick on EdgeID: " + this.getEdgeAt(params.pointer.DOM));
        }
        if (conceptMap.selectedNode) {console.log("edit this node"); this.editNode(); } //if a node is selected, fire editMode
        if (conceptMap.selectedEdge) {this.editEdgeMode(); }
    })

    //dataset subscription to listen for _any_ changes in the current data
    this.data.nodes.on('*', function (event, properties, senderId) {
      if (DEBUG) {
        //This results in unmeasurable amounts of console spam
        //console.log('[NETWORK] [EVT] event:', event, ',properties:', properties, ',senderId:', senderId);
      }
      conceptMap.saveMap("backup");
    });

    this.data.edges.on('*', function (event, properties, senderId) {
      if (DEBUG) {
        //same story with this
        //console.log('[NETWORK] [EVT] event:', event, ',properties:', properties, ',senderId:', senderId);
      }
      conceptMap.saveMap("backup");
    });

    //checks for cordova to be fully loaded
    document.addEventListener("deviceready", () => {
      if (DEBUG) {
        console.log("[##############][##############][##############]")
        console.log("[##############]  DEVICE READY  [##############]");
        console.log("[##############][##############][##############]")
      }
    }
    , false);

    //these currently do not work at all
    // //triggered when app gets paused/resumed to/from background
    // document.addEventListener("pause", () => {
    //   if (DEBUG) {
    //     console.log("[NETWORK] [EVT] APPLICATION PAUSED")
    //   }
    // }
    // , false);
    // document.addEventListener("resume", () => {
    //   if (DEBUG) {
    //     console.log("[NETWORK] [EVT] APPLICATION RESUMED")
    //   }
    // }
    // , false);
    // document.addEventListener("backbutton", () => {
    //   if (DEBUG) {
    //     console.log("[NETWORK] [EVT] BACK BUTTON PRESSED")
    //   }
    // }
    // , false);
    
    if (DEBUG) {
      console.log("[NETWORK] [EVT] event listeners added")
    }
  }


    /**
     * assign a random Colour from the colour palette
     * @returns colour string from the palette
    */
    getRandomColour() {
      
      let random = Math.floor(Math.random() * (this.COLOURS.length)); 
      var randomColour = this.COLOURS[random];
      if (DEBUG) {
        console.log("[NETWORK][COLOUR] rolled random colour %s",randomColour);
      }
      return randomColour
    }

    /**
     * Changes the colour of the given NodeID
     * @param {int} nodeID
     * @param {String} colourString 
     */
    setNodeColour(nodeID, colourString) {
      //var currentNode = this.network.nodes.get(nodeID);
      if (DEBUG){
        console.log('[NETWORK][COLOUR] setting %s to new colour %s',nodeID,colourString)
      }
      this.data.nodes.update({
        id: nodeID,
        color: colourString
      } 
      )
    }

    
  /**
   * takes every node of the current network and assigns a random colour to it
   */
  makeColourfull() {
    var nodeIDs = this.data.nodes.getIds() 
    //iterate over all IDs and update the node colour with the id respectivly
    for(const entry of nodeIDs){
      this.setNodeColour(entry, this.getRandomColour());
    }
    this.network.redraw();
  }

  /**
   * deletes the current selected node or edge or both
   */
  deleteSelectedObj() {
    if(DEBUG){
      console.log("[NETWORK] trying to delete the selected (edgeId, nodeID): ",this.selectedEdge,this.selectedNode);
    } 
    if (this.selectedNode) { //check if selected Object is undefined. If not, remove
      this.deleteNodeById(this.selectedNode);
    }
    if (this.selectedEdge) {
      this.deleteEdgeById(this.selectedEdge);
    }
  }

  /**
   * adds a node to the network with a name/label if node not already present
   * @param {name} String - The name for the node
   */
  addNodeByName(name) {
    
    let [currentNodeLabels, currentEdgeLabels] = this.extractStudentLabels()
    // if the label does not already exists, add the node to the data
    if (!(currentNodeLabels.includes(name))) {
      this.data.nodes.add({ 
        id:this.nextNodeID, 
        label: name,
        x:this.generateRandomPosition("x"),      
        y:this.generateRandomPosition("y"),
        color: this.getRandomColour()
    });
      //play fancy animation so that we do not get lost
      this.network.focus(this.nextNodeID,{animation: true});  
      this.nextNodeID++;
      if (DEBUG){
        console.log("[NETWORK] added node: ",name);
      }
    } else {
      if (DEBUG) {
        console.log("[NETWORK] node " + name + " already in network")
      }
    }
  }

  /**
   * adds a node using the selection menu, (useful for the student editor)
   */
  addNodeBySelection(){
    var elem = document.getElementById(this.NODE_DROPDOWN_ID)
    var name = elem.value;
    this.addNodeByName(name);
  }

  /**
   * deletes a node from the network using its name/label
   * if more than one nodes exist, delete the first found node
   * @param {name} String - The name of the node
   */
  deleteNodeByName(name) {
    // find the node based on the name
    var possibleNodes =this.data.nodes.get({
      filter: function (item) {
        return (item.label == name);
      }
    })
    var nodeID = possibleNodes[0]
    console.log(nodeID)
    this.deleteConnectedEdges(nodeID)
    // remove the (first) found node from the DataSet
    this.data.nodes.remove(nodeID)
    if (DEBUG){
      console.log("[NETWORK] removed node: ",name);
    }
  }

  /**
   * adds an edge with a label to the network
   * @param {name} String - The name for the edge
   * @param {connection} Array tuple with [fromNode, toNode]
   */
  addEdgeByName(name, connection) {
    let [fromNode, toNode] = connection;
    // find id of the starting node
    var fromNodeData =this.data.nodes.get({
      filter: function (item) {
        return (item.label == fromNode)
      }
    })
    // find the id of the target node
    var toNodeData =this.data.nodes.get({
      filter: function (item) {
        return (item.label == toNode)
      }
    })

    // add the egde to the DataSet and decrease idCounter
    this.data.edges.add({ id:this.nextEdgeID, from: fromNodeData[0].id, to: toNodeData[0].id, label: name })
    this.nextEdgeID--

    if (DEBUG){
      console.log("[NETWORK] added edge: " + name + " from: " + fromNode + " to:" + toNode );
    }
  }


  /**
   * adds a new Edge using the given selection menu
   * (useful for the student editor)
   * @deprecated as currently there is no need.
   */
  addEdgeBySelection(){
    var elem = document.getElementById(this.EDGE_DROPDOWN_ID)
    var name = elem.value
    this.addEdgeByName(name);
  }

  /**
   * activates the vis.network.js addEdgeMode, so we can drag/drop new edges
   */
  activateAddEdgeMode(){
   this.network.addEdgeMode();
  }

  /**
   * deactivates the vis.network.js addEdgeMode
   * */
  deactivateAddEdgeMode(){
    this.network.disableEditMode();
   }
  /**
   * deletes an edge by its label from the network
   * If more than one edge with this name exits, only delete the first found
   * @param {name} String - The name of the edge
   * @param {connection} Array - Array containg origin and destination node names
   */
  deleteEdgeByName(name, connection) {
    let [fromNode, toNode] = connection;
    // find the nodes from the given names
    var fromNodeData =this.data.nodes.get({
      filter: function (item) {
        return (item.label == fromNode)
      }
    })
    var toNodeData =this.data.nodes.get({
      filter: function (item) {
        return (item.label == toNode)
      }
    })

    // find the edge with the node ids and the given name
    var edgeData =this.data.edges.get({
      filter: function (item) {
        return (item.label == name && item.from == fromNodeData[0].id && item.to == toNodeData[0].id)
      }
    })

    // remove the edge from the DataSet
   this.data.edges.remove(edgeData[0])

   if (DEBUG){
    console.log("[NETWORK] deleted edge: " + name + " from: " + fromNode + " to:" + toNode );
  }
  }

  /**
   * deletes an edge from the network, referenced by its internal ID
   * @param {edgeID} int - ID of the edge to be deleted
   */
  deleteEdgeById(edgeID) {
   this.data.edges.remove(edgeID);
   if (DEBUG){
    console.log("[NETWORK] deleted edge: " + edgeID );
   }
  }

  
  /**
   * deletes a node from the network, referenced by its internal ID
   * @param {nodeID} int - ID of the node to be deleted
   */
  deleteNodeById(nodeID) {
    this.data.nodes.remove(nodeID);
    this.deleteConnectedEdges(nodeID);

    if (DEBUG){
      console.log("[NETWORK] deleted node: " + nodeID);
     }
  }

  /**
   * 
   */
  deleteConnectedEdges(nodeID) {
    var relevantIDs = this.data.edges.getIds({filter: function (item){
      return (item.from == nodeID || item.to == nodeID)
    }})
    this.data.edges.remove(relevantIDs)
  }


  /**
   * loads a json file from local storage to create a new network for the correct user
   * @param {user} String - Type of the user to identify
   */
  loadMap(user) {
    // load the JSON file from the storage
    var storePosition = user + "JsonFile"
    var jsonFileObject = localStorage.getItem(storePosition)
    var jsonFile = JSON.parse(jsonFileObject)
    if (DEBUG) {
      console.log("[NETWORK] loading: ", jsonFile, "from: ", storePosition)
    }
    // set the data to the contents of the json file
    this.setData(jsonFile)
  }

  /**
   * saves the current network to localStorage
   * @param {string} user username to define save-position
   */
  saveMap(user) {
    // create a json file withthis.network contents
    var jsonFile = this.createDataAsJson(network)
    var storePosition = user + "JsonFile"
    // store the JSON file in the localStorage
    localStorage.setItem(storePosition, JSON.stringify(jsonFile));
    if (DEBUG) {
      console.log("[NETWORK] saving: ", jsonFile, "at: ", storePosition);
    }
  }

  /**
   * asks the QRScanner to scan a QR-Code for us, to import a map for creating a new network
  */
  async importMapFromQr() {
    // import from QR code
    // using a callback function to stop flow
    let jsonFileString 
    QRScanner.importDataFromQR();
           
    var promise = new Promise((resolve) => {_wait = resolve }); //generates promise to wait for user input
        
    await promise.then(
        (result) => {   //if promise fullfilled (no error), save the result
          jsonFileString = result;
          // set the network data to the contents of the json file
          var jsonFile = JSON.parse(jsonFileString)
          this.setData(jsonFile);
          if (DEBUG){
            console.log("[NETWORK] imported: ", jsonFile)
          }
          console.log("[QRSCAN] scan successfull")
        },
        (result) => {   //if promise rejected, (error), handle it and log it 
          console.log("[QRSCAN] [ERROR] while promising: "+ result);
        });
  }

  /**
   * asks the QRScanner to scan a QR-Code for us, to import a map that can be used to work on tasks 
   */
  async importTaskFromQr() {
    // import from QR code
    // using a callback function to stop flow
    let jsonFileString 
    QRScanner.importDataFromQR();
           
    var promise = new Promise((resolve) => {_wait = resolve }); //generates promise to wait for user input
        
    await promise.then(
        (result) => {   //if promise fullfilled (no error), save the result
          jsonFileString = result;
          this.saveTask(jsonFileString);
          this.populateLabels();
          console.log("[QRSCAN] scan successfull")
        },
        (result) => {   //if promise rejected, (error), handle it and log it 
          console.log("[QRSCAN] [ERROR] while promising: "+ result);
        });
  }
   /**
   * skip the qrCodeScanner and only populate the task with the saved example
   * @deprecated
   */
   importTaskExample() {
    this.populateLabels();
  }
  /**
   * exports the current network to a json file and asks
   * the QRScanner to generate a QR-Code for us
  */
  exportMapToQr() {
    // create a json file withthis.network contents
    var jsonFile = this.createDataAsJson(this.network)

    var jsonString = JSON.stringify(jsonFile)
    // create thethis.data as an QR code
    QRScanner.sendDataToQR(jsonString)
    if(DEBUG){
     console.log("[NETWORK] exporting to QR: ", jsonFile)
    }
  }

  /**
   * exports the current evaluation data
   */
  exportResultToQr() {
    var evaluationData = JSON.parse(localStorage.getItem("evaluationData"))
    if(DEBUG) {
      console.log("[NETWORK] exporting to QR: ", evaluationData)
    }
    QRScanner.sendDataToQR(evaluationData)
  }

  /**
   * creates the network data as jsonFile
   * @return the json file containing networkthis.data 
   */
  createDataAsJson() {
    // store the current positions in the nodes
   this.network.storePositions()
    // copy the data from the visthis.network DataSet
    var nodesCopy = this.data.nodes.get()
    var edgesCopy = this.data.edges.get()

    // store the data in a JSON file
    var jsonFile = {
      "nodes": [nodesCopy],
      "edges": [edgesCopy],
      "nextNodeID":this.nextNodeID,
      "nextEdgeID":this.nextEdgeID,
    }
    //no debug output here as this resulted in humoungus amounts of console spam
    return jsonFile
  }

  /**
   * sets the current network.data to the contents of the jsonFile
   * @param {jsonFile} jsonFile 
   */
  setData(jsonFile) {
    // clear the currentthis.data
   this.data.nodes.clear()
   this.data.edges.clear()

    // set thethis.data from the provided JSON file
   this.data.nodes.add(jsonFile.nodes[0])
   this.data.edges.add(jsonFile.edges[0])
    // set the IDs to the new IDs
   this.nextNodeID = jsonFile.nextNodeID
   this.nextEdgeID = jsonFile.nextEdgeID
  }

 

  /**
   * function to fill the labels for the dropdowns for student editor
   */
  populateLabels() {
    var [nodeNames, edgeNames] = this.extractTaskLabels()
    if(DEBUG) {
      console.log("[NETWORK] the importet nodenames are: ",nodeNames)
    }
    var nodeSelect = document.getElementById(this.NODE_DROPDOWN_ID)
    var edgeSelect = document.getElementById(this.EDGE_DROPDOWN_ID)

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
  extractTaskLabels() {

    var jsonFileObject = localStorage.getItem("taskjsonFile")
    var jsonFile = JSON.parse(jsonFileObject)
    var nodeNames = []
    var edgeNames = []
    for (let i = 0; i < jsonFile.nodes[0].length; i++) {
      nodeNames.push(jsonFile.nodes[0][i].label)
    }
    for (let i = 0; i < jsonFile.edges[0].length; i++) {
      edgeNames.push(jsonFile.edges[0][i].label)
    }
    if (DEBUG) {
      console.log("[NETWORK] Extracted: ", "Nodes: ", nodeNames, "Edges: ", edgeNames)
    }
    return [nodeNames, edgeNames]
  }

  /**
   * extract the current labels from the stored student network data 
   */
  extractStudentLabels() {
    // create current label array from current data 
    let currentNodes = this.data.nodes.get();
    let currentNodeLabels = currentNodes.map(function(i) {
      return i.label;
    })
    let currentEdges = this.data.edges.get();
    let currentEdgeLabels = currentEdges.map(function(i) {
      return i.label;
    })
    return [currentNodeLabels, currentEdgeLabels]
  }

  /**
   * helper function to complete import of task map from teacher for the student
   * @param {String} jsonFileString containing the visthis.network mapthis.data
   */
  saveTask(jsonFileString) {
    var jsonFile = JSON.parse(jsonFileString)
    localStorage.setItem("taskjsonFile", JSON.stringify(jsonFile));
    console.log("imported and saved map to taskjsonFile")
  }

  /**
   * generates a random pos coordinate inside the current viewport
   * @param {char} axis, either x or y
   * @returns 
   */
  generateRandomPosition(axis){
    var positionInfo = document.getElementById(this.CONTAINER_ID).getBoundingClientRect();
    let maxValue = 0;
    let BUFFER = 0.5; //sets a multiplicator so that we do not reach the edge 
    if(axis=='y'){
      maxValue = positionInfo.height * BUFFER;
    }else if (axis == 'x'){
      maxValue = positionInfo.width * BUFFER;
    }else return 0;
  
    let random = Math.floor(Math.random() * (maxValue)); 
    return random;  
}
  /**
   * creates a new blank node using the network intern naming function 
   * (default: prompt)
   */
  createBlankNode() {
    var updatedIds =this.data.nodes.add([{
      label: 'new',
      //changed so that node starts at random pos inside viewport
      //absolutly destroys performance tho
      x:this.generateRandomPosition("x"),//x:this.network.params.pointer.canvas.x, //x: 0,
      y:this.generateRandomPosition("y"),//y:this.network.params.pointer.canvas.y //y: 0
      color: this.getRandomColour()
    }]);
   this.network.focus([updatedIds[0]],{animation: true});
   this.network.selectNodes([updatedIds[0]]);
   this.network.editNode();
  }

  /**
   * creates a new blank edge using the network intern naming function 
   * (default: prompt)
   */
  createBlankEdge() {
   this.network.addEdgeMode();
  }

  /**
  * log some information in the console. Only generates output if DEBUG mode is activated
  */
  showInfo() {
    if (DEBUG) {
      console.log("Next Node ID: ",this.nextNodeID)
      console.log("Next Edge ID: ",this.nextEdgeID)
      //console.log(this.network.data.nodes)
      console.log(this.data.nodes.get())
      //console.log(this.network.data.edges)
      console.log(this.data.edges.get())
    }
    else {
      console.log("[INFO] Debug mode not activated");
    }
  }

  /**
   * evaluate the current student network with the saved taskJsonFile
   */
  evaluate() {
    if (confirm("Are you sure you want to evaluate and finish working for now?")) {
      console.log("[NETWORK] entered evaluation")
      this.saveMap("student")
      
      var [nodesUsed, nodesPossible, nodesPercentage, edgesUsed, edgesPossible, edgesPercentage] = this.evaluatePercentages()
      console.log("nodesPercentage: " + nodesPercentage)
      console.log("edgesPercentage: " + edgesPercentage)

      var jsonFileObject = localStorage.getItem("taskjsonFile")
      var taskNetwork = JSON.parse(jsonFileObject)
      // create temporary dataSets for working with the data
      var taskNodes = new vis.DataSet(taskNetwork.nodes[0]);
      var taskEdges = new vis.DataSet(taskNetwork.edges[0])
      let taskData = {
        nodes: taskNodes,
        edges: taskEdges,
      }
      
      var jsonFileObject = localStorage.getItem("studentJsonFile")
      var studentNetwork = JSON.parse(jsonFileObject)
      // create temporary dataSets for working with the data
      var studentNodes = new vis.DataSet(studentNetwork.nodes[0])
      var studentEdges = new vis.DataSet(studentNetwork.edges[0])
      let studentData = {
        nodes: studentNodes,
        edges: studentEdges,
      }

      // correct the edges of the dataSets
      let correctEdges = []
      taskNetwork.edges[0].forEach(evaluateEdge)

      // colour every correct edge green
      for (let i = 0; i < correctEdges.length; i++) {
        var edgeID = correctEdges[i].id
        this.setEdgeColour(edgeID, "green")
      }
      

      var correctEdgesPercentage = correctEdges.length / taskData.edges.get().length
      console.log("Correct Edges Percentage: " + correctEdgesPercentage)
      var evaluationData = {
        "nodesUsed": nodesUsed,
        "nodesPossible": nodesPossible,
        "nodesPercentage": nodesPercentage,
        "edgesUsed": edgesUsed,
        "edgesPossible": edgesPossible,
        "edgesPercentage": edgesPercentage,
        "correctEdgesPercentage": correctEdgesPercentage,
      } 
      console.log(evaluationData)
      localStorage.setItem("evaluationData", JSON.stringify(evaluationData))
      alert("Evaluation Complete\n Node usage: "+nodesPercentage+" ("+nodesUsed+"/"+nodesPossible+")"+"\n Edge usage: "+edgesPercentage+" ("+edgesUsed+"/"+edgesPossible+")"+"\n Overall correctness: "+correctEdgesPercentage+" ("+correctEdges.length+"/"+taskData.edges.get().length+")"+"\n")

      /**
        * subfunction to compare task edges with the student's edges
        * @param {edgeObject} edge the task edge that is being compared
        */
      function evaluateEdge(edge) {
        // console.log(edge)
        var edgeFrom = taskData.nodes.get(edge.from).label
        var edgeTo = taskData.nodes.get(edge.to).label
        // console.log(edgeFrom, edgeTo)
    
        // compare the current edge with every edge that the student created
        studentNetwork.edges[0].forEach(function(i) {
          var iFrom = studentData.nodes.get(i.from).label 
          var iTo = studentData.nodes.get(i.to).label 
          if (i.label == edge.label && iFrom == edgeFrom && iTo == edgeTo) {
            console.log(i)
            correctEdges.push(i)
          }
        })
      }

    } else {
      console.log("[NETWORK] cancelled evaluation")
    }
  }


  /**
   * 
   * @returns the percentages of edges and nodes used by the student
   */
  evaluatePercentages() {
    // extract all labels from Task and Student work
    var [taskNodeLabels, taskEdgeLabels] = this.extractTaskLabels()
    var [studentNodeLabels, studentEdgeLabels] = this.extractStudentLabels()
    //console.log(taskNodeLabels, taskEdgeLabels)
    //console.log(studentNodeLabels, studentEdgeLabels)

    // create value for percentage of labels used
    let nodesPossible = taskNodeLabels.length
    let edgesPossible = taskEdgeLabels.length
    var nodesUsed = 0
    var edgesUsed = 0
    // iterate over task labels and compare if they are being used
    taskNodeLabels.forEach(compareStudentNodes)
    taskEdgeLabels.forEach(compareStudentEdges)
    
    function compareStudentNodes(item) {
      if (studentNodeLabels.includes(item)) {
        nodesUsed += 1;
      }
    }

    function compareStudentEdges(item) {
      if (studentEdgeLabels.includes(item)) {
        edgesUsed += 1;
        // remove the edge from the array so that they cannot be counted twice
        var index = studentEdgeLabels.indexOf(item)
        studentEdgeLabels.splice(index, 1)
      }
    }

    var nodesPercentage = nodesUsed / nodesPossible
    var edgesPercentage = edgesUsed / edgesPossible

    return [nodesUsed, nodesPossible, nodesPercentage, edgesUsed, edgesPossible, edgesPercentage]
  }

  /**
   * Changes the colour of the given EdgeID
   * @param {int} edgeID
   * @param {string} colourString
   */
  setEdgeColour(edgeID, colourString) {
    if (DEBUG) {
      console.log('[NETWORK][COLOUR] setting %s to new colour %s',edgeID,colourString)
    }
    this.data.edges.update({
      id: edgeID,
      color: colourString
    })
  }
}