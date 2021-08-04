import { type, Schema } from '@colyseus/schema';

class Message extends Schema {
  @type('string') playerId = null;
  @type('string') message = '';

  constructor(playerId, message) {
    super();
		this.playerId = playerId;
		this.message = message
  }
}

export default Message;
