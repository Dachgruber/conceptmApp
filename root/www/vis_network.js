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
function DeleteNode(name){

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
function DeleteEdge(name, fromNode, toNode){
  
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
 * imports a json file to create a new network
 */
function ImportMap(jsonPath){

}

/**
 * exports the current network to a json file
 */
function ExportMap(){
  return jsonFile
}
