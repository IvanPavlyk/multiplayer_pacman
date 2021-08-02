import { type, Schema } from "@colyseus/schema";

class Player extends Schema {
	@type('boolean') ready = false;
	@type('string') direction =  'right';
	@type('string') queuedDirection =  'right';
	@type('number') x =  0;
	@type('number') y = 0;

  constructor({x, y}) {
    super();
	this.x = x;
	this.y = y;
  }
}

export default Player;
