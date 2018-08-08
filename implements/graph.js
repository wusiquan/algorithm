
class GraphNode {
  constructor(name) {
    this.name = name

    // 邻接表 (不考虑入边)
    this.adjList = []
    // 权重 与 邻接表中顶点序号对应
    this.weight = []
  }

  addEdge(v, weight = 1) {
    this.adjList.push(v)
    this.weight.push(weight)
  }
}

class GraphEdge {
  constructor(startv, endv, weight = 0) {
    this.startv = startv
    this.endv = endv
    this.weight = weight
  }

  static getKey(startv, endv) {
    return startv + '_' + endv
  }
}

/**
 * 图的邻接表表示方式(其中邻接表使用数组表示)
 */
export default class Graph {
  constructor(directed = false) {
    this.vetices = {}
    this.edges = {}
    this.directed = directed
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

    let edgeKey = GraphEdge.getKey(u, v)
    if (this.edges[edgeKey]) {
      throw new Error('Edge ' + edgeKey + ' has already been added before')
    } else {
      this.edges[edgeKey] = new GraphEdge(u, v, weight) 
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
    // 效率不高...
    // let uNode = this.getNode(u)
    // if (uNode && inArray(v, uNode.adjList)) {
    //   ret = true 
    // }

    if (this.edges[GridEdge.getKey(u, v)]) {
      return true
    }
    
    return false
  }

  getEdge(u, v) {
    return this.edges[GridEdge.getKey(u, v)]
  }
}