import PriorityQ from 'es6-priorityqueue'
import Graph from '../../implements/graph'

// 图和算法导论P368保持一致
let graph = new Graph()
graph.addVertex('a')
graph.addVertex('b')
graph.addVertex('c')
graph.addVertex('d')
graph.addVertex('e')
graph.addVertex('f')
graph.addVertex('g')
graph.addVertex('h')
graph.addVertex('i')

graph.addEdge('a', 'b', 4)
graph.addEdge('a', 'h', 8)
graph.addEdge('b', 'c', 8)
graph.addEdge('b', 'h', 11)
graph.addEdge('c', 'i', 2)
graph.addEdge('c', 'f', 4)
graph.addEdge('c', 'd', 7)
graph.addEdge('d', 'e', 9)
graph.addEdge('d', 'f', 14)
graph.addEdge('e', 'f', 10)
graph.addEdge('f', 'g', 2)
graph.addEdge('g', 'i', 6)
graph.addEdge('g', 'h', 1)
graph.addEdge('h', 'i', 7)

function prim() {
  let vetices = graph.vetices
  let nodes = []

  for (let i in vetices) {
    let node = vetices[i]
    // 这里设置了一个
    node.key = 1000
    node.parent = null
    nodes.push(node)
  }

  nodes[0].key = 0

  let q = new PriorityQ(nodes, {
    comparator(a, b) {
      return a.key - b.key
    }
  })
  
  while(!q.isEmpty()) {
    let uNode = q.extract()
    
    for (let i = 0; i < uNode.adjList.length; i++) {
      let v = uNode.adjList[i]
      let uvEdge = graph.getEdge(uNode.name, v)
      let uvWeight = uvEdge.weight
      
      if (isInQ(v, q) && uvWeight < vetices[v].key) {
        vetices[v].parent = uNode
        vetices[v].key = uvWeight
        q.updateItem(vetices[v])
      }
    }
  }
}

function isInQ(name, q) {
  let heapArr = q.strategy.heap._heapArr
  let result = false

  for (let i = 0; i < heapArr.length; i++) {
    let graphNode = heapArr[i]
    if (graphNode.name == name) {
      result = true
      break
    }
  }

  return result
}

prim()