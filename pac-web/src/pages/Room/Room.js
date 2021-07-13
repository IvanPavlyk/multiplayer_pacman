import React, { useState } from 'react';
import GameCanvas from 'components/GameCanvas';

const Room = () => {
	return (
		<div>
			<p>This is the lobby</p>

			<GameCanvas>
				{/* Interactive UI stuff here */}
			</GameCanvas>
		</div>
	)
}

export default Room;