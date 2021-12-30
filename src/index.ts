import Phaser from 'phaser'
import 'index.css'
type GameObjectWithBody = Phaser.Types.Physics.Arcade.GameObjectWithBody
let cursors: Phaser.Types.Input.Keyboard.CursorKeys

const preload: Phaser.Types.Scenes.ScenePreloadCallback = function () {
  this.load.image('sky', 'assets/sky.png');
  this.load.image('ground', 'assets/platform.png');
  this.load.image('star', 'assets/star.png');
  this.load.image('bomb', 'assets/bomb.png');
  this.load.spritesheet('balls', 'assets/balls.png', { frameWidth: 17, frameHeight: 17 });
  this.load.spritesheet('dude',
    'assets/dude.png',
    { frameWidth: 32, frameHeight: 48 }
  );
}

const calculateArea = (vertices: Phaser.Geom.Point[], signed: boolean) => {
  let area = 0
  let j = vertices.length - 1;

  for (var i = 0; i < vertices.length; i++) {
    // area += (vertices[j].x - vertices[i].x) * (vertices[j].y + vertices[i].y);
    area += vertices[i].x * vertices[j].x - vertices[j].x * vertices[j].y
    j = i;
  }

  if (signed)
    return area / 2;

  return Math.abs(area) / 2;
}

const create: Phaser.Types.Scenes.SceneCreateCallback = function () {
  this.add.image(400, 300, 'sky');

  this.matter.world.setBounds(0, 0, 800, 600, 32, true, true, false, true);
  let path: number[] = []
  let x = 0

  path = [
    0, -300,
    300, -400,
    500, -300,
    800, -100,
    800, 0,
    0, 0,
  ]
  // path.push(0, -300)
  // const N = 3
  // const dx = 800 / (N + 1)
  // for (let i = 0; i < N; i++) {
  //   x += dx
  //   let y = -Math.floor(Math.random() * 200)
  //   path.push(x, y)
  // }
  // // path.push(800, -150)
  // path.push(800, 0)
  // path.push(0, 0)
  console.log(path)

  const polygon = new Phaser.Geom.Polygon(path)
  const graphics = this.add.graphics({ x: 0, y: 600 });
  graphics.lineStyle(2, 0x00aa00);
  graphics.fillStyle(0x00aa00);
  graphics.fillPoints(polygon.points, true);
  const pathStr = path.join(" ")
  console.log(polygon.points)
  //@ts-ignore
  // this.matter.add.gameObject(polygon, { shape: { type: 'fromVerts', verts: path, flagInternal: true } })

  // const body = this.matter.add.polygon(0, 0, path.length - 1, 0, { isStatic: true })
  const verts = this.matter.verts.fromPath(pathStr, polygon)
  console.log("CENTRE: ", this.matter.verts.centre(verts))


  let xMax = -1
  let yMax = -1
  let xMin = Infinity
  let yMin = Infinity

  let xSum = 0
  let ySum = 0
  let xSum1 = 0
  let ySum1 = 0
  const area = calculateArea(polygon.points, true)
  polygon.calculateArea()
  let centreX = 0
  let centreY = 0
  for (let i = 0; i < polygon.points.length; i++) {
    const p1 = polygon.points[i]
    const p2 = polygon.points[(i + 1) % polygon.points.length]
    // console.log("p2: ", p2)

    const x1 = p1.x
    const y1 = p1.y

    const x2 = p2.x
    const y2 = p2.y

    xSum1 += p1.x
    ySum1 += p1.y

    const cross = (p1.x * p2.y) - (p1.y * p2.x);
    const tempX = (p1.x + p2.x) * cross
    const tempY = (p1.y + p2.y) * cross
    // console.log("Cross: ", cross)
    centreX += tempX
    centreY += tempY
    // console.log("temp: ", centreX, centreY)

    xSum += (x1 + x2) * (x1 * y2 - x2 * y1)
    ySum += (y1 + y2) * (x1 * y2 - x2 * y1)
    xMax = Math.max(xMax, Math.max(x1, x2))
    xMin = Math.min(xMin, Math.min(x1, x2))
    yMax = Math.max(yMax, Math.max(y1, y2))
    yMin = Math.min(yMin, Math.min(y1, y2))
  }
  centreX /= 6 * area
  centreY /= 6 * area
  console.log("centre: ", centreX, centreY)

  xSum1 += polygon.points[polygon.points.length - 1].x
  ySum1 += polygon.points[polygon.points.length - 1].y

  xSum1 /= polygon.points.length
  ySum1 /= polygon.points.length
  console.log("COM1: ", xSum1, ySum1)

  xSum /= 6 * polygon.area
  ySum /= 6 * polygon.area
  console.log("COM2: ", xSum, ySum)


  // const obj = this.matter.add.fromVertices(341, 600 - 108, verts, { ignoreGravity: true, isStatic: true }, true, 0.01, 10)
  const obj = this.matter.add.fromVertices(xSum, 600 + ySum, verts, { ignoreGravity: true, isStatic: true }, true, 0.01, 10)

  // obj.position.x += obj.centerOffset.x
  // obj.position.y = 600 + obj.centerOffset.y
  //@ts-ignore
  window.obj = obj
  // console.log(obj)

  cursors = this.input.keyboard.createCursorKeys();
  var ball = this.matter.add.image(Phaser.Math.Between(0, 800), -1, 'balls', Phaser.Math.Between(0, 5));
  //@ts-ignore
  ball.setCircle();
  ball.setBounce(1.0);

}

const update: Phaser.Types.Scenes.SceneUpdateCallback = function () {

}

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: 'matter',
    matter: {
      gravity: { y: 1 },
      debug: true
    }
  },
  scene: {
    preload: preload,
    create: create,
    update: update,
  }
};

const game = new Phaser.Game(config)

export default game;