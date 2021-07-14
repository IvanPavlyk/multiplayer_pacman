import { type, Schema, MapSchema, ArraySchema } from '@colyseus/schema';
import Player from './entities/Player';

class GameState extends Schema {
	@type({ map: Player }) players = new MapSchema<Player>();
}

export default GameState;