import React from 'react';
import { GameComponent } from 'phaser-react-tools';
import { MainScene } from './mainscene';

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
};

const GameCanvas = (props) => {
	return (
		<GameComponent config={config} {...props}/>
	)
}

export default GameCanvas;