import Graph from './implements/graph'

// 虽然不是有向图，但每条边其实判断一次就可以了
let graph = new Graph(true)
graph.addVertex('a')
graph.addVertex('b')
graph.addVertex('c')
graph.addVertex('d')
graph.addVertex('e')
graph.addVertex('f')
graph.addVertex('g')

graph.addEdge('a', 'b', 4)
graph.addEdge('h', 'a', 8)
graph.addEdge('b', 'c', 8)
graph.addEdge('b', 'h', 11)
graph.addEdge('i', 'h', 7)
graph.addEdge('c', 'd', 7)
graph.addEdge('c', 'f', 4)
graph.addEdge('c', 'i', 2)

graph.addEdge('d', 'e', 9)
graph.addEdge('d', 'f', 14)
graph.addEdge('e', 'f', 10)
graph.addEdge('f', 'g', 2)
graph.addEdge('g', 'h', 1)

graph.addEdge('i', 'g', 6)


function makeSet(x) {
  x.p = null
  x.rank = 0
}

function union(x, y) {
  link(findSet(x), findSet(y))
}

function link(x, y) {
  if (x.rank > y.rank) {
    y.p = x
  } else {
    // == 随便所以可以随 < 时的情况
    x.p = y
    if (x.rank == y.rank) {
      y.rank = x.rank + 1
    }
  }
}

// 带路径压缩的findSet
function findSet(x) {
  if (x.p != null) {
    x.p = findSet(x.p)
  }

  let ret = x.p
  
  if (ret == null) {
    ret = x
  }

  return ret
}

function kruskal(graph) {
  let nodes = graph.vetices
  
  // 对结点处理
  for (let i in nodes) {
    let node = nodes[i]
    makeSet(node)
  }

  // 对边处理
  let edges = graph.edges
  let edgesArr = []

  for (let i in edges) {
    let edge = edges[i]
    edgesArr.push(edge)
  }

  edgesArr.sort((a, b) => {
    return a.weight - b.weight
  })

  // 
  let a = [] 
  edgesArr.forEach((edge) => {
    let startNode = graph.getNode(edge.startv)
    let endNode = graph.getNode(edge.endv)
    if (findSet(startNode) != findSet(endNode)) {
      a.push(edge)
      union(startNode, endNode)
    }
  })

  return a
}

let t = kruskal(graph)
console.log(t)