import React, { useState } from 'react';
import GameCanvas from 'components/GameCanvas';

const Lobby = () => {
	return (
		<div>
			<p>This is the lobby</p>

			<GameCanvas>
				{/* Interactive UI stuff here */}
			</GameCanvas>
		</div>
	)
}

export default Lobby;