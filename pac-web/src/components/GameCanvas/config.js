import Phaser from "phaser";
import { MainScene } from "./scenes/main";
const game = {
  width: 800,
  height: 800,
  type: Phaser.AUTO,
  pixelArt: true,
  physics: {
    default: 'arcade',
    arcade: {
        //gravity: { y: -300 },
        debug: false
    }
  },
  scene: MainScene,
};

export default game;
