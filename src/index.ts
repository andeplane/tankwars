import phaser from 'phaser';
import { GameConfig } from './config';

export class Game extends Phaser.Game { }

window.addEventListener('load', () => {
  const game = new Game(GameConfig);
});