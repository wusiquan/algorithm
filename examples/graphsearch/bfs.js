import {
  DiagonalMovement,
  backtrace
} from './helper.js'

/**
 * Breadth-First-Search path finder.
 * @constructor
 * @param {Object} opt
 * @param {boolean} opt.allowDiagonal Whether diagonal movement is allowed.
 *     Deprecated, use diagonalMovement instead.
 * @param {boolean} opt.dontCrossCorners Disallow diagonal movement touching
 *     block corners. Deprecated, use diagonalMovement instead.
 * @param {DiagonalMovement} opt.diagonalMovement Allowed diagonal movement.
 */
function BreadthFirstFinder(opt) {
  opt = opt || {};
  this.allowDiagonal = opt.allowDiagonal;
  this.dontCrossCorners = opt.dontCrossCorners;
  this.diagonalMovement = opt.diagonalMovement;

  if (!this.diagonalMovement) {
    if (!this.allowDiagonal) {
      this.diagonalMovement = DiagonalMovement.Never;
    } else {
      if (this.dontCrossCorners) {
        this.diagonalMovement = DiagonalMovement.OnlyWhenNoObstacles;
      } else {
        this.diagonalMovement = DiagonalMovement.IfAtMostOneObstacle;
      }
    }
  }
}

/**
 * Find and return the the path.
 * @return {Array<Array<number>>} The path, including both start and
 *     end positions.
 */
BreadthFirstFinder.prototype.findPath = function (startX, startY, endX, endY, grid) {
  var openList = []
  var diagonalMovement = this.diagonalMovement
  var startNode = grid.getNodeAt(startX, startY)
  var endNode = grid.getNodeAt(endX, endY)
  var neighbors
  var neighbor
  var node
  var i
  var l

  // push the start pos into the queue
  openList.push(startNode);
  startNode.opened = true;

  // while the queue is not empty
  while (openList.length) {
    // take the front node from the queue
    node = openList.shift();
    node.closed = true;

    // reached the end position
    if (node === endNode) {
      return backtrace(endNode);
    }

    neighbors = grid.getNeighbors(node, diagonalMovement);
    for (i = 0, l = neighbors.length; i < l; ++i) {
      neighbor = neighbors[i];

      // skip this neighbor if it has been inspected before
      if (neighbor.closed || neighbor.opened) {
        continue;
      }

      openList.push(neighbor);
      neighbor.opened = true;
      neighbor.parent = node;
    }
  }

  // fail to find the path
  return [];
};

export default BreadthFirstFinder