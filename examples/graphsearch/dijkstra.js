import {
  DiagonalMovement,
  backtrace
} from './helper.js'
import PriorityQ from 'es6-priorityqueue'

export default function dijkstra(startX, startY, endX, endY, grid) {
  let startNode = grid.getNodeAt(startX, startY)
  let endNode = grid.getNodeAt(endX, endY)

  let openList = new PriorityQ([ startNode ], {
    comparator: (nodeA, nodeB) => {
      if (nodeA.g === nodeB.g) return 0
      return nodeA.g < nodeB.g ? -1 : 1
    }
  })

  startNode.opened = true
  startNode.g = 0

  while(!openList.isEmpty()) {
    let node = openList.extract()
    node.closed = true
    // get neigbours of the current node
    let neighbors = grid.getNeighbors(node, DiagonalMovement.Never)

    // if reached the end position, construct the path and return it
    if (node === endNode) {
      return backtrace(endNode)
    }

    for (let i = 0, l = neighbors.length; i < l; ++i) {
      let neighbor = neighbors[i]
      
      if (neighbor.closed) {
        continue
      }
      
      // let x = neighbor.x
      // let y = neighbor.y
      
      let g = node.g + 1
      // 相当于relax
      if (!neighbor.opened || g < neighbor.g) {
        neighbor.g = g
        neighbor.parent = node

        if (!neighbor.opened) {
          openList.insert(neighbor)
          neighbor.opened = true
        } else {
          openList.changeValue(neighbor)
        }
      }
    } // end for each neighbor
  } // end while not open list empty

  // fail to find the path
  return []
}