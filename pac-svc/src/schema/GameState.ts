import { type, Schema, MapSchema, ArraySchema } from '@colyseus/schema';
import Player from './entities/Player';

class GameState extends Schema {
	@type({ map: Player }) players = new MapSchema<Player>();
	@type( ["number"] ) pellets = new ArraySchema<number>();
	@type('boolean') gameStarted = false;

	@type(Player) admin
}

export default GameState;