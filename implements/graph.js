
function inArray(item, arr) {
  return arr.indexOf(item) > -1;
}

// let id = 0
// function nextid() {
//   return id++
// }

class GraphNode {
  constructor(name) {
    this.name = name
    // 邻接表 (不考虑入边)
    this.adjList = []
    // 权重 与 edges 序号对应
    this.weight = []
  }

  addEdge(v, weight = 1) {
    this.adjList.push(v)
    this.weight.push(weight)
  }
}

class GraphEdge {
  
}

/**
 * 图的邻接表表示方式(其中邻接表使用数组表示)
 * 
 * @param {boolean} directed 是否有向图
 */
class Graph {
  constructor(directed = false) {
    this.directed = directed
    this.vetices = Object.create(null)
  }

  /**
   * 添加结点
   */
  addVertex(v) {
    if (this.vetices[v]) {
      throw new Error('vertex "' + v + '" has already been added')
    }
    let vNode = new GraphNode(v)
    this.vetices[v] = vNode
    return vNode
  }
  
  /**
   * 添加边 
   */
  addEdge(u, v, weight) {
    let uNode = this.vetices[u]
    let vNode = this.vetices[v]
    if (!uNode) {
      uNode = this.addVertex(u)
    }

    if (!vNode) {
      vNode = this.addVertex(v)
    }

    uNode.addEdge(v, weight)
    if (!this.directed) {
      vNode.addEdge(u, weight)
    }
  }

  hasNode(v) {
    if (this.vetices[v]) {
      return true
    }

    return false
  }

  getNode(v) {
    return this.vetices[v]
  }

  hasEdge(u, v) {
    let ret = false
    let uNode = this.getNode(u)
    if (uNode && inArray(v, uNode.adjList)) {
      ret = true 
    }

    return ret
  }

  getEdgeWeight() {
    
  }
}



