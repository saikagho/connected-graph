import React, { Component } from 'react'
import GraphList from './graphList'
import GraphItems from './graphItems'

import './App.css';

class App extends Component {
  inputElement = React.createRef()
  state = {
    items: [],
    graphStatus: [],
    currentItem: {
      text: '',
      key: '',
    },
  }

  graphConnColorableFunc = async (comp, comnNode) => {
    if ((comp === 1) && (comnNode === false)) {
      return "Is a connected and red-blue colorable graph"
    } else if (comp > 1) {
      return "Is not a connected graph"
    } else if ((comp === 1) && (comnNode === true)) {
      return "Is a connected graph, but not red blue colorable"
    } else {
      return ""
    }
  }

  inputProcessing = (obj) => {
    const val = (obj[obj.length-1].text)
    const sides = val.trim().replaceAll(" ", "").split(",");
    const nodes = sides.map(side => side.replaceAll("-", "").split(""))
    return nodes;
  }

  cmnNode = (key, val) => {
    return (val[0].includes(key[key.length-1]) && val[val.length-1].includes(key[0]))
  }

  splitArrayIntoChunksOfLen = (arr, len = 2) => {
    var chunks = [], i = 1, n = arr.length;
    while (i < n) {
      chunks.push(arr.slice(i-1, i += len-1)) ;
    }
    return chunks;
  }

  buildAdjList = async(edges) => {
    const adjList = {}  
    for (let edge of edges) {
      let [src, dest] = edge;
      adjList[src] = adjList[src] === undefined ? [dest] : adjList[src].concat(dest)
      adjList[dest] = adjList[dest] === undefined ? [src] : adjList[dest].concat(src)
    }
    return adjList
  }

  bfs = (node, adjList, visited) => {
    const queue = [node];
    visited[node] = true;
    while(queue.length) {
      let curNode = queue.shift();
      for (let neighbor of adjList[curNode]) {
        if(!visited[neighbor]) {
          visited[neighbor] = true
          queue.push(neighbor)
        }
      }
    }
  }
  
  deleteItem = key => {
    const filteredItems = this.state.items.filter(item => {
      return item.key !== key
    })
    this.setState({
      items: filteredItems,
    })
  }

  handleInput = e => {
    const itemText = e.target.value
    const currentItem = { text: itemText, key: Date.now() }
    this.setState({
      currentItem,
    })
  }

  addItem = async(e) => {
    e.preventDefault()
    const newItem = this.state.currentItem

    if (newItem.text !== '') {
      const items = [...this.state.items, newItem]
      let visited = {}, numComponents = 0;
      let nodesArray = this.inputProcessing(items);
      nodesArray = nodesArray.map((e) => (e.length > 2)  ? this.splitArrayIntoChunksOfLen(e): e);
      nodesArray = nodesArray.length === 1 ? nodesArray[0] : nodesArray;
      
      const adjList = await this.buildAdjList(nodesArray)
      const grpArrVal = Object.values(adjList)
      const grpArrKey = Object.keys(adjList)
      const comnNode = this.cmnNode(grpArrKey, grpArrVal);

      for (let vertex=0; vertex<grpArrKey.length; vertex++){
          if(!visited[grpArrKey[vertex]]) {
            numComponents = numComponents + 1;
            this.bfs(grpArrKey[vertex], adjList, visited);
          }
      }
      
      const graphStatus = [...this.state.graphStatus, await this.graphConnColorableFunc(numComponents, comnNode)]

      this.setState({
        items: items,
        graphStatus: graphStatus,
        currentItem: { text: '', key: '' },
      })
    }
  }

  render() {
    return (
      <div>
        <div className="section1">
          <GraphList
            addItem={this.addItem}
            inputElement={this.inputElement}
            handleInput={this.handleInput}
            currentItem={this.state.currentItem}
          />
        </div>
        <div className="section2">
          <GraphItems entries={this.state.items} status={this.state.graphStatus} deleteItem={this.deleteItem} />
        </div>
      </div>
    )
  }
}

export default App
