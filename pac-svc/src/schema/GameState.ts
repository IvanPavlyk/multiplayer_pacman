import { type, Schema, MapSchema, ArraySchema } from '@colyseus/schema';
import Player from './Player';
import Ghost from './Ghost';
import Message from './Message';

class GameState extends Schema {
  @type({ map: Player }) players = new MapSchema<Player>();
  @type({ map: 'string' }) chatMessages = new MapSchema<string>();
  @type([Ghost]) ghosts = new ArraySchema<Ghost>();

	@type('boolean') gameCanStart = false;
	@type('boolean') gameStarted = false;
	@type('string') adminId = null;

  @type(['number']) pellets = new ArraySchema<number>();
  @type(['number']) walls = new ArraySchema<number>();
  @type('number') width = undefined;
  @type('number') height = undefined;
  @type('number') counter = 0;
}

export default GameState;
