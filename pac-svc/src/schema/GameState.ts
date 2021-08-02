import { type, Schema, MapSchema, ArraySchema } from '@colyseus/schema';
import Ghost from './entities/Ghost';
import Player from './entities/Player';

class GameState extends Schema {
  @type({ map: Player }) players = new MapSchema<Player>();
  @type([Ghost]) ghosts = new ArraySchema<Ghost>();
  @type(['number']) pellets = new ArraySchema<number>();
  @type(['number']) walls = new ArraySchema<number>();
  @type('number') width = undefined;
  @type('number') height = undefined;
  @type('number') counter = 0;
  @type('boolean') gameStarted = false;

  @type(Player) admin;
}

export default GameState;
