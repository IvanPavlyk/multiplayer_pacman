import { type, Schema } from "@colyseus/schema";

class Player extends Schema {
	@type('boolean') ready = false;
	@type('string') direction =  'right';
	@type('number') x =  Math.floor(Math.random() * 300) + 50;
	@type('number') y = Math.floor(Math.random() * 300) + 50;

  constructor() {
    super();
  }
}

export default Player;
