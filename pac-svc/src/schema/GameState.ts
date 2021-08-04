import { type, Schema, MapSchema, ArraySchema } from '@colyseus/schema';
import Player from './Player';

class GameState extends Schema {
	@type({ map: Player }) players = new MapSchema<Player>();
	@type( ['number'] ) pellets = new ArraySchema<number>();
	@type('boolean') gameCanStart = false;
	@type('boolean') gameStarted = false;
	@type('string') adminId = null;
}

export default GameState;