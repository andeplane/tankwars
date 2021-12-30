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

function releaseBall() {
  //@ts-ignore
  var ball = this.matter.add.image(Phaser.Math.Between(32, 768), -200, 'balls', Phaser.Math.Between(0, 5));

  ball.setCircle();
  ball.setBounce(0.96);
}

const create: Phaser.Types.Scenes.SceneCreateCallback = function () {
  this.add.image(400, 300, 'sky');

  this.matter.world.setBounds(0, 0, 800, 600, 32, true, true, false, true);
  let path: number[] = []
  let x = 0

  // path = [
  //   0, -300,
  //   300, -200,
  //   500, -300,
  //   800, -100,
  //   800, 0,
  //   0, 0,
  // ]

  path.push(0, -100)
  const N = 10
  const dx = 800 / (N + 1)

  for (let i = 0; i < N; i++) {
    x += dx
    let y = -Math.floor(Math.random() * 200)
    path.push(x, y)
  }
  path.push(800, -100)
  path.push(800, 0)
  path.push(0, 0)
  console.log(path)

  const polygon = new Phaser.Geom.Polygon(path)
  const graphics = this.add.graphics({ x: 0, y: 600 });
  graphics.lineStyle(2, 0x00aa00);
  graphics.fillStyle(0x00aa00);
  graphics.fillPoints(polygon.points, true);
  const pathStr = path.join(" ")

  //@ts-ignore
  const verts = this.matter.verts.fromPath(pathStr, polygon)
  const centre = this.matter.verts.centre(verts)

  const obj = this.matter.add.fromVertices(centre.x, 600 + centre.y, verts, { ignoreGravity: true, isStatic: false }, true, 0.01, 10)
  obj.isStatic = true
  cursors = this.input.keyboard.createCursorKeys();
  var ball = this.matter.add.image(Phaser.Math.Between(0, 800), -1, 'balls', Phaser.Math.Between(0, 5));

  //@ts-ignore
  ball.setCircle();
  ball.setBounce(1.0);
  this.time.addEvent({ delay: 250, callback: releaseBall, callbackScope: this, repeat: 256 });
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