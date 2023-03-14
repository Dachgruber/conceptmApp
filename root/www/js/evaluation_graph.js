/**
 * EvaluationGraphs are a simple (and somewhat repurposed) implementation of the vis.js graph2D API, 
 * which builds upon the vis-timeline foundation.  It provides very basic support for adding simple, 
 * x/y points to a graph based on LIFO
 * 
 * As for our purposes, no time-data-relation is needed(but graph2D is based on timeline). This means we correlate each
 * new data entry to a new point of time and hide the time axis.
 *  
 * I am extremly sorry for anyone trying to use this, but the usage of vis.graph2D was a somewhat rushed decision
 * based on the fact that our project already implemented vis.DataSet and network, and that the due-date comes up real soon.
 * 
 * @author Cornelius Brütt
 * @version 0.1 
 */
//Note: The creation process of this API is very similar 
//to the process of the vis_network.js API. Therefore, not many
//comments are given

//let DEBUG = true; //specify if debug console output should be generated

class EvaluationGraph{
    CONTAINER_ID = 'visualization';

    BASE_TIME = new Date("2023-03-12");

    /**
     * creates a new graph in CONTAINER_ID using the (optional given) options.
     * If options = false, use some default values.
     *  
     * @param {vis graph2D options} options 
     */
    constructor(options) {
        //we use this variable to keep track of the next free space
        this.nextFreeSpace = 0;

        //the container the graph will be displayed at
        this.container = document.getElementById(this.CONTAINER_ID);

        //if no options were given, use the default
        if(!options){
            this.options = this._generateDefaultOptions();
        } else {
            this.options = options;
        }

        //starting data should always be empty
        this.data = new vis.DataSet([]);
        console.log("BEFORE GRAPH INITIALISED")

        //finally, create the graph
        this.graph = new vis.Graph2d(this.container, this.data, this.options)
        console.log("GRAPH INITIALISED")
    }

    /**
     * generates some default option values for use of the evaluation Graph
     * @returns options array
     */
    _generateDefaultOptions() {
        var options = {
            style:'bar',
            barChart: {width:50, align:'center'}, // align: left, center, right
            drawPoints: false,
            dataAxis: {
                icons: false,
                //visible: false
            },
            height: '100%',
            orientation:'top',
            showMajorLabels: false,
            showMinorLabels: false,
            start: this.BASE_TIME,
            showCurrentTime: false
        };
        return options;
    }

    /**
     * adds a new data point with bar to the graph.
     * The x-value gets set automatically
     * @param {int} yValue 
     */
    addBar(yValue) {
        //save the current space, as getXValue will increase it after computing
        let currentSpace = this.nextFreeSpace;
        let xValue = this._getXValue();
        this.data.add({id: currentSpace, x: xValue, y: yValue});
        this.graph.fit();

    }

    /**
     * this computes a new date out of the nextFreeSpace
     * 
     * @returns date object of the next free xValue
     */
    _getXValue() {
        //clone the BASE_TIME so we base everything from the same foundation
        //then, add 1 hour for every nextFreeSpace so that the xValues are each
        //one hour apart
        let newXValue = new Date(this.BASE_TIME.getTime() + (this.nextFreeSpace*60*60*1000));
        if (DEBUG) {
            console.log("[EVGRAPH] computed xValue: %s",newXValue);
        }
        //also increase, as this space is now occupied
        this.nextFreeSpace++
        return newXValue;

    }

    /**
     * removes the last Bar of the graph and marks this slot as now free
     */
    removeBar() {
        this.nextFreeSpace--;
        this.data.remove(this.nextFreeSpace);
        this.graph.fit();

    }

    /**
     * resets the whole graph to be empty again. 
     * No windows recycle bin on this one tho!
     */
    resetGraph() {
        this.nextFreeSpace = 0;
        this.data.clear();
    }

}

