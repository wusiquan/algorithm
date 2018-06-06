// BFS
export default function bfs(graph, s) {
  // 这里用js的数组模拟队列
  let q = [ s ]
  let _visited = { s: true }

  let u
  let v
  let uNode
  let vNode
  let uAdjList

  let sNode = graph.getNode(s)
  sNode.d = 0
  sNode.prev = null

  while (q.length) {
    u = q.shift()
    uNode = graph.getNode(u)
    uAdjList = uNode.adjList
    for (let i = 0; i < uAdjList.length; i++) {
      v = uAdjList[i]
      if (!_visited[v]) {
        vNode = graph.getNode(v)
        vNode.d = uNode.d + 1
        vNode.prev = u
        _visited[v] = true
        q.push(v)
      }
    }
  }
}


// let graph = new Graph()
// graph.addEdge('r', 's')
// graph.addEdge('r', 'v')
// graph.addEdge('s', 'w')
// graph.addEdge('w', 't')
// graph.addEdge('w', 'x')
// graph.addEdge('t', 'u')
// graph.addEdge('t', 'x')
// graph.addEdge('x', 'u')
// graph.addEdge('x', 'y')
// graph.addEdge('u', 'y')

// bfs(graph, 's')

// function dfs() {}

// function dijkstra() {
// }