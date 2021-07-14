import { type, Schema } from '@colyseus/schema';

class Player extends Schema {
	@type('boolean') ready = false;

	constructor() {
		super();
	}
}

export default Player;