import * as d3 from 'd3'
import { Node, Grid } from './grid'
import BreadthFirstFinder from './bfs'

// https://vuejsexamples.com/
// https://codepen.io/shshaw/pen/vJNMQY
// https://greensock.com/svg-tips
import {
  TweenMax
} from 'gsap'

// https://bost.ocks.org/mike/join/
var containerStyle = document.querySelector('html').getBoundingClientRect();
const width = containerStyle.width
const height = containerStyle.height

class View {
  constructor(numRows, numCols, nodeSize = 30) {
    this.numRows = numRows
    this.numCols = numCols
    this.nodeSize = nodeSize
    this.nodeStyle = {
      normal: {
        'fill': '#fff',
        'stroke': '#000',
        'stroke-opacity': 0.2
      },
      opened: {
        fill: '#98fb98',
        'stroke-opacity': 0.2
      },
      closed: {
        fill: '#afeeee',
        'stroke-opacity': 0.2
      }
    }
  }

  // https://stackoverflow.com/questions/15580300/proper-way-to-draw-gridlines
  // https://engineering.velocityapp.com/building-a-grid-ui-with-d3-js-v4-p1-c2da5ed016
  generateGridData() {
    let {
      numRows,
      numCols,
      nodeSize
    } = this
    let xPos = 0.5
    let yPos = 0.5
    let data = []
    for (let j = 0; j < numRows; j++) {
      data.push([])
      for (let i = 0; i < numCols; i++) {
        data[j].push({
          x: xPos,
          y: yPos,
          width: nodeSize,
          height: nodeSize
        })
        xPos += nodeSize
      }
      xPos = 0.5
      yPos += nodeSize
    }
    return data
  }

  generateGrid() {
    this.data = this.generateGridData()
    let normalStyle = this.nodeStyle.normal

    let svg = d3.select("#container")
      .append('svg')
      .attr('xmlns', 'http://www.w3.org/2000/svg')
      .attr('version', '1.1')
      .attr('width', width)
      .attr('height', height)

    let row = svg.selectAll(".row")
      .data(this.data)
      .enter().append("g")
      .attr("class", 'row')
    // console.log(this.nodeStyle.normal)

    let column = row.selectAll(".square")
      .data(function (d) {
        return d;
      })
      .enter()
      .append("g")
      .attr('class', 'column')
    
    column
      .append('rect')
      .attr('class', 'square')
      .attr('id', (d, i) => {
        let row = (d.y - 0.5) / this.nodeSize
        return `square${row}-${i}`
      })
      .attr('x', function (d) {
        return d.x;
      })
      .attr('y', function (d) {
        return d.y;
      })
      .attr('width', function (d) {
        return d.width;
      })
      .attr('height', function (d) {
        return d.height;
      })
      .style('fill', normalStyle.fill)
      .style('stroke', normalStyle.stroke)
      .style('stroke-opacity', normalStyle['stroke-opacity'])
      .style('stroke-width', 1)
  }

  tweenNodes(operations) {
    let i = 0
    while(operations.length) {
      let op = operations.shift()
      let x = op.x
      let y = op.y
      i++
      let styleObj = this.getStyle(op.attr)
      TweenMax.to(`#square${y}-${x}`, 0.5, { fill: styleObj.fill, delay: i * 0.1 })
    }
  }

  getStyle(attr) {
    let styleObj
    switch(attr) {
      case 'closed':
        styleObj = this.nodeStyle.closed
        break

      case 'opened':
        styleObj = this.nodeStyle.opened
        break
      
        default:
        console.error('unsupported operation: ' + attr)
        return;
    }

    return styleObj
  }

  static setStartPos(row, col) {
    this.setPos(col, row, '#00dd00')
  }

  static setEndPos(row, col) {
    this.setPos(col, row, '#ee4400')
  }

  static setPos(col, row, color) {
    d3.select(`#square${row}-${col}`)
      .transition()
      .duration(500)
      .style('fill', color)
  }
}

class Controller {
  // https://bl.ocks.org/cagrimmett/07f8c8daea00946b9e704e3efcbd5739
  constructor() {
    let nodeSize = 30
    this.numRows = Math.ceil(height / nodeSize)
    this.numCols = Math.ceil(width / nodeSize)
    
    let gridGraph = this.createGridGraph()

    this.view = new View(this.numRows, this.numCols, nodeSize)
    this.view.generateGrid()
  }

  // 设置起点位置
  setStartPos(gridX, gridY) {
    this.startX = gridX
    this.startY = gridY
    View.setStartPos(gridX, gridY)
  }

  // 设置终点位置
  setEndPos(gridX, gridY) {
    this.endX = gridX
    this.endY = gridY
    View.setEndPos(gridX, gridY)
  }

  // 生成gridgraph数据结构
  createGridGraph() {
    this.hookPathFinding()
    this.grid = new Grid(this.numRows, this.numCols)
  }

  /**
   * Define setters and getters of PF.Node, then we can get the operations
   * of the pathfinding.
   */
  hookPathFinding() {
    let self = this
    Node.prototype = {
      get opened() {
        return this._opened;
      },
      set opened(v) {
        this._opened = v;
        self.operations.push({
          x: this.x,
          y: this.y,
          attr: 'opened',
          value: v
        });
      },
      get closed() {
        return this._closed;
      },
      set closed(v) {
        this._closed = v;
        self.operations.push({
          x: this.x,
          y: this.y,
          attr: 'closed',
          value: v
        });
      },
      get tested() {
        return this._tested;
      },
      set tested(v) {
        this._tested = v;
        self.operations.push({
          x: this.x,
          y: this.y,
          attr: 'tested',
          value: v
        });
      },
    };

    this.operations = [];
  }

  search() {
    let finder = new BreadthFirstFinder({ allowDiagonal: false })
    this.path = finder.findPath(this.startX, this.startY, this.endX, this.endY, this.grid)
    
    this.view.tweenNodes(this.operations)
  }
}

let controller = new Controller()
controller.setStartPos(10, 10)
controller.setEndPos(10, 15)

setTimeout(() => {
  controller.search()
}, 1000)





// var p = d3.path()
// p.moveTo(100, 100)
// p.lineTo(200, 100)
// p.lineTo(200, 200)
// p.lineTo(100, 200)
// p.closePath()

// var rectGraph = svg.append("path")
//   .attr("d", p)
//   .attr("stroke", "blue")
//   .attr("stroke-width", 1.0)
//   .attr("fill", "none")