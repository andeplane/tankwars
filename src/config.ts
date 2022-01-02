import { MainScene } from 'scenes/MainScene';

// export const GameConfig: Phaser.Types.Core.GameConfig = {
//   title: 'Tank Wars',
//   url: 'https://andeplane.github.io/tankwars',
//   version: '1.0',
//   width: 800,
//   height: 600,
//   backgroundColor: 0x3a404d,
//   type: Phaser.AUTO,
//   parent: 'game',
//   physics: {
//     default: 'arcade',
//     arcade: {
//       gravity: { y: 200 }
//     }
//   },
//   scene: [MainScene]
// };

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