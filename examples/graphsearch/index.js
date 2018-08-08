import * as d3 from 'd3'
import { Node, Grid } from './grid'
import BreadthFirstFinder from './bfs'
import dijkastra from './dijkstra'

// https://vuejsexamples.com/
// https://codepen.io/shshaw/pen/vJNMQY
// https://greensock.com/svg-tips
import {
  TweenMax,
  TimelineMax
} from 'gsap'

// https://bost.ocks.org/mike/join/
var containerRect = document.querySelector('html').getBoundingClientRect()
const width = containerRect.width
const height = containerRect.height

class View {
  constructor(numRows, numCols, nodeSize = 30) {
    this.numRows = numRows
    this.numCols = numCols
    this.nodeSize = nodeSize
    this.nodeStyle = {
      // 白色
      normal: {
        'fill': '#fff',
        'stroke': '#000',
        'stroke-opacity': 0.2
      },
      // 偏绿色
      opened: {
        // fill: '#aaa',
        fill: '#98fb98',
        'stroke-opacity': 0.2
      },
      // 偏青色
      closed: {
        // fill: '#000',
        fill: '#afeeee',
        'stroke-opacity': 0.2
      }
    }
  }

  // https://stackoverflow.com/questions/15580300/proper-way-to-draw-gridlines
  // https://engineering.velocityapp.com/building-a-grid-ui-with-d3-js-v4-p1-c2da5ed016
  generateGridData() {
    let { numRows, numCols, nodeSize } = this
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

    let wrapper = row.selectAll(".wrapper")
      .data(function (d, index) {
        return d
      })
      .enter()
      .append("g")
      .attr('class', 'wrapper')
    
    wrapper
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

  // TODO:似乎不太容易和数据this.data关联上
  tweenNodes(operations) {
    let maxIndex = operations.length - 1
    let i = 0
    // let tl = new TimelineMax()
    while(operations.length) {
      let op = operations.shift()
      let x = op.x
      let y = op.y
      i++
      let styleObj = this.getStyle(op.attr)
      TweenMax.to(`#square${x}-${y}`, 1, { fill: styleObj.fill, delay: i / maxIndex * 8 })
      // tl.to(`#square${x}-${y}`, 0.1, { fill: styleObj.fill })
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

  // 设置起点
  static setStartPos(row, col) {
    this.setPos(row, col, '#00dd00')
  }

  // 设置终点
  static setEndPos(row, col) {
    this.setPos(row, col, '#ee4400')
  }

  static setPos(row, col, color) {
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
    
    // 必须先hook 
    this.hookPathFinding()

    // 生成gridgraph数据结构
    this.grid = new Grid(this.numRows, this.numCols)
    
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
    // bfs
    // let finder = new BreadthFirstFinder({ allowDiagonal: false })
    // this.path = finder.findPath(this.startX, this.startY, this.endX, this.endY, this.grid)
    // this.view.tweenNodes(this.operations)
    
    // dijkastra
    dijkastra(this.startX, this.startY, this.endX, this.endY, this.grid)
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
