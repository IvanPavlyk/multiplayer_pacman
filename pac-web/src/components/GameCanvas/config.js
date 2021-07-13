import { MainScene } from './scenes/main';

const config = {
  width: 512,
  height: 512,
  render: {
    antialias: false,
    pixelArt: true,
    roundPixels: true
  },

  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 400 },
      debug: true
    }
  },
  scene: MainScene
}

export default config;