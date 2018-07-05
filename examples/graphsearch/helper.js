
// 对角线移动
export const  DiagonalMovement = {
  // 总是允许
  Always: 1,
  // 不允许
  Never: 2,
  IfAtMostOneObstacle: 3,
  OnlyWhenNoObstacles: 4
};

/**
 * Backtrace according to the parent records and return the path.
 * (including both start and end nodes)
 * @param {Node} node End node
 * @return {Array<Array<number>>} the path
 */
export function backtrace(node) {
  var path = [
    [node.x, node.y]
  ]
  while (node.parent) {
    node = node.parent;
    path.push([node.x, node.y]);
  }
  return path.reverse();
}