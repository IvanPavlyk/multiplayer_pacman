import React from 'react';
import { GameComponent } from 'phaser-react-tools';
import config from './config';

const GameCanvas = (props) => (
	<GameComponent config={config} {...props}/>
)

export default GameCanvas;