import { Room, Delayed, Client } from 'colyseus';
import Player from '../schema/entities/Player';
import GameState from '../schema/GameState';

class GameRoom extends Room<GameState> {
	maxClients = 6;

	onCreate(options) {
		this.setState(new GameState());

		/* event listeners */
		this.onMessage('PLAYER_READY', (client, message) => {
			const player = this.state.players.get(client.id);
			player.ready = !player.ready;
			console.log(message)
		})
	}

	onJoin(client: Client) {
		this.state.players.set(client.id, new Player());
	}
	
	onLeave(client: Client) {
		this.state.players.delete(client.id);
	}

	onDispose() {

	}
}	

export default GameRoom;