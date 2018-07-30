import Phaser from 'phaser'
import EasyStar from 'easystarjs'

class Game extends Phaser.Scene {
  constructor() {
    super({
      key: 'Game'
    })
  }

  preload() {
    this.load.image('tileset', 'assets/gridtiles.png')
    this.load.tilemapTiledJSON('map', 'assets/map.json')
    this.load.image('phaserguy', 'assets/phaserguy.png')
  }

  create() {
    // Handles the clicks on the map to make the character move
    this.input.on('pointerup', this.handleClick, this)

    let camera = this.camera = this.cameras.main
    camera.setBounds(0, 0, 20 * 32, 20 * 32)

    let player = this.player = this.add.image(32, 32, 'phaserguy')
    player.setDepth(1)
    player.setOrigin(0, 0.5)
    camera.startFollow(player)

    // 地图
    let map = this.map = this.make.tilemap({
      key: 'map'
    })
    let tiles = map.addTilesetImage('tiles', 'tileset')
    let layer = map.createStaticLayer(0, tiles, 0, 0)

    // 鼠标marker
    let marker = this.marker = this.add.graphics()
    marker.lineStyle(3, 0xffffff, 1)
    marker.strokeRect(0, 0, map.tileWidth, map.tileHeight)

    // ### Pathfinding stuff ###
    // Initializing the pathfinder
    let finder = new EasyStar.js()
    this.finder = finder
    // We create the 2D array representing all the tiles of our map
    var grid = []
    for (let y = 0; y < map.height; y++) {
      var col = []
      for (let x = 0; x < map.width; x++) {
        col.push(this.getTileID(x, y))
      }
      grid.push(col)
    }
    
    finder.setGrid(grid)

    // 这个tileset === tiles
    let tileset = map.tilesets[0]
    // 这是用户在tile创建时自己加的属性
    let properties = tileset.tileProperties

    // for (let i = tileset.firstgid - 1; i < tiles.total; i++) {
    let acceptableTiles = [1, 58, 72, 30]
    finder.setAcceptableTiles(acceptableTiles)

    acceptableTiles.forEach((tileType, i) => {
      let cost = i + 1
      finder.setTileCost(tileType, cost)
    })

  }

  update() {
    let { map, marker } = this
    let worldPoint = this.input.activePointer.positionToCamera(this.cameras.main)
    
    let pointerTileX = map.worldToTileX(worldPoint.x)
    let pointerTileY = map.worldToTileY(worldPoint.y)
    marker.x = map.tileToWorldX(pointerTileX)
    marker.y = map.tileToWorldY(pointerTileY)

    marker.setVisible(!this.checkCollision(pointerTileX, pointerTileY))
  }

  checkCollision(x, y) {
    // ???
    if (x > 0) {
      var tile = this.map.getTileAt(x, y)
      return tile.properties.collide === true
    }
  }

  getTileID(x, y) {
    let tile = this.map.getTileAt(x, y)
    return tile.index
  }

  handleClick(pointer) {
    let x = pointer.x
    let y = pointer.y

    var toX = Math.floor(x / 32)
    var toY = Math.floor(y / 32)
    var fromX = Math.floor(this.player.x / 32)
    var fromY = Math.floor(this.player.y / 32)

    this.finder.findPath(fromX, fromY, toX, toY, (path) => {
      if (path) {
        this.moveCharacter(path)
      }
    })

    this.finder.calculate()
  }

  moveCharacter(path) {
    let { map, player } = this
   
    let tweens = []
    let len = path.length
    for (var i = 0; i < len - 1; i++) {
      var ex = path[i + 1].x
      var ey = path[i + 1].y
      tweens.push({
        x: {
          value: ex * map.tileWidth,
          duration: 200
        },
        y: {
          value: ey * map.tileHeight,
          duration: 200
        }
      })
    }

    this.tweens.timeline({
      tweens: tweens,
      targets: player,
    })
  }
}

let config = {
  type: Phaser.AUTO,
  width: 20 * 32,
  height: 20 * 32,
  scene: [Game],
  parent: 'container'
}

let game = new Phaser.Game(config)