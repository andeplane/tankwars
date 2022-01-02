import { MainScene } from 'scenes/MainScene';

export const GameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  title: 'Tank Wars',
  url: 'https://andeplane.github.io/tankwars',
  width: 800,
  height: 600,
  physics: {
    default: 'matter',
    matter: {
      gravity: { y: 1 },
      debug: true
    }
  },
  scene: [MainScene]
}