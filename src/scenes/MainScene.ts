import Phaser from 'phaser'

export class MainScene extends Phaser.Scene {
  private cursors?: Phaser.Types.Input.Keyboard.CursorKeys

  constructor() {
    super({ key: 'MainScene' });
  }

  releaseBall(): void {
    const ball = this.matter.add.image(Phaser.Math.Between(32, 768), -200, 'balls', Phaser.Math.Between(0, 5));
    ball.setCircle(5.0)
    ball.setBounce(0.96);
  }

  preload(): void {
    this.load.setBaseURL(window.location.href)
    this.load.path = 'assets/'
    this.load.image('sky', 'sky.png');
    this.load.image('ground', 'platform.png');
    this.load.image('star', 'star.png');
    this.load.image('bomb', 'bomb.png');
    this.load.spritesheet('balls', 'balls.png', { frameWidth: 17, frameHeight: 17 });
    this.load.spritesheet('dude',
      'dude.png',
      { frameWidth: 32, frameHeight: 48 }
    );
  }

  create(): void {
    this.cursors = this.input.keyboard.createCursorKeys();

    this.add.image(400, 300, 'sky');

    this.matter.world.setBounds(0, 0, 800, 600, 32, true, true, false, true);
    let path: number[] = []
    let x = 0

    // path = [
    //   0, -300,
    //   100, -200,
    //   200, -300,
    //   300, -200,
    //   400, 0,
    //   500, -200,
    //   600, -400,
    //   700, -200,
    //   800, -400,
    //   800, 0,
    //   0, 0,
    // ]

    path.push(0, -100)
    const N = 8
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
    this.time.addEvent({ delay: 2500, callback: this.releaseBall, callbackScope: this, repeat: 256 });
  }
}